import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, StyleSheet, TextInput, Button, Text, View} from 'react-native';
import {NativeModules} from 'react-native';
import {initializeDatabase} from "./src/schema/database";

const {TextFeatureExtractor} = NativeModules;

const App = () => {
  const [text, setText] = useState('');
  const [feature, setFeature] = useState<number | null>(null);

  const isInit = useRef(false);
  useEffect(() => {
    try {
      if (!isInit.current) {
        isInit.current = true;
        initializeDatabase()
      }
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  }, []);

  const handleExtractFeatures = async () => {
    try {
      const result = await TextFeatureExtractor.extractFeatures(text);
      console.log("typeof result", typeof result);
      console.log("result.length", result.length);
      for (const i of result) {
        console.log(i);
      }
      // console.log('Feature extracted:', result);
      setFeature(result[0]); // Assuming result is an array of numbers
    } catch (error) {
      console.error('Failed to extract features:', error);
      setFeature(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Enter some text"
      />
      <Button title="Extract Features" onPress={handleExtractFeatures} />
      <View style={styles.resultContainer}>
        {feature !== null && (
          <Text style={styles.resultText}>First Embedding: {feature}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  resultContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
  },
});

export default App;
