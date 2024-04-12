// @flow

import React, {useState, useRef, useEffect} from 'react'
import {View, StyleSheet, TouchableOpacity, Image, Animated} from 'react-native'
import type {MessageSQL} from '../../schema/Message/MessageSchema.mjs'
import {MessageRole} from '../../schema/Message/MessageSchema.mjs'
import Spinner from './Spinner.js'
import Colors, {
  aiChat,
  aiText,
  aiText2,
  aiText2Active,
  userChat,
  userText,
  userText2,
  userText2Active,
} from '../../Colors.js'
import Text from './Text.js'
import MarkdownText from './MarkdownText.js'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import Icon from 'react-native-vector-icons/Ionicons'
import modalStore from '../../stores/ModalStore.js'
import MessageInterface from '../../schema/Message/MessageInterface.js'
import chatStore from '../../stores/ChatStore.js'
import ProfilePic from './ProfilePic.js'
import {observer} from 'mobx-react'

export const margin = 12

const ChatMessage: any = observer(
  ({
    messageId,
    // onOpenOptions,
    isActive,
     onMessageLayout
  }:
  {
    messageId: string,
    // onOpenOptions: () => void,
    isActive: boolean,
    onMessageLayout: (any, MessageSQL) => void,
  }): any => {
    const message = chatStore.messages[messageId]

    const [isConfirming, setIsConfirming] = useState(false)

    async function handleDeleteMessage() {
      setIsConfirming(true)
      const confirmed = await modalStore.confirm('Delete Message?', null)
      setIsConfirming(false)
      if (confirmed) {
        await MessageInterface.softDelete(message.messageId)
        // todo: delete annotations from faiss
        await chatStore.load()
      }
    }

    function openOptions() {
      // onOpenOptions()
      ReactNativeHapticFeedback.trigger('soft', {
        enableVibrateFallback: false,
      })
    }

    const [initialLayout, setInitialLayout] = useState(null)
    const handleInitialLayout = (event: any) => {
      if (initialLayout === null) {
        setInitialLayout(event.nativeEvent.layout)
      }
      if (onMessageLayout) onMessageLayout(event, message)
    }

    // return <View/>

    if (!message) {
      return null
    }

    return (
      <View
        style={[
          message.role === MessageRole.USER
            ? styles.userMessage
            : styles.aiMessage,
        ]}
        onLayout={handleInitialLayout}>
        <ProfileRow
          message={message}
          initialLayout={initialLayout}
          isActive={isActive}
        />
        <MainText message={message} initialLayout={initialLayout} />
        {!message.deleted ? (
          <DeleteButton
            message={message}
            initialLayout={initialLayout}
            handleDeleteMessage={handleDeleteMessage}
            isConfirming={isConfirming}
          />
        ) : null}
      </View>
    )
  },
)

const DeleteButton: any = ({
  message,
  initialLayout,
  handleDeleteMessage,
  isConfirming,
}: {
  message: MessageSQL,
  initialLayout: any,
  handleDeleteMessage: () => any,
  isConfirming: boolean,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.clearInputButton,
        message.deleted
          ? {
              position: 'absolute',
              bottom: -1,
              right: -4,
            }
          : {
              position: 'absolute',
              bottom: -4,
              right: -4,
            },
        {
          alignSelf: 'flex-end',
        },
      ]}
      onPress={handleDeleteMessage}>
      <View
        style={{
          width: 42,
          height: 42,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon
          name={'close-outline'}
          size={18}
          color={
            message.role === MessageRole.USER
              ? isConfirming
                ? userText2Active
                : userText2
              : isConfirming
              ? aiText2Active
              : aiText2
          }
        />
      </View>
    </TouchableOpacity>
  )
}

const MainText: any = ({
  message,
  initialLayout,
}: {
  message: MessageSQL,
  initialLayout: any,
}) => {
  const [fullLayout, setFullLayout] = useState(null)
  const handleLayout = (event: any) => {
    if (fullLayout === null && message.completed) {
      setFullLayout(event.nativeEvent.layout)
    }
  }

  const deleteAnim = useRef(new Animated.Value(message.deleted ? 1 : 0)).current
  useEffect(() => {
    if (message.deleted) {
      Animated.timing(deleteAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start()
    }
  }, [message.deleted])

  return (
    <Animated.View
      style={[
        message.role === MessageRole.USER
          ? styles.userMessageWrap
          : styles.aiMessageWrap,
        {
          marginBottom: deleteAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [37, 0],
          }),
          height:
            fullLayout && message.deleted
              ? deleteAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [fullLayout.height, 0],
                })
              : 'auto',
          // minWidth: 140,
          overflow: 'hidden',
        },
      ]}
      onLayout={handleLayout}>
      {!!message.text ? (
        <MarkdownText
          textStyle={
            message.role === MessageRole.USER
              ? styles.userMessageText
              : styles.aiMessageText
          }>
          {message.text.trim()}
        </MarkdownText>
      ) : (
        <Spinner dieOut={message.deleted} />
      )}
    </Animated.View>
  )
}

const ProfileRow: any = ({
  message,
  initialLayout,
  isActive,
}: {
  message: MessageSQL,
  initialLayout: any,
  isActive: boolean,
}) => {
  const [timeWidth, setTimeWidth] = useState(0)
  const handleTimeLayout = (event: any) => {
    const {width} = event.nativeEvent.layout
    setTimeWidth(width)
  }

  return (
    <TouchableOpacity
      style={[
        styles.profileRow,
        {
          flexDirection: 'row',
          alignSelf: 'flex-start',
          marginLeft: 9,
          marginTop: 9,
          marginBottom: 9,
        },
      ]}
      onPress={() => {}}>
      <ProfilePic message={message} isActive={isActive} />
      <Text
        style={{
          color: message.role === MessageRole.USER ? userText : aiText,
          marginTop: 0,
          marginLeft: 10,
          paddingRight: 14,
        }}>
        {message.role === MessageRole.USER ? 'Charlie' : 'Algernon'}
      </Text>
      {/*{!initialLayout || message.deleted ? (*/}
      {/*  <View style={{width: 42, hieght: 42}} />*/}
      {/*) : null}*/}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  optionsRow: {
    flexDirection: 'row',
  },
  optionsBox: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'white',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: userChat,
    borderRadius: 24,
    minWidth: 40,
    marginTop: margin,
    marginBottom: margin,
    marginLeft: 20,
    marginRight: 17,
  },
  aiMessage: {
    alignSelf: 'stretch',
    backgroundColor: aiChat,
    borderRadius: 24,
    minWidth: 40,
    marginTop: margin,
    marginBottom: margin,
    marginLeft: 18,
    marginRight: 17,
  },
  singleLineMessage: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  multiLineMessage: {
    paddingTop: 18,
    paddingBottom: 18,
  },
  userMessageWrap: {
    marginLeft: 11,
    marginRight: 10,
  },
  aiMessageWrap: {
    marginLeft: 11,
    marginRight: 9,
  },
  userMessageText: {
    color: userText,
    fontSize: Colors.fontSize,
    lineHeight: Colors.fontSize * 1.5,
  },
  aiMessageText: {
    color: aiText,
    fontSize: Colors.fontSize,
    lineHeight: Colors.fontSize * 1.5,
  },
})

export default ChatMessage
