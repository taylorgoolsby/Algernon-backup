// @flow

import React, {useState} from 'react'
import {View, StyleSheet} from 'react-native'
import type {MessageSQL} from '../../schema/Message/MessageSchema.mjs'
import {MessageRole} from '../../schema/Message/MessageSchema.mjs'
import Spinner from './Spinner.js'
import Colors from "../../Colors.js";
import Text from './Text.js'

const ChatMessage = ({
  message,
}: {
  message: MessageSQL,
}): any => {
  const [isSingleLine, setIsSingleLine] = useState(true)

  const handleLayout = (event: any) => {
    const {height} = event.nativeEvent.layout
    const singleLineHeight = 25 // Adjust based on your font size and line height
    setIsSingleLine(height <= singleLineHeight)
  }

  const messageStyle = isSingleLine
    ? styles.singleLineMessage
    : styles.multiLineMessage

  return (
    <View
      style={[
        message.role === MessageRole.USER
          ? styles.userMessage
          : styles.aiMessage,
        messageStyle,
      ]}>
      {!!message.text ? (
        <Text
          style={
            message.role === MessageRole.USER
              ? styles.userMessageText
              : styles.aiMessageText
          }
          onLayout={handleLayout}>
          {message.text.trim()}
        </Text>
      ) : (
        <Spinner />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
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
    lineHeight: 21,
  },
  aiMessageText: {
    // color: 'rgba(255, 255, 255, 0.97)',
    color: Colors.aiBubbleText,
    fontSize: Colors.fontSize,
    lineHeight: 21,
  },
})

export default ChatMessage
