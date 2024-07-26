// @flow

import React, { useState } from "react";
import {TouchableOpacity, StyleSheet, SafeAreaView, View} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors, { headerLeft, headerRight } from "../../Colors.js"; // Assuming you're using Ionicons
import Text from './Text.js'
import {BlurView} from '@react-native-community/blur'
import HeaderBackButton from './HeaderBackButton'
import { leftMargin, rightMargin } from "./ChatMessage";

type CustomHeaderProps = {
  title: string,
  makeSpace?: boolean, // The header is absolute positioned, so if true, it will make space for the header
  onOuterLayout?: ?(any) => void,
  onInnerLayout?: ?(any) => void,
  onLeftPress: () => void,
  onRightPress?: ?() => void,
  leftIcon?: 'monolith' | 'back',
  rightIcon?: 'sparkles'
}

const CustomHeader = (props: CustomHeaderProps): any => {
  const {
    title,
    makeSpace,
    onOuterLayout,
    onInnerLayout,
    onLeftPress,
    onRightPress,
    leftIcon,
    rightIcon
  } = props

  const [outerHeight, setOuterHeight] = useState(0);

  function handleOuterLayout(event: any) {
    if (onOuterLayout) onOuterLayout(event)
    setOuterHeight(event.nativeEvent.layout.height)
  }

  let leftIconComponent = null
  if (leftIcon === 'monolith') {
    leftIconComponent = (
      <View
        style={{
          backgroundColor: headerLeft,
          height: 19,
          width: 7,
        }}
      />
    )
  } else if (leftIcon === 'back') {
    leftIconComponent = (
      <Icon
        style={{
          transform: [{translateY: 0}, {translateX: 1}, {scaleY: 1.15}],
          marginLeft: -11,
          marginRight: -11,
        }}
        name={'chevron-back-outline'}
        size={22}
        color={headerLeft}
        opacity={1}
      />
    )
  }

  let rightIconComponent = null
  if (rightIcon === 'sparkles') {
    {/*            // name={'analytics-outline'}*/}
    {/*            // name={'layers-outline'}*/}
    {/*            // name={'analytics'}*/}
    rightIconComponent = (
      <Icon
        style={{
          transform: [{translateY: -3}],
        }}
        name={'sparkles'}
        size={18}
        color={headerRight}
        opacity={1}
      />
    )
  }

  return (
    <>
      <View style={styles.header}>
        <BlurView
          style={{flex: 1, opacity: 1}}
          blurType={Colors.chatHeaderBlurType}
          blurAmount={70}
          onLayout={handleOuterLayout}
        >
          <SafeAreaView style={styles.safeArea}>
            <View
              style={{
                height: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}
              onLayout={onInnerLayout}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{
                    // paddingLeft: 22,
                    paddingLeft: leftMargin + 17,
                    paddingBottom: 12,
                    paddingRight: 30,
                  }}
                  onPress={onLeftPress}
                >
                  {leftIconComponent}
                </TouchableOpacity>
              </View>

              <Text style={styles.title}>{title}</Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    {
                      paddingLeft: 30,
                      paddingRight: rightMargin + 7,
                      opacity: 1,
                    },
                  ]}
                  onPress={onRightPress}>
                  {rightIconComponent}
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </BlurView>
      </View>
      {!!makeSpace ? <View style={{height: outerHeight}} /> : null}
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 500,
  },
  safeArea: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sendButton: {
    padding: 0,
    paddingRight: rightMargin + 5,
    minWidth: 28,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: Colors.fontFamily,
    fontSize: Colors.fontSize,
    fontWeight: '700',
    transform: [{translateY: -1}]
  },
})

export default CustomHeader
