// @flow

import React, { useRef, useState, useEffect } from "react";
import {View, StyleSheet, TouchableOpacity, Animated} from 'react-native'
import chatStore from '../../stores/ChatStore.js'
import {observer} from 'mobx-react'
import {BlurView} from '@react-native-community/blur'
import Colors, { darkMode } from "../../Colors.js";
import { MessageRole } from "../../schema/Message/MessageSchema.mjs";
import Text from "./Text.js";
import modalStore from "../../stores/ModalStore.js";

// There is only one MessageOptions component open at a time.
// It is positioned absolutely using the onLayout event of the ChatMessage component to
// determine where the absolute position should be.
// The system attempts to mount the options just above the ChatMessage, but if there
// is not enough room, because of the SafeAreaView, then it will adjust the
// position to be inside the safe area.

type MessageOptionsProps = {
  headerHeight: number,
  footerHeight: number
}

const MessageOptions: any = observer((props: MessageOptionsProps): any => {
  const {
    headerHeight,
    footerHeight,
  } = props

  const {showOptions, optionsMessageId, optionsMeasure} = chatStore

  const [layout, setLayout] = useState<any>(null);
  const opacityAnim = useRef(new Animated.Value(0)).current; // Initialize opacity to 0

  useEffect(() => {
    if (showOptions) {
      // Fade in
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    } else {
      // Fade out
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }
  }, [showOptions]);

  if (!showOptions) {
    return null
  }

  // $FlowFixMe
  const message = chatStore.messages[optionsMessageId.toString()]
  const isUser = message.role === MessageRole.USER

  const onLayout = (event: any) => {
    setLayout(event.nativeEvent.layout)
  }

  const handleCustomize = () => {

  }

  const handleRegenerate = () => {

  }

  const handleDelete = async () => {
    const confirmed = await modalStore.confirm('Delete Message?', null)
    if (confirmed) {
      await chatStore.deleteMessage(message.messageId)
    }
  }

  let top = optionsMeasure.y - (layout?.height ?? 0) - 6
  if (top < headerHeight) {
    top = headerHeight
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top,
          left: optionsMeasure.x,
          opacity: opacityAnim,
        },
      ]}
      onLayout={onLayout}>
      <BlurView
        style={styles.blurView}
        blurType={darkMode ? 'dark' : 'light'}
        blurAmount={70}>
        {isUser ? (
          <>
            <OptionRow label="Customize" onPress={handleCustomize}/>
            {/*<OptionRow label="Publish" onPress={handlePublish}/>*/}
            <OptionRow label="Delete" onPress={handleDelete}/>
          </>
        ) : (
          <>
            {/*<OptionRow label="Think Harder" onPress={handleThinkHarder}/>*/}
            <OptionRow label="Regenerate" onPress={handleRegenerate}/>
            <OptionRow label="Delete" onPress={handleDelete}/>
          </>
        )}
      </BlurView>
    </Animated.View>
  )
})

const OptionRow: any = (props: any) => {
  const {
    label,
    onPress,
  } = props;

  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <Text style={styles.optionText}>
        {label}
      </Text>
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
    borderRadius: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    paddingLeft: 24,
    paddingRight: 24,
  },
  optionText: {
    fontSize: Colors.fontSize * 14/16,
    color: darkMode ? 'white' : 'black',
  }
})

export default MessageOptions
