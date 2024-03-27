// @flow

import React from 'react';
import { Image, StyleSheet, Text } from "react-native";

const Logo = (props) => {
  const {
    style,
    children,
    ...rest
  } = props;

  return (
    <Image
      source={{uri: 'Title'}}
      style={{
        width: 120,
        height: (92 * 120) / 600,
        top: 0,
    }}
      resizeMode="contain"
    />
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Nunito',
    fontWeight: 'bold',
    letterSpacing: 3
  }
})

export default Logo
