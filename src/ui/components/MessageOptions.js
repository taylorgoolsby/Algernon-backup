// @flow

import React, {useRef, useState, useEffect} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native'
import chatStore from '../../stores/ChatStore.js'
import {observer} from 'mobx-react'
import {BlurView} from '@react-native-community/blur'
import Colors, { darkMode, fadeTime, shadow } from "../../Colors.js";
import {MessageRole} from '../../schema/Message/MessageSchema.mjs'
import Text from './Text.js'
import modalStore from '../../stores/ModalStore.js'
import ChatMessage, {margin, profileRowMinHeight} from './ChatMessage.js'

// There is only one MessageOptions component open at a time.
// It is positioned absolutely using the onLayout event of the ChatMessage component to
// determine where the absolute position should be.
// The system attempts to mount the options just above the ChatMessage, but if there
// is not enough room, because of the SafeAreaView, then it will adjust the
// position to be inside the safe area.

type MessageOptionsProps = {
  style: any,
  zIndexOffset: number,
  messageId: number,
  headerHeight: number,
  footerHeight: number,
  safeAreaHeaderHeight: number,
  safeAreaFooterHeight: number,
}

const easingTime = fadeTime
const screenHeight = Dimensions.get('window').height

const MessageOptions: any = observer((props: MessageOptionsProps): any => {
  const {style, messageId, headerHeight, footerHeight, zIndexOffset, safeAreaHeaderHeight, safeAreaFooterHeight} =
    props

  const measure = chatStore.optionsMeasures[messageId.toString()] ?? {x: 0, y: 0, width: 0, height: 0}
  const fadeOut = !!chatStore.optionsMessageIdFadeOuts[messageId.toString()]
  const prevFadeOut = useRef(fadeOut)
  const unmountTimeout = useRef<any>(null)
  const [layout, setLayout] = useState<any>(null)
  const opacityAnim = useRef(new Animated.Value(0)).current // Initialize opacity to 0
  const [unmount, setUnmount] = useState(true)
  useEffect(() => {
    if (fadeOut && !prevFadeOut.current) {
      if (unmountTimeout.current) {
        clearTimeout(unmountTimeout.current)
      }
      unmountTimeout.current = setTimeout(() => {
        setUnmount(true)
        setLayout(null)
        chatStore.onOptionFadeOut(messageId)
      }, easingTime)
    } else if (!fadeOut) {
      clearTimeout(unmountTimeout.current)
      setUnmount(false)
    }
    prevFadeOut.current = fadeOut
  }, [fadeOut])

  useEffect(() => {
    if (!unmount && layout) {
      if (!fadeOut) {
        // Fade in
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: easingTime,
          useNativeDriver: true, // Use native driver for better performance
        }).start()
      } else {
        // Fade out
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: easingTime,
          useNativeDriver: true,
        }).start()
      }
    }
  }, [fadeOut, unmount, layout])

  const message = chatStore.messages[messageId?.toString() ?? '']
  const isUser = message?.role === MessageRole.USER

  let top = (measure?.y ?? 0) - (layout?.height ?? 0) - margin / 2
  // let top = (measure?.y ?? 0) - 36
  // if (top < headerHeight) {
  //   top = headerHeight
  // }



  const isOptionTarget = chatStore.optionsTarget === messageId

  const backgroundColorAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (isOptionTarget) {
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
  }, [isOptionTarget])

  const onLayout = (event: any) => {
    setLayout(event.nativeEvent.layout)
  }

  const handleCustomize = () => {}

  const handleRegenerate = () => {}

  const handleDelete = async () => {
    const confirmed = await modalStore.confirm('Delete Message?', null)
    if (confirmed) {
      await chatStore.deleteMessage(message.messageId)
    }
  }

  const predictFutureVelocity = (velocity: number, deceleration: number) => {
    return velocity / (1 - deceleration)
  }

  const getScreenBoundaries = (): {lower: number, upper: number} => {
    // The lower boundary is either the top of the footer or the top of the previous message
    const previousMessageId =
      chatStore.optionsMessageIds[
      chatStore.optionsMessageIds.indexOf(messageId) - 1
        ]
    const previousMessageMeasure = previousMessageId
      ? chatStore.optionsMeasures[previousMessageId?.toString()]
      : null
    const previousMessageTop =
      (previousMessageMeasure?.y ?? 0) +
      (chatStore.optionsPannings[previousMessageId?.toString()] ?? 0) // acount for panning in the previous message
    let lower = !previousMessageMeasure
      ? screenHeight - safeAreaFooterHeight
      : screenHeight - safeAreaFooterHeight
    // : previousMessageTop
    lower += -profileRowMinHeight

    // The upper boundary is either the bottom of the header or the bottom of the next message
    const nextMessageId =
      chatStore.optionsMessageIds[
      chatStore.optionsMessageIds.indexOf(messageId) + 1
        ]
    const nextMessageMeasure = nextMessageId
      ? chatStore.optionsMeasures[nextMessageId?.toString()]
      : null
    const nextMessageTop =
      (nextMessageMeasure?.y ?? 0) +
      (chatStore.optionsPannings[nextMessageId?.toString()] ?? 0) // acount for panning in the next message
    let upper = !nextMessageMeasure
      ? safeAreaHeaderHeight
      : safeAreaHeaderHeight
    // : nextMessageTop
    upper += profileRowMinHeight
    upper -= chatStore.optionsMeasures[messageId?.toString()]?.height ?? 0

    return {lower, upper}
  }

  const animMode = useRef<'pan' | 'slide' | 'spring'>('pan')
  const startSliding = useRef<any>(null)
  const currentTop = useRef(measure?.y ?? 0)
  const anim = useRef(new Animated.ValueXY()).current
  const lastTime = useRef(0)
  const lastY = useRef(0)
  const animListenerAdded = useRef(false)
  useEffect(() => {
    if (!animListenerAdded.current) {
      animListenerAdded.current = true
      const listener = (position: {value: number}) => {
        const diffY = position.value - lastY.current
        lastY.current = position.value

        const diffTime = Date.now() - lastTime.current
        lastTime.current = Date.now()

        if (diffTime > 0) {
          if (animMode.current === 'slide') {
            const {lower, upper} = getScreenBoundaries()
            const maxDy = lower - (measure?.y ?? 0)
            const minDy = upper - (measure?.y ?? 0)
            const velocity = predictFutureVelocity(startSliding.current.v0, 0.9983)
            if (position.value > maxDy) {
              animMode.current = 'spring'
              // If the boundary is exceeded, spring back to the boundary
              Animated.spring(anim.y, {
                velocity: velocity,
                toValue: maxDy,
                friction: 7, // Adjust the friction for the bounce effect
                // tension: 1,
                useNativeDriver: true,
              }).start();
            }
            else if (position.value < minDy) {
              animMode.current = 'spring'
              // If the boundary is exceeded, spring back to the boundary
              Animated.spring(anim.y, {
                velocity: velocity,
                toValue: minDy,
                friction: 7, // Adjust the friction for the bounce effect
                // tension: 1,
                useNativeDriver: true,
              }).start();
            }
          }
        }
      }
      anim.y.addListener(listener)

      return () => {
        // $FlowFixMe
        anim.y.removeAllListeners()
      }
    }
  }, [])
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        animMode.current = 'pan'
        // chatStore.deselectOptionsTarget()
        // const isOptionColorTarget = chatStore.optionsColorTarget === messageId
        // if (!isOptionColorTarget) {
        chatStore.setOptionsColorTarget(messageId)
        chatStore.setOptionsTarget(messageId)
        // }
        anim.extractOffset()

        const {lower, upper} = getScreenBoundaries()
        currentTop.current = Math.max(Math.min(
          (measure?.y ?? 0) + anim.y._offset,
          lower,
        ), upper)

        anim.y.setValue(0) // stops any animations
      },
      onPanResponderMove: (e, gestureState) => {
        const isOptionColorTarget = chatStore.optionsColorTarget === messageId
        if (isOptionColorTarget) {
          chatStore.deselectOptionsColorTarget()
        }

        const {lower, upper} = getScreenBoundaries()
        const maxDy = lower - currentTop.current
        const minDy = upper - currentTop.current

        if (gestureState.dy > maxDy) {
          anim.setValue({x: 0, y: maxDy})
        }
        else if (gestureState.dy < minDy) {
          anim.setValue({x: 0, y: minDy})
        }
        else {
          Animated.event([null, {dy: anim.y}], {
            useNativeDriver: false,
          })(e, gestureState)
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        // const isOptionColorTarget = chatStore.optionsColorTarget === messageId
        // if (gestureState.dy === 0) {
        //   if (isOptionColorTarget) {
        //     chatStore.deselectOptionsColorTarget()
        //   }
        //   // else {
        //   //   chatStore.setOptionsColorTarget(messageId)
        //   //   chatStore.setOptionsTarget(messageId)
        //   // }
        // } else {
        //   chatStore.deselectOptionsColorTarget()
        // }

        const {lower, upper} = getScreenBoundaries()

        currentTop.current = Math.max(Math.min(
          currentTop.current + gestureState.dy,
          lower,
        ), upper)
        chatStore.optionsPannings[messageId.toString()] =
          currentTop.current -
          chatStore.optionsMeasures[messageId.toString()].y
        anim.flattenOffset()
        // anim.extractOffset()

        animMode.current = 'slide'
        startSliding.current = {x0: currentTop.current -
            chatStore.optionsMeasures[messageId.toString()].y, v0: gestureState.vy, time: Date.now()}

        // Start a decay animation to simulate momentum
        Animated.decay(anim, {
          velocity: {x: 0, y: gestureState.vy}, // Use the vertical velocity that the user ended with
          deceleration: 0.9983,
          useNativeDriver: true,
        }).start()
      },
    }),
  ).current

  const optionsAnim = useRef(Animated.diffClamp(anim.y, -(measure?.y ?? 0), screenHeight - (measure?.y ?? 0))).current

  if (unmount) {
    return null
  }

  return (
    <>
      {isOptionTarget ? (
        <Animated.View
          style={[
            styles.container,
            {
              top,
              // height: (measure?.height ?? 0),
              opacity: opacityAnim,
              transform: [{translateY: anim.y}],
              // zIndex: 500 + zIndexOffset
              zIndex: 500 - zIndexOffset
            },
            isUser
              ? {
                  left:
                    (measure?.x ?? 0) +
                    ((measure?.width ?? 0) - (layout?.width ?? 0)) -
                    0,
                // left: (measure?.x ?? 0) + 0
                }
              : {
                  // left:
                  //   (measure?.x ?? 0) +
                  //   ((measure?.width ?? 0) - (layout?.width ?? 0)) -
                  //   0,
                  left: (measure?.x ?? 0) + 0
                },
            style,
            shadow,
            {
              borderRadius: 24,
              backgroundColor: 'rgba(112, 163, 255, 0.5)',
              // backgroundColor: backgroundColorAnim.interpolate({
              //   inputRange: [0, 1],
              //   outputRange: [
              //     'rgba(255, 255, 255, 0)',
              //     message.role === MessageRole.USER
              //       ? 'rgba(112, 163, 255, 0.5)'
              //       : 'rgba(255, 255, 255, 0)',
              //   ],
              // }),
            },
          ]}
          onLayout={onLayout}
          {...panResponder.panHandlers}>
          <BlurView
            style={[
              styles.blurView,

            ]}
            blurType={darkMode ? 'dark' : 'light'}
            blurAmount={70}>
            {isUser ? (
              <>
                <OptionRow label="Customize" onPress={handleCustomize} />
                {/*<OptionRow label="Publish" onPress={handlePublish}/>*/}
                <OptionRow label="Delete" onPress={handleDelete} />
              </>
            ) : (
              <>
                {/*<OptionRow label="Think Harder" onPress={handleThinkHarder}/>*/}
                <OptionRow label="Regenerate" onPress={handleRegenerate} />
                <OptionRow label="Delete" onPress={handleDelete} />
              </>
            )}
          </BlurView>
        </Animated.View>
      ) : null}

      <Animated.View
        style={[
          styles.container,
          {
            top: measure?.y ?? 0,
            left: measure?.x ?? 0,
            opacity: opacityAnim,
            width: measure?.width ?? 0,
            transform: [{translateY: anim.y}],
            zIndex: 500 - zIndexOffset
          },
          style,
          shadow,
        ]}
        onLayout={onLayout}
        {...panResponder.panHandlers}>
        <ChatMessage
          messageId={messageId.toString()}
          isActive={true}
          onMessageLayout={() => {}}
          isFloating
        />
      </Animated.View>
    </>
  )
})

