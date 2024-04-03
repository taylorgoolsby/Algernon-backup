// @flow

import {observer} from 'mobx-react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native'
// import Swiper from 'react-native-swiper'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../Colors.js'
import React, { useState, useEffect, useRef } from "react";
import Text from './components/Text.js'
import preferencesStore from '../stores/PreferencesStore.js'
import paymentStore from '../stores/PaymentStore.js'
import List from './components/List.js'
import Config from '../Config.js'
import {requestPurchase, finishTransaction} from 'react-native-iap'
import { withIAPContext, useIAP } from "react-native-iap";

const Option = (props: any) => {
  const {label, note, onSelect, selected} = props

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 24,
        shadowColor: selected
          ? 'rgba(0, 0, 0, 0.7)'
          : 'rgba(255, 255, 255, 0.8)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 1,
        backgroundColor: selected
          ? Colors.introSelectedOption
          : 'rgba(4, 7, 22, 0.8)',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 24,
        paddingRight: 12,
        marginTop: 12,
      }}
      onPress={onSelect}>
      <Text
        style={[
          styles.text,
          {fontWeight: '600'},
          selected ? {color: 'rgba(0, 0, 0, 0.75)'} : {},
        ]}>
        {label}
      </Text>
      {note ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 14,
            justifyContent: 'center',
          }}>
          <View
            // start={{x: 0, y: 1}} end={{x: 1, y: 0}}
            // colors={[Colors.gradient4, Colors.gradient4]}
            style={{
              borderRadius: 16,
              backgroundColor: selected
                ? Colors.violetLight
                : Colors.violetLight,
              paddingLeft: 8,
              paddingRight: 8,
            }}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 12,
                  fontWeight: '700',
                  fontFamily: 'Nunito',
                  paddingLeft: 8,
                  paddingRight: 6,
                },
              ]}>
              {note}
            </Text>
          </View>
        </View>
      ) : null}
    </TouchableOpacity>
  )
}

