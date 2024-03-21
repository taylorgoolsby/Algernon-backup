// @flow

import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import ChatIteration from '../agent/ChatIteration.js'
import {observer} from 'mobx-react'
import type {ModelConfig} from '../types/ModelConfig.js'
import preferencesStore from '../stores/PreferencesStore.js'
import {BlurView} from '@react-native-community/blur'
import {MessageRole} from '../schema/Message/MessageSchema.mjs'
import chatStore from '../stores/ChatStore.js'

const ChatScreen: any = observer(({navigation}) => {
  const messages = [...chatStore.messages]
  const [input, setInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  // scrollToBottom when message updates the first time (initial load):
  const initialLoad = React.useRef(true)
  React.useEffect(() => {
    if (chatStore.loaded && initialLoad.current) {
      initialLoad.current = false
      // scrollToBottom()
    }
  }, [chatStore.loaded])

  React.useEffect(() => {
    chatStore.onRenderDone()
  }, [messages])

  const handleModelSelect = (model: ModelConfig) => {
    preferencesStore.selectModel(model)
    setIsExpanded(false) // Collapse the list after selection
  }

  const sendMessage = async () => {
    if (!preferencesStore.selectedModel) {
      console.error('No model selected')
      return
    }
    ChatIteration.iterate(
      chatStore.windowId,
      preferencesStore.selectedModel,
      input,
      output => {
        chatStore.appendMessage(output)
      },
      output => {
        chatStore.updateMessage(output)
      },
      error => {
        console.error(error)
      },
    )
    setInput('')
  }

  // Ref for the TextInput to call focus
  const inputRef = React.useRef(null)
  const focusInput = () => {
    // $FlowFixMe
    inputRef.current.focus()
  }

  const scrollViewRef = React.useRef(null)
  const scrollToBottom = () => {
    {
      /*$FlowFixMe*/
    }
    // setTimeout(() => {
    //   scrollViewRef.current?.scrollToEnd({animated: true})
    // })
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <SafeAreaView style={styles.safeView}>
        <View style={styles.safeView}>
          {!!preferencesStore.selectedModel?.title ? (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setIsExpanded(!isExpanded)}>
              <BlurView
                style={styles.settingsButtonBlurView}
                blurType="regular" // or "dark", "xlight", etc., depending on your design needs
                blurAmount={10} // Adjust the blur amount to get the desired effect
              >
                <Text style={styles.settingsButtonText}>
                  {preferencesStore.selectedModel.title}
                </Text>
              </BlurView>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Models')}>
              <BlurView
                style={styles.settingsButtonBlurView}
                blurType="regular" // or "dark", "xlight", etc., depending on your design needs
                blurAmount={10} // Adjust the blur amount to get the desired effect
              >
                <Text style={styles.settingsButtonText}>Configure Models</Text>
              </BlurView>
            </TouchableOpacity>
          )}

          <FlatList
            style={styles.chatContainer}
            // $FlowFixMe
            ref={scrollViewRef}
            inverted
            data={messages}
            // $FlowFixMe
            keyExtractor={message => message.messageId}
            renderItem={item => {
              const message = item.item
              return (
                <BlurView
                  style={
                    message.role === MessageRole.USER
                      ? styles.userMessage
                      : styles.aiMessage
                  }
                  blurType="regular" // or "dark", "xlight", etc., depending on your design needs
                  blurAmount={10} // Adjust the blur amount to get the desired effect
                >
                  <Text style={styles.messageText}>{message.text}</Text>
                </BlurView>
              )
            }}
          />
          <BlurView
            style={styles.inputContainer}
            blurType="regular" // or "dark", "xlight", etc., depending on your design needs
            blurAmount={10} // Adjust the blur amount to get the desired effect
          >
            <TouchableWithoutFeedback onPress={focusInput}>
              <View style={styles.inputWrapContainer}>
                {/*$FlowFixMe*/}
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  multiline
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type a message"
                  placeholderTextColor="#aaa"
                />
                {/*$FlowFixMe*/}
                <Button
                  style={styles.sendButton}
                  title="Send"
                  onPress={sendMessage}
                  color={'#fff'}
                />
              </View>
            </TouchableWithoutFeedback>
          </BlurView>

          {isExpanded && (
            <BlurView
              style={styles.blurContainer}
              blurType="regular" // or "dark", "xlight", etc., depending on your design needs
              blurAmount={10} // Adjust the blur amount to get the desired effect
            >
              <ScrollView style={styles.listContainer}>
                {preferencesStore.models.map((model, index) => (
                  <Button
                    key={index}
                    title={model.title}
                    onPress={() => handleModelSelect(model)}
                    color="#FFFFFF"
                  />
                ))}
                <Button
                  title="Configure Models"
                  onPress={() => {
                    navigation.navigate('Models')
                    setIsExpanded(false)
                  }}
                  color="#FFFFFF"
                />
              </ScrollView>
            </BlurView>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#123456',
  },
  safeView: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 15,
  },
  settingsButton: {
    // position: 'absolute',
    // top: 15,
    // left: 15,
    marginBottom: 15,
    borderRadius: 10,
    // backgroundColor: 'lightgrey',
    zIndex: 1, // Make sure the button is clickable over other elements
  },
  settingsButtonBlurView: {
    padding: 10,
    borderRadius: 5,
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  blurContainer: {
    position: 'absolute',
    top: 15 + 40, // Adjust based on your layout
    left: 15,
    right: 15,
    borderRadius: 10,
    overflow: 'hidden', // Keep the blur effect within the borders
  },
  listContainer: {
    maxHeight: 300, // Optional: Set a max height for scrollability
    // Add any additional styles for the inner container
  },
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    height: 50,
    marginBottom: 0,
    overflow: 'hidden',
  },
  inputWrapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    flex: 1,
    paddingLeft: 18,
    paddingRight: 14,
  },
  input: {
    flex: 1,
    color: '#fff',
    backgroundColor: 'transparent',
    paddingTop: 0,
  },
  sendButton: {
    height: 50,
    padding: 0,
  },
  userMessage: {
    alignSelf: 'flex-end',
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    minWidth: 40,
    margin: 5,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    minWidth: 40,
    margin: 5,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  messageText: {
    color: '#fff',
  },
})

export default ChatScreen