const FloatingOption: any = (props) => {
  const {
    style,
    messageId,
    measure,
    safeHeaderHeight,
    safeFooterHeight,
    zIndexOffset,
    opacityAnim,
    render,
    onLayout,
  } = props;

  const predictFutureVelocity = (velocity: number, deceleration: number) => {
    return velocity / (1 - deceleration)
  }

  const getScreenBoundaries = (): {lower: number, upper: number} => {
    // The lower boundary is either the top of the footer or the top of the previous message
    const previousMessageId =
      chatStore.optionsMessageIds[
      chatStore.optionsMessageIds.indexOf(messageId) - 1
        ]
    const previousMessageMeasure = previousMessageId
      ? chatStore.optionsMeasures[previousMessageId?.toString()]
      : null
    const previousMessageTop =
      (previousMessageMeasure?.y ?? 0) +
      (chatStore.optionsPannings[previousMessageId?.toString()] ?? 0) // acount for panning in the previous message
    let lower = !previousMessageMeasure
      ? screenHeight - safeFooterHeight
      : screenHeight - safeFooterHeight
    // : previousMessageTop
    lower += -profileRowMinHeight

    // The upper boundary is either the bottom of the header or the bottom of the next message
    const nextMessageId =
      chatStore.optionsMessageIds[
      chatStore.optionsMessageIds.indexOf(messageId) + 1
        ]
    const nextMessageMeasure = nextMessageId
      ? chatStore.optionsMeasures[nextMessageId?.toString()]
      : null
    const nextMessageTop =
      (nextMessageMeasure?.y ?? 0) +
      (chatStore.optionsPannings[nextMessageId?.toString()] ?? 0) // acount for panning in the next message
    let upper = !nextMessageMeasure
      ? safeHeaderHeight
      : safeHeaderHeight
    // : nextMessageTop
    upper += profileRowMinHeight
    upper -= chatStore.optionsMeasures[messageId?.toString()]?.height ?? 0

    return {lower, upper}
  }

  const animMode = useRef<'pan' | 'slide' | 'spring'>('pan')
  const startSliding = useRef<any>(null)
  const currentTop = useRef(measure?.y ?? 0)
  const anim = useRef(new Animated.ValueXY()).current
  const lastTime = useRef(0)
  const lastY = useRef(0)
  anim.y.addListener((position) => {
    const diffY = position.value - lastY.current
    lastY.current = position.value

    const diffTime = Date.now() - lastTime.current
    lastTime.current = Date.now()

    if (diffTime > 0) {
      if (animMode.current === 'slide') {
        const {lower, upper} = getScreenBoundaries()
        const maxDy = lower - (measure?.y ?? 0)
        const minDy = upper - (measure?.y ?? 0)
        const velocity = predictFutureVelocity(startSliding.current.v0, 0.9983)
        if (position.value > maxDy) {
          animMode.current = 'spring'
          // If the boundary is exceeded, spring back to the boundary
          Animated.spring(anim.y, {
            velocity: velocity,
            toValue: maxDy,
            friction: 7, // Adjust the friction for the bounce effect
            // tension: 1,
            useNativeDriver: true,
          }).start();
        }
        else if (position.value < minDy) {
          animMode.current = 'spring'
          // If the boundary is exceeded, spring back to the boundary
          Animated.spring(anim.y, {
            velocity: velocity,
            toValue: minDy,
            friction: 7, // Adjust the friction for the bounce effect
            // tension: 1,
            useNativeDriver: true,
          }).start();
        }
      }
    }
  });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        animMode.current = 'pan'
        // chatStore.deselectOptionsTarget()
        // const isOptionColorTarget = chatStore.optionsColorTarget === messageId
        // if (!isOptionColorTarget) {
        chatStore.setOptionsColorTarget(messageId)
        chatStore.setOptionsTarget(messageId)
        // }
        anim.extractOffset()

        const {lower, upper} = getScreenBoundaries()
        currentTop.current = Math.max(Math.min(
          (measure?.y ?? 0) + anim.y._offset,
          lower,
        ), upper)

        anim.y.setValue(0) // stops any animations
      },
      onPanResponderMove: (e, gestureState) => {
        const isOptionColorTarget = chatStore.optionsColorTarget === messageId
        if (isOptionColorTarget) {
          chatStore.deselectOptionsColorTarget()
        }

        const {lower, upper} = getScreenBoundaries()
        const maxDy = lower - currentTop.current
        const minDy = upper - currentTop.current

        if (gestureState.dy > maxDy) {
          anim.setValue({x: 0, y: maxDy})
        }
        else if (gestureState.dy < minDy) {
          anim.setValue({x: 0, y: minDy})
        }
        else {
          Animated.event([null, {dy: anim.y}], {
            useNativeDriver: false,
          })(e, gestureState)
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        // const isOptionColorTarget = chatStore.optionsColorTarget === messageId
        // if (gestureState.dy === 0) {
        //   if (isOptionColorTarget) {
        //     chatStore.deselectOptionsColorTarget()
        //   }
        //   // else {
        //   //   chatStore.setOptionsColorTarget(messageId)
        //   //   chatStore.setOptionsTarget(messageId)
        //   // }
        // } else {
        //   chatStore.deselectOptionsColorTarget()
        // }

        const {lower, upper} = getScreenBoundaries()

        currentTop.current = Math.max(Math.min(
          currentTop.current + gestureState.dy,
          lower,
        ), upper)
        chatStore.optionsPannings[messageId.toString()] =
          currentTop.current -
          chatStore.optionsMeasures[messageId.toString()].y
        anim.flattenOffset()
        // anim.extractOffset()

        animMode.current = 'slide'
        startSliding.current = {x0: currentTop.current -
            chatStore.optionsMeasures[messageId.toString()].y, v0: gestureState.vy, time: Date.now()}

        // Start a decay animation to simulate momentum
        Animated.decay(anim, {
          velocity: {x: 0, y: gestureState.vy}, // Use the vertical velocity that the user ended with
          deceleration: 0.9983,
          useNativeDriver: true,
        }).start()
      },
    }),
  ).current

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: measure?.y ?? 0,
          left: measure?.x ?? 0,
          opacity: opacityAnim,
          width: measure?.width ?? 0,
          transform: [{translateY: anim.y}],
          zIndex: 500 - zIndexOffset
        },
        style,
        shadow,
      ]}
      onLayout={onLayout}
      {...panResponder.panHandlers}>
      {render()}
    </Animated.View>
  )
}

const OptionRow: any = (props: any) => {
  const {label, onPress} = props

  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 300,
  },
  blurView: {
    flex: 1,
    borderRadius: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    paddingLeft: 24,
    paddingRight: 24,
  },
  optionText: {
    fontSize: (Colors.fontSize * 14) / 16,
    color: darkMode ? 'white' : 'black',
  },
})

export default MessageOptions
