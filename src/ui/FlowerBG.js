// @flow

import React from 'react'
import {View, StyleSheet} from 'react-native'
import {observer} from 'mobx-react'
import ProfilePic from "./components/ProfilePic";
import chatStore from "../stores/ChatStore";

const FlowerBG: any = observer((props: any) => {
  const {
  } = props;

  const messageIds = chatStore.displayedMessageIds

  return (
    <View style={[styles.container, {transform: [{scale: 4.2}]}]}>
      <ProfilePic message={{
        ...chatStore.messages[messageIds[0]],
        messageId: 1000,
      }} tenX/>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
})

export default FlowerBG
