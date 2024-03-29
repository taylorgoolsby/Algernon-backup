// @flow

import React from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import Text from './components/Text.js'
import { BlurView } from "@react-native-community/blur";
import { observer } from "mobx-react";
import modalStore from "../stores/ModalStore.js";
import Colors from "../Colors.js";

const ModalLayer: any = observer((props) => {
  const {
    openModal,
    errorMessage,
    confirmTitle,
    confirmMessage,
    confirmCallback,
  } = modalStore;

  console.log("openModal", openModal);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      // presentationStyle={"formSheet"}
      visible={openModal}
      onRequestClose={modalStore.close}>
      <TouchableWithoutFeedback
        onPress={modalStore.close}>
        <View style={{flex: 1}}>
          <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
            <BlurView style={styles.errorBox} blurType="dark" blurAmount={70}>
              {confirmTitle ? (
                <Text style={styles.title}>{confirmTitle}</Text>
              ) : null}
              <Text style={styles.message}>{errorMessage || confirmMessage}</Text>
              {confirmCallback ? (
                <View style={styles.confirmOptions}>
                  {/*$FlowFixMe*/}
                  <TouchableOpacity
                    style={styles.confirmPrimaryButton}
                    onPress={() => confirmCallback(true)}
                  >
                    <Text style={styles.confirmYes}>{'Yes'}</Text>
                  </TouchableOpacity>
                  {/*$FlowFixMe*/}
                  <TouchableOpacity
                    style={styles.confirmSecondaryButton}
                    onPress={() => confirmCallback(false)}
                  >
                    <Text style={styles.confirmNo}>{'Nevermind'}</Text>
                  </TouchableOpacity>
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
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 24,
  },
  title: {
    fontSize: 24,
    lineHeight: 28 * 1.5,
    color: 'rgba(255, 255, 255, 0.97)',
    marginBottom: 16,
    marginLeft: -1,
  },
  message: {
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: 'rgba(255, 255, 255, 0.97)',
  },
  confirmOptions: {
    alignItems: 'center',
    paddingTop: 20
  },
  confirmPrimaryButton: {
    padding: 10,
  },
  confirmSecondaryButton: {
    padding: 10,
  },
  confirmYes: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.97)',
  },
  confirmNo: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.97)',
  }
})

export default ModalLayer
