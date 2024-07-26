// @flow

import React from 'react'
import { View, StyleSheet, NativeModules, TouchableOpacity, SafeAreaView } from "react-native";
import { observer } from "mobx-react";
import Colors, { headerRight } from "../Colors";
import { BlurView } from "@react-native-community/blur";
import { rightMargin } from "./components/ChatMessage";
import Icon from "react-native-vector-icons/Ionicons";
import HeaderBackButton from "./components/HeaderBackButton";
import CustomHeader from "./components/CustomHeader";
import { useNavigation } from "@react-navigation/native";
import PlotView from "./components/PlotView";

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
      <PlotView/>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryBg,
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
