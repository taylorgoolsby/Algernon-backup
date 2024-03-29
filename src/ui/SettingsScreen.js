// @flow

import React from 'react';
import { TouchableOpacity, View, StyleSheet, NativeModules } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../Colors.js";
import Text from './components/Text.js'
import preferencesStore from "../stores/PreferencesStore.js";
import {deepLinkToSubscriptions} from "react-native-iap";
import { observer } from "mobx-react";
import paymentStore from "../stores/PaymentStore.js";
import { truncateDatabase } from "../schema/initializeDatabase.js";
import chatStore from "../stores/ChatStore.js";
import modalStore from "../stores/ModalStore.js";

const {
  FaissBridge
} = NativeModules;

const SettingsScreen: any = observer(() => {
  async function deleteData() {
    try {
      preferencesStore.reset()
      await preferencesStore.save()

      await truncateDatabase()

      await FaissBridge.deleteEntireIndex()
      await FaissBridge.init(384)

      await chatStore.load()
    } catch (err) {
      console.error(err);
    }
  }

  async function showDeleteConfirmation() {
    const confirmation = await modalStore.confirm('Are you sure?', 'All data will be deleted.')
    if (confirmation) {
      await deleteData()
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>
          Complete Reset
        </Text>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={showDeleteConfirmation}
        >
          <Icon
            name={'trash-outline'}
            size={24}
            color={Colors.trashIcon}
          />
        </TouchableOpacity>
      </View>

      {paymentStore.isSubscribed ? (
        <View style={styles.row}>
          <Text>
            Cancel Subscription
          </Text>
          <TouchableOpacity
            style={{padding: 10}}
            onPress={deepLinkToSubscriptions}
          >
            <Icon
              name={'open-outline'}
              size={24}
              color={Colors.trashIcon}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.row}>
          <Text>
            Subscribe
          </Text>
          <TouchableOpacity
            style={{padding: 10}}
            onPress={() => {
              preferencesStore.showIntro()
            }}
          >
            <Icon
              name={'add-circle-outline'}
              size={24}
              color={Colors.trashIcon}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    padding: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default SettingsScreen;
