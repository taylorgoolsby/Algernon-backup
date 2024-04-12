// @flow

import {makeObservable, observable} from 'mobx'
import type { MessageSQL } from "../schema/Message/MessageSchema.mjs";
import type { AppendMessageOutput } from "../types/AppendMessageOutput.js";
import type { UpdateMessageOutput } from "../types/UpdateMessageOutput.js";
import MessageInterface from "../schema/Message/MessageInterface.js";
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import debounce from 'lodash.debounce'

export class ChatStore {
  loaded: boolean = false
  windowId: number = 0
  messages: {[messageId: string]: MessageSQL} = {}
  displayedMessageIds: Array<string> = []
  queuedMessages: Array<MessageSQL> = []
  dirty: boolean = false

  searchResults: Array<MessageSQL> = []

  constructor() {
    makeObservable(this, {
      loaded: observable,
      messages: observable,
      displayedMessageIds: observable,
      dirty: observable,
    })

    // Wait 2 frames before updating the screen.
    // This allows other events to be handled while a message is updating.
    this.updateMessage = debounce(this.updateMessage, 16).bind(this)
    // The ultimate answer to life everything and the universe is 42,
    // so we debounce the haptic feedback to 42ms.
    // This is the frequency at which cats purr.
    // $FlowFixMe
    this.hapticFeedback = debounce(this.hapticFeedback, 42, {leading: true, trailing: false, maxWait: 42}).bind(this)
  }

  async load() {
    const messages = await MessageInterface.getAll(this.windowId, 'ASC')
    this.displayedMessageIds = messages.map(message => message.messageId.toString())
    this.messages = {}
    for (const message of messages) {
      // $FlowFixMe
      this.messages[message.messageId.toString()] = message
    }
    this.loaded = true
  }

  appendMessage: (AppendMessageOutput) => void = (output: AppendMessageOutput) => {
    console.log("output", output);
    this.displayedMessageIds = [...this.displayedMessageIds, output.message.messageId.toString()]
    this.messages[output.message.messageId.toString()] = output.message
    this.hapticFeedback()
  }

  updateMessage: (UpdateMessageOutput) => void = (output: UpdateMessageOutput) => {
    this.messages[output.message.messageId.toString()] = output.message

    if (!this.dirty) {
      // this.messages = updatedMessages;
      // this.dirty = true
    } else {
      // this.queuedMessages = updatedMessages;
    }
    setTimeout(() => {
      this.hapticFeedback()
    }, 0)

  }

  onRenderDone() {
    // if (this.dirty && this.queuedMessages.length) {
    if (this.dirty) {
      // this.messages = this.queuedMessages
      // this.queuedMessages = []
      this.dirty = false
      this.hapticFeedback()
    }
  }

  hapticFeedback() {
    ReactNativeHapticFeedback.trigger("soft", {
      enableVibrateFallback: false,
    });
  }
}

const chatStore: ChatStore = new ChatStore()
export default chatStore
