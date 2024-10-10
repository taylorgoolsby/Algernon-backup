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
import {leftMargin, rightMargin} from './components/ChatMessage.js'
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
  darkMode
} from '../Colors.js'
import modalStore from '../stores/ModalStore.js'
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
import MessageOptions from './components/MessageOptions.js'
import InvertedChatList from './components/InvertedChatList.js'
import { NativeModules } from 'react-native';
import SpokeSpinner from "./components/SpokeSpinner";
import CustomHeader from "./components/CustomHeader";

const { AudioTranscription } = NativeModules;

const AnimatedIcon = Animated.createAnimatedComponent(Icon)

const ChatScreen: any = observer(({navigation}) => {
  const displayedMessageIds = chatStore.displayedMessageIds
  const [input, setInput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchInputFocused, setSearchInputFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
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

  async function checkAndRequestAudio(): Promise<boolean> {
    let micCheck = await check(PERMISSIONS.IOS.MICROPHONE)
    console.log('micCheck', micCheck)
    if (micCheck !== RESULTS.GRANTED) {
      micCheck = await request(PERMISSIONS.IOS.MICROPHONE)
      console.log('micCheck', micCheck)
    }

    if (micCheck === RESULTS.BLOCKED) {
      modalStore.cta(
        null,
        'Please enable microphone permissions in your system settings.',
        'Open Settings',
        () => {
          openSettings().catch(console.error)
        },
      )
    }

    return micCheck === RESULTS.GRANTED
  }

  const voiceInitialized = useRef(false)
  const [voiceReady, setVoiceReady] = useState(false)
  useEffect(() => {
    if (!voiceInitialized.current) {
      voiceInitialized.current = true
      Promise.resolve().then(async () => {
        setVoiceReady(true)
        AudioTranscription.initialize()
          .then((message) => console.log(message))
          .catch((error) => console.error(error));
      })
    }
  }, [])

  const startSpeechToText = async () => {
    const permissionsGranted = await checkAndRequestAudio()

    if (permissionsGranted && voiceReady) {
      setIsRecording(true)
      AudioTranscription.onData((transcription) => {
        setIsTranscribing(false)

        const cleanTranscription = transcription.replace(/\[BLANK_AUDIO\]/g, '');
        setInput(cleanTranscription)
      })
      AudioTranscription.start()
        .then((message) => console.log(message))
        .catch((error) => console.error(error));
    }
  }

  const stopSpeechToText = async () => {
    if (isRecording) {
      setIsRecording(false)
      setIsTranscribing(true)
      AudioTranscription.stop()
        .then((message) => console.log(message))
        .catch((error) => console.error(error));
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
      chatStore.submitMessage(input)
      setInput('')
    }

    inputRef.current?.blur()
  }

  const inputRef = useRef(null)
  const setInputRef = (ref: any) => {
    inputRef.current = ref
    chatStore.inputRef = ref
  }
  const focusInput = () => {
    inputRef.current.focus()
  }

  const [_headerHeight, setHeaderHeight] = useState(0)
  const [headerHeight] = useDebounce(_headerHeight, 0)
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
    Animated.timing(clearColor, {
      toValue: searchMode || !!input ? 1 : 0,
      duration: 120,
      useNativeDriver: false,
    }).start()
  }, [searchMode, input])

  const submitColor = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(submitColor, {
      toValue: canPost || isRecording || (searchMode && searchInputFocused) ? 1 : 0,
      duration: 120,
      useNativeDriver: false,
    }).start()
  }, [canPost, isRecording, searchMode, searchInputFocused])

  const getClearIconName = () => {
    if (!!input && !searchMode) return 'close-circle';
    return 'search-circle';
  };

  const getClearIconSize = () => {
    if (!!input && !searchMode) return 28;
    return 30;
  };

  const getSubmitIconName = () => {
    if ((input.trim() && !isRecording) || searchMode) return 'arrow-up-circle';
    if (isRecording) return 'stop-circle';
    return 'mic';
  };

  const getSubmitIconSize = () => {
    if (!(input.trim() && !isRecording) && !isRecording) return 24;
    return 28;
  };

  const handleEmptyAreaPress = () => {
    chatStore.closeAllOptions()
    inputRef.current?.blur()
  }

  return (
    <View style={styles.container}>
      <View style={styles.background}></View>

      {displayedMessageIds.length > 0 && headerHeight && footerHeight ? (
        <InvertedChatList
          messageIds={chatStore.displayedMessageIds}
          onEmptyAreaPress={handleEmptyAreaPress}
          headerHeight={headerHeight}
          footerHeight={footerHeight}
          safeAreaFooterHeight={safeAreaFooterHeight}
        />
      ) : null}

      <TouchableWithoutFeedback
        onPress={() => {
          chatStore.deselectOptionsColorTarget()
          chatStore.deselectOptionsTarget()
          inputRef.current?.blur()
        }}>
        <CustomHeader
          title={''}
          onOuterLayout={onLayoutHeader}
          onInnerLayout={onLayoutInnerHeader}
          leftIcon={'monolith'}
          onLeftPress={() => {
            navigation.navigate('Settings')
            inputRef.current?.blur()
          }}
          rightIcon={'sparkles'}
          onRightPress={() => {
            navigation.navigate('MemoryViewer')
            inputRef.current?.blur()
          }}
        />
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
              paddingLeft: leftMargin + 17,
              paddingBottom: 12,
              paddingRight: 30,
            }}
            onPress={() => {
              navigation.navigate('Settings')
              inputRef.current?.blur()
            }}
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
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
                      name={getClearIconName()}
                      size={getClearIconSize()}
                      style={{
                        marginLeft: !!input && !searchMode ? 0 : -1,
                        marginRight: !!input && !searchMode ? 0 : -1
                      }}
                      color={clearColor.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          footerInactive,
                          searchMode ? searchActive : footerActive,
                        ],
                      })}
                    />
                  </TouchableOpacity>
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
                    style={[styles.sendButton, {transform: [{translateX: 0.5}]}]}
                    onPress={
                      (input.trim() && !isRecording) || searchMode
                        ? submit
                        : isRecording
                          ? stopSpeechToText
                          : startSpeechToText
                    }
                    disabled={!!input.trim() && !isRecording && !canPost}>
                    {isTranscribing ? <SpokeSpinner/> : (
                      <AnimatedIcon
                        style={{marginRight: !(input.trim() && !isRecording) && !isRecording ? 2 : 0}}
                        name={getSubmitIconName()}
                        size={getSubmitIconSize()}
                        color={submitColor.interpolate({
                          inputRange: [0, 1],
                          outputRange: [footerInactive, footerActive],
                        })}
                      />
                    )}
                  </TouchableOpacity>
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
    backgroundColor: darkMode ? 'black' : Colors.chatBg,
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
    opacity: 1,
  },
  inputSafeArea: {
    flexDirection: 'column',
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
    paddingRight: 10,
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
})

export default ChatScreen
