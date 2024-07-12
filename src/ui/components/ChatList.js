// @flow

import React from 'react'
import {View, ScrollView, Keyboard, Platform, Dimensions} from 'react-native'
import chatStore from '../../stores/ChatStore'
import ChatMessage, {leftMargin, margin, rightMargin} from './ChatMessage'
import debounce from 'lodash.debounce'
import type { MessageSQL } from "../../schema/Message/MessageSchema.mjs";

const screenHeight = Dimensions.get('window').height

type ChatListProps = {
  onEmptyAreaPress: () => void,
  headerHeight: number,
  footerHeight: number,
  safeAreaFooterHeight: number,
  messageIds: Array<string>,
}

type ChatListState = {
  visibleHeight: number,
  keyboardHeight: number,
  initialSafeAreaFooterHeight: number,
  displayedMessageIds: Array<string>,
  cacheBust: number,
  // itemHeights: Array<{messageId: number, height: number}>,
}

class ChatList extends React.Component<ChatListProps, ChatListState> {
  scrollViewRef: any
  queuedScrollOffsetDiff: number = 0
  scrollOffset: number = 0
  prevScrollOffset: number = 0
  contentOffset: number = 0
  scrollDiff: number = 0
  // When a message is rendered, because of issues with markdown rendering, it lays out twice, and the height changes between them.
  // We onMarkdownLayout to detect when the markdown is fully rendered and to set completedLayouts[messageId] = true.
  // This allows an item to be mounted as visible, lay out twice, and then become invisible for list virtualization.
  layoutsInProgress: {[messageId: string]: boolean} = {}
  completedMarkdownLayouts: {[messageId: string]: boolean} = {}
  completedLayouts: {[messageId: string]: boolean} = {}
  itemHeights: Array<{messageId: number, height: number}>
  itemIndexMapping: {[messageId: string]: number} = {} // Tells the index of the item in itemHeights
  queuedCumulativeHeights: {[messageId: string]: number} = {}
  cumulativeHeights: {[messageId: string]: number} = {}
  getMoreInFlight: boolean = false
  isInitialFlight: boolean = false
  getMoreScrollAdjusted: boolean = false
  visibilityMap: {[messageId: string]: boolean} = {}
  visibleMessageIds: Array<string> = []
  keyboardDidShowListener: any
  keyboardDidHideListener: any

