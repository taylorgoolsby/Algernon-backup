// @flow

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from "react-native";
import Colors from "../../Colors.js";

const LENGTH = 6
const OFFSET = 2

const SpokeSpinner = () => {
  // This is an eight spoke spinner.
  // The opacity of the eight spokes is animated to give the effect that something is spinning.

  const animation1 = useRef(new Animated.Value(1)).current;
  const animation2 = useRef(new Animated.Value(1)).current;
  const animation3 = useRef(new Animated.Value(1)).current;
  const animation4 = useRef(new Animated.Value(1)).current;
  const animation5 = useRef(new Animated.Value(1)).current;
  const animation6 = useRef(new Animated.Value(1)).current;
  const animation7 = useRef(new Animated.Value(1)).current;
  const animation8 = useRef(new Animated.Value(1)).current;

  // gate is used to initially start the opacity at a low value, which is the ending value of the animation, 1.
  // The gate goes to 0 when the spoke first starts animating.
  const gate1 = useRef(new Animated.Value(0)).current;
  const gate2 = useRef(new Animated.Value(0)).current;
  const gate3 = useRef(new Animated.Value(0)).current;
  const gate4 = useRef(new Animated.Value(0)).current;
  const gate5 = useRef(new Animated.Value(0)).current;
  const gate6 = useRef(new Animated.Value(0)).current;
  const gate7 = useRef(new Animated.Value(0)).current;
  const gate8 = useRef(new Animated.Value(0)).current;

  const opacity1 = Animated.multiply(animation1, gate1)
  const opacity2 = Animated.multiply(animation2, gate2)
  const opacity3 = Animated.multiply(animation3, gate3)
  const opacity4 = Animated.multiply(animation4, gate4)
  const opacity5 = Animated.multiply(animation5, gate5)
  const opacity6 = Animated.multiply(animation6, gate6)
  const opacity7 = Animated.multiply(animation7, gate7)
  const opacity8 = Animated.multiply(animation8, gate8)

  const animationsStarted = useRef(false)
  useEffect(() => {
    if (!animationsStarted.current) {
      animationsStarted.current = true
      setTimeout(() => {
        Animated.stagger(1000/8,[
          Animated.sequence([
            Animated.timing(gate1, {
              toValue: 1,
              duration: 0,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.loop(Animated.timing(animation1, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }))
          ]),
          Animated.sequence([
            Animated.timing(gate2, {
              toValue: 1,
              duration: 0,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.loop(Animated.timing(animation2, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            })),
          ]),
          Animated.sequence([
            Animated.timing(gate3, {
              toValue: 1,
              duration: 0,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.loop(Animated.timing(animation3, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            })),
          ]),
          Animated.sequence([
            Animated.timing(gate4, {
              toValue: 1,
              duration: 0,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.loop(Animated.timing(animation4, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            })),
          ]),
          Animated.sequence([
            Animated.timing(gate5, {
              toValue: 1,
              duration: 0,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.loop(Animated.timing(animation5, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            })),
          ]),
          Animated.sequence([
            Animated.timing(gate6, {
              toValue: 1,
              duration: 0,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.loop(Animated.timing(animation6, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            })),
          ]),
          Animated.sequence([
            Animated.timing(gate7, {
              toValue: 1,
              duration: 0,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.loop(Animated.timing(animation7, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            })),
          ]),
          Animated.sequence([
            Animated.timing(gate8, {
              toValue: 1,
              duration: 0,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.loop(Animated.timing(animation8, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }))
          ]),
        ]).start()
      }, 1000/8)
    }
  }, []);

  // Each spoke is a rectangle with rounded ends.
  // Each spoke's transform should be centered at its center -50%, -50%.
  // Each spoke should be offset from the center of the entire spinner in the direction given by its rotation.
  // Each spoke's opacity is animated, and they are staggered in their animation.
  // Each spoke's opacity takes loops over 1 second.

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spoke,
          {
            transform: [{rotate: '0deg'}, {translateY: -(LENGTH + OFFSET)}],
            opacity: opacity1.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }
        ]}
      />
      <Animated.View
        style={[
          styles.spoke,
          {
            transform: [{rotate: '45deg'}, {translateY: -(LENGTH + OFFSET)}],
            opacity: opacity2.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }
        ]}
      />
      <Animated.View
        style={[
          styles.spoke,
          {
            transform: [{rotate: '90deg'}, {translateY: -(LENGTH + OFFSET)}],
            opacity: opacity3.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }
        ]}
      />
      <Animated.View
        style={[
          styles.spoke,
          {
            transform: [{rotate: '135deg'}, {translateY: -(LENGTH + OFFSET)}],
            opacity: opacity4.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }
        ]}
      />
      <Animated.View
        style={[
          styles.spoke,
          {
            transform: [{rotate: '180deg'}, {translateY: -(LENGTH + OFFSET)}],
            opacity: opacity5.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }
        ]}
      />
      <Animated.View
        style={[
          styles.spoke,
          {
            transform: [{rotate: '225deg'}, {translateY: -(LENGTH + OFFSET)}],
            opacity: opacity6.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }
        ]}
      />
      <Animated.View
        style={[
          styles.spoke,
          {
            transform: [{rotate: '270deg'}, {translateY: -(LENGTH + OFFSET)}],
            opacity: opacity7.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }
        ]}
      />
      <Animated.View
        style={[
          styles.spoke,
          {
            transform: [{rotate: '315deg'}, {translateY: -(LENGTH + OFFSET)}],
            opacity: opacity8.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spoke: {
    position: 'absolute',
    width: 2,
    height: LENGTH,
    backgroundColor: 'white',
    borderRadius: 1,
  },
});

export default SpokeSpinner
