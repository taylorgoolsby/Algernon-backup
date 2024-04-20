// @flow

import React, { useEffect, useRef, useState } from "react";
import MessageList from "./MessageList.js";
import SearchList from "./SearchList.js";
import { Animated, Dimensions, Keyboard, Platform, TouchableWithoutFeedback, View } from "react-native";

const screenWidth = Dimensions.get('window').width

const ListSlider = (props: any): any => {
  const {
    searchMode,
    messageIds,
    searchResults,
    headerHeight,
    footerHeight,
    safeAreaFooterHeight,
    onEmptyAreaPress,
    inputRef
  } = props;

  const [visibleHeight, setVisibleHeight] = useState(0)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const initialized = useRef(false)
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const keyboardDidShowListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        e => {
          adjustForKeyboard(e.endCoordinates.height)
        },
      )

      const keyboardDidHideListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        () => adjustForKeyboard(0),
      )

      return () => {
        keyboardDidShowListener.remove()
        keyboardDidHideListener.remove()
      }
    }
  }, [])
  const adjustForKeyboard = (keyboardHeight: number) => {
    setKeyboardHeight(keyboardHeight)
  }

  const slideAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (searchMode) {
      Animated.spring(slideAnim, {
        toValue: 1,
        // duration: 350,
        // easing: Easing.out(Easing.poly(5)),
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        // restDisplacementThreshold: 10,
        // restSpeedThreshold: 10,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        // duration: 350,
        // easing: Easing.out(Easing.poly(5)),
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        // restDisplacementThreshold: 10,
        // restSpeedThreshold: 10,
        useNativeDriver: true,
      }).start()
    }
  }, [searchMode])

  const onLayout = (event: any) => {
    const {height} = event.nativeEvent.layout
    setVisibleHeight(height)
  }

  const initialSafeAreaFooterHeight = useRef(safeAreaFooterHeight)
  useEffect(() => {
    if (footerHeight === 50 && keyboardHeight === 0) {
      if (safeAreaFooterHeight > initialSafeAreaFooterHeight.current) {
        initialSafeAreaFooterHeight.current = safeAreaFooterHeight
      }
    }
  }, [footerHeight, safeAreaFooterHeight, keyboardHeight])

  return (
    <Animated.View
      style={{
        flex: 1,
        flexDirection: 'row',
        width: screenWidth * 2,
        alignItems: 'stretch',
        transform: [
          {
            translateX: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-screenWidth, 0],
            }),
          },
        ],
      }}
      onLayout={onLayout}
    >
      <View style={{width: screenWidth}}>
        <SearchList
          messageIds={searchResults}
          visibleHeight={visibleHeight}
          keyboardHeight={keyboardHeight}
          headerHeight={headerHeight}
          footerHeight={footerHeight}
          initialSafeAreaFooterHeight={initialSafeAreaFooterHeight.current}
        />
      </View>

      <View style={{width: screenWidth}}>
        <MessageList
          messageIds={messageIds}
          visibleHeight={visibleHeight}
          keyboardHeight={keyboardHeight}
          headerHeight={headerHeight}
          footerHeight={footerHeight}
          initialSafeAreaFooterHeight={initialSafeAreaFooterHeight.current}
        />
      </View>
    </Animated.View>
  )
}

export default ListSlider;
