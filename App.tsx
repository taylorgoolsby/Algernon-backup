// App.tsx

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  Button,
  View,
  NativeModules
} from 'react-native';

const App = () => {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');

  const generateResponse = async () => {
    try {
      const LLMNativeModule = NativeModules.LLMNativeModule;
      const generatedResponse = await LLMNativeModule.generateResponse(text);
      setResponse(generatedResponse);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Type here..."
      />
      <Button title="Generate" onPress={generateResponse} />
      <View style={styles.responseContainer}>
        <Text style={styles.responseText}>{response}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  responseContainer: {
    marginTop: 20,
    backgroundColor: 'aliceblue',
    padding: 10,
  },
  responseText: {
    fontSize: 16,
  },
});

export default App;
