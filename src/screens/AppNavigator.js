// @flow

import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import ChatScreen from './ChatScreen.js' // Adjust the path as necessary
import ModelsScreen from './ModelsScreen.js' // Adjust the path as necessary
import {initializeDatabase} from '../schema/initializeDatabase'
import modelStore from '../stores/PreferencesStore.js'
import {configure} from 'mobx'
import redact from '../utils/redact'

configure({
  enforceActions: 'never',
})
initializeDatabase()
  .then(() => {
    modelStore.load()
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

const AppNavigator: any = () => (
  <NavigationContainer>
    <Stack.Navigator>
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
    </Stack.Navigator>
  </NavigationContainer>
)

export default AppNavigator
