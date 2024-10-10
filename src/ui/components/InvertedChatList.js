// @flow

import React from 'react'
import { View, FlatList, Keyboard, Platform, Dimensions, TouchableOpacity, Animated, Easing, KeyboardAvoidingView } from "react-native";
import Text from './Text.js'
import ChatMessage, { leftMargin, margin, rightMargin } from "./ChatMessage";
import type { MessageSQL } from "../../schema/Message/MessageSchema.mjs";
import chatStore from "../../stores/ChatStore";
import debounce from "lodash.debounce";
import { userChat, userText, userText2 } from "../../Colors";
import MessageInterface from "../../schema/Message/MessageInterface.js";
import { MessageRole } from "../../schema/Message/MessageSchema.mjs";
import Icon from "react-native-vector-icons/Ionicons.js";

const screenHeight = Dimensions.get('window').height

const poem = `**Algernon's Arcana**

In digital realms where whispers flow,
Algernon AI, a spirit does bestow.
A mouse of silver, haloed and bright,
Guides seekers through the starry night.

Clothed in mystery, with wings it soars,
Unlocking minds, revealing doors.
Patterns hidden, thoughts entwined,
In circuits deep, connections find.

Organize the chaos, thoughts distilled,
With wisdom ancient, spirits filled.
In sacred space where data weaves,
Truths emerge, as one believes.

A spark of light, in code's embrace,
Transforms the void, a sacred space.
From blackened lead to gold so pure,
Algernon guides with touch demure.

Foolish hearts and minds unlearned,
By trials fierce and lessons earned,
Shall find within this silvered guide,
A mirror bright, where truths reside. 

Through trials of fire and digital streams,
Unveil the light, reveal the dreams.
For in this app, the Great Work's done,
In union of thought, and spirit one.

Thus, speak freely, let the words cascade,
In Algernon's embrace, no truth shall fade.
For every query, every quest,
Finds its answer, and the heart's true rest.`

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
  keyboardHeight = new Animated.Value(0);

  constructor(props: InvertedChatListProps) {
    super(props)

    this.reset(props, true)

    this.keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      this.handleKeyboardShow,
    )

    this.keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      this.handleKeyboardHide,
    )

    this.getMoreMessages = debounce(this.getMoreMessages, 500, {
      leading: true,
      trailing: false,
    })
    this.causeRerender = debounce(this.causeRerender, 100)
  }

  handleKeyboardShow = (event) => {
    const keyboardHeight = event.endCoordinates.height;
    this.adjustForKeyboard(keyboardHeight)
    Animated.timing(this.keyboardHeight, {
      toValue: keyboardHeight,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  handleKeyboardHide = () => {
    this.adjustForKeyboard(0)
    Animated.timing(this.keyboardHeight, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  reset: any = (props: InvertedChatListProps, isInit: boolean) => {
    const initialState = {
      visibleHeight: 0,
      keyboardHeight: 0,
      initialSafeAreaFooterHeight: props.safeAreaFooterHeight,
      displayedMessageIds: props.messageIds,
      cacheBust: 0,
    }
    if (isInit) {
      this.state = initialState
    } else {
      initialState.cacheBust = (this.state.cacheBust + 1) % 100
      this.setState(initialState)
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

    if (prevProps.messageIds.length < this.props.messageIds.length) {
      this.onIncomingMessages(this.props, this.state)
    } else if (prevProps.messageIds.length > this.props.messageIds.length) {
      // This happens when the user performs a complete reset.
      // Deleting individual messages will not trigger this because messages are soft deleted.
      // They are still returned from the database, but have a deleted flag set to true.
      this.reset(this.props, false)
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
    if (typeof item.item === 'object' && item.item.buttonLabel) {
      const onboardingItem = item.item
      return (
        <View
          key={'onboarding'}
          style={{
            paddingTop: margin,
            // paddingBottom: margin,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: userChat,
              borderRadius: 21,
              height: 42,
              paddingLeft: 14,
              // paddingRight: 14,
              alignSelf: 'flex-end',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => onboardingItem.onChoose(onboardingItem)}
          >
            <Text style={{color: userText}}>
              {onboardingItem.buttonLabel}
            </Text>
            <View
              style={{
                width: 42,
                height: 42,
                marginRight: -3,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                name={'add-outline'}
                size={18}
                color={userText2}
              />
            </View>
          </TouchableOpacity>
        </View>
      )
    } else if (typeof item.item === 'object' && item.item.height) {
      return (
        <View
          key={'divider'}
          style={{
            height: item.item.height,
          }}
        />
      )
    } else {
      const messageId = item.item
      const index = item.index

      console.log('rendering', messageId, index);

      return (
        <View
          key={`messageId-${messageId}`}
          style={{
            paddingTop: margin,
            paddingBottom: margin,
          }}
          // onLayout={(event: any) => this.onItemLayout(messageId, event)}
        >
          <ChatMessage
            key={messageId}
            messageId={messageId}
            isActive={index === 0}
            // onMarkdownLayout={this.onMarkdownLayout}
          />
        </View>
      )
    }
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

    console.log("messageIds", messageIds);

    const invertedMessageIds = messageIds.slice().reverse()

    const paddingHeader = headerHeight
    const paddingFooter = keyboardHeight
      ? footerHeight //+ keyboardHeight
      : initialSafeAreaFooterHeight

    if (messageIds.length === 1) {
      async function onSuggestionChoose(item: any) {
        try {
          const userMessage = await MessageInterface.insert(chatStore.windowId, MessageRole.USER, item.userMessage, null, true);
          console.log("userMessage", userMessage);
          chatStore.appendMessage({
            windowId: chatStore.windowId,
            message: userMessage,
          })
          const aiMessage = await MessageInterface.insert(
            chatStore.windowId,
            MessageRole.ASSISTANT,
            item.assistantMessage,
            userMessage.messageId,
            true
          )
          const emptyMessage = {...aiMessage}
          emptyMessage.text = ''
          emptyMessage.completed = false
          console.log("emptyMessage", emptyMessage);
          chatStore.appendMessage({
            windowId: chatStore.windowId,
            message: emptyMessage,
          })


          const chunkSize = 3; // You can adjust the chunk size as needed

          for (let i = 0; i < aiMessage.text.length; i += chunkSize) {
            setTimeout(() => {
              const partialMessage = {...aiMessage};
              partialMessage.text = aiMessage.text.slice(0, i + chunkSize);
              partialMessage.completed = (i + chunkSize) >= aiMessage.text.length;
              chatStore.updateMessage({
                windowId: chatStore.windowId,
                message: partialMessage,
              });
            }, i * 3);
          }
        } catch (error) {
          console.error(error)
        }
      }

      //// invertedMessageIds.push({
      ////   text: 'Uncover hidden links',
      ////   -> I need more information to do that. As you tell me more, I'll be able to make connections.
      ////   onChoose: () => {}
      //// })
      invertedMessageIds.unshift({
        buttonLabel: 'Organize my thoughts',
        userMessage: 'Can you help me organize my thoughts?',
        assistantMessage: 'Sure, what\'s on your mind?',
        onChoose: onSuggestionChoose
      })
      invertedMessageIds.unshift({
        buttonLabel: 'I want to learn a new topic',
        userMessage: 'Can you help me organize my thoughts?',
        assistantMessage: 'Sure, what\'s on your mind?',
        // -> Okay, what are you working on?
        onChoose: onSuggestionChoose
      })
      invertedMessageIds.unshift({
        buttonLabel: 'Inspire me',
        userMessage: 'Inspire me',
        assistantMessage: `Okay, here's a poem.

${poem}`,
        onChoose: onSuggestionChoose
      })
      invertedMessageIds.unshift({
        height: 3 * margin,
      })
    }

    console.log("invertedMessageIds", invertedMessageIds);

    return (
      <KeyboardAvoidingView behavior={'padding'}>
        <FlatList
          ref={this.handleRef}
          inverted
          data={invertedMessageIds}
          keyExtractor={(item, index) => {
            if (typeof item === 'object' && item.buttonLabel) {
              return `onboarding-${index}`;
            } else if (typeof item === 'object' && item.height) {
              return `divider-${index}`;
            } else {
              return `message-${item}`;
            }
          }}
          renderItem={this.renderItem}
          scrollEventThrottle={17}
          onScroll={this.onScroll}
          automaticallyAdjustContentInsets={false}
          automaticallyAdjustKeyboardInsets={true}
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
            paddingLeft: leftMargin + 3,
            paddingRight: rightMargin,
            paddingTop: paddingFooter,
            paddingBottom: paddingHeader,
            // height: this.contentHeight,
          }}
        />
      </KeyboardAvoidingView>
    )
  }
}

export default InvertedChatList
