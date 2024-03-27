// @flow

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../Colors.js";
import Text from './components/Text.js'
import preferencesStore from "../stores/PreferencesStore.js";

const SettingsScreen = () => {
  async function deleteData() {
    try {
      preferencesStore.reset()
      await preferencesStore.save()
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>
          Delete All Data
        </Text>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={deleteData}
        >
          <Icon
            name={'trash-outline'}
            size={24}
            color={Colors.trashIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default SettingsScreen;
