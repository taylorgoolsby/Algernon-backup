// @flow

import React from 'react'
import { View, StyleSheet, Dimensions } from "react-native";
import { observer } from "mobx-react";
import Colors, { darkMode } from "../Colors";
import { rightMargin } from "./components/ChatMessage";
import CustomHeader from "./components/CustomHeader";
import { useNavigation } from "@react-navigation/native";
import PlotView from "./components/PlotView";

const screenWidth = Dimensions.get('window').width

// This is a page for vieweing the memory of the AI, which is a data visualization of a vector database.
// The viewer is a 2d plot of the vectors, reduced by PCA.

const MemoryViewer: any = observer((props: any) => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Memories'}
        makeSpace
        leftIcon={'back'}
        onLeftPress={() => {
          navigation.goBack()
        }}
      />
      <PlotView style={{
        width: screenWidth,
        height: screenWidth
      }} />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkMode ? 'black' : Colors.chatBg,
    alignItems: 'stretch',
    // padding: 20,
  },
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
  }
})

export default MemoryViewer;