  constructor(props: any) {
    super(props)

    this.state = {
      visibleHeight: 0,
      keyboardHeight: 0,
      initialSafeAreaFooterHeight: props.safeAreaFooterHeight,
      displayedMessageIds: props.messageIds,
      cacheBust: 0,
      // itemHeights: props.messageIds.map(messageId => ({messageId: parseInt(messageId), height: 0}))
    }

    this.itemHeights = props.messageIds.map(messageId => ({
      messageId: parseInt(messageId),
      height: 0,
    }))
    for (let i = 0; i < props.messageIds.length; i++) {
      const messageId = props.messageIds[i]
      this.itemIndexMapping[messageId] = i
      this.queuedCumulativeHeights[messageId] = 0
      this.cumulativeHeights[messageId] = 0
      this.layoutsInProgress[messageId] = true
    }
    this.getMoreInFlight = true
    this.isInitialFlight = true

    this.keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        this.adjustForKeyboard(e.endCoordinates.height)
      },
    )

    this.keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => this.adjustForKeyboard(0),
    )

    this.getMoreMessages = debounce(this.getMoreMessages, 500, {
      leading: true,
      trailing: false,
    })
    this.causeRerender = debounce(this.causeRerender, 100)
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  adjustForKeyboard: number => void = (keyboardHeight: number) => {
    this.setState({
      keyboardHeight,
    })
  }

  componentDidUpdate(
    prevProps: ChatListProps,
    prevState: ChatListState,
    _: any,
  ) {
    console.log("componentDidUpdate");

    if (
      prevProps.footerHeight !== this.props.footerHeight ||
      prevProps.safeAreaFooterHeight !== this.props.safeAreaFooterHeight ||
      prevState.keyboardHeight !== this.state.keyboardHeight
    ) {
      if (this.props.footerHeight === 50 && this.state.keyboardHeight === 0) {
        if (
          this.props.safeAreaFooterHeight >
          this.state.initialSafeAreaFooterHeight
        ) {
          this.setState({
            initialSafeAreaFooterHeight: this.props.safeAreaFooterHeight,
          })
        }
      }
    }

    if (prevProps.messageIds !== this.props.messageIds) {
      this.onIncomingMessages(this.props, this.state)
    }

    console.log("this.getMoreInFlight", this.getMoreInFlight);

    // Update scroll position after fetching more items
    // and those new items have been layed out:
    if (this.getMoreInFlight) {
      // Check if all newMessageHeights have a non-zero value:
      let anyInProgress = false
      let allLayoutsCompleted = true
      for (const messageId of Object.keys(this.layoutsInProgress)) {
        anyInProgress = !this.completedLayouts[messageId]
        const markdownLayoutCompleted = this.completedMarkdownLayouts[messageId]
        if (!markdownLayoutCompleted) {
          allLayoutsCompleted = false
          break
        }
      }

      console.log("anyInProgress", anyInProgress);
      console.log("allLayoutsCompleted", allLayoutsCompleted);

      if (anyInProgress && allLayoutsCompleted) {
        setTimeout(() => {
          // A setTimeout is used here because it seems that the scrollView
          // needs 2 frames rendered with the new contentHeight
          // in order for .scrollTo to see the new contentHeight.
          // this.adjustScrollPosition()
          this.finalizeNewItemLayouts()
        }, 0)
      }
    }

    if (this.getMoreScrollAdjusted) {
      // Shortly after componentDidUpdate after finalizeNewItemLayouts,
      // there will be a new onScroll event with a large value.
      const expectedJump = this.contentOffset - this.scrollOffset
      // This large jump should be ignored,
      // so we cancel it out by adding the negation to scrollDiff.
      this.scrollDiff -= expectedJump
      this.getMoreScrollAdjusted = false
    }
  }

  handleRef: any = (el: any) => {
    this.scrollViewRef = el
  }

  getMoreMessages: any = () => {
    this.getMoreInFlight = true
    this.queuedCumulativeHeights = {...this.cumulativeHeights}
    this.queuedScrollOffsetDiff = 0
    this.layoutsInProgress = {}
    chatStore.fetchEarlierMessages()
  }

  onIncomingMessages: any = (props: ChatListProps, state: ChatListState) => {
    const {messageIds} = props || this.props
    const itemHeights = this.itemHeights

    const nextItemHeights = []
    const nextItemIndexMapping: {[string]: number} = {}
    // const nextCumulativeHeights = {...this.cumulativeHeights}

    // Check if itemHieghts is parallel to messageIds
    const currentFirstMessageId = itemHeights[0]?.messageId ?? null
    const currentLastMessageId =
      itemHeights[itemHeights.length - 1]?.messageId ?? null
    // messageIds are always sorted in increasing order.
    // Add the new messagesIds up to currentFirstMessageId to nextItemHeights with 0 height.
    // Then there will be a section of existing messageIds, which should be copied over from itemHeights.
    // And then there might be new messageIds at the end, which should be added to nextItemHeights with 0 height.

    if (!currentFirstMessageId) {
      // If itemHeights is empty, then all messageIds are new.
      messageIds.forEach(messageId => {
        nextItemHeights.push({messageId: parseInt(messageId), height: 0})
        nextItemIndexMapping[messageId.toString()] = nextItemHeights.length - 1
        this.queuedCumulativeHeights[messageId.toString()] = 0
        this.cumulativeHeights[messageId.toString()] = 0
        this.layoutsInProgress[messageId] = true
      })
    } else {
      let currentItemsHeightsIndex = 0
      for (let i = 0; i < messageIds.length; i++) {
        const messageId = parseInt(messageIds[i])
        if (messageId < currentFirstMessageId) {
          nextItemHeights.push({messageId, height: 0})
          nextItemIndexMapping[messageId.toString()] =
            nextItemHeights.length - 1
          this.queuedCumulativeHeights[messageId.toString()] = 0
          this.cumulativeHeights[messageId.toString()] = 0
          this.layoutsInProgress[messageId.toString()] = true
        } else if (
          currentFirstMessageId <= messageId &&
          messageId <= currentLastMessageId
        ) {
          const currentItemHeight = itemHeights[currentItemsHeightsIndex]
          currentItemsHeightsIndex++
          if (currentItemHeight.messageId === messageId) {
            nextItemHeights.push({messageId, height: currentItemHeight.height})
            nextItemIndexMapping[messageId.toString()] =
              nextItemHeights.length - 1
          } else {
            console.error('messageIds in the middle missing.')
          }
        } else {
          nextItemHeights.push({messageId, height: 0})
          nextItemIndexMapping[messageId.toString()] =
            nextItemHeights.length - 1
          this.queuedCumulativeHeights[messageId.toString()] = 0
          this.cumulativeHeights[messageId.toString()] = 0
          this.layoutsInProgress[messageId.toString()] = true
        }
      }
    }

    this.setState({
      displayedMessageIds: messageIds,
    })
    this.itemHeights = nextItemHeights
    this.itemIndexMapping = nextItemIndexMapping
  }

  onItemLayout: any = (messageId: number, height: number) => {
    /*
    On layout,
    itemHeights is updated, and then a re-render is caused with debounce so that all new items are layed out before the next render.
    contentHeight is derived from itemHeights, and is used to set the height of the content container, since the items are absolutely positioned.
    Then we must wait one more frame to allow the native ScrollView to register the new contentHeight.
    Then we can call .scrollTo with the new scrollOffset.
    We apply the new cumulativeHeights on the same frame that the new scrollOffset is applied
    because those two things need to always be in sync.
    * */

    if (this.completedLayouts[messageId.toString()]) {
      return
    }

    const index = this.itemIndexMapping[messageId.toString()]
    const oldHeight = this.itemHeights[index].height
    this.itemHeights[index].height = height

    // Recompute cumulativeHeights:
    // Given that we are updating the message with messageId,
    // all messageIds after it need their cumulativeHeight updated.
    // This means subtracting out the old height and adding the new height.
    for (let i = index + 1; i < this.itemHeights.length; i++) {
      const nextMessageId = this.itemHeights[i].messageId.toString()
      this.queuedCumulativeHeights[nextMessageId] += height - oldHeight
    }

    // cumulativeHeights is the top value for absolutely positioned items.
    // It is relative to the scrollOffset.
    // This means scrollOffset and cumulativeHeights must always be in sync.
    this.queuedScrollOffsetDiff += height - oldHeight

    this.causeRerender()
  }

  onMarkdownLayout: (any, MessageSQL) => void = (event: any, message: MessageSQL) => {
    const { height } = event.nativeEvent.layout

    console.log("onMarkdownLayout", message.messageId, height);

    if (height !== 0 || message.deleted) {
      this.completedMarkdownLayouts[message.messageId.toString()] = true
    }
  }

  finalizeNewItemLayouts: any = () => {
    this.cumulativeHeights = {...this.queuedCumulativeHeights} // todo: constant time

    const {footerHeight, headerHeight} =
      this.props
    const {
      keyboardHeight,
      initialSafeAreaFooterHeight,
    } = this.state
    const paddingFooter = keyboardHeight
      ? footerHeight + keyboardHeight
      : initialSafeAreaFooterHeight
    const paddingHeader = headerHeight

    let contentHeight = 0 // todo: constant time
    for (const itemHeight of this.itemHeights) {
      contentHeight += itemHeight.height
    }

    const maxScrollOffset = contentHeight - screenHeight + paddingFooter + paddingHeader
    // this.prevScrollOffset = Math.min(this.prevScrollOffset, maxScrollOffset)
    // this.scrollOffset = Math.min(this.scrollOffset, maxScrollOffset)

    const meantimeScroll = this.scrollOffset - this.contentOffset
    this.contentOffset += meantimeScroll
    this.contentOffset += this.queuedScrollOffsetDiff
    this.contentOffset = Math.min(this.contentOffset, maxScrollOffset)
    // this.prevScrollOffset = this.contentOffset
    // this.scrollOffset = this.contentOffset
    this.scrollDiff = 0

    console.log("\nfinalize\n", this.contentOffset);

    this.getMoreInFlight = false
    this.getMoreScrollAdjusted = true

    for (const messageId of Object.keys(this.layoutsInProgress)) {
      this.completedLayouts[messageId] = true
    }
    this.layoutsInProgress = {}

    this.recalcVisible()
    this.causeRerender()
  }

  onScroll: any = (event: any) => {
    // console.log("event.nativeEvent.contentOffset.y", event.nativeEvent.contentOffset.y);

    this.prevScrollOffset = this.scrollOffset
    this.scrollOffset = event.nativeEvent.contentOffset.y

    this.scrollDiff += this.scrollOffset - this.prevScrollOffset

    // Pagination:
    if (
      this.scrollOffset < 250 &&
      this.scrollOffset - this.prevScrollOffset < 0
    ) {
      this.getMoreMessages()
    }

    this.recalcVisible()
  }

  recalcVisible: any = () => {
    let changed = false

    let adjustedScrollOffset = this.contentOffset + this.scrollDiff

    console.log("recalcVisible", adjustedScrollOffset);

    const firstVisibleMessageId: ?string = this.visibleMessageIds[0] ?? null

    const nextVisibleMessageIds: Array<string> = []

    if (firstVisibleMessageId === null) {
      // console.warn('rechecking all items for visibility')
      for (let i = 0; i < this.itemHeights.length; i++) {
        const messageId = this.itemHeights[i].messageId.toString()
        const isVisible = this.isVisible(messageId, adjustedScrollOffset)

        if (isVisible) {
          nextVisibleMessageIds.push(messageId)
        }
      }
    } else {
      const {headerHeight} = this.props
      const paddingHeader = headerHeight

      // $FlowFixMe
      const firstVisibleTop = this.cumulativeHeights[firstVisibleMessageId]
      const diff = adjustedScrollOffset - firstVisibleTop - paddingHeader // todo: check

      if (diff < 0) {
        // First visible item is below top edge of screen.
        // Iterate up, checking for items which should be visible.
        let distanceLeft: number = -diff
        // $FlowFixMe
        let i = this.itemIndexMapping[firstVisibleMessageId] - 1
        while (i >= 0 && distanceLeft > 0) {
          const messageId = this.itemHeights[i].messageId.toString()
          const itemHeight = this.itemHeights[i].height
          const isVisible = this.isVisible(messageId, adjustedScrollOffset)

          if (isVisible) {
            nextVisibleMessageIds.unshift(messageId)
          } else {
            break
          }
          distanceLeft -= itemHeight
          i--
        }

        // Now, from the firstVisibleMessageId, we iterate down,
        // breaking when we find the first item which is not visible.
        // $FlowFixMe
        i = this.itemIndexMapping[firstVisibleMessageId]
        while (i < this.itemHeights.length) {
          const messageId = this.itemHeights[i].messageId.toString()
          const isVisible = this.isVisible(messageId, adjustedScrollOffset)

          if (!isVisible) {
            break
          } else {
            nextVisibleMessageIds.push(messageId)
          }

          i++
        }
      } else if (diff >= 0) {
        // First visible item is above top edge of screen.
        // Starting from it, iterate down, checking for items which should be visible,
        // and break when we find the first item which is not visible.
        // $FlowFixMe
        let i = this.itemIndexMapping[firstVisibleMessageId]
        let visibleFound = false
        while (i < this.itemHeights.length) {
          const messageId = this.itemHeights[i].messageId.toString()
          const isVisible = this.isVisible(messageId, adjustedScrollOffset)

          if (!isVisible) {
            // $FlowFixMe
            if (visibleFound) {
              break
            }
          } else {
            nextVisibleMessageIds.push(messageId)
            visibleFound = true
          }

          i++
        }
      }
    }

    // Check if visible items changed by looking at the first and last items in the list,
    // and the length, assuming that the list is sorted and monotonic.
    if (
      nextVisibleMessageIds.length !== this.visibleMessageIds.length ||
      nextVisibleMessageIds[0] !== this.visibleMessageIds[0] ||
      nextVisibleMessageIds[nextVisibleMessageIds.length - 1] !==
        this.visibleMessageIds[this.visibleMessageIds.length - 1]
    ) {
      changed = true
    }

    if (changed) {
      console.log('changed', nextVisibleMessageIds)
      this.visibleMessageIds = nextVisibleMessageIds
      this.visibilityMap = {}
      for (let i = 0; i < this.visibleMessageIds.length; i++) {
        const messageId: string = this.visibleMessageIds[i]
        // $FlowFixMe
        this.visibilityMap[messageId] = true
      }
      this.causeRerender()
    }
  }

  isVisible: (string, number) => boolean = (messageId: string, scrollOffset: number) => {
    if (!this.completedLayouts[messageId]) {
      return false
    }

    const {headerHeight} = this.props
    const paddingHeader = headerHeight

    const visibleStart = scrollOffset - paddingHeader
    const visibleEnd = visibleStart + screenHeight

    const itemIndex = this.itemIndexMapping[messageId]
    const itemHeight = this.itemHeights[itemIndex].height
    const itemTop = this.cumulativeHeights[messageId]
    const itemBottom = itemTop + itemHeight
    const notVisible =
      (itemTop < visibleStart && itemBottom < visibleStart) ||
      (visibleEnd < itemTop && visibleEnd < itemBottom)

    return !notVisible
  }

  causeRerender: any = () => {
    // if (this.state.cacheBust === 18) {
    //   return
    // }

    this.setState({
      cacheBust: (this.state.cacheBust + 1) % 100,
    })
  }

  render(): any {
    const {onEmptyAreaPress, headerHeight, footerHeight, safeAreaFooterHeight} =
      this.props
    const {
      visibleHeight,
      keyboardHeight,
      initialSafeAreaFooterHeight,
      cacheBust,
    } = this.state
    const messageIds = this.state.displayedMessageIds
    const itemHeights = this.itemHeights

    const paddingHeader = headerHeight
    const paddingFooter = keyboardHeight
      ? footerHeight + keyboardHeight
      : initialSafeAreaFooterHeight

    let contentHeight = 0
    for (const itemHeight of itemHeights) {
      contentHeight += itemHeight.height
    }

    // console.log('')
    console.log("this.state.cacheBust", this.state.cacheBust);
    console.log("contentHeight", contentHeight);
    console.log("this.contentOffset", this.contentOffset);
    console.log("this.visibleMessageIds", this.visibleMessageIds);
    console.log("this.cumulativeHeights", this.cumulativeHeights);
    console.log("this.layoutsInProgress", this.layoutsInProgress);
    console.log("this.completedMarkdownLayouts", this.completedMarkdownLayouts);
    console.log("this.completedLayouts", this.completedLayouts);
    console.log("this.queuedCumulativeHeights", this.queuedCumulativeHeights);
    // console.log("messageIds", messageIds);


    return (
      <ScrollView
        ref={this.handleRef}
        style={{
          backgroundColor: 'black',
          flex: 1,
          // opacity: opacityAnim,
        }}
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustKeyboardInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
        scrollsToTop={false}
        onScrollBeginDrag={() => {
          chatStore.deselectOptionsTarget()
          chatStore.deselectOptionsColorTarget()
        }}
        onScroll={this.onScroll}
        scrollIndicatorInsets={{
          top: paddingHeader,
          bottom: paddingFooter,
        }}
        contentContainerStyle={{
          paddingLeft: leftMargin + 5,
          paddingRight: rightMargin,
          paddingTop: paddingHeader,
          paddingBottom: paddingFooter,
          // height: itemPositions[itemPositions.length - 1]
        }}
        contentOffset={{x: 0, y: this.contentOffset}}
        scrollEventThrottle={17}
        // decelerationRate={this.getMoreInFlight ? 0 : 'normal'}
      >
        <View
          style={{
            height: contentHeight,
          }}
        />
        {Object.keys(this.layoutsInProgress).map((messageId) => {
          console.log("laying out", messageId);
          const index = this.itemIndexMapping[messageId]
          return (
            <ItemWrapper
              key={messageId}
              messageId={parseInt(messageId)}
              onLayout={this.onItemLayout}
              top={0}
              isLayoutInProgress={true}
              isVirtual={false}
              virtualHeight={0}
            >
              <ChatMessage
                messageId={messageId}
                isActive={index === 0}
                onMarkdownLayout={this.onMarkdownLayout}
              />
            </ItemWrapper>
          )
        })}
        {this.visibleMessageIds.map((messageId) => {
          const index = this.itemIndexMapping[messageId]
          return (
            <ItemWrapper
              key={messageId}
              messageId={parseInt(messageId)}
              onLayout={this.onItemLayout}
              top={paddingHeader + (this.cumulativeHeights[messageId] || 0)}
              isLayoutInProgress={false}
              isVirtual={!this.visibilityMap[messageId]}
              virtualHeight={this.itemHeights[index].height}
            >
              <ChatMessage
                messageId={messageId}
                isActive={index === 0}
                onMarkdownLayout={this.onMarkdownLayout}
              />
            </ItemWrapper>
          )
        })}
      </ScrollView>
    )
  }
}

