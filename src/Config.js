// @flow

export default class Config {
  // $FlowFixMe
  static stage: string = __DEV__ ? 'debug' : 'release';
}
