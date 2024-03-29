//      

import RNConfig from "react-native-config";

export default class Config {
  // $FlowFixMe
  static stage         = __DEV__ ? 'debug' : 'release';
  static openAiApiKey         = RNConfig.OPENAI_API_KEY;
  static codePushKey         = RNConfig.APP_CENTER_SECRET;
  static monthlyProductId         = 'sub1.monthly1'
  static annualProductId         = 'sub1.annual1'
  static tokensPerChar         = 0.17421777221526907
}
