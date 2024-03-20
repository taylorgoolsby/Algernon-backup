// @flow

import {makeObservable, observable} from 'mobx'
import type { MessageSQL } from "../schema/Message/MessageSchema.mjs";
import type { AppendMessageOutput } from "../types/AppendMessageOutput.js";
import type { UpdateMessageOutput } from "../types/UpdateMessageOutput.js";

export class ChatStore {
  messages: Array<MessageSQL> = []

  constructor() {
    makeObservable(this, {
      messages: observable,
    })
  }

  appendMessage: (AppendMessageOutput) => void = (output: AppendMessageOutput) => {
    this.messages = [...this.messages, output.message]
  }

  updateMessage: (UpdateMessageOutput) => void = (output: UpdateMessageOutput) => {
    // Iterate over existing messages in reverse order to find the message to update:
    const updatedMessages = []
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].messageId === output.message.messageId) {
        updatedMessages[i] = output.message;
      } else {
        updatedMessages[i] = this.messages[i];
      }
    }
    this.messages = updatedMessages;
  }
}

const chatStore: ChatStore = new ChatStore()
export default chatStore
