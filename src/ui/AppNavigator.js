// @flow

import React, {useState, useEffect, useRef} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import {Image, View} from 'react-native'
import ChatScreen from './ChatScreen.js' // Adjust the path as necessary
import ModelsScreen from './ModelsScreen.js' // Adjust the path as necessary
import IntroScreen from './IntroScreen.js'
import SettingsScreen from './SettingsScreen.js'
import {initializeDatabase} from '../schema/initializeDatabase'
import preferencesStore from '../stores/PreferencesStore.js'
import paymentStore, {oneWeek} from '../stores/PaymentStore.js'
import {configure} from 'mobx'
import redact from '../utils/redact'
import chatStore from '../stores/ChatStore.js'
import {observer} from 'mobx-react'
import {setup, withIAPContext, useIAP} from 'react-native-iap'
import DeviceInfo from 'react-native-device-info'
import Config from '../Config.js'
import ModalLayer from './ModalLayer.js'

setup({storekitMode: 'STOREKIT2_MODE'})

configure({
  enforceActions: 'never',
})
initializeDatabase()
  .then(async () => {
    await preferencesStore.load()
    await chatStore.load()
  })
  .catch(error => {
    console.error(error)
  })

// Redact:
const oldLog = console.log // eslint-disable-line no-console
function newLog(...args: Array<any>) {
  args = args.map(el => redact(el))
  return oldLog(...args)
}
// $FlowFixMe
console.log = newLog.bind(console) // eslint-disable-line no-console

const Stack = createNativeStackNavigator()

const AppNavigator: any = withIAPContext(
  observer(() => {
    const {
      connected,
      subscriptions,
      getSubscriptions,
      getPurchaseHistory,
    } = useIAP()

    const [iapLoaded, setIapLoaded] = useState(false)

    useEffect(() => {
      if (connected && !iapLoaded) {
        getPurchaseHistory().catch(console.error)
        getSubscriptions({
          skus: [Config.monthlyProductId, Config.annualProductId],
        }).catch(console.error)
      }
    }, [connected])

    useEffect(() => {
      if (connected && subscriptions.length) {
        setIapLoaded(true)
      }
    }, [connected, subscriptions])

    useEffect(() => {
      if (preferencesStore.loaded) {
        if (paymentStore.isSubscribed && !preferencesStore.introCompleted) {
          // If isSubscribed, make sure intro screen does not appear.
          preferencesStore.completeIntro()
          preferencesStore.save().catch(console.error)
        } else if (
          !paymentStore.isSubscribed &&
          !paymentStore.isFreeTrialAvailable
        ) {
          // If not isSubscribed, then user might be on unpaid free-trial.
          // This is what blocks the user out of the app if the free-trial is over.
          preferencesStore.showIntro()
          preferencesStore.save().catch(console.error)
        }
      }
    }, [
      paymentStore.isSubscribed,
      preferencesStore.introCompleted,
      preferencesStore.loaded,
    ])

    // Update preferencesStore.isFreeTrialAvailable
    const intervalSet = useRef(false)
    useEffect(() => {
      if (intervalSet.current) return
      intervalSet.current = true
      setInterval(() => {
        const firstInstallTime = DeviceInfo.getFirstInstallTimeSync()
        const timeElapsed = Date.now() - firstInstallTime
        paymentStore.isFreeTrialAvailable = timeElapsed < oneWeek
      }, 1000 * 10)
    }, [])

    const {loaded, introCompleted} = preferencesStore

    if (!loaded)
      return (
        <View
          style={{
            flex: 1,
          }}>
          {/*<Image*/}
          {/*  style={{*/}
          {/*    flex: 1,*/}
          {/*  }}*/}
          {/*  source={{uri: 'IntroBg'}}*/}
          {/*  resizeMode="cover"*/}
          {/*/>*/}
        </View>
      )

    return (
      <View style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator>
            {introCompleted ? (
              <>
                <Stack.Screen
                  name="Chat"
                  component={ChatScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Models"
                  component={ModelsScreen}
                  options={{
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{
                    headerShown: true,
                  }}
                />
              </>
            ) : (
              <Stack.Screen
                name="Intro"
                component={IntroScreen}
                options={{
                  headerShown: false,
                }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <ModalLayer />
      </View>
    )
  }),
)

export default AppNavigator
