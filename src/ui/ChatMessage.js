// @flow

import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import type {MessageSQL} from '../schema/Message/MessageSchema.mjs'
import {MessageRole} from '../schema/Message/MessageSchema.mjs'
import Spinner from './Spinner.js'

const ChatMessage = ({
  first,
  message,
  footerHeight,
}: {
  first: boolean,
  message: MessageSQL,
  footerHeight: number,
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
        first ? {marginBottom: footerHeight + 12} : {},
      ]}>
      {!!message.text ? (
        <Text
          style={
            message.role === MessageRole.USER
              ? styles.userMessageText
              : styles.aiMessageText
          }
          onLayout={handleLayout}>
          {message.text}
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
    backgroundColor: 'rgba(255, 255, 255, 1)',
    color: '#000',
    borderRadius: 24,
    minWidth: 40,
    marginTop: 12,
    marginBottom: 12,
    paddingLeft: 25,
    paddingRight: 25,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
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
    color: 'rgba(0, 0, 0, 0.80)',
    fontSize: 14,
    lineHeight: 21,
  },
  aiMessageText: {
    color: 'rgba(255, 255, 255, 0.97)',
    fontSize: 14,
    lineHeight: 21,
  },
})

export default ChatMessage
