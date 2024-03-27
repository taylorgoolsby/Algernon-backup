// @flow

import React from 'react';
import {StyleSheet, Text} from "react-native";

const MyText = (props) => {
  const {
    style,
    children,
    ...rest
  } = props;

  return (
    <Text style={[styles.text, style]} {...rest}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    lineHeight: 24
  }
})

export default MyText
