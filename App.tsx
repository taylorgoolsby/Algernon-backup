import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { NativeModules } from 'react-native';

const { FaissBridge } = NativeModules;

const App = () => {
  const [vector, setVector] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleAddVector = () => {
    const vectorArray = vector.split(',').map(Number);
    FaissBridge.addVectors([vectorArray])
      .then(() => {
        alert('Vector added successfully!');
      })
      .catch((error) => {
        console.error('Error adding vector:', error);
        alert('Failed to add vector.');
      });
  };

  const handleSearchVector = () => {
    const queryVector = vector.split(',').map(Number);
    FaissBridge.searchVectors(queryVector, 5) // Let's say we want the top 5 results
      .then((results) => {
        setSearchResults(results);
        console.log('Search results:', results);
      })
      .catch((error) => {
        console.error('Error searching for vector:', error);
        alert('Failed to search for vector.');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setVector}
          value={vector}
          placeholder="Enter a vector (e.g., 1.0,2.0,3.0)"
          keyboardType="default"
        />
        <Button title="Add Vector" onPress={handleAddVector} />
        <Button title="Search" onPress={handleSearchVector} />
      </View>
      <View style={styles.resultsContainer}>
        <Text>Search Results:</Text>
        {searchResults.map((result, index) => (
          <Text key={index}>{JSON.stringify(result)}</Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    margin: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  resultsContainer: {
    marginTop: 20,
  },
});

export default App;
