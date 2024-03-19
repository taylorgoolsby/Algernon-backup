//      

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import App from './App.js'; // Adjust the path as necessary
import SettingsScreen from './SettingsScreen.js'; // Adjust the path as necessary

const Stack = createNativeStackNavigator();

const AppNavigator      = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Chat" component={App} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
