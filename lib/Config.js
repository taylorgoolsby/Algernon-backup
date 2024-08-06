//      

import RNConfig from "react-native-config";

console.log("RNConfig.EXA_SECRET", RNConfig.EXA_SECRET);

export default class Config {
  // $FlowFixMe
  static stage         = __DEV__ ? 'debug' : 'release';
  static appSalt         = RNConfig.APP_SALT;

  static openAiApiKey         = RNConfig.OPENAI_API_KEY;
  static claudeApiKey         = RNConfig.CLAUDE_API_KEY;
  static mistralApiKey         = RNConfig.MISTRAL_API_KEY;

  static codePushKey         = RNConfig.APP_CENTER_SECRET;

  static awsAccessKeyId         = RNConfig.AWS_ACCESS_KEY_ID;
  static awsSecretAccessKey         = RNConfig.AWS_SECRET_ACCESS_KEY;

  static bingSecret         = RNConfig.BING_SECRET;
  static exaSecret         = RNConfig.EXA_SECRET;

  static monthlyProductId         = 'sub1.monthly1'
  static annualProductId         = 'sub1.annual1'
  static tokensPerChar         = 0.17421777221526907
}
