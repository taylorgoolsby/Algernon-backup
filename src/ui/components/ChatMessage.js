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
  darkMode,
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
import {BlurView} from '@react-native-community/blur'

export const margin = 12

const ChatMessage = ({
  message,
  onOpenOptions,
  isActive,
  onMessageLayout,
}: {
  message: MessageSQL,
  onOpenOptions: () => void,
  isActive: boolean,
  onMessageLayout: (any, MessageSQL) => void,
}): any => {
  const [isConfirming, setIsConfirming] = useState(false)

  async function handleDeleteMessage() {
    setIsConfirming(true)
    const confirmed = await modalStore.confirm('Are you sure?', null)
    setIsConfirming(false)
    if (confirmed) {
      await MessageInterface.softDelete(message.messageId)
      // todo: delete annotations from faiss
      await chatStore.load()
    }
  }

  function openOptions() {
    onOpenOptions()
    ReactNativeHapticFeedback.trigger('soft', {
      enableVibrateFallback: false,
    })
  }

  const [initialLayout, setInitialLayout] = useState(null)
  const handleInitialLayout = (event: any) => {
    if (initialLayout === null) {
      setInitialLayout(event.nativeEvent.layout)
    }
    onMessageLayout(event, message)
  }

  // return <View/>

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
      <DeleteButton
        message={message}
        initialLayout={initialLayout}
        handleDeleteMessage={handleDeleteMessage}
        isConfirming={isConfirming}
      />
    </View>
  )
}

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
              bottom: 0,
              right: -4,
            }
          : {
              position: 'absolute',
              bottom: -4,
              right: -4,
            },
        {
          alignSelf: 'flex-end',
          // paddingLeft: 15,
          // paddingBottom: 15,
          // paddingRight: 15,
          // paddingTop: 8,
          // transform: [{translateX: -(iconLayout?.width ?? 0) / 2}, {translateY: -(iconLayout?.height ?? 0) / 2 }],
        },
      ]}
      onPress={handleDeleteMessage}>
      <View
        style={{
          width: 48,
          height: 48,
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

  // useEffect(() => {
  //   if (message.deleted && initialLayout) {
  //     Animated.timing(maxHeightAnim, {
  //       toValue: 0,
  //       duration: 200,
  //       useNativeDriver: false,
  //     }).start()
  //   } else if (!message.deleted && fullLayout) {
  //     Animated.timing(maxHeightAnim, {
  //       toValue: 1,
  //       duration: 200,
  //       useNativeDriver: false,
  //     }).start()
  //   }
  // }, [message.deleted])

  const deleteAnim = useRef(new Animated.Value(message.deleted ? 1 : 0)).current
  useEffect(() => {
    if (message.deleted) {
      console.log('message.text', message)
      console.log('deleting')
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
          // marginBottom: 37,
          marginBottom: deleteAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [37, 0],
          }),
          // opacity: deleteAnim.interpolate({
          //   inputRange: [0, 1],
          //   outputRange: [1, 0],
          // }),
          // height: 'auto',
          height:
            fullLayout && message.deleted
              ? deleteAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [fullLayout.height, 0],
                })
              : 'auto',
          minWidth: 140,
          overflow: 'hidden',
          // transform: [
          //   {
          //     scaleY: deleteAnim.interpolate({
          //       inputRange: [0, 1],
          //       outputRange: [1, 0],
          //     }),
          //   },
          // ],
          // height: 'auto',
          // height: 0,
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
          {/*{'this is a p\n\n# header\n\n## Welcome to Cobalt\n\n### h3\n\n* line 1\n* line2\n\nline 3'}*/}
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
          marginBottom: 11,
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
      {/*{message.role === MessageRole.ASSISTANT ? (*/}
      {/*  <Text*/}
      {/*    style={{*/}
      {/*      // marginTop: 2, marginLeft: 3, marginRight: 14*/}
      {/*      position: 'absolute',*/}
      {/*      top: 2,*/}
      {/*      left: '50%',*/}
      {/*      marginLeft: -timeWidth / 2,*/}
      {/*      textAlign: 'center',*/}
      {/*      color: aiText2,*/}
      {/*    }}*/}
      {/*    onLayout={handleTimeLayout}>*/}
      {/*    {*/}
      {/*      // parse iso into formatted date*/}
      {/*      new Date()*/}
      {/*        .toISOString()*/}
      {/*        .split('T')[1]*/}
      {/*        .split('.')[0]*/}
      {/*        .split(':')*/}
      {/*        .slice(0, 2)*/}
      {/*        .join(':')*/}
      {/*    }*/}
      {/*  </Text>*/}
      {/*) : null}*/}
      {!initialLayout || message.deleted ? (
        <View style={{width: 48, hieght: 48}} />
      ) : null}
    </TouchableOpacity>
  )
}

