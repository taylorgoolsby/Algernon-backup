// @flow

import React, {useState, useRef, useEffect} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  TouchableWithoutFeedback, Dimensions,
} from "react-native";
import type {MessageSQL} from '../../schema/Message/MessageSchema.mjs'
import {MessageRole} from '../../schema/Message/MessageSchema.mjs'
import Spinner from './Spinner.js'
import Colors, {
  aiChat,
  aiText,
  aiText2,
  aiText2Active,
  darkMode,
  fadeTime,
  userChat,
  userText,
  userText2,
  userText2Active,
} from '../../Colors.js'
import Text from './Text.js'
import MarkdownText from './MarkdownText.js'
import Icon from 'react-native-vector-icons/Ionicons'
import modalStore from '../../stores/ModalStore.js'
import chatStore from '../../stores/ChatStore.js'
import ProfilePic from './ProfilePic.js'
import {observer} from 'mobx-react'
import {BlurView} from '@react-native-community/blur'

const screenWidth = Dimensions.get('window').width

export const leftMargin = 10
// export const leftMargin = 0
export const rightMargin = 11
// export const rightMargin = 0
export const margin = 12
export const profileRowMinHeight = 38
export const peekHeight = 29
export const shuffleHeight = 18

type ChatMessageProps = {
  messageId: string,
  isActive: boolean,
  onMessageLayout?: (any, MessageSQL) => void,
  onMarkdownLayout?: (any, MessageSQL) => void,
  isFloating?: ?boolean,
}

