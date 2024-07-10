// @flow

import React, {useState, useEffect, useRef} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Animated,
  Modal,
  Platform,
  Appearance,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Text from './components/Text.js'
import ChatMessage, {leftMargin, rightMargin} from './components/ChatMessage.js'
import ProfilePic from './components/ProfilePic.js'
import ChatIteration from '../agent/ChatIteration.js'
import {observer} from 'mobx-react'
import preferencesStore from '../stores/PreferencesStore.js'
import {BlurView} from '@react-native-community/blur'
import chatStore from '../stores/ChatStore.js'
import Colors, {
  footerActive,
  footerInactive,
  headerLeft,
  headerRight,
  searchActive,
  shadow,
} from '../Colors.js'
import modalStore from '../stores/ModalStore.js'
import Voice from '@react-native-voice/voice'
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions'
import type {MessageSQL} from '../schema/Message/MessageSchema.mjs'
import LongTermAnnotation from '../agent/LongTermAnnotation.js'
import {useDebounce} from 'use-debounce'
import ListSlider from './components/ListSlider.js'
import MessageOptions from './components/MessageOptions.js'
import ChatList from "./components/ChatList";

const darkMode = Appearance.getColorScheme() === 'dark'

const AnimatedIcon = Animated.createAnimatedComponent(Icon)

