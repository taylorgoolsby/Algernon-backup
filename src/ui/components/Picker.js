// @flow

import { Picker as RNPicker } from '@react-native-picker/picker'
import React, { useState } from "react";
import { BlurView } from "@react-native-community/blur";
import { StyleSheet, Modal, View, TouchableOpacity, Button } from "react-native";
import Text from './Text.js'
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../../Colors.js";

const Picker: any = (props) => {
  const {
    style,
    selectedItem,
    onValueChange,
    items
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={style}>
      <TouchableOpacity style={styles.inline} onPress={() => {
        setIsExpanded(true)
      }}>
        <Text style={{marginRight: 10, color: Colors.settingsText}}>
          {selectedItem?.label ?? 'Placeholder'}
        </Text>
        <Icon
          name="chevron-down-outline"
          size={18}
          color="rgba(0, 0, 0, 0.78)"
        />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isExpanded}
        onRequestClose={() => {
          setIsExpanded(false)
        }}>
        <BlurView
          blurType="light"
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <RNPicker
            itemStyle={{
              fontFamily: 'Montserrat',
            }}
            // style={{ height: 50, width: 150 }}
            selectedValue={selectedItem?.value}
            onValueChange={onValueChange}
          >
            {items.map((item) => (
              <RNPicker.Item key={item.value} label={item.label} value={item.value} />
            ))}
          </RNPicker>
          <TouchableOpacity
            style={{marginTop: 24, alignItems: 'center'}}
            onPress={() => {
              setIsExpanded(false)
            }}
          >
            <Text style={{color: 'black', fontSize: 18, color: Colors.settingsText}}>Close</Text>
          </TouchableOpacity>
        </BlurView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  inline: {
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default Picker
