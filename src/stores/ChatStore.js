// @flow

import {makeObservable, observable, action} from 'mobx'
import type { MessageSQL } from "../schema/Message/MessageSchema.mjs";
import type { AppendMessageOutput } from "../types/AppendMessageOutput.js";
import type { UpdateMessageOutput } from "../types/UpdateMessageOutput.js";
import MessageInterface from "../schema/Message/MessageInterface.js";
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import debounce from 'lodash.debounce'

const INITIAL_LIMIT = 12
let limit = INITIAL_LIMIT

/*

How pagination works:

1. The app is loaded with the last messages. This is done by figuring out the offset and limit that will include the last message.
2. When the user scrolls up, the offset is decremented and a new query is performed.
3. If the offset is less than 0, this means the earliest message is being obtained. There is nothing left to paginate to.

For new messages which are added after the app has loaded, we don't have to paginate to these.
These are added to the database and the displayedMessageIds independently, but they are mirror operations.
Only backwards pagination needs to be handled.

* */

export class ChatStore {
  loaded: boolean = false
  windowId: number = 0
  offset: number = 0
  completedOffsets: {[string]: boolean} = {}
  messages: {[messageId: string]: MessageSQL} = {}
  displayedMessageIds: Array<string> = []

  inputRef: ?HTMLInputElement = null

  // All items in optionsMessageIds hover, but only the optionsTarget has the options menu.
  optionsMessageIds: Array<number> = []
  optionsMessageIdFadeOuts: {[string]: boolean} = {}
  optionsMeasures: {[string]: {x: number, y: number, width: number, height: number}} = {}
  optionsTarget: ?number = null // The messageId to show the options for.
  optionsPannings: {[string]: number} = {} // The y-offset of a hovering option.

  constructor() {
    makeObservable(this, {
      loaded: observable,
      messages: observable,
      displayedMessageIds: observable,
      optionsMessageIds: observable,
      optionsMeasures: observable,
      optionsMessageIdFadeOuts: observable,
      optionsTarget: observable,
      optionsPannings: observable,
      openOptions: action.bound,
      closeOptions: action.bound,
      closeAllOptions: action.bound,
      startOptionFadeOut: action.bound,
      onOptionFadeOut: action.bound,
      setOptionsTarget: action.bound,
      deselectOptionsTarget: action.bound,
    })

    this.fetchEarlierMessages = debounce(this.fetchEarlierMessages, 250, {leading: true, trailing: false}).bind(this)

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
    limit = INITIAL_LIMIT
    const lastMessage = await MessageInterface.getLast(this.windowId)
    if (!lastMessage) return
    this.offset = lastMessage.messageId // this offset will return nothing.
    this.offset -= limit // now the return from this offset will include the last message.
    if (this.offset < 0) {
      limit = limit + this.offset
      this.offset = 0
    }

    this.completedOffsets = {}
    // $FlowFixMe
    this.completedOffsets[this.offset.toString()] = true

    const messages = await MessageInterface.getOffsetLimit(this.windowId, this.offset, limit)
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
    setTimeout(() => {
      this.hapticFeedback()
    }, 0)
  }

  hapticFeedback() {
    ReactNativeHapticFeedback.trigger("soft", {
      enableVibrateFallback: false,
    });
  }

  fetchEarlierMessages: () => Promise<void> = async (): Promise<void> => {
    this.offset -= limit
    if (this.offset < 0) {
      limit = limit + this.offset
      this.offset = 0
    }

    if (this.completedOffsets[this.offset.toString()]) {
      return
    }
    this.completedOffsets[this.offset.toString()] = true

    const messages = await MessageInterface.getOffsetLimit(this.windowId, this.offset, limit)
    this.displayedMessageIds = [...messages.map(message => message.messageId.toString()), ...this.displayedMessageIds]
    for (const message of messages) {
      // $FlowFixMe
      this.messages[message.messageId.toString()] = message
    }
  }

  // await chatStore.deleteMessage(message.messageId)
  deleteMessage: (number) => Promise<void> = async (messageId: number): Promise<void> => {
    // todo: delete annotations from faiss
    await MessageInterface.softDelete(messageId)
    const message = await MessageInterface.get(this.windowId, messageId)
    // $FlowFixMe
    this.messages[messageId.toString()] = message
  }


  openOptions: (number, number, number, number, number) => void = (messageId: number, x: number, y: number, width: number, height: number) => {
    this.optionsMessageIds.push(messageId)
    this.optionsMeasures[messageId.toString()] = {x, y, width, height}
    delete this.optionsMessageIdFadeOuts[messageId.toString()]
    this.setOptionsTarget(messageId)
  }

  closeOptions: (number) => void = (messageId: number) => {
    this.startOptionFadeOut(messageId)
  }

  closeAllOptions: () => void = () => {
    for (const messageId of this.optionsMessageIds) {
      this.startOptionFadeOut(messageId)
    }
  }

  startOptionFadeOut: (string | number) => void = (messageId: string | number) => {
    // The option remains in this.optionMessageIds in order to preserve order.
    this.optionsMessageIdFadeOuts[messageId.toString()] = true
  }

  onOptionFadeOut: (number) => void = (messageId: number) => {
    this.optionsMessageIds = this.optionsMessageIds.filter(id => id !== messageId)
    delete this.optionsMeasures[messageId.toString()]
    delete this.optionsMessageIdFadeOuts[messageId.toString()]
  }

  setOptionsTarget: (number) => void = (messageId: number) => {
    this.optionsTarget = messageId
  }

  deselectOptionsTarget: () => void = () => {
    this.optionsTarget = null
  }
}

const chatStore: ChatStore = new ChatStore()
export default chatStore
