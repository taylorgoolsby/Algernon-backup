// @flow

import React, {useState, useEffect, useRef} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Animated,
  Modal,
  Platform,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Text from './components/Text.js'
import ChatMessage from './components/ChatMessage.js'
import ChatIteration from '../agent/ChatIteration.js'
import {observer} from 'mobx-react'
import preferencesStore from '../stores/PreferencesStore.js'
import {BlurView} from '@react-native-community/blur'
import chatStore from '../stores/ChatStore.js'
import Colors from '../Colors.js'
import Config from "../Config.js";
import { useDebounce } from 'use-debounce';

const AnimatedIcon = Animated.createAnimatedComponent(Icon)

const ChatScreen: any = observer(({navigation}) => {
  const messages = [...chatStore.messages]
  const [input, setInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // const canPost =
  //   !!input.trim() && (messages[0] ? !!messages[0].completed : true)
  // const canPost = true
  const canPost = !!input.trim()

  // scrollToBottom when message updates the first time (initial load):
  const initialLoad = useRef(true)
  useEffect(() => {
    if (chatStore.loaded && initialLoad.current) {
      initialLoad.current = false
      // scrollToBottom()
    }
  }, [chatStore.loaded])

  useEffect(() => {
    chatStore.onRenderDone()
  }, [messages])

  const handleModelSelect = (modelIndex: number) => {
    preferencesStore.selectModel(modelIndex)
    setIsExpanded(false) // Collapse the list after selection
  }

  const sendMessage = async () => {
    if (!canPost) return
    // if (!preferencesStore.selectedModel) {
    //   console.error('No model selected')
    //   return
    // }
    // if (preferencesStore.selectedModel.local) {
    //   setErrorMessage('Local models are not supported yet.')
    //   return
    // }
    ChatIteration.iterate(
      chatStore.windowId,
      {
        title: 'GPT-4',
        apiBase: 'https://api.openai.com',
        apiKey: Config.openAiApiKey,
        completionOptions: {
          model: 'gpt-3.5-turbo'
        }
      },
      input.trim(),
      output => {
        chatStore.appendMessage(output)
      },
      output => {
        chatStore.updateMessage(output)
      },
      error => {
        console.error(error)
        setErrorMessage(error.message)
      },
    )
    setInput('')
  }

  // Ref for the TextInput to call focus
  const inputRef = useRef(null)
  const focusInput = () => {
    // $FlowFixMe
    inputRef.current.focus()
  }

  const scrollViewRef = useRef(null)
  const scrollToBottom = () => {
    {
      /*$FlowFixMe*/
    }
    // setTimeout(() => {
    //   scrollViewRef.current?.scrollToEnd({animated: true})
    // })
  }

  // SafeArea causes headerHeight and footerHeight to change over time.
  const [_headerHeight, setHeaderHeight] = useState(0)
  const [headerHeight] = useDebounce(_headerHeight, 16);
  const onLayoutHeader = (event: any) => {
    const {height} = event.nativeEvent.layout
    setHeaderHeight(height)
  }

  const [_footerHeight, setFooterHeight] = useState(0)
  const [footerHeight] = useDebounce(_footerHeight, 16);
  const onLayoutFooter = (event: any) => {
    const {height} = event.nativeEvent.layout
    setFooterHeight(height)
  }

  const colorAnimation = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (canPost) {
      Animated.timing(colorAnimation, {
        toValue: 1,
        duration: 120,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(colorAnimation, {
        toValue: 0,
        duration: 120,
        useNativeDriver: false,
      }).start()
    }
  }, [canPost])

  return (
    <View style={styles.container}>
      <View style={styles.background}>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'height' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} //
      >
        {(messages.length > 0 && headerHeight && footerHeight) ? (
          <FlatList
            style={styles.chatContainer}
            contentContainerStyle={{
              paddingBottom: headerHeight,
              paddingTop: footerHeight,
            }}
            scrollIndicatorInsets={{
              top: footerHeight,
              bottom: headerHeight,
            }}
            automaticallyAdjustsScrollIndicatorInsets={false}
            // $FlowFixMe
            ref={scrollViewRef}
            inverted
            data={messages}
            // $FlowFixMe
            keyExtractor={message => message.messageId}
            renderItem={item => {
              const message = item.item
              return <ChatMessage message={message} />
            }}
          />
        ) : null}
      </KeyboardAvoidingView>

      <BlurView
        style={styles.header}
        blurType={Colors.chatHeaderBlurType}
        blurAmount={70} //
        onLayout={onLayoutHeader} //
      >
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.settingsButtonText}>Settings</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </BlurView>

      <Modal
        animationType="fade"
        transparent={true}
        // presentationStyle={"formSheet"}
        visible={isExpanded}
        onRequestClose={() => {
          setIsExpanded(false)
        }}>
        <BlurView style={{flex: 1}}>
          <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
            <ScrollView style={styles.settingsList}>
              {preferencesStore.models.map((model, index) => (
                <Button
                  key={index}
                  title={model.title}
                  onPress={() => handleModelSelect(index)}
                  color="#FFFFFF"
                />
              ))}
              <Button
                title="Configure Models"
                onPress={() => {
                  navigation.navigate('Models')
                  setIsExpanded(false)
                }}
                color="#FFFFFF"
              />
            </ScrollView>
          </SafeAreaView>
        </BlurView>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        // presentationStyle={"formSheet"}
        visible={!!errorMessage}
        onRequestClose={() => {
          setErrorMessage('')
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setErrorMessage('')
          }}>
          <View style={{flex: 1}}>
            <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
              <BlurView style={styles.errorBox} blurType="dark" blurAmount={70}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </BlurView>
            </SafeAreaView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/*{isExpanded && (*/}
      {/*  <View style={styles.settingsModal}>*/}
      {/*    <BlurView style={styles.settingsContainer} blurType="regular">*/}
      {/*      */}
      {/*    </BlurView>*/}
      {/*  </View>*/}
      {/*)}*/}

      <KeyboardAvoidingView
        style={styles.footer}
        behavior={Platform.OS === 'ios' ? 'position' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} //
      >
        <BlurView
          style={styles.footerBlur}
          blurType={Colors.chatFooterBlurType}
          blurAmount={70}
          onLayout={onLayoutFooter} //
        >
          <SafeAreaView style={styles.safeArea}>
            <TouchableWithoutFeedback onPress={focusInput}>
              <View style={styles.inputBar}>
                {/*$FlowFixMe*/}
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  multiline
                  value={input}
                  onChangeText={setInput}
                  placeholder="Message"
                  placeholderTextColor="#aaa"
                />
                {/*$FlowFixMe*/}
                {/*<Button*/}
                {/*  style={styles.sendButton}*/}
                {/*  title="Send"*/}
                {/*  onPress={sendMessage}*/}
                {/*  color={'#fff'}*/}
                {/*/>*/}
                <TouchableOpacity disabled={!canPost} onPress={sendMessage}>
                  <AnimatedIcon
                    name={'arrow-up-circle'}
                    size={30}
                    color={colorAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        Colors.sendIconDisabledBg,
                        Colors.sendIconBg,
                      ],
                    })}
                  />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </BlurView>
      </KeyboardAvoidingView>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    // backgroundColor: '#0105AA',
    backgroundColor: Colors.chatBg,
  },
  backgroundOrb: {
    position: 'absolute',
    top: 100,
    bottom: 0,
    left: 100,
    right: 0,
    height: 200,
    width: 200,
    borderRadius: 100,
    // backgroundColor: '#010599',
    backgroundColor: '#009',
  },
  backgroundBlurView: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerBlur: {
    flex: 1,
  },
  safeArea: {
    flexDirection: 'row',
  },
  settingsButton: {
    // position: 'absolute',
    // top: 15,
    // left: 15,
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 12,
    padding: 10,
    paddingLeft: 18,
    paddingRight: 18,
    backgroundColor: Colors.settingsButtonBg,
  },
  settingsButtonText: {
    fontSize: 16,
    color: Colors.settingsButtonText,
  },
  settingsModal: {
    position: 'absolute',
    top: 50 + 10, // Adjust based on your layout
    left: 0,
    right: 0,
  },
  settingsContainer: {
    // margin: 50 + 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 24,
  },
  settingsList: {
    maxHeight: 300,
  },
  chatContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    paddingLeft: 27,
    paddingRight: 23,
  },
  input: {
    flex: 1,
    color: Colors.inputText,
    backgroundColor: 'transparent',
    paddingTop: 0,
    marginRight: 10,
    fontSize: Colors.fontSize,
    fontFamily: 'Montserrat',
  },
  sendButton: {
    height: 50,
    padding: 0,
  },
  errorBox: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 24,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.97)',
  },
})

export default ChatScreen