const Slide1 = withIAPContext((props: any) => {
  const {
    connected,
    subscriptions,
    getSubscriptions,
    getPurchaseHistory
  } = useIAP();

  const iapLoaded = useRef(false)
  useEffect(() => {
    if (connected && !iapLoaded.current) {
      iapLoaded.current = true
      getSubscriptions({skus: [Config.monthlyProductId, Config.annualProductId]}).catch(console.error)
    }
  }, [connected])

  const [selectedOptionId, setSelectedOptionId] = useState(null)
  function selectOption(optionId: any) {
    setSelectedOptionId(optionId)
  }

  async function confirm() {
    try {
      if (selectedOptionId === Config.monthlyProductId) {
        const purchase = await requestPurchase({ sku: Config.monthlyProductId });
        // paymentStore.
        console.log("purchase", purchase);
        await paymentStore.storePaymentStatus(true, purchase)
        await finishTransaction({purchase});
      } else if (selectedOptionId === Config.annualProductId) {
        const purchase = await requestPurchase({ sku: Config.annualProductId });
        console.log("purchase", purchase);
        await paymentStore.storePaymentStatus(true, purchase)
        await finishTransaction({purchase});
      }
      await getPurchaseHistory()
      preferencesStore.completeIntro();
      await preferencesStore.save();
    } catch (err) {
      console.error(err);
    }
  }

  // On the first render, the logo is the only element with flex: 1,
  // and if it maxes out its height, then the rendering switches modes.
  // Instead, the logo will now be rendered with a max height of 154,
  // and the sectional will be given flex 1.
  // This will ensure that the logo will always be rendered with a max height of 154.
  const [logoHeight, setLogoHeight] = useState(0)
  const onLayout = (event: any) => {
    const {height} = event.nativeEvent.layout
    setLogoHeight(height)
  }

  const openTermsOfService = () => {
    const url = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url).catch(console.error);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const openPrivacyPolicy = () => {
    const url = 'https://cobalt.tgoolsby.to/privacy';
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url).catch(console.error);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  if (!connected || !subscriptions.length) {
    return null
  }

  const maxedLogoHeight = logoHeight >= 154

  const monthlyPrice = subscriptions.find(sub => sub.productId === Config.monthlyProductId)?.localizedPrice ?? '$6.99'
  const annualPrice = subscriptions.find(sub => sub.productId === Config.annualProductId)?.localizedPrice ?? '$57.99'

  return (
    <View
      style={{
        flex: 1,
        alignSelf: 'stretch',
      }}>
      <View style={{alignSelf: 'center', ...(maxedLogoHeight ? {height: 154} : {flex: 1})}} onLayout={onLayout}>
        <View style={{flex: 1, aspectRatio: 1 / (1 + 92/600), marginBottom: 22, maxHeight: 154}}>
          <Image
            source={{uri: 'LogoTransparent'}}
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
          />
          <View
            style={{
              alignSelf: 'stretch',
              aspectRatio: 600 / 92,
            }}>
            <Image
              source={{uri: 'Title'}}
              style={{width: '100%', height: '100%'}}
              // style={{width: '100%'}}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <View
        style={{
          alignSelf: 'stretch',
          justifyContent: 'center',
          paddingLeft: 30,
          paddingRight: 30,
          // paddingTop: 26,
          paddingBottom: 40,
          ...(maxedLogoHeight ? {flex: 1} : {})
        }}>
        <View style={{alignSelf: 'stretch'}}>
          <Text style={[styles.text, styles.title]}>{'Welcome to Cobalt'}</Text>
          <Text style={[styles.text, styles.subtitle]}>
            {'Cobalt requires a subscription to operate.'}
          </Text>
          <Text style={[styles.text, styles.subtitle]}>{''}</Text>
          <List
            itemStyle={[styles.text, styles.subtitle]}
            items={[
              'Free 1-Week Trial',
              'Unlimited chat messages',
              'Long Term Memory',
            ]}
          />
        </View>
      </View>

      <View
        style={{
          // position: 'absolute',
          // bottom: 0,
          // left: 0,
          // right: 0,
          // zIndex: 1,
          alignSelf: 'stretch',
        }}>
        <SafeAreaView
          style={{
            borderRadius: 24,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            shadowColor: 'white',
            shadowOffset: {width: 0, height: -1},
            shadowOpacity: 0.5,
            shadowRadius: 1,
            elevation: 1,
            backgroundColor: Colors.introSlideUpBg,
          }}>
          <View
            style={{
              paddingTop: 12,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 0,
            }}>
            <Text
              style={[
                styles.text,
                styles.title,
                {marginBottom: 4, marginLeft: 3},
              ]}>
              {'Subscription'}
            </Text>
            <Option
              id={Config.monthlyProductId}
              label={`Monthly (${monthlyPrice})`}
              onSelect={() => selectOption(Config.monthlyProductId)}
              selected={selectedOptionId === Config.monthlyProductId}
            />
            <Option
              id={Config.annualProductId}
              label={`Annual (${annualPrice})`}
              note={'30% OFF'}
              onSelect={() => selectOption(Config.annualProductId)}
              selected={selectedOptionId === Config.annualProductId}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 14,
              }}
            >
              <TouchableOpacity
                style={{
                  paddingTop: 6,
                  paddingLeft: 23,
                  paddingBottom: 16,
                }}
                onPress={() => paymentStore.restorePurchases()}>
                <Text
                  style={[
                    styles.text,
                    {opacity: 0.5},
                  ]}>
                  Restore
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingTop: 6,
                  paddingRight: 22,
                  paddingBottom: 16,
                }}
                disabled={!selectedOptionId}
                onPress={confirm}>
                <Text
                  style={[
                    styles.text,
                    selectedOptionId ? {opacity: 1} : {opacity: 0.5},
                  ]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.legalLinksContainer}>
              <TouchableOpacity style={{marginRight: 21}} onPress={openTermsOfService}>
                <Text style={styles.legalLinkText}>Terms</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openPrivacyPolicy}>
                <Text style={styles.legalLinkText}>Privacy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        <View style={{
          marginTop: -3,
          height: 16,
          backgroundColor: 'rgb(35, 41, 66)',
        }}/>
      </View>
    </View>
  )
})

const IntroScreen: any = observer(({navigation}) => {
  async function close() {
    try {
      preferencesStore.completeIntro()
      await preferencesStore.save()
    } catch (err) {
      console.error(err)
      // todo: error modal system
    }
  }

  return (
    <View style={styles.container}>
      <Image
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
        source={{uri: 'IntroBg'}}
        resizeMode="cover"
      />
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity style={{padding: 12}} onPress={close} disabled={!paymentStore.isFreeTrialAvailable}>
            <Icon
              name={'close-circle'}
              size={30}
              color={Colors.introCloseButton}
              opacity={paymentStore.isFreeTrialAvailable ? 1 : 0}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Slide1

      />
      {/*<Swiper style={styles.wrapper}>*/}
      {/*  <Slide1 />*/}
      {/*  <View style={styles.slide}>*/}
      {/*    <Text>Slide 2</Text>*/}
      {/*  </View>*/}
      {/*  <View style={styles.slide}>*/}
      {/*    <Text>Slide 3</Text>*/}
      {/*  </View>*/}
      {/*</Swiper>*/}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {},
  slide: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
  },
  text: {
    color: Colors.introText,
  },
  title: {
    fontSize: 28,
    lineHeight: 28 * 1.8,
    letterSpacing: 0.7,
    fontFamily: 'Nunito',
    fontWeight: 'bold',
  },
  subtitle: {
    lineHeight: 16 * 1.8,
  },
  legalLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legalLinkText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    textDecorationLine: 'none',
  },
})

export default IntroScreen