const ChatScreen: any = observer(({navigation}) => {
  const displayedMessageIds = chatStore.displayedMessageIds
  const [input, setInput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchInputFocused, setSearchInputFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showFlipSide, setShowFlipSide] = useState(false)
  const [showOptionsForMessage, setShowOptionsForMessage] =
    useState<?MessageSQL>(null)

  const [searchResults, setSearchResults] = useState<?Array<string>>(null)
  const [searchMode, setSearchMode] = useState(false)
  function enterSearchMode() {
    setSearchMode(true)
    setSearchResults(null)
  }
  function exitSearchMode() {
    setSearchMode(false)
    setSearchResults(null)
  }

  function onInputValueChange(value: string) {
    setInput(value)
  }

  function onSearchInputValueChange(value: string) {
    setSearchInput(value)
    LongTermAnnotation.searchAndGetMessages(
      value,
      (messages: Array<string>) => {
        setSearchResults(messages)
      },
    )
  }

  function onFocus() {
    if (searchMode) {
      setSearchInputFocused(true)
    }
  }

  function onBlur() {
    if (searchMode) {
      setSearchInputFocused(false)
    }
  }

  function closeOptions() {
    setShowOptionsForMessage(null)
  }

  const canPost =
    !!input.trim() &&
    (displayedMessageIds[0]
      ? !!chatStore.messages[displayedMessageIds[0]].completed
      : true)

  // useEffect(() => {
  //   chatStore.onRenderDone()
  // }, [chatStore.dirty])

  // const [micReady, setMicReady] = useState(false)
  // const [speechReady, setSpeechReady] = useState(false)
  async function checkAndRequestVoice(): Promise<boolean> {
    let micCheck = await check(PERMISSIONS.IOS.MICROPHONE)
    console.log('micCheck', micCheck)
    if (micCheck !== RESULTS.GRANTED) {
      micCheck = await request(PERMISSIONS.IOS.MICROPHONE)
      console.log('micCheck', micCheck)
    }

    let speechCheck = await check(PERMISSIONS.IOS.SPEECH_RECOGNITION)
    if (speechCheck !== RESULTS.GRANTED) {
      speechCheck = await request(PERMISSIONS.IOS.SPEECH_RECOGNITION)
    }

    if (micCheck === RESULTS.BLOCKED || speechCheck === RESULTS.BLOCKED) {
      modalStore.cta(
        null,
        'Please enable microphone and speech recognition permissions in your system settings.',
        'Open Settings',
        () => {
          openSettings().catch(console.error)
        },
      )
    }

    return micCheck === RESULTS.GRANTED && speechCheck === RESULTS.GRANTED
  }

  const voiceInitialized = useRef(false)
  const [voiceReady, setVoiceReady] = useState(false)
  useEffect(() => {
    if (!voiceInitialized.current) {
      voiceInitialized.current = true
      Promise.resolve().then(async () => {
        // setVoiceReady(await Voice.isAvailable() === 1)
        setVoiceReady(true)
        Voice.onSpeechResults = e => {
          console.log('e.value', e.value)
          setInput(input + ' ' + e.value[0])
          // console.log("e.value", e.value);
        }
        // Voice.onSpeechPartialResults = (e) => {
        //   console.log("e.value", e.value);
        // }
        Voice.onSpeechError = e => {
          console.log(e.error)
          stopSpeechToText()
          modalStore.showError('Speech recognition stopped')
        }
      })
    }
  }, [])

  const startSpeechToText = async () => {
    // This function is called whenever the user presses the mic button,
    // which is always displayed when input is empty.

    // If permissions have not been granted, then this function will request
    // them and start recording once they have been accepted.

    // It will always ask for permissions, even if they have been rejected in
    // the past.

    // If the user rejects these permissions, then this function will exit
    // early so no recording is started.

    const permissionsGranted = await checkAndRequestVoice()

    if (permissionsGranted && voiceReady) {
      setIsRecording(true)
      Voice.start('en-US') // todo: detect language
    }
  }

  const stopSpeechToText = () => {
    if (isRecording) {
      setIsRecording(false)
      Voice.stop()
    }
  }

  const handleModelSelect = (modelIndex: number) => {
    preferencesStore.selectModel(modelIndex)
    setIsExpanded(false) // Collapse the list after selection
  }

  const submit = async () => {
    if (searchMode) {
      LongTermAnnotation.searchAndGetMessages(
        input.trim(),
        (messages: Array<string>) => {
          setSearchResults(messages)
        },
      )
    } else {
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

    inputRef.current?.blur()
  }

  // Ref for the TextInput to call focus
  const inputRef = useRef(null)
  const setInputRef = (ref: any) => {
    inputRef.current = ref
    chatStore.inputRef = ref
  }
  const focusInput = () => {
    // $FlowFixMe
    inputRef.current.focus()
  }

  const [_headerHeight, setHeaderHeight] = useState(0)
  const [headerHeight] = useDebounce(_headerHeight, 0) // for some reason layout on safe area changes over time on initial mount.
  const onLayoutHeader = (event: any) => {
    const {height} = event.nativeEvent.layout
    setHeaderHeight(height)
  }

  const [innerHeaderHeight, setInnerHeaderHeight] = useState(0)
  const onLayoutInnerHeader = (event: any) => {
    const {height} = event.nativeEvent.layout
    setInnerHeaderHeight(height)
  }

  const [safeAreaFooterHeight, setSafeAreaFooterHeight] = useState(0)
  const onLayoutSafeAreaFooter = (event: any) => {
    const {height} = event.nativeEvent.layout
    setSafeAreaFooterHeight(height)
  }

  const [footerHeight, setFooterHeight] = useState(0)
  const onLayoutFooter = (event: any) => {
    const {height} = event.nativeEvent.layout
    setFooterHeight(height)
  }

  const clearColor = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (searchMode || !!input) {
      Animated.timing(clearColor, {
        toValue: 1,
        duration: 120,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(clearColor, {
        toValue: 0,
        duration: 120,
        useNativeDriver: false,
      }).start()
    }
  }, [searchMode, input])

  const submitColor = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (canPost || isRecording || (searchMode && searchInputFocused)) {
      Animated.timing(submitColor, {
        toValue: 1,
        duration: 120,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(submitColor, {
        toValue: 0,
        duration: 120,
        useNativeDriver: false,
      }).start()
    }
  }, [canPost, isRecording, searchMode, searchInputFocused])

  return (
    <View style={styles.container}>
      <View style={styles.background}></View>

      {displayedMessageIds.length > 0 && headerHeight && footerHeight ? (
        <ChatList
          messageIds={chatStore.displayedMessageIds}
          onEmptyAreaPress={() => {
            chatStore.closeAllOptions()
            inputRef.current?.blur()
          }}
          headerHeight={headerHeight}
          footerHeight={footerHeight}
          safeAreaFooterHeight={safeAreaFooterHeight}
        />
      ) : null}
      {/*{displayedMessageIds.length > 0 && headerHeight && footerHeight ? (*/}
      {/*  <ListSlider*/}
      {/*    searchMode={searchMode}*/}
      {/*    messageIds={displayedMessageIds}*/}
      {/*    searchResults={searchResults}*/}
      {/*    headerHeight={headerHeight}*/}
      {/*    footerHeight={footerHeight}*/}
      {/*    safeAreaFooterHeight={safeAreaFooterHeight}*/}
      {/*    onEmptyAreaPress={() => {*/}
      {/*      chatStore.closeAllOptions()*/}
      {/*      inputRef.current?.blur()*/}
      {/*    }}*/}
      {/*  />*/}
      {/*) : null}*/}

      <TouchableWithoutFeedback
        onPress={() => {
          chatStore.deselectOptionsColorTarget()
          chatStore.deselectOptionsTarget()
          inputRef.current?.blur()
        }}>
        <View style={styles.header}>
          <BlurView
            style={{flex: 1, opacity: 0}}
            blurType={Colors.chatHeaderBlurType}
            blurAmount={70} //
            onLayout={onLayoutHeader} //
          >
            <SafeAreaView style={styles.safeArea}>
              <View
                style={{
                  paddingBottom: 12,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  flex: 1,
                }}
                onLayout={onLayoutInnerHeader}>
                <TouchableOpacity
                  style={[styles.sendButton, {paddingRight: 24, opacity: 0}]}
                  onPress={() => {
                    setShowFlipSide(!showFlipSide)
                  }}
                  disabled={true}>
                  <Icon
                    // name={'analytics-outline'}
                    name={'layers-outline'}
                    size={18}
                    color={headerRight}
                    opacity={0.3}
                  />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </BlurView>
        </View>
      </TouchableWithoutFeedback>

      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1000,
        }}>
        <SafeAreaView>
          <TouchableOpacity
            style={{
              // paddingLeft: 22,
              paddingLeft: leftMargin + 18,
              paddingBottom: 12,
              paddingRight: 30,
            }}
            onPress={() => {
              navigation.navigate('Settings')
              inputRef.current?.blur()
            }} //
          >
            <View
              style={{
                backgroundColor: headerLeft,
                height: 19,
                width: 7,
              }}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

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

      <TouchableWithoutFeedback
        onPress={() => {
          chatStore.deselectOptionsColorTarget()
          chatStore.deselectOptionsTarget()
          inputRef.current?.blur()
        }}>
        <KeyboardAvoidingView
          style={[styles.footer, shadow]}
          behavior={Platform.OS === 'ios' ? 'position' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} //
        >
          <BlurView
            style={styles.footerBlur}
            blurType={Colors.chatFooterBlurType}
            blurAmount={70}
            onLayout={onLayoutSafeAreaFooter}>
            <SafeAreaView style={styles.inputSafeArea}>
              <TouchableWithoutFeedback onPress={focusInput}>
                <View style={styles.inputBar} onLayout={onLayoutFooter}>
                  <TouchableOpacity
                    style={styles.clearInputButton}
                    onPress={() => {
                      if (searchMode) {
                        exitSearchMode()
                      } else if (!!input) {
                        setInput('')
                      } else {
                        enterSearchMode()
                      }
                    }}>
                    <AnimatedIcon
                      name={
                        !!input && !searchMode
                          ? 'close-circle'
                          : 'search-circle'
                      }
                      size={!!input && !searchMode ? 28 : 30}
                      style={{marginLeft: !!input && !searchMode ? 0 : -1}}
                      color={clearColor.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          footerInactive,
                          searchMode ? searchActive : footerActive,
                        ],
                      })}
                    />
                  </TouchableOpacity>
                  {/*$FlowFixMe*/}
                  <TextInput
                    ref={setInputRef}
                    style={styles.input}
                    multiline
                    onFocus={onFocus}
                    onBlur={onBlur}
                    value={searchMode ? searchInput : input}
                    onChangeText={
                      searchMode ? onSearchInputValueChange : onInputValueChange
                    }
                    placeholder={searchMode ? 'Search' : 'Message'}
                    placeholderTextColor={Colors.sendIconDisabledBg}
                  />
                  <TouchableOpacity
                    style={[styles.sendButton, {marginRight: isRecording ? -1 : 0}]}
                    onPress={
                      (input.trim() && !isRecording) || searchMode
                        ? submit
                        : isRecording
                        ? stopSpeechToText
                        : startSpeechToText
                    }
                    disabled={!!input.trim() && !isRecording && !canPost}>
                    <AnimatedIcon
                      name={
                        (input.trim() && !isRecording) || searchMode
                          ? 'arrow-up-circle'
                          : isRecording
                          ? 'stop-circle'
                          : 'mic'
                      }
                      size={
                        !(input.trim() && !isRecording) && !isRecording
                          ? 26
                          : 28
                      }
                      color={submitColor.interpolate({
                        inputRange: [0, 1],
                        outputRange: [footerInactive, footerActive],
                      })}
                    />
                  </TouchableOpacity>
                  {/*{isRecording ? (*/}
                  {/*  <TouchableOpacity*/}
                  {/*    style={styles.recordingContainer}*/}
                  {/*    onPress={stopSpeechToText}>*/}
                  {/*    <Icon*/}
                  {/*      name={'stop-circle-outline'}*/}
                  {/*      size={28}*/}
                  {/*      color={'white'}*/}
                  {/*    />*/}
                  {/*    <Text style={styles.recordingText}>*/}
                  {/*      {' Tap to stop recording.'}*/}
                  {/*    </Text>*/}
                  {/*  </TouchableOpacity>*/}
                  {/*) : null}*/}
                </View>
              </TouchableWithoutFeedback>
            </SafeAreaView>
          </BlurView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {showFlipSide ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flex: 1,
            alignSelf: 'stretch',
            backgroundColor: 'black',
            zIndex: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ProfilePic
            message={chatStore.messages[displayedMessageIds[0]]}
            noBorder
            tenX
          />
        </View>
      ) : null}

      {chatStore.optionsMessageIds.map((messageId, i) => {
        return (
          <MessageOptions
            key={messageId}
            zIndexOffset={i + 1}
            messageId={messageId}
            headerHeight={headerHeight - innerHeaderHeight}
            footerHeight={safeAreaFooterHeight - footerHeight}
            completeFooterHeight={safeAreaFooterHeight}
            completeHeaderHeight={headerHeight}
          />
        )
      })}
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
    backgroundColor: darkMode ? 'black' : Colors.chatBg,
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
    zIndex: 500,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 500,
  },
  footerBlur: {
    flex: 1,
    opacity: 0,
  },
  safeArea: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  inputSafeArea: {
    flexDirection: 'column',
  },
  settingsButton: {},
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
    // flex: 1,
    // paddingLeft: 20,
    // paddingRight: 20,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    maxHeight: 73,
    paddingTop: 3,
    paddingBottom: 3,
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    paddingLeft: 0,
    paddingRight: 0,
  },
  clearInputButton: {
    padding: 0,
    paddingLeft: leftMargin + 12,
    paddingRight: 7,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: Colors.inputText,
    backgroundColor: 'transparent',
    paddingTop: 0,
    marginLeft: 0,
    marginRight: 8,
    letterSpacing: Colors.letterSpacing,
    fontSize: Colors.fontSize,
    fontFamily: Colors.fontFamily,
    fontWeight: '300',
  },
  sendButton: {
    padding: 0,
    paddingRight: rightMargin + 5,
    minWidth: 28,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingContainer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue,
    flexDirection: 'row',
  },
  recordingText: {
    color: 'white', // Adjust as needed
  },
})

export default ChatScreen
