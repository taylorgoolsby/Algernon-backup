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
import { observer } from 'mobx-react';
                                                           
import modelStore from "../ModelStore.js";

const ChatScreen      = observer(({navigation}) => {
  const [messages, setMessages] = useState     ([])
  const [input, setInput] = useState('')

  const [isExpanded, setIsExpanded] = useState(false);

  const handleModelSelect = (model             ) => {
    modelStore.selectModel(model);
    setIsExpanded(false); // Collapse the list after selection
  };

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

  console.log("modelStore.selectedModel", modelStore.selectedModel);

  return (
    <View style={styles.container}>
      {!!modelStore.selectedModel?.title ? (
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>{modelStore.selectedModel.title}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
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

      {isExpanded && (
        <View style={styles.listContainer}>
          <ScrollView>
            {modelStore.models.map((model, index) => (
              <Button
                key={index}
                title={model.title}
                onPress={() => handleModelSelect(model)}
                color="#FFFFFF"
              />
            ))}
            <Button
              title="Configure Models"
              onPress={() => navigation.navigate('Settings')}
              color="#FFFFFF"
            />
          </ScrollView>
        </View>
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
  listContainer: {
    position: 'absolute',
    top: 50, // Adjust based on your layout
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white for the frosted glass effect
    borderRadius: 10,
    padding: 10,
    maxHeight: 300, // Set a max-height for scrollability
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

export default ChatScreen
