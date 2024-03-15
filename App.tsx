import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text, TouchableOpacity, NativeModules} from 'react-native';

const {FaissBridge} = NativeModules;

const App = () => {
  const [searchResults, setSearchResults] = useState([]);

  const addVector = async () => {
    try {
      // Example vector. Replace with your data or user input as necessary.
      const vector = [0.1, 0.2, 0.3, Math.random()];
      const response = await FaissBridge.addVector(vector);
      console.log('Add Vector Response:', response);
      alert('Vector added successfully');
    } catch (error) {
      console.error('Error adding vector:', error);
      alert('Failed to add vector');
    }
  };

  const searchVectors = async () => {
    try {
      // Example query vector. Replace with your data or user input as necessary.
      const queryVector = [0.1, 0.2, 0.3, 0.4];
      // Number of results you want to get back.
      const k = 5;
      const results = await FaissBridge.searchVectors(queryVector, k);
      console.log('Search Results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching vectors:', error);
      alert('Failed to search vectors');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={addVector} style={styles.button}>
          <Text style={styles.buttonText}>Add Vector</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={searchVectors} style={styles.button}>
          <Text style={styles.buttonText}>Search Vectors</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.resultsContainer}>
        {searchResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            Label: {result.label}, Distance: {result.distance}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 16,
  },
});

export default App;
