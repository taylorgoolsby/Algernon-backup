// @flow

import {makeObservable, observable, computed} from 'mobx'
import DeviceInfo from "react-native-device-info";

const firstInstallTime = DeviceInfo.getFirstInstallTimeSync()
const timeElapsed = Date.now() - firstInstallTime
export const oneWeek = 1000 * 60 * 2

class PaymentStore {
  // isFreeTrialAvailable is the free trial without purchase.
  // Note that subs include a free trial, but they still count as a purchase.
  isFreeTrialAvailable: boolean = timeElapsed < oneWeek
  isSubscribed: boolean = false

  constructor() {
    makeObservable(this, {
      isFreeTrialAvailable: observable,
      isSubscribed: observable
    })
  }
}

const paymentStore: PaymentStore = new PaymentStore()

export default paymentStore
