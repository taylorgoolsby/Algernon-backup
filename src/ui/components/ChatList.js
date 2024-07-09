// @flow

import React from 'react';
import { View, ScrollView, Keyboard, Platform } from "react-native";
import chatStore from "../../stores/ChatStore";
import ChatMessage, { leftMargin, margin, rightMargin } from "./ChatMessage";
import debounce from 'lodash.debounce';

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
  cacheBust: number
  // itemHeights: Array<{messageId: number, height: number}>,
}

class ChatList extends React.Component<ChatListProps, ChatListState> {
  scrollViewRef: any
  scrollOffset: number = 0
  itemHeights: Array<{messageId: number, height: number}>
  itemIndexMapping: {[messageId: string]: number} = {} // Tells the index of the item in itemHeights
  cumulativeHeights: {[messageId: string]: number} = {}
  getMoreInFlight: boolean = false
  isInitialFlight: boolean = false
  newMessageHeights: {[messageId: string]: number} = {}
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

    this.itemHeights = props.messageIds.map(messageId => ({messageId: parseInt(messageId), height: 0}))
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

    this.getMoreMessages = debounce(this.getMoreMessages, 500, {leading: true, trailing: false})
    this.causeRerender = debounce(this.causeRerender, 100)
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  adjustForKeyboard: (number) => void = (keyboardHeight: number) => {
    this.setState({
      keyboardHeight
    })
  }

