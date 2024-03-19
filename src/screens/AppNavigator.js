// @flow

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import ChatScreen from './ChatScreen.js'; // Adjust the path as necessary
import ModelsScreen from './ModelsScreen.js'; // Adjust the path as necessary
import {initializeDatabase} from "../schema/database.js";
import modelStore from "../ModelStore.js";

initializeDatabase();
modelStore.load();

const Stack = createNativeStackNavigator();

const AppNavigator: any = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Models" component={ModelsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
