// @flow

import React, {useState, useEffect} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import { Image, View } from "react-native";
import ChatScreen from './ChatScreen.js' // Adjust the path as necessary
import ModelsScreen from './ModelsScreen.js' // Adjust the path as necessary
import IntroScreen from "./IntroScreen.js";
import SettingsScreen from "./SettingsScreen.js";
import {initializeDatabase} from '../schema/initializeDatabase'
import preferencesStore from '../stores/PreferencesStore.js'
import {configure} from 'mobx'
import redact from '../utils/redact'
import chatStore from "../stores/ChatStore.js";
import { observer } from "mobx-react";

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

const AppNavigator: any = observer(() => {
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
  )
})

export default AppNavigator
