// @flow

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';


const Spinner = ({style}: any): any => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 2000,
          easing: t => {
            return Math.sin(t * Math.PI * 2)
          },
          useNativeDriver: false,
        })
      ])
    ).start();
  }, [animation]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.circle,
          {
            opacity: animation.interpolate({
              // inputRange: [0, 0.5, 1],
              // outputRange: [1, 0.3, 1], // Change the opacity in a sinusoidal pattern
              inputRange: [0, 1],
              outputRange: [0.3, 1], // Change the opacity in a sinusoidal pattern
            }),
            transform: [{scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1.2, 1.4], // Reverse the radius pattern for the second circle
              })}],
            backgroundColor: 'rgba(200, 200, 255, 0.8)'
            // backgroundColor: 'red'
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          {
            opacity: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0], // Reverse the opacity pattern for the second circle
            }),
            transform: [{scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.4], // Reverse the radius pattern for the second circle
              })}],
            backgroundColor: 'rgba(190, 190, 255, 0.75)'
            // backgroundColor: 'red'
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: 20,
    // backgroundColor: '#FFF',
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    opacity: 0.5,
    height: 10,
    width: 10,
    borderRadius: 5,
  },
});


export default Spinner
