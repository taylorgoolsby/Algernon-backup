// @flow

import React, {useRef, useState, useEffect} from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native'
import chatStore from '../../stores/ChatStore.js'
import {observer} from 'mobx-react'
import {BlurView} from '@react-native-community/blur'
import Colors, {darkMode, fadeTime, shadow} from '../../Colors.js'
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
const rate = 0.999
const friction = 7

const MessageOptions: any = observer((props: MessageOptionsProps): any => {
  const {
    style,
    messageId,
    headerHeight,
    footerHeight,
    safeAreaHeaderHeight,
    safeAreaFooterHeight,
  } = props

  const measure = chatStore.optionsMeasures[messageId.toString()] ?? {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }
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
        chatStore.unDockOption(messageId)
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

  const getDockVelocity = (velocity: number, deceleration: number) => {
    return velocity / (1 - deceleration)
  }

  const getScreenBoundaries = (): {lower: number, upper: number} => {
    // The lower boundary is either the top of the footer or the top of the previous message
    // const previousMessageId =
    //   chatStore.optionsMessageIds[
    //     chatStore.optionsMessageIds.indexOf(messageId) - 1
    //   ]
    // const previousMessageMeasure = previousMessageId
    //   ? chatStore.optionsMeasures[previousMessageId?.toString()]
    //   : null
    // const previousMessageTop =
    //   (previousMessageMeasure?.y ?? 0) +
    //   (chatStore.optionsPannings[previousMessageId?.toString()] ?? 0) // acount for panning in the previous message
    // let lower = !previousMessageMeasure
    //   ? screenHeight - safeAreaFooterHeight
    //   // : screenHeight - safeAreaFooterHeight
    // : previousMessageTop
    // lower += -profileRowMinHeight

    let nUserDocked = 0
    let nAiDocked = 0
    for (const id of chatStore.optionsMessageIds) {
      if (messageId === id) {
        break
      }
      const message = chatStore.messages[id.toString()]
      if (message.role === MessageRole.USER) {
        nUserDocked += chatStore.optionsDocked[id.toString()] === 'footer' ? 1 : 0
      } else {
        nAiDocked += chatStore.optionsDocked[id.toString()] === 'footer' ? 1 : 0
      }
    }
    const nItemsDocked = message.role === MessageRole.USER ? nUserDocked : nAiDocked
    let lower = screenHeight - safeAreaFooterHeight - profileRowMinHeight - nItemsDocked * profileRowMinHeight

    if (chatStore.optionsTarget === messageId) {
      // When an item is selected, the lower boundary is raised to show the first sentence of text.
      lower -= 28
    }

    // The upper boundary is either the bottom of the header or the bottom of the next message
    const nextMessageId =
      chatStore.optionsMessageIds[
        chatStore.optionsMessageIds.indexOf(messageId) + 1
      ]
    const nextMessageMeasure = nextMessageId
      ? chatStore.optionsMeasures[nextMessageId?.toString()]
      : null
    // const nextMessageTop =
    //   (nextMessageMeasure?.y ?? 0) +
    //   (chatStore.optionsPannings[nextMessageId?.toString()] ?? 0) // acount for panning in the next message
    let upper = !nextMessageMeasure
      ? safeAreaHeaderHeight
      : safeAreaHeaderHeight
    // : nextMessageTop
    upper += profileRowMinHeight
    upper -= chatStore.optionsMeasures[messageId?.toString()]?.height ?? 0

    return {lower, upper}
  }

  useEffect(() => {
    const {lower, upper} = getScreenBoundaries()
    const maxDy = lower - (measure?.y ?? 0)
    const minDy = upper - (measure?.y ?? 0)
    if (animMode.current === 'spring') {
      if (springMode.current === 'footer') {
        if (lastY.current !== maxDy) {
          anim.y.stopAnimation(() => {
            Animated.spring(anim.y, {
              velocity: 0,
              toValue: maxDy,
              friction: friction,
              // tension: 1,
              useNativeDriver: true,
            }).start()
          })
        }
      } else {
        if (lastY.current !== minDy) {
          anim.y.stopAnimation(() => {
            Animated.spring(anim.y, {
              velocity: 0,
              toValue: minDy,
              friction: friction,
              // tension: 1,
              useNativeDriver: true,
            }).start()
          })
        }
      }
    }
  }, [chatStore.optionsTarget, chatStore.optionsDocked])

  const animMode = useRef<'pan' | 'slide' | 'spring'>('pan')
  const springMode = useRef<'footer' | 'header'>('footer')
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

        chatStore.optionsPannings[messageId.toString()] = lastY.current

        if (diffTime > 0) {
          if (animMode.current === 'slide') {
            const {lower, upper} = getScreenBoundaries()
            const maxDy = lower - (measure?.y ?? 0)
            const minDy = upper - (measure?.y ?? 0)
            const velocity = getDockVelocity(
              startSliding.current.v0,
              rate
            )
            if (position.value > maxDy) {
              animMode.current = 'spring'
              springMode.current = 'footer'
              chatStore.dockOption(messageId, 'footer')
              Animated.spring(anim.y, {
                velocity: velocity,
                toValue: maxDy,
                friction: friction,
                // tension: 1,
                useNativeDriver: true,
              }).start()
            } else if (position.value < minDy) {
              animMode.current = 'spring'
              springMode.current = 'header'
              chatStore.dockOption(messageId, 'header')
              Animated.spring(anim.y, {
                velocity: velocity,
                toValue: minDy,
                friction: friction,
                // tension: 1,
                useNativeDriver: true,
              }).start()
            }
          }
        }
      }
      anim.y.addListener(listener)
    }
  }, [])
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => {

        return true
      },
      onPanResponderGrant: (e, gestureState) => {
        animMode.current = 'pan'
        console.log("animMode.current", animMode.current);
        anim.extractOffset()

        const {lower, upper} = getScreenBoundaries()
        currentTop.current = Math.max(
          Math.min((measure?.y ?? 0) + anim.y._offset, lower),
          upper,
        )

        anim.y.setValue(0) // stops any animations
      },
      onPanResponderMove: (e, gestureState) => {
        // const isOptionColorTarget = chatStore.optionsColorTarget === messageId
        const isOptionTarget = chatStore.optionsTarget === messageId
        if (!isOptionTarget) {
          // chatStore.deselectOptionsColorTarget()
          chatStore.setOptionsColorTarget(messageId)
          chatStore.setOptionsTarget(messageId)
        }

        const {lower, upper} = getScreenBoundaries()
        const maxDy = lower - currentTop.current
        const minDy = upper - currentTop.current

        if (chatStore.optionsDocked[messageId.toString()] === 'footer' && gestureState.dy < 0) {
          // undock if paning moves away from the docked position
          chatStore.unDockOption(messageId)
        }

        Animated.event([null, {dy: anim.y}], {
          useNativeDriver: false,
        })(e, gestureState)
      },
      onPanResponderRelease: (e, gestureState) => {
        // screenBoundaries must be computed before changing targets
        const {lower, upper} = getScreenBoundaries()
        const maxDy = lower - (measure?.y ?? 0)
        const minDy = upper - (measure?.y ?? 0)

        if (gestureState.dy === 0) {
          // When tapping (d = 0), on release, the message should be deselected
          const isOptionTarget = chatStore.optionsTarget === messageId
          if (!isOptionTarget) {
            chatStore.setOptionsTarget(messageId)
            chatStore.setOptionsColorTarget(messageId)
          } else {
            chatStore.deselectOptionsTarget()
            chatStore.deselectOptionsColorTarget()
          }
        }

        currentTop.current = Math.max(
          Math.min(currentTop.current + gestureState.dy, lower),
          upper,
        )
        chatStore.optionsPannings[messageId.toString()] =
          currentTop.current - chatStore.optionsMeasures[messageId.toString()].y
        anim.flattenOffset()

        if (
          gestureState.vy === 0 &&
          (isPixelEqual(anim.y._value, maxDy) ||
            isPixelEqual(anim.y._value, minDy))
        ) {
          if (isPixelEqual(anim.y._value, maxDy)) {
            animMode.current = 'spring'
            springMode.current = 'footer'
            chatStore.dockOption(messageId, 'footer')
            Animated.spring(anim.y, {
              velocity: 0,
              toValue: maxDy,
              friction: friction,
              // tension: 1,
              useNativeDriver: true,
            }).start()
          } else {
            animMode.current = 'spring'
            springMode.current = 'header'
            Animated.spring(anim.y, {
              velocity: 0,
              toValue: minDy,
              friction: friction,
              // tension: 1,
              useNativeDriver: true,
            }).start()
          }
        } else {
          animMode.current = 'slide'
          startSliding.current = {
            x0:
              currentTop.current -
              chatStore.optionsMeasures[messageId.toString()].y,
            v0: gestureState.vy,
            time: Date.now(),
          }

          // Start a decay animation to simulate momentum
          Animated.decay(anim, {
            velocity: {x: 0, y: gestureState.vy}, // Use the vertical velocity that the user ended with
            deceleration: rate,
            useNativeDriver: true,
          }).start()
        }
      },
    }),
  ).current

  // const optionsAnim = useRef(Animated.diffClamp(anim.y, -(measure?.y ?? 0), screenHeight - (measure?.y ?? 0))).current
  const isDocked = chatStore.optionsDocked[messageId.toString()] === 'footer'
  let nUserDocked = 0
  let nAiDocked = 0
  for (const id of chatStore.optionsMessageIds) {
    if (chatStore.optionsDocked[id.toString()] === 'footer') {
      if (chatStore.messages[id.toString()].role === MessageRole.USER) {
        nUserDocked++
      } else {
        nAiDocked++
      }
    }
  }
  const nDockRows = Math.max(nUserDocked, nAiDocked)
  let nUserDockedBelow = 0
  let nAiDockedBelow = 0
  for (const id of chatStore.optionsMessageIds) {
    if (id === messageId) {
      break
    }
    if (chatStore.optionsDocked[id.toString()] === 'footer') {
      if (chatStore.messages[id.toString()].role === MessageRole.USER) {
        nUserDockedBelow++
      } else {
        nAiDockedBelow++
      }
    }
  }
  let zIndexOffset = props.zIndexOffset

  if (!isDocked) {
    zIndexOffset += nDockRows * 2 // times 2 because each dock row has two zIndices for the two messages in it.

    // User message is always above AI messages within the bulk.
    if (!isUser) {
      zIndexOffset += 100
    }
  } else {
    const dockRow = message.role === MessageRole.USER ? nUserDockedBelow : nAiDockedBelow
    zIndexOffset = dockRow * 2

    // AI message is always below user message within the same dock row.
    if (!isUser) {
      zIndexOffset += 1
    }
  }

  // Above zIndexOffset has been decided without considering a selected message.
  // Now we will adjust the zIndexOffset if the message is selected.
  if (chatStore.optionsTarget !== null) {
    if (chatStore.optionsTarget === messageId) {
      // If selected, it's zIndex should be where it would be if it were to be docked.
      const dockRow = message.role === MessageRole.USER ? nUserDockedBelow : nAiDockedBelow
      zIndexOffset = dockRow * 2

      // AI message is always below user message within the same dock row.
      if (!isUser) {
        zIndexOffset += 1
      }
    }

    // Then all other messages below it should be pushed down.
    if (chatStore.optionsTarget !== messageId) {
      const indexOfSelected = chatStore.optionsMessageIds.indexOf(chatStore.optionsTarget)
      const myIndex = chatStore.optionsMessageIds.indexOf(messageId)
      if (indexOfSelected < myIndex) {
        zIndexOffset += 1
      }
    }
  }

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
              zIndex: 500 - zIndexOffset,
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
                  left: (measure?.x ?? 0) + 0,
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
            style={[styles.blurView]}
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
            zIndex: 500 - zIndexOffset,
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

const OptionRow: any = (props: any) => {
  const {label, onPress} = props

  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  )
}

function isPixelEqual(a: number, b: number): boolean {
  return Math.round(a) === Math.round(b) || Math.abs(Math.round(a) - Math.round(b)) === 1
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
