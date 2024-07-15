// @flow

import React from 'react'
import {View, ScrollView, FlatList, Keyboard, Platform, Dimensions} from 'react-native'
import ChatMessage, { leftMargin, margin, rightMargin } from "./ChatMessage";
import type { MessageSQL } from "../../schema/Message/MessageSchema.mjs";
import chatStore from "../../stores/ChatStore";
import debounce from "lodash.debounce";

const screenHeight = Dimensions.get('window').height

type InvertedChatListProps = {
  onEmptyAreaPress: () => void,
  headerHeight: number,
  footerHeight: number,
  safeAreaFooterHeight: number,
  messageIds: Array<string>,
}

type InvertedChatListState = {
  visibleHeight: number,
  keyboardHeight: number,
  initialSafeAreaFooterHeight: number,
  displayedMessageIds: Array<string>,
  cacheBust: number,
  // itemHeights: Array<{messageId: number, height: number}>,
}

class InvertedChatList extends React.Component<InvertedChatListProps, ChatListState> {
  scrollViewRef: any
  prevScrollOffset: number = 0
  scrollOffset: number = 0
  layoutsInProgress: {[messageId: string]: boolean} = {}
  completedMarkdownLayouts: {[messageId: string]: boolean} = {}
  completedLayouts: {[messageId: string]: boolean} = {}
  itemHeights: Array<{messageId: number, height: number}>
  itemIndexMapping: {[messageId: string]: number} = {} // Tells the index of the item in itemHeights
  queuedCumulativeHeights: {[messageId: string]: number} = {}
  cumulativeHeights: {[messageId: string]: number} = {}
  visibilityMap: {[messageId: string]: boolean} = {}
  visibleMessageIds: Array<string> = []
  keyboardDidShowListener: any
  keyboardDidHideListener: any
  contentHeight: number = 0

  constructor(props: InvertedChatListProps) {
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
  }

  handleRef: any = (el: any) => {
    this.scrollViewRef = el
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

  onItemLayout: any = (messageId: number, event: any) => {
    if (this.completedLayouts[messageId.toString()]) {
      return
    }

    const { height } = event.nativeEvent.layout
    const index = this.itemIndexMapping[messageId.toString()]
    const oldHeight = this.itemHeights[index].height
    this.itemHeights[index].height = height

    for (let i = index + 1; i < this.itemHeights.length; i++) {
      const nextMessageId = this.itemHeights[i].messageId.toString()
      this.cumulativeHeights[nextMessageId] += height - oldHeight
    }

    this.contentHeight += height - oldHeight

    this.causeRerender()
  }

  onMarkdownLayout: (any, MessageSQL) => void = (event: any, message: MessageSQL) => {
    const { height } = event.nativeEvent.layout

    if (height !== 0 || message.deleted) {
      this.completedMarkdownLayouts[message.messageId.toString()] = true
    }
  }

  onScroll: any = (event: any) => {
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

    this.prevScrollOffset = this.scrollOffset
    this.scrollOffset = event.nativeEvent.contentOffset.y

    const maxScroll = this.contentHeight - screenHeight + paddingFooter + paddingHeader
    const distanceFromMaxScroll = maxScroll - this.scrollOffset

    // Pagination:
    if (
      distanceFromMaxScroll < 250 &&
      this.scrollOffset - this.prevScrollOffset > 0
    ) {
      this.getMoreMessages()
    }
  }

  getMoreMessages: any = () => {
    this.queuedCumulativeHeights = {...this.cumulativeHeights}
    this.queuedScrollOffsetDiff = 0
    this.layoutsInProgress = {}
    chatStore.fetchEarlierMessages()
  }

  renderItem: any = (item) => {
    const messageId = item.item
    const index = item.index

    return (
      <View
        style={{
          paddingTop: margin,
          paddingBottom: margin,
        }}
        onLayout={(event: any) => this.onItemLayout(messageId, event)}
      >
        <ChatMessage
          key={messageId}
          messageId={messageId}
          isActive={index === 0}
          onMarkdownLayout={this.onMarkdownLayout}
        />
      </View>
    )
  }

  causeRerender: any = () => {
    // if (this.state.cacheBust === 18) {
    //   return
    // }

    this.setState({
      cacheBust: (this.state.cacheBust + 1) % 100,
    })
  }

  render() {
    const {onEmptyAreaPress, headerHeight, footerHeight, safeAreaFooterHeight} =
      this.props
    const {
      visibleHeight,
      keyboardHeight,
      initialSafeAreaFooterHeight,
      cacheBust,
    } = this.state
    const messageIds = this.state.displayedMessageIds

    const invertedMessageIds = messageIds.slice().reverse()

    const paddingHeader = headerHeight
    const paddingFooter = keyboardHeight
      ? footerHeight + keyboardHeight
      : initialSafeAreaFooterHeight

    // console.log("this.cumulativeHeights", this.cumulativeHeights);
    // console.log("this.contentHeight", this.contentHeight);

    return (
      <FlatList
        ref={this.handleRef}
        inverted
        data={invertedMessageIds}
        renderItem={this.renderItem}
        scrollEventThrottle={17}
        onScroll={this.onScroll}
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustKeyboardInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
        scrollsToTop={false}
        onScrollBeginDrag={() => {
          chatStore.deselectOptionsTarget()
          chatStore.deselectOptionsColorTarget()
        }}
        scrollIndicatorInsets={{
          top: paddingFooter,
          bottom: paddingHeader,
        }}
        contentContainerStyle={{
          paddingLeft: leftMargin + 5,
          paddingRight: rightMargin,
          paddingTop: paddingFooter,
          paddingBottom: paddingHeader,
          // height: itemPositions[itemPositions.length - 1]
        }}
      />
    )
  }
}

export default InvertedChatList
