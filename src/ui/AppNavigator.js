// @flow

import React, {useState, useEffect, useRef} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import { Image, View } from "react-native";
import ChatScreen from './ChatScreen.js' // Adjust the path as necessary
import ModelsScreen from './ModelsScreen.js' // Adjust the path as necessary
import IntroScreen from "./IntroScreen.js";
import SettingsScreen from "./SettingsScreen.js";
import {initializeDatabase} from '../schema/initializeDatabase'
import preferencesStore from '../stores/PreferencesStore.js'
import paymentStore, {oneWeek} from '../stores/PaymentStore.js'
import {configure} from 'mobx'
import redact from '../utils/redact'
import chatStore from "../stores/ChatStore.js";
import { observer } from "mobx-react";
import { setup, withIAPContext, useIAP } from "react-native-iap";
import DeviceInfo from "react-native-device-info";
import Config from '../Config.js'
import ModalLayer from "./ModalLayer.js";

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

const AppNavigator: any = withIAPContext(observer(() => {
  const {
    connected,
    products,
    promotedProductsIOS,
    subscriptions,
    purchaseHistory,
    availablePurchases,
    currentPurchase,
    currentPurchaseError,
    initConnectionError,
    finishTransaction,
    getProducts,
    getSubscriptions,
    getAvailablePurchases,
    getPurchaseHistory,
  } = useIAP();

  const [iapLoaded, setIapLoaded] = useState(false);

  useEffect(() => {
    if (connected && !iapLoaded) {
      getPurchaseHistory().catch(console.error)
      getSubscriptions({skus: [Config.monthlyProductId, Config.annualProductId]}).catch(console.error)
    }
  }, [connected])

  useEffect(() => {
    if (connected && subscriptions.length) {
      setIapLoaded(true)
    }
  }, [connected, subscriptions]);

  useEffect(() => {
    if (connected && iapLoaded) {
      paymentStore.isSubscribed = !!currentPurchase
    }
  }, [connected, iapLoaded, currentPurchase]);

  useEffect(() => {
    if (!iapLoaded) return
    if (connected && preferencesStore.introCompleted && !paymentStore.isFreeTrialAvailable && !currentPurchase) {
      // If the user has completed the intro, then
      // * they are allowed to use the app for 1 week if they have never purchased before.
      // * If it has been 1 week since firstInstallTime, and they have not purchased before, then show the purchase screen.
      // * If it has been 1 week, and they have purchased before, then if there is no currentPurchase, and it has been 1 week since the last purchase, then show the purchase screen.

      if (!purchaseHistory.length) {
        preferencesStore.showIntro()
        preferencesStore.save().catch(console.error)
      } else {
        const lastPurchaseTime = purchaseHistory[purchaseHistory.length - 1]?.transactionDate
        const timeSinceLastPurchase = Date.now() - lastPurchaseTime
        if (oneWeek < timeSinceLastPurchase) {
          preferencesStore.showIntro()
          preferencesStore.save().catch(console.error)
        }
      }
    }

    if (connected && !preferencesStore.introCompleted && !!currentPurchase) {
      preferencesStore.completeIntro()
      preferencesStore.save().catch(console.error)
    }
  }, [connected, iapLoaded, purchaseHistory, currentPurchase, preferencesStore.introCompleted, paymentStore.isFreeTrialAvailable])

  // Update preferencesStore.isFreeTrialAvailable
  const intervalSet = useRef(false);
  useEffect(() => {
    if (intervalSet.current) return
    intervalSet.current = true
    setInterval(() => {
      const firstInstallTime = DeviceInfo.getFirstInstallTimeSync()
      const timeElapsed = Date.now() - firstInstallTime
      paymentStore.isFreeTrialAvailable = timeElapsed < oneWeek
    }, 1000 * 10)
  }, []);

  const {
    loaded,
    introCompleted
  } = preferencesStore;

  if (!loaded) return (
    <View
      style={{
        flex: 1
      }}
    >
      <Image
        style={{
          flex: 1
        }}
        source={{uri: 'IntroBg'}}
        resizeMode="cover"
      />
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
      <ModalLayer/>
    </View>
  )
}))

export default AppNavigator
