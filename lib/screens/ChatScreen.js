//      

import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import ChatIteration from '../agent/ChatIteration.js'
import {observer} from 'mobx-react'
                                                        
import preferencesStore from '../PreferencesStore.js'
import {BlurView} from '@react-native-community/blur'

const ChatScreen      = observer(({navigation}) => {
  const [messages, setMessages] = useState     ([])
  const [input, setInput] = useState('')

  const [isExpanded, setIsExpanded] = useState(false)

  const handleModelSelect = (model             ) => {
    preferencesStore.selectModel(model)
    setIsExpanded(false) // Collapse the list after selection
  }

  const sendMessage = async () => {
    if (!preferencesStore.selectedModel) {
      console.error('No model selected')
      return
    }

    const response = ''
    ChatIteration.iterate(
      0,
      preferencesStore.selectedModel,
      input,
      output => {
        // console.log('output', output)
      },
      output => {
        // console.log('output', output)
      },
      error => {
        console.error(error)
      },
    )

    // Store the response in the Message table
    // ...

    // Update the local state
    setMessages([
      ...messages,
      {text: input, sender: 'user'},
      {text: response, sender: 'ai'},
    ])
    setInput('')
  }

  return (
    <View style={styles.container}>
      {!!preferencesStore.selectedModel?.title ? (
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>
            {preferencesStore.selectedModel.title}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate('Models')}
          style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>Configure Models</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={
              message.sender === 'user' ? styles.userMessage : styles.aiMessage
            }>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <BlurView
        style={styles.inputContainer}
        blurType="regular" // or "dark", "xlight", etc., depending on your design needs
        blurAmount={10} // Adjust the blur amount to get the desired effect
      >
        <TextInput
          style={styles.input}
          multiline
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          placeholderTextColor="#aaa"
        />
        <Button style={styles.sendButton} title="Send" onPress={sendMessage} color={"#fff"} />
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
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#123456',
    padding: 10,
  },
  chatContainer: {
    flex: 1,
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
    zIndex: 1, // Make sure the button is clickable over other elements
  },
  settingsButtonText: {
    fontSize: 16,
  },
  blurContainer: {
    position: 'absolute',
    top: 50, // Adjust based on your layout
    left: 0,
    right: 0,
    borderRadius: 10,
    overflow: 'hidden', // Keep the blur effect within the borders
  },
  listContainer: {
    maxHeight: 300, // Optional: Set a max height for scrollability
    // Add any additional styles for the inner container
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 25,
    height: 50,
    paddingLeft: 18,
    paddingRight: 14,
    marginBottom: 15,
    overflow: 'hidden'
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    margin: 5,
    padding: 10,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    margin: 5,
    padding: 10,
  },
  messageText: {
    color: '#000',
  },
})

export default ChatScreen
