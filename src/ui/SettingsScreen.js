// @flow

import React from 'react'
import {View, StyleSheet, NativeModules, TouchableOpacity} from 'react-native'
import Colors from '../Colors.js'
import Text from './components/Text.js'
import preferencesStore from '../stores/PreferencesStore.js'
import {observer} from 'mobx-react'
import {truncateDatabase} from '../schema/initializeDatabase.js'
import chatStore from '../stores/ChatStore.js'
import modalStore from '../stores/ModalStore.js'
import Picker from './components/Picker.js'
import paymentStore from '../stores/PaymentStore.js'
import {deepLinkToSubscriptions} from 'react-native-iap'
import Icon from 'react-native-vector-icons/Ionicons'

const {FaissBridge} = NativeModules

const SettingsScreen: any = observer(() => {
  async function deleteData() {
    try {
      preferencesStore.reset()
      await preferencesStore.save()

      await paymentStore.reset()
      await paymentStore.restorePurchases(true)

      await truncateDatabase()

      await FaissBridge.deleteEntireIndex()
      await FaissBridge.init(384)

      await chatStore.load()
    } catch (err) {
      console.error(err)
    }
  }

  async function showDeleteConfirmation() {
    const confirmation = await modalStore.confirm(
      null,
      'All data will be deleted.',
      'OK',
    )
    if (confirmation) {
      await deleteData()
    }
  }

  return (
    <View style={styles.container}>
      {paymentStore.isSubscribed ? null : (
        <View style={styles.row}>
          <Text style={{flex: 1, color: Colors.settingsText}}>Subscribe</Text>
          <TouchableOpacity
            style={{padding: 10}}
            onPress={() => {
              preferencesStore.showIntro()
            }}>
            <Icon
              name={'add-circle-outline'}
              size={24}
              color={Colors.settingsText}
            />
          </TouchableOpacity>
        </View>
      )}

      {paymentStore.isSubscribed ? null : (
        <View style={styles.row}>
          <Text style={{flex: 1, color: Colors.settingsText}}>Already Subscribed?</Text>
          <TouchableOpacity
            style={{flexDirection: 'row', padding: 10, marginRight: 1}}
            onPress={() => paymentStore.restorePurchases()}>
            <Text style={{marginRight: 10, color: Colors.settingsText}}>Restore</Text>
            <Icon name={'refresh-outline'} size={24} color={Colors.settingsText} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.row}>
        <Text style={{flex: 1, color: Colors.settingsText}}>Inference Model</Text>
        <Picker
          style={{marginRight: 3}}
          selectedItem={
            preferencesStore.selectedModel
              ? {
                  label: preferencesStore.selectedModel.title,
                  value: preferencesStore.selectedModel.title,
                }
              : null
          }
          onValueChange={(itemValue, itemIndex) => {
            preferencesStore.selectModel(itemIndex)
          }}
          items={preferencesStore.models.map(model => ({
            label: model.title,
            value: model.title,
          }))}
        />
      </View>

      <View style={styles.row}>
        <Text style={{flex: 1, color: Colors.settingsText}}>Complete Reset</Text>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={showDeleteConfirmation}>
          <Icon name={'trash-outline'} size={24} color={Colors.settingsText} />
        </TouchableOpacity>
      </View>

      {paymentStore.isSubscribed ? (
        <View style={styles.row}>
          <Text style={{flex: 1, color: Colors.settingsText}}>Cancel Subscription</Text>
          <TouchableOpacity
            style={{padding: 10}}
            onPress={deepLinkToSubscriptions}>
            <Icon name={'open-outline'} size={24} color={Colors.settingsText} />
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
    alignItems: 'stretch',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
})

export default SettingsScreen
