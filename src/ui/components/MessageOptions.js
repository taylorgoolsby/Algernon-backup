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
import Colors, {darkMode} from '../../Colors.js'
import {MessageRole} from '../../schema/Message/MessageSchema.mjs'
import Text from './Text.js'
import modalStore from '../../stores/ModalStore.js'
import ChatMessage, {margin, profileRowHeight} from './ChatMessage.js'

// There is only one MessageOptions component open at a time.
// It is positioned absolutely using the onLayout event of the ChatMessage component to
// determine where the absolute position should be.
// The system attempts to mount the options just above the ChatMessage, but if there
// is not enough room, because of the SafeAreaView, then it will adjust the
// position to be inside the safe area.

type MessageOptionsProps = {
  style: any,
  messageId: number,
  headerHeight: number,
  footerHeight: number,
  safeAreaFooterHeight: number,
}

const easingTime = 280
const screenHeight = Dimensions.get('window').height

const MessageOptions: any = observer((props: MessageOptionsProps): any => {
  const {style, messageId, headerHeight, footerHeight, safeAreaFooterHeight} =
    props

  const measure = chatStore.optionsMeasures[messageId.toString()]
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
  if (top < headerHeight) {
    top = headerHeight
  }

  const startPanningTop = useRef(measure?.y ?? 0)
  const pan = useRef(new Animated.ValueXY()).current
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        // startPanningTop.current = (measure?.y ?? 0) + lastPanY.current
        chatStore.setOptionsTarget(messageId)
      },
      onPanResponderMove: (e, gestureState) => {
        const previousMessageId =
          chatStore.optionsMessageIds[
            chatStore.optionsMessageIds.indexOf(messageId) - 1
          ]
        const previousMessageMeasure = previousMessageId
          ? chatStore.optionsMeasures[previousMessageId?.toString()]
          : null
        const previousMessageTop =
          (previousMessageMeasure?.y ?? 0) +
          (chatStore.optionsPannings[previousMessageId?.toString()] ?? 0)
        let lowerBoundary = !previousMessageMeasure
          ? screenHeight - safeAreaFooterHeight
          : previousMessageTop
        lowerBoundary += -profileRowHeight
        const maxDy = lowerBoundary - startPanningTop.current

        if (gestureState.dy > maxDy) {
          pan.setValue({x: 0, y: maxDy})
        } else {
          Animated.event([null, {dy: pan.y}], {
            useNativeDriver: false,
          })(e, gestureState)
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        const previousMessageId =
          chatStore.optionsMessageIds[
            chatStore.optionsMessageIds.indexOf(messageId) - 1
          ]
        const previousMessageMeasure = previousMessageId
          ? chatStore.optionsMeasures[previousMessageId?.toString()]
          : null
        const previousMessageTop =
          (previousMessageMeasure?.y ?? 0) +
          (chatStore.optionsPannings[previousMessageId?.toString()] ?? 0)
        let lowerBoundary = !previousMessageMeasure
          ? screenHeight - safeAreaFooterHeight
          : previousMessageTop
        lowerBoundary += -profileRowHeight
        startPanningTop.current = Math.min(
          startPanningTop.current + gestureState.dy,
          lowerBoundary,
        )
        chatStore.optionsPannings[messageId.toString()] =
          startPanningTop.current -
          chatStore.optionsMeasures[messageId.toString()].y
        pan.extractOffset()

        // // Start a decay animation to simulate momentum
        // Animated.decay(pan, {
        //   velocity: {x: 0, y: gestureState.vy}, // Use the vertical velocity that the user ended with
        //   deceleration: 0.997,
        //   useNativeDriver: true,
        // }).start(() => {
        //   pan.y.extractOffset(); // Prepare for measuring the current value
        //   pan.y.setValue(0); // Reset to start tracking new movement
        //   pan.y.flattenOffset(); // Apply the total movement
        //
        //   pan.y.addListener((position) => {
        //     if (position.value > lowerBoundary) {
        //       // If the boundary is exceeded, spring back to the boundary
        //       Animated.spring(pan.y, {
        //         toValue: lowerBoundary,
        //         friction: 5, // Adjust the friction for the bounce effect
        //         useNativeDriver: true,
        //       }).start();
        //     }
        //   });
        // });
      },
    }),
  ).current

  const isOptionTarget = chatStore.optionsTarget === messageId

  const backgroundColorAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (isOptionTarget) {
      Animated.timing(backgroundColorAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(backgroundColorAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start()
    }
  }, [isOptionTarget])

  if (unmount) {
    return null
  }

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
              transform: [{translateY: pan.y}],
            },
            isUser
              ? {
                  // left:
                  //   (measure?.x ?? 0) +
                  //   ((measure?.width ?? 0) - (layout?.width ?? 0)) -
                  //   0,
                left: (measure?.x ?? 0) + 0
                }
              : {
                  // left:
                  //   (measure?.x ?? 0) +
                  //   ((measure?.width ?? 0) - (layout?.width ?? 0)) -
                  //   0,
                  left: (measure?.x ?? 0) + 0
                },
            style,
            {
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.5,
              shadowRadius: 1,
              elevation: 1,
            },
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
            transform: [{translateY: pan.y}],
          },
          style,
          {
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.5,
            shadowRadius: 1,
            elevation: 1,
          },
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
