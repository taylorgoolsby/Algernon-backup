// @flow

import React from 'react'
import {View, ScrollView, Keyboard, Platform, Dimensions} from 'react-native'
import chatStore from '../../stores/ChatStore'
import ChatMessage, {leftMargin, margin, rightMargin} from './ChatMessage'
import debounce from 'lodash.debounce'
import type { MessageSQL } from "../../schema/Message/MessageSchema.mjs";

const screenHeight = Dimensions.get('window').height
const EXTRA_SPACE = 0 // Currently there is an issue where the first message should not have any extra space above it.

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
  scrollOffset: number = 0
  prevScrollOffset: number = 0
  // When a message is rendered, because of issues with markdown rendering, it lays out twice, and the height changes between them.
  // We onMarkdownLayout to detect when the markdown is fully rendered and to set completedLayouts[messageId] = true.
  // This allows an item to be mounted as visible, lay out twice, and then become invisible for list virtualization.
  completedLayouts: {[messageId: string]: boolean} = {}
  itemHeights: Array<{messageId: number, height: number}>
  itemIndexMapping: {[messageId: string]: number} = {} // Tells the index of the item in itemHeights
  cumulativeHeights: {[messageId: string]: number} = {}
  getMoreInFlight: boolean = false
  isInitialFlight: boolean = false
  getMoreScrollAdjusted: boolean = false
  newMessageHeights: {[messageId: string]: number} = {}
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
      this.cumulativeHeights[messageId] = 0
      this.newMessageHeights[messageId] = 0
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

    // Update scroll position after fetching more items
    // and those new items have been layed out:
    if (this.getMoreInFlight) {
      // Check if all newMessageHeights have a non-zero value:
      let allNonZero = true
      for (const height of Object.values(this.newMessageHeights)) {
        if (height === 0) {
          allNonZero = false
          break
        }
      }
      if (allNonZero) {
        setTimeout(() => {
          // A setTimeout is used here because it seems that the scrollView
          // needs 2 frames rendered with the new contentHeight
          // in order for .scrollTo to see the new contentHeight.
          this.adjustScrollPosition()
        }, 0)
      }
    }
  }

  handleRef: any = (el: any) => {
    this.scrollViewRef = el
  }

  getMoreMessages: any = () => {
    this.getMoreInFlight = true
    this.newMessageHeights = {}
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
        this.cumulativeHeights[messageId.toString()] = 0
        this.newMessageHeights[messageId] = 0
      })
    } else {
      let currentItemsHeightsIndex = 0
      for (let i = 0; i < messageIds.length; i++) {
        const messageId = parseInt(messageIds[i])
        if (messageId < currentFirstMessageId) {
          nextItemHeights.push({messageId, height: 0})
          nextItemIndexMapping[messageId.toString()] =
            nextItemHeights.length - 1
          this.cumulativeHeights[messageId.toString()] = 0
          this.newMessageHeights[messageId.toString()] = 0
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
          this.cumulativeHeights[messageId.toString()] = 0
          this.newMessageHeights[messageId.toString()] = 0
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
    const index = this.itemIndexMapping[messageId.toString()]
    const oldHeight = this.itemHeights[index].height
    this.itemHeights[index].height = height

    // Recompute cumulativeHeights:
    // Given that we are updating the message with messageId,
    // all messageIds after it need their cumulativeHeight updated.
    // This means subtracting out the old height and adding the new height.
    for (let i = index + 1; i < this.itemHeights.length; i++) {
      const nextMessageId = this.itemHeights[i].messageId.toString()
      this.cumulativeHeights[nextMessageId] += height - oldHeight
    }

    if (this.newMessageHeights.hasOwnProperty(messageId.toString())) {
      this.newMessageHeights[messageId.toString()] = height
    }

    this.causeRerender()
  }

  onMarkdownLayout: (any, MessageSQL) => void = (event: any, message: MessageSQL) => {
    const { height } = event.nativeEvent.layout
    if (height !== 0) {
      this.completedLayouts[message.messageId.toString()] = true
    }
  }

  onScroll: any = (event: any) => {
    // if (this.getMoreInFlight) {
    //   if (this.scrollViewRef) {
    //     // Kill any decay animation.
    //     // The decay animation happens on the native side,
    //     // so this JS code's value for this.scrollOffset might be old.
    //     // Since .scrollTo is called after the new messages have been layed out,
    //     // in adjustScrollPosition, an old value of this.scrollOffset is used,
    //     // which causes the scrollView to appear to skip slightly due to the
    //     // discrepancy between the JS this.scrollOffset and the native scroll position.
    //     // So we kill the decay animation now, to prevent the discrepancy.
    //     console.log(".scrollTo", this.scrollOffset);
    //     this.scrollViewRef.scrollTo({
    //       y: this.scrollOffset,
    //       animated: false
    //     })
    //   }
    // } else {
    //   const prevScrollOffset = this.scrollOffset
    //   this.scrollOffset = event.nativeEvent.contentOffset.y
    //
    //   console.log("onScroll", this.scrollOffset);
    //
    //   // Pagination:
    //   if (this.scrollOffset < 250 && this.scrollOffset - prevScrollOffset < 0) {
    //     this.getMoreMessages()
    //   }
    // }

    // console.log("event.nativeEvent.contentOffset.y", event.nativeEvent.contentOffset.y);

    if (this.getMoreScrollAdjusted) {
      // When adjustScrollPosition is called, it calls .scrollTo with the new scrollOffset.
      // However, is it possible for the native side to call onScroll with the old scrollOffset
      // before the new scrollOffset takes effect because of the decay animation (scrolling momentum).
      // So we ignore any onScroll events which do not have the new scrollOffset.
      // When we finally see a scroll event with the new offset, we disable this.getMoreScrollAdjusted.
      if (Math.abs(this.scrollOffset - event.nativeEvent.contentOffset.y) < 1) {
        this.getMoreScrollAdjusted = false
        console.log('exit')
      } else {
        return
      }
    }

    this.prevScrollOffset = this.scrollOffset
    this.scrollOffset = event.nativeEvent.contentOffset.y

    // Pagination:
    if (
      this.scrollOffset < 250 + EXTRA_SPACE &&
      this.scrollOffset - this.prevScrollOffset < 0
    ) {
      this.getMoreMessages()
    }

    this.recalcVisible()
  }

  adjustScrollPosition: any = () => {
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

    let sumNewMessageHeights = 0
    for (const height of Object.values(this.newMessageHeights)) {
      sumNewMessageHeights += height
    }

    if (this.scrollViewRef) {
      let nextScrollOffset = this.scrollOffset + sumNewMessageHeights
      if (this.isInitialFlight) {
        nextScrollOffset += EXTRA_SPACE
        // On initial render, scrolling to bottom is capped by screenHeight and padding:
        nextScrollOffset += -screenHeight + paddingFooter + paddingHeader
        this.isInitialFlight = false
      }

      this.scrollViewRef.scrollTo({
        y: nextScrollOffset,
        animated: false,
      })
      this.prevScrollOffset = nextScrollOffset
      this.scrollOffset = nextScrollOffset

      console.log("adjustScrollPosition this.prevScrollOffset", this.prevScrollOffset);
      console.log("adjustScrollPosition this.scrollOffset", this.scrollOffset);

      setTimeout(() => {
        this.onScroll({nativeEvent: {contentOffset: {y: this.scrollOffset}}})
      }, 100)
    }

    this.newMessageHeights = {}
    this.getMoreInFlight = false
    this.getMoreScrollAdjusted = true
    // this.recalcVisible()
  }

  recalcVisible: any = () => {
    // This function causes a rerender if the visibility of any item changes.
    // It should be of constant order, O(1), because it only re-checks
    // the items which are currently visible, and any nearby items based on the
    // change in scrollOffset.
    // For example, if the scrollOffset decreased by 100, then we would re-check
    // the items which fall within that range of 100 above the first currently
    // visible item.
    let changed = false

    // New items are layed out during momentum scrolling.
    // This means it is possible for onScroll and onItemLayout to be called
    // around the same time.
    // onScroll calls recalcVisibility which depends on the scrollOffset.
    // So for example, if the scrollOffset is old, but new items have been layed out,
    // then the currently visible items will have their cumulativeHeights updated,
    // but the scrollOffset will be old, so the new items will appear relative to
    // the scrollOffset in a position which is not correct.
    // scrollOffset and cumulativeHeights need to be in sync,
    // or at least they need to appear to be in sync during a recalc.
    let adjustedScrollOffset = this.scrollOffset
    for (const messageId of Object.keys(this.newMessageHeights)) {
      adjustedScrollOffset += this.newMessageHeights[messageId]
    }

    const scrollDiff = adjustedScrollOffset - this.prevScrollOffset

    // const visibleStart = this.scrollOffset
    // const visibleEnd = this.scrollOffset + screenHeight

    // We will need a map of this.visibilityMap[messageId], which will be used
    // during rendering to quickly determine if an item is visible.

    // We will also have a this.visibleMessageIds array, which is an array of messageIds.
    // It keeps order of the currently visible items.

    // We can loop through this map to re-check the visibility of currently visible items.
    // However, we also need to check the visibility of items which are near the currently
    // visible items, based on the change in scrollOffset.
    // If the scrollOffset decreased by 100,
    // we know the messageId of the first currently visible item from this.visibleMessageIds[0].
    // Then we can use this.itemIndexMapping to get the index of that item in this.itemHeights.
    // Then we can decrement that index by 1, and check the height of the first non-visible item before the first currently visible item.
    // We compare the height of that item to the scrollDiff, and if it fits within that range, we re-check its visibility.

    // If scrollDiff is large because scrolling is very fast, sometimes the this.visibleMessageIds will be left empty after
    // all of its items have been checked for visibility.
    // So we need to save the messageId of the first or last currently visible item before updating this.visibleMessageIds.
    // Then if scrollDiff is negative, we check items before the first visible item.
    // If scrollDiff is positive, we check items after the last visible item.
    // This will add messageIds back into this.visibleMessageIds.

    // Finally, after this.visibleMessageIds is completely updated,
    // we update this.visibilityMap if anything changed,
    // and then cause a re-render.

    const firstVisibleMessageId: ?string = this.visibleMessageIds[0] ?? null
    // const lastVisibleMessageId: ?string =
    //   this.visibleMessageIds[this.visibleMessageIds.length - 1] ?? null
    const startLength = this.visibleMessageIds.length

    console.log('recalcVisible', scrollDiff, firstVisibleMessageId, startLength, adjustedScrollOffset, this.cumulativeHeights[firstVisibleMessageId])

    // todo: introduce a variable to keep of the first visible messageId
    //  the last time recalc was called.
    //  In case of fast scrolling up, we can start from that messageId,
    //  obtaining its top from cumulativeHeights,
    //  and then check items up to the current scrollOffset.
    //  Also, when the scrollOffset is adjusted for pagination,
    //  their cumulativeHeights are updated, so the same algorithm can be used
    //  with the new scrollOffset and cumulativeHeights.
    //  Finally, the problem of scrollOffset thrashing due to native bridge discrepancies, needs to be handled separately.

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

      console.log("diff", diff);

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
      console.log("changed", changed);
      this.visibleMessageIds = nextVisibleMessageIds
      console.log("this.visibleMessageIds", this.visibleMessageIds);
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
    console.log('isVisible', messageId)
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

    console.log("notVisible", notVisible);

    return !notVisible
  }

  causeRerender: any = () => {
    // if (this.state.cacheBust === 2) {
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
    contentHeight += EXTRA_SPACE // extra space to allow scrolling while loading.

    // console.log("this.itemHeights", this.itemHeights);
    console.log("this.state.cacheBust", this.state.cacheBust);
    console.log("contentHeight", contentHeight);
    console.log("this.visibilityMap", this.visibilityMap);
    console.log("this.visibleMessageIds", this.visibleMessageIds);
    console.log("this.scrollOffset", this.scrollOffset);
    console.log("this.completedLayouts", this.completedLayouts);

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
        scrollEventThrottle={17}
        // decelerationRate={this.getMoreInFlight ? 0 : 'normal'}
      >
        <View
          style={{
            height: contentHeight,
          }}
        />
        {Object.keys(this.newMessageHeights).map((messageId, index) => {
          return (
            <ItemWrapper
              key={messageId}
              messageId={parseInt(messageId)}
              onLayout={this.onItemLayout}
              top={paddingHeader + (this.cumulativeHeights[messageId] || 0) + EXTRA_SPACE}
              isNew={this.newMessageHeights[messageId] === 0}
              isVisible={this.visibilityMap[messageId] || !this.completedLayouts[messageId]}
              // isVisible={true}
              layedOutHeight={this.itemHeights[index].height}
            >
              <ChatMessage
                messageId={messageId}
                isActive={index === 0}
                onMarkdownLayout={this.onMarkdownLayout}
              />
            </ItemWrapper>
          )
        })}
        {this.visibleMessageIds.map((messageId, index) => {
          return (
            <ItemWrapper
              key={messageId}
              messageId={parseInt(messageId)}
              onLayout={this.onItemLayout}
              top={paddingHeader + (this.cumulativeHeights[messageId] || 0) + EXTRA_SPACE}
              isNew={this.newMessageHeights[messageId] === 0}
              isVisible={this.visibilityMap[messageId] || !this.completedLayouts[messageId]}
              // isVisible={true}
              layedOutHeight={this.itemHeights[index].height}
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
  isNew: boolean,
  isVisible: boolean,
  layedOutHeight: number
}

// class ItemWrapper extends React.Component<ItemWrapperProps, any> {
//   constructor(props: ItemWrapperProps) {
//     super(props)
//   }
//
//   // shouldComponentUpdate(
//   //   nextProps: ItemWrapperProps,
//   //   nextState: any,
//   // ): boolean {
//   //   console.log("this.props", this.props);
//   //   console.log("nextProps", nextProps);
//   //   return true
//   //
//   //   // if (this.props.someValue !== nextProps.someValue) {
//   //   //   return true;
//   //   // }
//   //   // if (this.state.someOtherValue !== nextState.someOtherValue) {
//   //   //   return true;
//   //   // }
//   //   // return false;
//   // }
//
//   onLayoutHandler = (event: any) => {
//     const {height} = event.nativeEvent.layout
//     this.props.onLayout(this.props.messageId, height)
//   }
//
//   render(): any {
//     const {messageId, children, top, isNew, isVisible, layedOutHeight} =
//       this.props
//
//     console.log('rendering', messageId, isVisible, layedOutHeight, top, isNew)
//
//     return isVisible ? (
//       <View
//         onLayout={this.onLayoutHandler}
//         style={{
//           position: 'absolute',
//           top,
//           left: leftMargin + 5,
//           right: rightMargin,
//           paddingTop: margin,
//           paddingBottom: margin,
//           opacity: isNew ? 0 : 1,
//         }}>
//         {children}
//       </View>
//     ) : (
//       <View
//         onLayout={this.onLayoutHandler}
//         style={{
//           position: 'absolute',
//           top: top,
//           left: leftMargin + 5,
//           right: rightMargin,
//           paddingTop: margin,
//           paddingBottom: margin,
//           opacity: 0,
//           height: layedOutHeight,
//         }}
//       />
//     )
//   }
// }

const ItemWrapper = (props: ItemWrapperProps) => {
  const {
    messageId,
    onLayout,
    children,
    top,
    isNew,
    isVisible,
    layedOutHeight
  } = props
  const onLayoutHandler = (event: any) => {
    const {height} = event.nativeEvent.layout
    onLayout(messageId, height)
  }

  // console.log('rendering', messageId, isVisible, layedOutHeight)

  return isVisible ? (
    <View
      onLayout={onLayoutHandler}
      style={{
        position: 'absolute',
        top,
        left: leftMargin + 5,
        right: rightMargin,
        paddingTop: margin,
        paddingBottom: margin,
        opacity: isNew ? 0 : 1,
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
        height: layedOutHeight
      }}
    />
  )
}

export default ChatList
