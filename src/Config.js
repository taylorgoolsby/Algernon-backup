// @flow

import RNConfig from "react-native-config";

console.log("RNConfig.EXA_SECRET", RNConfig.EXA_SECRET);

export default class Config {
  // $FlowFixMe
  static stage: string = __DEV__ ? 'debug' : 'release';
  static appSalt: string = RNConfig.APP_SALT;

  static openAiApiKey: string = RNConfig.OPENAI_API_KEY;
  static claudeApiKey: string = RNConfig.CLAUDE_API_KEY;
  static mistralApiKey: string = RNConfig.MISTRAL_API_KEY;

  static codePushKey: string = RNConfig.APP_CENTER_SECRET;

  static awsAccessKeyId: string = RNConfig.AWS_ACCESS_KEY_ID;
  static awsSecretAccessKey: string = RNConfig.AWS_SECRET_ACCESS_KEY;

  static bingSecret: string = RNConfig.BING_SECRET;
  static exaSecret: string = RNConfig.EXA_SECRET;

  static monthlyProductId: string = 'sub1.monthly1'
  static annualProductId: string = 'sub1.annual1'
  static tokensPerChar: number = 0.17421777221526907
}