  componentDidUpdate(prevProps: ChatListProps, prevState: ChatListState, _: any) {
    if (
      prevProps.footerHeight !== this.props.footerHeight ||
      prevProps.safeAreaFooterHeight !== this.props.safeAreaFooterHeight ||
      prevState.keyboardHeight !== this.state.keyboardHeight
    ) {
      if (this.props.footerHeight === 50 && this.state.keyboardHeight === 0) {
        if (this.props.safeAreaFooterHeight > this.state.initialSafeAreaFooterHeight) {
          this.setState({
            initialSafeAreaFooterHeight: this.props.safeAreaFooterHeight
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
          this.getMoreInFlight = false
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
    const {
      messageIds
    } = props || this.props
    const itemHeights = this.itemHeights

    const nextItemHeights = []
    const nextItemIndexMapping: {[string]: number} = {}
    // const nextCumulativeHeights = {...this.cumulativeHeights}

    // Check if itemHieghts is parallel to messageIds
    const currentFirstMessageId = itemHeights[0]?.messageId ?? null
    const currentLastMessageId = itemHeights[itemHeights.length - 1]?.messageId ?? null
    // messageIds are always sorted in increasing order.
    // Add the new messagesIds up to currentFirstMessageId to nextItemHeights with 0 height.
    // Then there will be a section of existing messageIds, which should be copied over from itemHeights.
    // And then there might be new messageIds at the end, which should be added to nextItemHeights with 0 height.

    if (!currentFirstMessageId) {
      // If itemHeights is empty, then all messageIds are new.
      messageIds.forEach(messageId => {
        nextItemHeights.push({messageId: parseInt(messageId), height: 0});
        nextItemIndexMapping[messageId.toString()] = nextItemHeights.length - 1
        this.cumulativeHeights[messageId.toString()] = 0
        this.newMessageHeights[messageId] = 0
      })
    } else {
      let currentItemsHeightsIndex = 0
      for (let i = 0; i < messageIds.length; i++) {
        const messageId = parseInt(messageIds[i])
        if (messageId < currentFirstMessageId) {
          nextItemHeights.push({messageId, height: 0});
          nextItemIndexMapping[messageId.toString()] = nextItemHeights.length - 1
          this.cumulativeHeights[messageId.toString()] = 0
          this.newMessageHeights[messageId.toString()] = 0
        } else if (currentFirstMessageId <= messageId && messageId <= currentLastMessageId) {
          const currentItemHeight = itemHeights[currentItemsHeightsIndex];
          currentItemsHeightsIndex++
          if (currentItemHeight.messageId === messageId) {
            nextItemHeights.push({messageId, height: currentItemHeight.height})
            nextItemIndexMapping[messageId.toString()] = nextItemHeights.length - 1
          } else {
            console.error('messageIds in the middle missing.')
          }
        } else {
          nextItemHeights.push({messageId, height: 0});
          nextItemIndexMapping[messageId.toString()] = nextItemHeights.length - 1
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
      this.cumulativeHeights[nextMessageId] -= oldHeight
      this.cumulativeHeights[nextMessageId] += height
    }

    if (this.newMessageHeights.hasOwnProperty(messageId.toString())) {
      this.newMessageHeights[messageId.toString()] = height
    }

    this.causeRerender()
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

    const prevScrollOffset = this.scrollOffset
    this.scrollOffset = event.nativeEvent.contentOffset.y

    // Pagination:
    if (this.scrollOffset < (250 + EXTRA_SPACE) && this.scrollOffset - prevScrollOffset < 0) {
      this.getMoreMessages()
    }
  }

  adjustScrollPosition: any = () => {
    let sumNewMessageHeights = 0
    for (const height of Object.values(this.newMessageHeights)) {
      sumNewMessageHeights += height
    }

    if (this.scrollViewRef) {
      let nextScrollOffset = this.scrollOffset + sumNewMessageHeights
      if (this.isInitialFlight) {
        nextScrollOffset += EXTRA_SPACE
        this.isInitialFlight = false
      }

      this.scrollViewRef.scrollTo({
        y: nextScrollOffset,
        animated: false
      })
      this.scrollOffset = nextScrollOffset
    }
  }

  causeRerender: any = () => {
    // if (this.state.cacheBust === 2) {
    //   return
    // }

    this.setState({
      cacheBust: (this.state.cacheBust + 1) % 100
    })
  }

  render(): any {
    const {
      onEmptyAreaPress,
      headerHeight,
      footerHeight,
      safeAreaFooterHeight,
    } = this.props
    const {
      visibleHeight,
      keyboardHeight,
      initialSafeAreaFooterHeight,
      cacheBust
    } = this.state;
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
            height: contentHeight
          }}
        />
        {messageIds.map((messageId, index) => (
          <ItemWrapper key={messageId} messageId={parseInt(messageId)} onLayout={this.onItemLayout} paddingTop={paddingHeader} cumulativeHeights={this.cumulativeHeights} newMessageHeights={this.newMessageHeights}>
            <ChatMessage
              messageId={messageId.toString()}
              isActive={index === 0}
              // onMessageLayout={(event, message) => {
              //   const { height } = event.nativeEvent.layout;
              //   console.log("m", message.messageId, "height", height);
              // }}
            />
          </ItemWrapper>
        ))}
      </ScrollView>
    )
  }
}

type ItemWrapperProps = {
  messageId: number,
  onLayout: (number, number) => void,
  children: any,
  paddingTop: number,
  cumulativeHeights: {[string]: number},
  newMessageHeights: {[string]: number},
}

const ItemWrapper = (props: ItemWrapperProps) => {
  const { messageId, onLayout, children, paddingTop, cumulativeHeights, newMessageHeights } = props
  const onLayoutHandler = (event: any) => {
    const { height } = event.nativeEvent.layout;
    onLayout(messageId, height);
  };

  let top = paddingTop + (cumulativeHeights[messageId.toString()] || 0) + EXTRA_SPACE

  return (
    <View
      onLayout={onLayoutHandler}
      style={{
        position: 'absolute',
        top: top,
        left: leftMargin + 5,
        right: rightMargin,
        paddingTop: margin,
        paddingBottom: margin,
        opacity: newMessageHeights[messageId.toString()] === 0 ? 0 : 1,
      }}
    >
      {children}
    </View>
  );
};

export default ChatList;
