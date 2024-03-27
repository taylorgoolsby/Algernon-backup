// @flow

import RNConfig from "react-native-config";

export default class Config {
  // $FlowFixMe
  static stage: string = __DEV__ ? 'debug' : 'release';
  static openAiApiKey: string = RNConfig.OPENAI_API_KEY;
}
