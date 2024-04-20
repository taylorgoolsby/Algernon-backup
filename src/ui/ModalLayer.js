// @flow

import React from 'react'
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from 'react-native'
import Text from './components/Text.js'
import {BlurView} from '@react-native-community/blur'
import {observer} from 'mobx-react'
import modalStore from '../stores/ModalStore.js'
import Colors from "../Colors.js";

const ModalLayer: any = observer(props => {
  const {
    openModal,
    title,
    message,
    primaryLabel,
    secondaryLabel,
    onPrimary,
    onSecondary,
  } = modalStore

  return (
    <Modal
      animationType="fade"
      transparent={true}
      // presentationStyle={"formSheet"}
      visible={openModal}
      onRequestClose={modalStore.close}>
      <TouchableWithoutFeedback onPress={modalStore.close}>
        <View style={{flex: 1}}>
          <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
            <BlurView style={[styles.errorBox]} blurType="dark" blurAmount={70}>
              {title ? <Text style={styles.title}>{title}</Text> : null}
              {!!message ? (
                <Text
                  style={[
                    styles.message,
                    !title && onPrimary ? {marginTop: 8} : {},
                    !title ? {alignSelf: 'center'} : {},
                  ]}>
                  {message}
                </Text>
              ) : null}
              {onPrimary || onSecondary ? (
                <View style={[styles.confirmOptions, !!message ? {} : {paddingTop: 0}]}>
                  {onPrimary ? (
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={onPrimary}>
                      <Text style={styles.primaryText}>{primaryLabel}</Text>
                    </TouchableOpacity>
                  ) : null}
                  {onSecondary ? (
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={onSecondary}>
                      <Text style={styles.secondaryText}>{secondaryLabel}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : null}
            </BlurView>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
})

const styles = StyleSheet.create({
  errorBox: {
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 20,
    paddingRight: 25,
    marginLeft: 41,
    marginRight: 41,
    borderRadius: 24,
  },
  title: {
    fontSize: 22/16 * Colors.fontSize,
    lineHeight: 28 * 1.5,
    color: 'rgba(255, 255, 255, 0.97)',
    marginLeft: 0,
    marginBottom: 14,
  },
  message: {
    fontSize: Colors.fontSize,
    lineHeight: 16 * 1.5,
    color: 'rgba(255, 255, 255, 0.97)',
  },
  confirmOptions: {
    alignItems: 'center',
    paddingTop: 15,
  },
  primaryButton: {
    padding: 8,
  },
  secondaryButton: {
    padding: 8,
  },
  primaryText: {
    fontSize: 17/16 * Colors.fontSize,
    color: 'rgba(255, 255, 255, 0.97)',
  },
  secondaryText: {
    fontSize: 14/16 * Colors.fontSize,
    color: 'rgba(255, 255, 255, 0.97)',
  },
})

export default ModalLayer
