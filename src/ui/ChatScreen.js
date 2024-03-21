// @flow

import React, {useState, useEffect, useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
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
import Icon from 'react-native-vector-icons/Ionicons';
import ChatMessage from './ChatMessage.js'
import ChatIteration from '../agent/ChatIteration.js'
import {observer} from 'mobx-react'
import type {ModelConfig} from '../types/ModelConfig.js'
import preferencesStore from '../stores/PreferencesStore.js'
import {BlurView} from '@react-native-community/blur'
import chatStore from '../stores/ChatStore.js'

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const ChatScreen: any = observer(({navigation}) => {
  const messages = [...chatStore.messages]
  const [input, setInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const canPost = !!input.trim() && messages[0].completed

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

  const handleModelSelect = (model: ModelConfig) => {
    preferencesStore.selectModel(model)
    setIsExpanded(false) // Collapse the list after selection
  }

  const sendMessage = async () => {
    if (!preferencesStore.selectedModel) {
      console.error('No model selected')
      return
    }
    if (!canPost) return
    ChatIteration.iterate(
      chatStore.windowId,
      preferencesStore.selectedModel,
      input.trim(),
      output => {
        chatStore.appendMessage(output)
      },
      output => {
        chatStore.updateMessage(output)
      },
      error => {
        console.error(error)
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

  const [footerHeight, setFooterHeight] = useState(50)
  const onLayoutFooter = (event: any) => {
    const {height} = event.nativeEvent.layout
    setFooterHeight(height)
  }

  const [x1, setX1] = useState(0)
  const [y1, setY1] = useState(0)

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

  const moveAnimation = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnimation, {
          toValue: 100, // Move up
          duration: 5000, // Duration of one half of the sine wave
          easing: t => {
            return Math.sin(t * Math.PI * 2)
          },
          useNativeDriver: true,
        }),
        // Animated.timing(moveAnimation, {
        //   toValue: 0, // Move back to original position
        //   duration: 1000, // Duration of the other half
        //   easing: Easing.circle,
        //   useNativeDriver: true,
        // }),
      ]),
    ).start()
  }, [moveAnimation])

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Animated.View
          style={[
            styles.backgroundOrb,
            {
              transform: [
                {
                  translateY: moveAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, -100], // Adjust these values for the amplitude of the sine wave
                  }),
                },
              ],
            },
          ]}
        />
        <BlurView
          style={styles.backgroundBlurView}
          blurType="ultraThinMaterialDark" // or "dark", "xlight", etc., depending on your design needs
          blurAmount={1000} // Adjust the blur amount to get the desired effect
        />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} //
      >
        <FlatList
          style={styles.chatContainer}
          // $FlowFixMe
          ref={scrollViewRef}
          inverted
          data={messages}
          // $FlowFixMe
          keyExtractor={message => message.messageId}
          renderItem={item => {
            const message = item.item
            return <ChatMessage first={item.index === 0} message={message} footerHeight={footerHeight}/>
          }}
        />
      </KeyboardAvoidingView>

      <BlurView
        style={styles.header}
        // blurType="dark"
        blurAmount={70}>
        <SafeAreaView style={styles.safeArea}>
          {!!preferencesStore.selectedModel?.title ? (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={styles.settingsButtonText}>
                {preferencesStore.selectedModel.title}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Models')}>
              <Text style={styles.settingsButtonText}>Configure Models</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </BlurView>

      <Modal
        animationType="fade"
        transparent={true}
        // presentationStyle={"formSheet"}
        visible={isExpanded}
        onRequestClose={() => {
          setIsExpanded(false);
        }}
      >
        <BlurView style={{flex: 1}}>
          <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
            <ScrollView style={styles.settingsList}>
              {preferencesStore.models.map((model, index) => (
                <Button
                  key={index}
                  title={model.title}
                  onPress={() => handleModelSelect(model)}
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
          // blurType="dark"
          blurAmount={70}
          onLayout={onLayoutFooter}
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
                  placeholder="Type a message"
                  placeholderTextColor="#aaa"
                />
                {/*$FlowFixMe*/}
                {/*<Button*/}
                {/*  style={styles.sendButton}*/}
                {/*  title="Send"*/}
                {/*  onPress={sendMessage}*/}
                {/*  color={'#fff'}*/}
                {/*/>*/}
                <AnimatedIcon
                  name={"arrow-up-circle"}
                  size={30} color={
                    colorAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.97)']
                    })
                  }
                />
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
    backgroundColor: '#0105AA',
    // backgroundColor: 'blue'
  },
  backgroundOrb: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 50,
    right: 0,
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: 'red',
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
    backgroundColor: 'rgba(150, 150, 255, 0.1)',
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#fff',
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
    color: 'rgba(255, 255, 255, 0.97)',
    backgroundColor: 'transparent',
    paddingTop: 0,
  },
  sendButton: {
    height: 50,
    padding: 0,
  },
})

export default ChatScreen
