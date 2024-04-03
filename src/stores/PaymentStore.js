// @flow

import RNFS from 'react-native-fs'
import {Buffer} from 'buffer';
import {getUniqueIdSync, getFirstInstallTimeSync} from 'react-native-device-info';
import {makeObservable, observable, computed} from 'mobx'
import Config from "../Config.js";
import { getAvailablePurchases } from "react-native-iap";
import modalStore from "./ModalStore.js";

const firstInstallTime = getFirstInstallTimeSync()
const timeElapsed = Date.now() - firstInstallTime
export const oneWeek = 1000 * 60 * 60 * 24 * 7

const path = `${RNFS.DocumentDirectoryPath}/paymentStatus.txt`

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
    this.initializePaymentStatus()
  }

  reset: () => Promise<void> = () => {
    return this.storePaymentStatus(false, null)
  }

  storePaymentStatus: (status: boolean, purchase: any) => Promise<void> = async (status: boolean, purchase: any) => {
    this.isSubscribed = status

    const paymentStatus = {
      status,
      purchase,
      deviceUniqueId: getUniqueIdSync(),
      appSpecificSalt: Config.appSalt
    };

    try {
      await RNFS.writeFile(path, JSON.stringify(paymentStatus), 'utf8');
      console.log('Payment status saved successfully');
    } catch (error) {
      console.error('Failed to save payment status', error);
    }
  };

  verifyPaymentStatus: () => Promise<boolean> = async () => {
    try {
      const paymentStatusData = await RNFS.readFile(path, 'utf8');
      const paymentStatus = JSON.parse(paymentStatusData);

      if (paymentStatus.deviceUniqueId === getUniqueIdSync() && paymentStatus.appSpecificSalt === Config.appSalt) {
        this.isSubscribed = paymentStatus.status;
        // this.verificationResultIOS = paymentStatus.verificationResultIOS;
        console.log('Payment status:', paymentStatus.status);
        return paymentStatus.status;
      }
    } catch (error) {
      console.error('Failed to verify payment status', error);
    }
    return false;
  };

  initializePaymentStatus: () => void = () => {
    Promise.resolve().then(async () => {
      this.isSubscribed = await this.verifyPaymentStatus();
    })
  };

  restorePurchases: (doNotShowModals?: ?boolean) => Promise<void> = async (doNotShowModals?: ?boolean) => {
    const purchases = await getAvailablePurchases();
    console.log("available purchases", purchases);
    const validPurchase = purchases.find(purchase => {
      return purchase.productId === Config.monthlyProductId || purchase.productId === Config.annualProductId
    })
    if (!validPurchase) {
      if (!doNotShowModals) {
        modalStore.cta(null, 'No purchases found.', 'OK')
      }
    } else {
      await this.storePaymentStatus(true, validPurchase)
      if (!doNotShowModals) {
        modalStore.cta(null, 'Purchases restored!', 'OK')
      }
    }
  }
}

const paymentStore: PaymentStore = new PaymentStore()

export default paymentStore
