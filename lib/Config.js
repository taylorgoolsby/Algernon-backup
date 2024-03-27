//      

import RNConfig from "react-native-config";

export default class Config {
  // $FlowFixMe
  static stage         = __DEV__ ? 'debug' : 'release';
  static openAiApiKey         = RNConfig.OPENAI_API_KEY;
}
