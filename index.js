/**
 * @format
 */

import {AppRegistry} from 'react-native';
import CodePush from 'react-native-code-push';
import Config from './src/Config.js'
import AppNavigator from './src/ui/AppNavigator.js';
import {name as appName} from './app.json';

const App = CodePush({
  deploymentKey: Config.codePushKey,
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.IMMEDIATE,
})(AppNavigator)

AppRegistry.registerComponent(appName, () => App);
