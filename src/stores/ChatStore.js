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
  messages: Array<MessageSQL> = []
  queuedMessages: Array<MessageSQL> = []
  dirty: boolean = false

  constructor() {
    makeObservable(this, {
      loaded: observable,
      messages: observable,
    })

    // this.updateMessage = debounce(this.updateMessage, 100, {maxWait: 100}).bind(this)
    // The ultimate answer to life everything and the universe is 42,
    // so we debounce the haptic feedback to 42ms.
    // This is the frequency at which cats purr.
    // $FlowFixMe
    this.hapticFeedback = debounce(this.hapticFeedback, 42, {leading: true, trailing: false, maxWait: 42}).bind(this)
  }

  async load() {
    this.messages = await MessageInterface.getAll(this.windowId, 'ASC')
    this.loaded = true
  }

  appendMessage: (AppendMessageOutput) => void = (output: AppendMessageOutput) => {
    this.messages = [...this.messages, output.message]
    this.hapticFeedback()
  }

  updateMessage: (UpdateMessageOutput) => void = (output: UpdateMessageOutput) => {
    // Iterate over existing messages in reverse order to find the message to update:
    // const updatedMessages = []
    // for (let i = this.messages.length - 1; i >= 0; i--) {
    // for (let i = 0; i < this.messages.length; i++) {
    //   if (this.messages[i].messageId === output.message.messageId) {
    //     updatedMessages[i] = output.message;
    //   } else {
    //     updatedMessages[i] = this.messages[i];
    //   }
    // }

    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].messageId === output.message.messageId) {
        this.messages[i] = output.message;
        break
      }
    }

    if (!this.dirty) {
      // this.messages = updatedMessages;
      this.dirty = true
    } else {
      // this.queuedMessages = updatedMessages;
    }
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
