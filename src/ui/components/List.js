// @flow

import React from 'react';
import {StyleSheet, View} from "react-native";
import Text from './Text.js'

const List = (props: any): any => {
  const {
    style,
    itemStyle,
    items,
    ...rest
  } = props;

  return (
    <View style={[styles.text, style]} {...rest}>
      {items.map((item, index) => (
        <View key={index} style={{flexDirection: 'row', alignItems: 'center', marginLeft: 2}}>
          <View style={{width: 22}}>
            <Text style={styles.bullet}>{'•'}</Text>
          </View>
          <Text style={itemStyle}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  bullet: {
    position: 'absolute',
    fontSize: 48,
    color: 'white',
    lineHeight: 48,
    top: -22,
  }
})

export default List