type ItemWrapperProps = {
  messageId: number,
  onLayout: (number, number) => void,
  children: any,
  top: number,
  isLayoutInProgress: boolean,
  isVirtual: boolean,
  virtualHeight?: number
}

const ItemWrapper = (props: ItemWrapperProps) => {
  const {
    messageId,
    onLayout,
    children,
    top,
    isLayoutInProgress,
    isVirtual,
    virtualHeight
  } = props
  const onLayoutHandler = (event: any) => {
    const {height} = event.nativeEvent.layout
    onLayout(messageId, height)
  }

  // console.log('rendering', messageId, isLayoutInProgress, isVirtual, virtualHeight)

  return !isVirtual ? (
    <View
      onLayout={onLayoutHandler}
      style={{
        position: 'absolute',
        top,
        left: leftMargin + 5,
        right: rightMargin,
        paddingTop: margin,
        paddingBottom: margin,
        opacity: isLayoutInProgress ? 0 : 1,
      }}>
      {children}
    </View>
  ) : (
    <View
      onLayout={onLayoutHandler}
      style={{
        position: 'absolute',
        top: top,
        left: leftMargin + 5,
        right: rightMargin,
        paddingTop: margin,
        paddingBottom: margin,
        opacity: 0,
        height: virtualHeight ?? 0
      }}
    />
  )
}

export default ChatList
