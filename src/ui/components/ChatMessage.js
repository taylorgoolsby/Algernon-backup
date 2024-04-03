// @flow

import React, {useState, useRef} from 'react'
import { View, Dimensions, StyleSheet, Animated, Easing, TouchableOpacity } from "react-native";
import type {MessageSQL} from '../../schema/Message/MessageSchema.mjs'
import {MessageRole} from '../../schema/Message/MessageSchema.mjs'
import Spinner from './Spinner.js'
import Colors from "../../Colors.js";
import Text from './Text.js'
import MarkdownText from "./MarkdownText.js";
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Icon from 'react-native-vector-icons/Ionicons';
import modalStore from '../../stores/ModalStore.js'
import MessageInterface from "../../schema/Message/MessageInterface.js";
import chatStore from "../../stores/ChatStore.js";

const ChatMessage = ({
  message,
  showOptions,
  onOpenOptions,
  onPressIn,
  showDeleteOption
}: {
  message: MessageSQL,
  showOptions: boolean,
  onOpenOptions: () => void,
  onPressIn: () => void,
  showDeleteOption: boolean,
}): any => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [isSingleLine, setIsSingleLine] = useState(true)

  async function handleDeleteMessage() {
    const confirmed = await modalStore.confirm('Are you sure?', null)
    if (confirmed) {
      await MessageInterface.softDelete(message.messageId)
      await chatStore.load()
    }
  }

  function openOptions() {
    onOpenOptions()
    ReactNativeHapticFeedback.trigger("soft", {
      enableVibrateFallback: false,
    });
  }

  const onLongPressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 1.034, // Scale up to 110%
      duration: 700,
      easing: Easing.out(Easing.poly(2)),
      useNativeDriver: true, // Use native driver for better performance
    }).start();
    onPressIn()
  };

  const onLongPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1, // Scale back to original size
      tension: 1800,
      friction: 17,
      // duration: 80,
      // easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handleLayout = (event: any) => {
    const {height} = event.nativeEvent.layout
    const singleLineHeight = 25 // Adjust based on your font size and line height
    setIsSingleLine(height <= singleLineHeight)
  }

  const messageStyle = isSingleLine
    ? styles.singleLineMessage
    : styles.multiLineMessage

  const screenWidth = Dimensions.get('window').width;

  const options = (
    <View
      style={[
        {alignSelf: 'stretch', justifyContent: 'flex-end', width: 36},
        messageStyle,
      ]}>
      {showDeleteOption ? (
        <TouchableOpacity style={{padding: 10}} onPress={handleDeleteMessage}>
          <Icon name="trash-outline" size={16} color="rgba(0, 0, 0, 0.5)" />
        </TouchableOpacity>
      ) : null}
    </View>
  )

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: message.role === MessageRole.USER ? 'flex-end' : 'flex-start',
    }}>
      {message.role === MessageRole.USER ? options : null}

      <View
        style={[
          message.role === MessageRole.USER
            ? styles.userMessage
            : styles.aiMessage,
          messageStyle,
          {maxWidth: screenWidth - 36 - 20 - 10}
        ]}
      >
        {!!message.text ? (
          <MarkdownText
            textStyle={
              message.role === MessageRole.USER
                ? styles.userMessageText
                : styles.aiMessageText
            }
            onLayout={handleLayout}
          >
            {message.text.trim()}
            {/*{'this is a p\n\n# header\n\n## Welcome to Cobalt\n\n### h3\n\n* line 1\n* line2\n\nline 3'}*/}
          </MarkdownText>
        ) : (
          <Spinner />
        )}
      </View>

      {message.role === MessageRole.USER ? null : options}
    </View>
  )
}

const styles = StyleSheet.create({
  optionsRow: {
    flexDirection: 'row',
  },
  optionsBox: {
    position: "absolute",
    top: 0,
    backgroundColor: 'white',
  },
  userMessage: {
    alignSelf: 'flex-end',
    // backgroundColor: 'rgba(255, 255, 255, 1)',
    backgroundColor: Colors.userBubbleBg,
    borderRadius: 24,
    minWidth: 40,
    marginTop: 12,
    marginBottom: 12,
    paddingLeft: 25,
    paddingRight: 25,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: Colors.aiBubbleBg,
    borderRadius: 24,
    minWidth: 40,
    marginTop: 12,
    marginBottom: 12,
    paddingLeft: 25,
    paddingRight: 25,
  },
  singleLineMessage: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  multiLineMessage: {
    paddingTop: 18,
    paddingBottom: 18,
  },
  userMessageText: {
    color: Colors.userBubbleText,
    // color: 'rgba(255, 255, 255, 0.97)',
    fontSize: Colors.fontSize,
    lineHeight: Colors.fontSize * 1.5,
  },
  aiMessageText: {
    // color: 'rgba(255, 255, 255, 0.97)',
    color: Colors.aiBubbleText,
    fontSize: Colors.fontSize,
    lineHeight: Colors.fontSize * 1.5,
  },
})

export default ChatMessage