export const ProfilePic: any = ({
  message,
  noBorder,
  isActive,
  tenX,
}: {
  message: MessageSQL,
  noBorder: boolean,
  isActive: boolean,
  tenX: number,
}) => {
  if (!message) return null

  const t = tenX ? 10 : 1

  const r = 7 * t
  const v = 5 * t
  const m = Math.random()
  const xPos = useRef([
    0,
    // r * Math.sin((1 / 3) * 2 * Math.PI),
    // r * Math.sin((2 / 3) * 2 * Math.PI),
    // r * Math.sin((3 / 3) * 2 * Math.PI),
    r * Math.sin(Math.PI),
    0.5 * r * Math.sin(m * 2 * Math.PI),
    r * Math.sin(2 * Math.PI),
    0,
  ])
  const yPos = useRef([
    0,
    // r * Math.cos((1 / 3) * 2 * Math.PI),
    // r * Math.cos((2 / 3) * 2 * Math.PI),
    // r * Math.cos((3 / 3) * 2 * Math.PI),
    // (Math.random() - 0.5) * 2 * r
    r * Math.cos(Math.PI),
    0.5 * r * Math.cos(m * 2 * Math.PI),
    r * Math.cos(2 * Math.PI),
    0,
  ])
  // const xVel = useRef([
  //   0, 0, 0, 0
  // ])
  // const yVel = useRef([
  //   0, 0, 0, 0,
  // ])
  // get the x-coordinate of a vector tangent to a circle given phi:
  const phase = Math.random() * 2 * Math.PI
  const xVel = useRef([
    0,
    // v * Math.cos((1 / 3) * 2 * Math.PI),
    // v * Math.cos((2 / 3) * 2 * Math.PI),
    // v * Math.cos((3 / 3) * 2 * Math.PI),
    v * Math.cos(Math.PI + phase),
    (Math.random() - 0.5) * 2 * v,
    v * Math.cos(2 * Math.PI + phase),
    0,
  ])
  const yVel = useRef([
    0,
    -v * Math.sin(Math.PI + phase),
    (Math.random() - 0.5) * 2 * v,
    -v * Math.sin(2 * Math.PI + phase),
    0,
  ])

  const [time, setTime] = useState(Date.now())

  const step = () => {
    // Implement a simple spring force simulation on the dots:
    // 1. Calculate the force on each dot
    // 2. Update the velocity of each dot
    // 3. Update the position of each dot
    // 4. Repeat
    const k = 0.1
    const dt = (Math.min(Date.now() - time, 1000) * 0.001) / 2
    setTime(Date.now())
    const n = 5

    for (let i = 0; i < n; i++) {
      if (i === 0) {
        // first point is fixed.
        continue
      }
      for (let j = 0; j < n; j++) {
        if (i === j) {
          continue
        }
        const dx = xPos.current[j] - xPos.current[i]
        const dy = yPos.current[j] - yPos.current[i]
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 0.005) {
          continue
        }
        const f = k * d
        const fx = (f * dx) / d
        const fy = (f * dy) / d
        xVel.current[i] += fx * dt
        yVel.current[i] += fy * dt
        xPos.current[i] += xVel.current[i] * dt
        yPos.current[i] += yVel.current[i] * dt

        if (isNaN(xVel.current[i])) {
          xVel.current[i] = 0
        }
        if (isNaN(yVel.current[i])) {
          yVel.current[i] = 0
        }
        if (isNaN(xPos.current[i])) {
          xPos.current[i] = 0
        }
        if (isNaN(yPos.current[i])) {
          yPos.current[i] = 0
        }
      }
    }
  }

  const timeout = useRef<any>(null)
  useEffect(() => {
    if (message.role === MessageRole.ASSISTANT) {
      // A step must render first before queueing another step.
      // So setTimeout is called in a render, not at the end of the step function.
      // This prevents the event queue from being filled with step calls,
      // which blocks touch events as they are added to the end of a long queue.
      if (timeout.current) {
        clearTimeout(timeout.current)
        timeout.current = null
      }
      timeout.current = setTimeout(() => {
        timeout.current = null
        step()
      }, 17)
    }
  }, [time, message.role])

  let averageDistanceFromCenter = Math.sqrt(
    xPos.current.reduce((acc, x, i) => {
      return acc + x * x + yPos.current[i] * yPos.current[i]
    }, 0) / 4,
  )

  const overlay = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 24 * t,
    height: 24 * t,
  }

  if (message.role === MessageRole.USER) {
    // return (
    //   <Image
    //     style={{
    //       width: 28,
    //       height: 28,
    //       borderRadius: 14,
    //       borderWidth: 1,
    //       borderColor:
    //         message.role === MessageRole.USER
    //           ? // ? 'rgba(255, 186, 0, 0.9)'
    //             'white'
    //           : 'rgba(62, 56, 225, 0.7)',
    //     }}
    //     source={
    //       message.role === MessageRole.USER
    //         ? {uri: 'AppIcon'}
    //         : {uri: 'LogoTransparent'}
    //     }
    //   />
    // )

    return (
      <View
        style={{
          width: 24 * t,
          height: 24 * t,
          borderRadius: 13 * t,
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}>
        <Icon
          style={[
            overlay,
            {
              width: 20,
              height: 20,
              marginTop: 6,
              marginLeft: 2,
            },
          ]}
          name={'person'}
          size={20}
          color={'rgba(0, 0, 0, 0.7)'}
        />

        <View
          style={[
            overlay,
            {
              width: 24 * t,
              height: 24 * t,
              borderRadius: 13 * t,
              // borderWidth: noBorder ? 0 : 1,
              borderWidth: noBorder ? 0 : 1,
              borderColor: 'rgba(0, 0, 0, 0.7)',
            },
          ]}
        />
      </View>
    )
  } else {
    const g = 2.8 / 10

    return (
      <View
        style={{
          width: 24 * t,
          height: 24 * t,
          borderRadius: 13 * t,
          overflow: 'hidden',
          // backgroundColor: darkMode ? 'black' : 'white',
          backgroundColor: 'white',
        }}>
        {xPos.current.map((x, i) => {
          const y = yPos.current[i]
          return (
            <View
              key={i}
              style={[
                overlay,
                i === 0
                  ? {
                      borderRadius: (8 * t + averageDistanceFromCenter / g) / 2,
                      width: 8 * t + averageDistanceFromCenter / g,
                      height: 8 * t + averageDistanceFromCenter / g,
                      top: '50%',
                      left: '50%',
                      marginLeft:
                        -((8 * t + averageDistanceFromCenter / g) / 2) + x,
                      marginTop:
                        -((8 * t + averageDistanceFromCenter / g) / 2) + -y,
                      backgroundColor: Colors.blue,
                    }
                  : {
                      borderRadius: 5 * t,
                      width: 10 * t,
                      height: 10 * t,
                      top: '50%',
                      left: '50%',
                      marginLeft: -5 * t + x,
                      marginTop: -5 * t + -y,
                      backgroundColor:
                        i === 1
                          ? 'rgba(255, 186, 0, 0.9)'
                          : i === 2
                          ? 'rgb(215, 29, 29)'
                          : i === 3
                          ? Colors.teal
                          : Colors.blue,
                    },
              ]}
            />
          )
        })}

        <BlurView
          style={[
            overlay,
            {
              width: 24 * t,
              height: 24 * t,
              borderRadius: 13 * t,
              // borderWidth: noBorder ? 0 : 1,
              borderWidth: noBorder ? 0 : 1,
              borderColor: Colors.blue,
            },
          ]}
          blurAmount={5 * t}
          blurType="light"
        />
      </View>
    )
  }
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
    // backgroundColor: 'rgba(255, 255, 255, 1)',
    backgroundColor: userChat,
    borderRadius: 24,
    minWidth: 40,
    marginTop: margin,
    marginBottom: margin,
    marginLeft: 20,
    marginRight: 20,
    // paddingLeft: 20,
    // paddingRight: 27,
  },
  aiMessage: {
    alignSelf: 'stretch',
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // backgroundColor: Colors.aiBubbleBg,
    backgroundColor: aiChat,
    borderRadius: 24,
    minWidth: 40,
    marginTop: margin,
    marginBottom: margin,
    marginLeft: 20,
    marginRight: 20,
    // paddingLeft: 25,
    // paddingRight: 20,
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
    marginRight: 7,
  },
  aiMessageWrap: {
    marginLeft: 11,
    marginRight: 7,
  },
  userMessageText: {
    color: userText,
    // color: 'rgba(255, 255, 255, 0.97)',
    fontSize: Colors.fontSize,
    lineHeight: Colors.fontSize * 1.5,
  },
  aiMessageText: {
    // color: 'rgba(255, 255, 255, 0.97)',
    color: aiText,
    fontSize: Colors.fontSize,
    lineHeight: Colors.fontSize * 1.5,
  },
})

export default ChatMessage
