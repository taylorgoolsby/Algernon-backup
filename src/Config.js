// @flow

import RNConfig from "react-native-config";

export default class Config {
  // $FlowFixMe
  static stage: string = __DEV__ ? 'debug' : 'release';
  static openAiApiKey: string = RNConfig.OPENAI_API_KEY;
  static monthlyProductId: string = 'sub1.monthly1'
  static annualProductId: string = 'sub1.annual1'
  static tokensPerChar: number = 0.17421777221526907
}
