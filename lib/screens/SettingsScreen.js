//      

import React, { useEffect, useRef, useState } from "react";
import {View, Text, TextInput, Button, ScrollView, StyleSheet} from 'react-native';
import ModelStore from '../ModelStore';
                                                       

const defaultModel                      = {
  title: '',
  apiBase: '',
  apiKey: '',
  completionOptions: [],
};

const SettingsScreen      = () => {
  const [models, setModels] = useState                            ([]);

  const saveModels = () => {
    Promise.resolve().then(async () => {
      try {
        await ModelStore.save(models);
        console.log('Models saved successfully');
      } catch (error) {
        console.error('Failed to save models:', error);
      }
    })
  };

  useEffect(() => {
    saveModels()
  }, [models])

  const addModel = () => {
    setModels([...models, {...defaultModel}]);
  };

  const updateModel = (index        , field        , value        ) => {
    const newModels                             = [...models];
    if (field === 'completionOptions') {
      newModels[index]['completionOptions'] = [...newModels[index][field], {name: '', value: ''}];
    } else {
      // $FlowFixMe
      newModels[index][field] = value;
    }
    setModels(newModels);
  };

  const updateCompletionOption = (modelIndex        , optionIndex        , name        , value        ) => {
    const newModels = [...models];
    newModels[modelIndex].completionOptions[optionIndex] = {name, value};
    setModels(newModels);
  };

  const removeModel = (index        ) => {
    const newModels = models.filter((_, modelIndex) => modelIndex !== index);
    setModels(newModels);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {models.map((model, index) => (
        <View key={index} style={styles.modelSection}>
          {/* Model configuration fields */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
              style={styles.input}
              placeholder="Model Title"
              value={model.title}
              onChangeText={(text) => updateModel(index, 'title', text)}
              autoCapitalize="sentences"
              editable={!model.local} // Disable editing if model.local is true
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>API Base:</Text>
            <TextInput
              style={styles.input}
              placeholder="API Base URL"
              value={model.apiBase}
              onChangeText={(text) => updateModel(index, 'apiBase', text)}
              autoCapitalize="none"
              editable={!model.local} // Disable editing if model.local is true
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>API Key:</Text>
            <TextInput
              style={styles.input}
              placeholder="API Key"
              value={model.apiKey}
              onChangeText={(text) => updateModel(index, 'apiKey', text)}
              autoCapitalize="none"
              secureTextEntry={true}
              editable={!model.local} // Disable editing if model.local is true
            />
          </View>
          {/* Completion Options */}
          <Button
            title="Add Completion Option"
            onPress={() => updateModel(index, 'completionOptions', '')}
          />
          {model.completionOptions.map((option, optionIndex) => (
            <View key={optionIndex} style={styles.completionOption}>
              <TextInput
                style={styles.completionInput}
                placeholder="Option Name"
                value={option.name}
                onChangeText={(text) => updateCompletionOption(index, optionIndex, text, option.value)}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.completionInput}
                placeholder="Option Value"
                value={option.value}
                onChangeText={(text) => updateCompletionOption(index, optionIndex, option.name, text)}
                autoCapitalize="none"
              />
            </View>
          ))}
          {!model.local ? (
            <Button
              title="Remove Model"
              onPress={() => removeModel(index)}
              color="red"
            />
          ) : null}
        </View>
      ))}
      {/* Add Model Button */}
      {/*$FlowFixMe*/}
      <Button title="Add New Model" onPress={addModel} style={styles.addButton} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  modelSection: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
    minWidth: 80,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    padding: 8,
    borderRadius: 5,
  },
  completionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  completionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  addButton: {
    marginTop: 20, // Adjust spacing as needed
  },
});

export default SettingsScreen;
