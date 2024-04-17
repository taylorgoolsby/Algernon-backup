// @flow

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../../Colors.js"; // Assuming you're using Ionicons
import Text from './Text.js'

const HeaderBackButton = (): any => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.goBack()}
    >
      <Icon style={styles.icon} name="chevron-back-outline" size={22} color={Colors.settingsText} />
      <Text style={styles.text}>Back</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: 10,
    transform: [{translateY: 1.5}],
  },
  text: {
    marginLeft: 5,
    color: Colors.settingsText,
    fontSize: Colors.fontSize
  },
});

export default HeaderBackButton
