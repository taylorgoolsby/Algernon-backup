// @flow

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../Colors.js";
import Text from './components/Text.js'
import preferencesStore from "../stores/PreferencesStore.js";
import {deepLinkToSubscriptions} from "react-native-iap";
import { observer } from "mobx-react";
import paymentStore from "../stores/PaymentStore.js";

const SettingsScreen: any = observer(() => {
  async function deleteData() {
    try {
      preferencesStore.reset()
      await preferencesStore.save()
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={styles.container}>
      {/*<View style={styles.row}>*/}
      {/*  <Text>*/}
      {/*    Delete All Data*/}
      {/*  </Text>*/}
      {/*  <TouchableOpacity*/}
      {/*    style={{padding: 10}}*/}
      {/*    onPress={deleteData}*/}
      {/*  >*/}
      {/*    <Icon*/}
      {/*      name={'trash-outline'}*/}
      {/*      size={24}*/}
      {/*      color={Colors.trashIcon}*/}
      {/*    />*/}
      {/*  </TouchableOpacity>*/}
      {/*</View>*/}

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
      ) : null}
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
