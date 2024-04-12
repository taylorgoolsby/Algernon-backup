// @flow

import React, {useRef, useState, useEffect} from 'react'
import {
  FlatList,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native'
import ChatMessage from './ChatMessage.js'
import type {MessageSQL} from '../../schema/Message/MessageSchema.mjs'
import chatStore from "../../stores/ChatStore.js";

/*

Invert or not to invert?

Without inverted:
- The problem is initial mount. We want the FlatList to be already scrolled to the bottom on initial mount.
- We must manipulate the scroll position when the keyboard appears to maintain the bottom edge.
- stickToBottom is easier to implement. When a chat is streaming, we just scroll back to the bottom.

With inverted:
- The FlatList will appear to be scrolled to the bottom already, but for new users who only see the introductory message,
  it will appear to have flex-end. Fixing this is too hard.
- The bottom edge is automatically maintained.
- Handling chat streaming is harder.

* */

const screenWidth = Dimensions.get('window').width

const MessageList = ({
  messageIds,
  visibleHeight,
  keyboardHeight,
  initialSafeAreaFooterHeight,
  footerHeight,
  headerHeight,
}: {
  messageIds: Array<string>,
  visibleHeight: number,
  keyboardHeight: number,
  initialSafeAreaFooterHeight: number,
  footerHeight: number,
  headerHeight: number,
}): any => {
  const flatListRef = useRef<any>(null)
  const [stickToBottom, setStickToBottom] = useState(true)
  const scrollOffset = useRef(0)

  const [isInitial, setIsInitial] = useState(true)
  useEffect(() => {
    if (isInitial) {
      flatListRef.current?.scrollToEnd({animated: false})
    }
  }, [])

  function onViewableItemsChanged({viewableItems, changed}: any) {
    if (isInitial) {
      const isLastViewable = viewableItems.some(
        item =>
          item.item === messageIds[messageIds.length - 1] && item.isViewable,
      )
      if (isLastViewable) {
        flatListRef.current?.scrollToEnd({animated: false})
        setIsInitial(false)
      } else {
        flatListRef.current?.scrollToEnd({animated: false})
      }
    }
  }

  const opacityAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (!isInitial && opacityAnim._value === 0) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
    }
  }, [isInitial])

  const onMessageLayout = (event: any, message: MessageSQL) => {
    if (stickToBottom) {
      flatListRef.current.scrollToEnd({animated: false})
    }
  }

  const contentHeight = useRef(0)
  const onContentSizeChange = (
    contentWidth: number,
    _contentHeight: number,
  ) => {
    contentHeight.current = _contentHeight
  }

  const onScroll = (event: any) => {
    const prevScrollOffset = scrollOffset.current
    scrollOffset.current = event.nativeEvent.contentOffset.y

    if (contentHeight.current - scrollOffset.current - visibleHeight <= 0) {
      if (!stickToBottom) setStickToBottom(true)
    } else {
      if (stickToBottom) setStickToBottom(false)
    }

    // Pagination:
    if (scrollOffset.current < 250 && scrollOffset.current - prevScrollOffset < 0) {
      chatStore.fetchEarlierMessages()
    }
  }

  const paddingHeader = keyboardHeight
    ? headerHeight + keyboardHeight
    : headerHeight
  const paddingFooter = keyboardHeight
    ? footerHeight
    : initialSafeAreaFooterHeight

  const scrollPositionBeforeKeyboard = useRef(0)
  useEffect(() => {
    if (keyboardHeight > 0) {
      scrollPositionBeforeKeyboard.current = scrollOffset.current
      // When the keyboard appears, the footer height changes,
      // so we need to adjust the scroll position
      // to keep everything in place relative to the bottom edge.
      const diff = initialSafeAreaFooterHeight - footerHeight
      // The keyboardHeight needs to be added because we are using KeyboardAvoidingView w/ position.
      // This slides the entire FlatList up, so we add a paddingTop by the amount it slides up, keyboardHeight.
      // This allows users to be able to still scroll up to messages at the top of the screen
      // while also maintaining the same scroll position relative to the bottom edge.
      flatListRef.current.scrollToOffset({
        offset: scrollOffset.current - diff + keyboardHeight,
        animated: false,
      })
    } else {
      flatListRef.current.scrollToOffset({
        offset: scrollPositionBeforeKeyboard.current,
        animated: false,
      })
    }
  }, [keyboardHeight])

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: opacityAnim,
      }}>
      <KeyboardAvoidingView
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        behavior={Platform.OS === 'ios' ? 'position' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} //
      >
        <FlatList
          style={styles.flatList}
          ref={flatListRef}
          scrollsToTop={false}
          onScroll={onScroll}
          onContentSizeChange={onContentSizeChange}
          onViewableItemsChanged={onViewableItemsChanged}
          scrollEventThrottle={17}
          automaticallyAdjustsScrollIndicatorInsets={false}
          ListFooterComponent={<View style={{height: paddingFooter}} />}
          contentContainerStyle={{
            paddingTop: paddingHeader,
            // paddingBottom: paddingFooter,
          }}
          scrollIndicatorInsets={{
            bottom: paddingFooter,
            top: paddingHeader,
          }}
          data={messageIds}
          keyExtractor={messageId => messageId}
          renderItem={item => {
            const messageId = item.item
            return (
              <ChatMessage
                messageId={messageId}
                isActive={item.index === 0}
                onMessageLayout={onMessageLayout}
              />
            )
          }}
        />
      </KeyboardAvoidingView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  flatList: {
    flex: 0,
  },
})

export default MessageList