const ChatMessage: ChatMessageProps => any = observer(
  ({
    messageId,
    isActive, // whether or not this is the last message in the chat.
    onMessageLayout,
    onMarkdownLayout,
    isFloating, // whether or not this is being rendered as a floating message.
  }: ChatMessageProps): any => {
    const message = chatStore.messages[messageId]

    const messageRef = useRef<any>(null)
    const [isConfirming, setIsConfirming] = useState(false)

    // todo: Use a Set instead of an array
    const hasFloatingCounterpart =
      !isFloating && chatStore.optionsMessageIds.includes(parseInt(messageId)) && !chatStore.optionsMessageIdFadeOuts[messageId.toString()]

    async function handleDeleteMessage() {
      if (!isFloating) {
        setIsConfirming(true)
        const confirmed = await modalStore.confirm(
          'Delete Message?',
          'It will be gone forever.',
        )
        setIsConfirming(false)
        if (confirmed) {
          await chatStore.deleteMessage(message.messageId)
        }
      } else {
        chatStore.closeOptions(message.messageId)
      }
    }

    function openOptions() {
      messageRef?.current?.measure((fx, fy, width, height, px, py) => {
        if (hasFloatingCounterpart && chatStore.optionsTarget !== message.messageId) {
          chatStore.setOptionsTarget(message.messageId)
          chatStore.setOptionsColorTarget(message.messageId)
        } else {
          // Open or close options:
          if (chatStore.optionsMessageIds.includes(message.messageId)) {
            if (
              isFloating ? chatStore.optionsTarget !== message.messageId : null
            ) {
              chatStore.setOptionsTarget(message.messageId)
              chatStore.setOptionsColorTarget(message.messageId)
            } else {
              chatStore.closeOptions(message.messageId)
            }
          } else {
            // $FlowFixMe
            chatStore.openOptions(message.messageId, px, py, width, height)
          }
        }
      })
    }

    const [initialLayout, setInitialLayout] = useState(null)
    const handleInitialLayout = (event: any) => {
      if (initialLayout === null) {
        setInitialLayout(event.nativeEvent.layout)
      }
      if (onMessageLayout) onMessageLayout(event, message)
    }

    const isOptionTarget = chatStore.optionsTarget === message?.messageId
    const isOptionColorTarget =
      chatStore.optionsColorTarget === message?.messageId

    const backgroundColorAnim = useRef(new Animated.Value(0)).current
    useEffect(() => {
      if (isOptionTarget || isOptionColorTarget) {
        Animated.timing(backgroundColorAnim, {
          toValue: 1,
          duration: fadeTime,
          useNativeDriver: false,
        }).start()
      } else {
        Animated.timing(backgroundColorAnim, {
          toValue: 0,
          duration: fadeTime,
          useNativeDriver: false,
        }).start()
      }
    }, [isOptionTarget, isOptionColorTarget])

    const [markdownRendered, setMarkdownRendered] = useState(false)
    function _onMarkdownLayout(event: any) {
      if (!markdownRendered) {
        setMarkdownRendered(true)
      }
      if (onMarkdownLayout) onMarkdownLayout(event, message)
    }

    const opacityAnim = useRef(new Animated.Value(0)).current
    useEffect(() => {
      if (markdownRendered) {
        if (hasFloatingCounterpart) {
          Animated.timing(opacityAnim, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: false,
          }).start()
        } else {
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }).start()
        }
      }
    }, [hasFloatingCounterpart, markdownRendered])

    const longPressAnim = useRef(new Animated.Value(0)).current
    function beginPress() {
      Animated.timing(longPressAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start()
    }
    function endPress() {
      Animated.timing(longPressAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start()
    }

    if (!message) {
      return null
    }

    const body = (
      <Animated.View
        ref={messageRef}
        style={[
          {
            opacity: opacityAnim,
          },
          message.role === MessageRole.USER
            ? styles.userMessage
            : styles.aiMessage,
          isFloating
            ? {
                // backgroundColor:
                // isOptionTarget ?
                //   () : 'rgba(255, 255, 255, 0)',
                backgroundColor: backgroundColorAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    'rgba(255, 255, 255, 0)',
                    'rgba(112, 163, 255, 0.5)',
                  ],
                }),
              }
            : null,
          isFloating
            ? {
                alignSelf: 'stretch',
              }
            : null,
          // hasFloatingCounterpart
          //   ? {
          //       opacity: 0.5,
          //     }
          //   : {},
          !isFloating ? {
            transform: [
              {
                translateY: longPressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -5],
                }),
              },
            ],
          } : null
        ]}
        onLayout={handleInitialLayout}>
        {isFloating ? (
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            blurType={darkMode ? 'dark' : 'light'}
            blurAmount={70}
          />
        ) : null}

        <ProfileRow
          message={message}
          initialLayout={initialLayout}
          isActive={isActive}
          isFloating={isFloating}
          onPress={openOptions}
        />
        <MainText
          message={message}
          initialLayout={initialLayout}
          isFloating={isFloating}
          onMarkdownLayout={_onMarkdownLayout}
        />
        {!message.deleted ? (
          <DeleteButton
            message={message}
            initialLayout={initialLayout}
            handleDeleteMessage={handleDeleteMessage}
            isConfirming={isConfirming}
          />
        ) : null}
      </Animated.View>
    )

    if (!isFloating) {
      return (
        <TouchableWithoutFeedback onPress={() => {
          chatStore.inputRef?.blur()
          chatStore.deselectOptionsTarget()
          chatStore.deselectOptionsColorTarget()
        }}>
        <View style={{alignSelf: 'stretch'}}>
          <TouchableWithoutFeedback
            onPress={() => {
              chatStore.inputRef?.blur()

              if (hasFloatingCounterpart) {
                const isOptionTarget = chatStore.optionsTarget === message.messageId
                if (!isOptionTarget) {
                  chatStore.setOptionsTarget(message.messageId)
                  chatStore.setOptionsColorTarget(message.messageId)
                } else {
                  chatStore.deselectOptionsTarget()
                  chatStore.deselectOptionsColorTarget()
                }
              } else {
                chatStore.deselectOptionsTarget()
                chatStore.deselectOptionsColorTarget()
              }
            }}
            onLongPress={() => {
              chatStore.inputRef?.blur()
              openOptions()
            }}
            onPressIn={beginPress}
            onPressOut={endPress}
          >
            {body}
          </TouchableWithoutFeedback>
        </View>
        </TouchableWithoutFeedback>
      )
    } else {
      return body
    }
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
  isFloating,
  onMarkdownLayout
}: {
  message: MessageSQL,
  initialLayout: any,
  isFloating: boolean,
  onMarkdownLayout: (any) => void
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
          minWidth: message.deleted ? 0 : 140,
          overflow: 'hidden',
        },
      ]}
      onLayout={handleLayout}>
      {!!message.text ? (
        <MarkdownText
          textStyle={[
            message.role === MessageRole.USER
              ? styles.userMessageText
              : styles.aiMessageText,
            isFloating
              ? {
                  color: aiText,
                }
              : null,
          ]}
          onLayout={onMarkdownLayout}
        >
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
  isFloating,
  onPress,
}: {
  message: MessageSQL,
  initialLayout: any,
  isActive: boolean,
  isFloating: boolean,
  onPress: () => void,
}) => {
  const [timeWidth, setTimeWidth] = useState(0)
  const handleTimeLayout = (event: any) => {
    const {width} = event.nativeEvent.layout
    setTimeWidth(width)
  }

  const isUser = message.role === MessageRole.USER

  return (
    <TouchableOpacity
      style={[
        styles.profileRow,
        {
          flexDirection: 'row',
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          flexDirection: isUser ? 'row-reverse' : 'row',
          marginLeft: 9,
          marginTop: 9,
          marginBottom: 9,
          top: -1,
          left: 1,
          paddingRight: 1,
        },
      ]}
      onPress={onPress}>
      <ProfilePic message={message} isActive={isActive} />
      <Text
        style={{
          color: isFloating
            ? aiText
            : message.role === MessageRole.USER
            ? userText
            : aiText,
          marginTop: 0,
          marginLeft: 10,
          paddingRight: 14,
          fontSize: Colors.fontSize,
          fontWeight: '700',
        }}>
        {message.role === MessageRole.USER ? 'Taylor G' : 'AI'}
      </Text>
      {/*{!initialLayout || message.deleted ? (*/}
      {/*  <View style={{width: profileRowHeight, hieght: profileRowHeight}} />*/}
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
    maxWidth: screenWidth * 0.74,
    // marginTop: margin,
    // marginBottom: margin,
    // marginLeft: 20,
    // marginRight: 17,
    overflow: 'hidden',
  },
  aiMessage: {
    alignSelf: 'stretch',
    backgroundColor: aiChat,
    borderRadius: 24,
    minWidth: 40,
    // marginTop: margin,
    // marginBottom: margin,
    // marginLeft: 18,
    // marginRight: 17,
    overflow: 'hidden',
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
    marginRight: 9,
  },
  aiMessageWrap: {
    marginLeft: 11,
    marginRight: 8,
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
