// @flow

import {observer} from 'mobx-react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform
} from 'react-native'
// import Swiper from 'react-native-swiper'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../Colors.js'
import React, {useState, useEffect} from 'react'
import Text from './components/Text.js'
import preferencesStore from '../stores/PreferencesStore.js'
import List from './components/List.js'
import * as RNIap from 'react-native-iap';
import {requestPurchase, withIAPContext, useIAP} from 'react-native-iap';

const itemSkus = Platform.select({
  ios: [
    'monthly1', // The product ID for your monthly subscription
    // 'com.yourapp.annual', // The product ID for your annual subscription
  ],
});

const Option = props => {
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

const Slide1 = withIAPContext(() => {
  const {
    connected,
    products,
    promotedProductsIOS,
    subscriptions,
    purchaseHistory,
    availablePurchases,
    currentPurchase,
    currentPurchaseError,
    initConnectionError,
    finishTransaction,
    getProducts,
    getSubscriptions,
    getAvailablePurchases,
    getPurchaseHistory,
  } = useIAP();

  const [selectedOptionId, setSelectedOptionId] = useState(null)

  function selectOption(optionId) {
    setSelectedOptionId(optionId)
  }

  console.log("connected", connected);
  console.log("products", products);

  async function confirm() {
    // if (selectedOptionId === 'monthly') {
    //   await requestPurchase({sku: 'monthly1'})
    // } else if (selectedOptionId === 'yearly') {
    //   // await purchase('com.yourapp.annual')
    // }
    preferencesStore.completeIntro()
    await preferencesStore.save()
  }

  useEffect(() => {
    // ... listen to currentPurchaseError, to check if any error happened
  }, [currentPurchaseError]);

  useEffect(() => {
    // ... listen to currentPurchase, to check if the purchase went through
  }, [currentPurchase]);

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

  const maxedLogoHeight = logoHeight >= 154

  const monthlyPrice = 6.99
  const annualPrice = Math.trunc(monthlyPrice * 12 * 0.7) - 0.01

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
              paddingBottom: 12,
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
              label={`Continue with free trial`}
              onSelect={() => selectOption('monthly')}
              selected={selectedOptionId === 'monthly'}
            />
            {/*<Option*/}
            {/*  label={`Monthly ($${monthlyPrice.toFixed(2)})`}*/}
            {/*  onSelect={() => selectOption('monthly')}*/}
            {/*  selected={selectedOptionId === 'monthly'}*/}
            {/*/>*/}
            {/*<Option*/}
            {/*  id={'yearly'}*/}
            {/*  label={`Annual ($${annualPrice})`}*/}
            {/*  note={'30% OFF'}*/}
            {/*  onSelect={() => selectOption('yearly')}*/}
            {/*  selected={selectedOptionId === 'yearly'}*/}
            {/*/>*/}
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                marginTop: 14,
                paddingTop: 6,
                paddingRight: 22,
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
        </SafeAreaView>
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
          <TouchableOpacity style={{padding: 12}} onPress={close}>
            <Icon
              name={'close-circle'}
              size={30}
              color={Colors.introCloseButton}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Slide1 />
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
})

export default IntroScreen
