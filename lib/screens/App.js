//      

import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView, TouchableOpacity
} from "react-native";
import ChatIteration from '../agent/ChatIteration.js'

const App      = ({navigation}) => {
  const [messages, setMessages] = useState     ([])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    // Add the message to the Message table
    // ...

    // // Get a response from the inference server
    // const response = await InferenceRest.relayChatCompletionStream(/* parameters */);
    const response = ''
    ChatIteration.iterate(
      0,
      {
        title: 'GPT-3.5',
        apiBase: 'https://api.openai.com/v1',
        apiKey: '',
        completionOptions: {
          model: 'gpt-3.5-turbo',
        },
      },
      input,
      (output) => {
        console.log("output", output);
      },
      (output) => {
        console.log("output", output);
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
      <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
        <Text style={styles.settingsButtonText}>Settings</Text>
      </TouchableOpacity>
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          placeholderTextColor="#aaa"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  )
}

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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: 'transparent',
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

export default App
