// @flow

import {makeObservable, observable, action} from 'mobx'
import type { MessageSQL } from "../schema/Message/MessageSchema.mjs";
import type { AppendMessageOutput } from "../types/AppendMessageOutput.js";
import type { UpdateMessageOutput } from "../types/UpdateMessageOutput.js";
import MessageInterface from "../schema/Message/MessageInterface.js";
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import debounce from 'lodash.debounce'
import Colors from "../Colors.js";

const INITIAL_LIMIT = 12
let limit = INITIAL_LIMIT

type Orb = {
  xPos: number,
  yPos: number,
  xVel: number,
  yVel: number,
  color: string,
}

type OrbSim = {
  time: number,
  points: Array<Orb>
}

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

  orbSims: {[messageId: string]: OrbSim} = {}

  // All items in optionsMessageIds hover, but only the optionsTarget has the options menu.
  optionsMessageIds: Array<number> = []
  optionsMessageIdFadeOuts: {[string]: boolean} = {}
  optionsMeasures: {[string]: {x: number, y: number, width: number, height: number}} = {}
  optionsTarget: ?number = null // The messageId to show the options for.
  optionsPannings: {[string]: number} = {} // The y-offset of a hovering option.
  optionsColorTarget: ?number = null // This message has a highlighted color.
  optionsDocked: {[string]: 'footer' | 'header'} = {} // Whether an option is docked to the footer.

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
      optionsColorTarget: observable,
      optionsDocked: observable,
      openOptions: action.bound,
      closeOptions: action.bound,
      closeAllOptions: action.bound,
      startOptionFadeOut: action.bound,
      onOptionFadeOut: action.bound,
      setOptionsTarget: action.bound,
      deselectOptionsTarget: action.bound,
      setOptionsColorTarget: action.bound,
      deselectOptionsColorTarget: action.bound,
      dockOption: action.bound,
      unDockOption: action.bound,
      putOptionBehind: action.bound,
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

  getOrCreateOrbSim: (number, ?boolean) => OrbSim = (messageId: number, tenX?: ?boolean): OrbSim => {
    if (!this.orbSims[messageId.toString()]) {
      const t = tenX ? 10 : 1

      const r = 7 * t
      const v = 5 * t
      const m = Math.random()
      const phase = Math.random() * 2 * Math.PI

      this.orbSims[messageId.toString()] = {
        time: Date.now(),
        points: [
          {
            xPos: 0,
            yPos: 0,
            xVel: 0,
            yVel: 0,
            color: Colors.blue
          },
          {
            xPos: r * Math.sin(Math.PI),
            yPos: r * Math.cos(Math.PI),
            xVel: v * Math.cos(Math.PI + phase),
            yVel: -v * Math.sin(Math.PI + phase),
            color: 'rgba(255, 186, 0, 0.9)'
          },
          {
            xPos: 0.5 * r * Math.sin(m * 2 * Math.PI),
            yPos: 0.5 * r * Math.cos(m * 2 * Math.PI),
            xVel: (Math.random() - 0.5) * 2 * v,
            yVel: (Math.random() - 0.5) * 2 * v,
            color: 'rgb(215, 29, 29)'
          },
          {
            xPos: r * Math.sin(2 * Math.PI),
            yPos: r * Math.cos(2 * Math.PI),
            xVel: v * Math.cos(2 * Math.PI + phase),
            yVel: -v * Math.sin(2 * Math.PI + phase),
            color: Colors.teal
          },
          {
            xPos: 0,
            yPos: 0,
            xVel: 0,
            yVel: 0,
            color: Colors.blue
          },
        ]}
    }
    return this.orbSims[messageId.toString()]
  }

  updateOrbSim: (number, number) => void = (messageId: number, time: number) => {
    const sim = this.getOrCreateOrbSim(messageId)

    // Implement a simple spring force simulation on the dots:
    // 1. Calculate the force on each dot
    // 2. Update the velocity of each dot
    // 3. Update the position of each dot
    // 4. Repeat
    const k = 0.1
    const dt = (Math.min(time - sim.time, 1000) * 0.001) / 2
    // const dt = 0
    sim.time = time
    const n = sim.points.length

    for (let i = 0; i < n; i++) {
      if (i === 0) {
        // first point is fixed.
        continue
      }
      for (let j = 0; j < n; j++) {
        if (i === j) {
          continue
        }
        const dx = sim.points[j].xPos - sim.points[i].xPos
        const dy = sim.points[j].yPos - sim.points[i].yPos
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 0.005) {
          continue
        }
        const f = k * d
        const fx = (f * dx) / d
        const fy = (f * dy) / d
        sim.points[i].xVel += fx * dt
        sim.points[i].yVel += fy * dt
        sim.points[i].xPos += sim.points[i].xVel * dt
        sim.points[i].yPos += sim.points[i].yVel * dt

        if (isNaN(sim.points[i].xVel)) {
          sim.points[i].xVel = 0
        }
        if (isNaN(sim.points[i].yVel)) {
          sim.points[i].yVel = 0
        }
        if (isNaN(sim.points[i].xPos)) {
          sim.points[i].xPos = 0
        }
        if (isNaN(sim.points[i].yPos)) {
          sim.points[i].yPos = 0
        }
      }
    }
  }

  openOptions: (number, number, number, number, number) => void = (messageId: number, x: number, y: number, width: number, height: number) => {
    this.optionsMessageIds.push(messageId)
    this.optionsMeasures[messageId.toString()] = {x, y, width, height}
    delete this.optionsMessageIdFadeOuts[messageId.toString()]
    this.setOptionsTarget(messageId)
    this.setOptionsColorTarget(messageId)
  }

  closeOptions: (number) => void = (messageId: number) => {
    this.startOptionFadeOut(messageId)
    chatStore.deselectOptionsTarget()
    chatStore.deselectOptionsColorTarget()
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

  setOptionsColorTarget: (number) => void = (messageId: number) => {
    this.optionsColorTarget = messageId

    // Put this option behind the last docked item of the same kind.
    let lastDockedMessageId = null
    for (let i = 0; i < this.optionsMessageIds.length; i++) {
      const id = this.optionsMessageIds[i]
      if (id === messageId) {
        break
      }
      if (this.optionsDocked[id.toString()] === 'footer' && this.messages[id.toString()].role === this.messages[messageId.toString()].role) {
        lastDockedMessageId = id
      }
    }
    if (lastDockedMessageId?.toString()) {
      // $FlowFixMe
      this.putOptionBehind(messageId, lastDockedMessageId)
    }
  }

  deselectOptionsColorTarget: () => void = () => {
    this.optionsColorTarget = null
  }

  dockOption: (number, 'footer' | 'header') => void = (messageId: number, type: 'footer' | 'header') => {
    // $FlowFixMe
    this.optionsDocked = {...this.optionsDocked, [messageId.toString()]: type}
  }

  unDockOption: (number) => void = (messageId: number) => {
    const next = {...this.optionsDocked}
    delete next[messageId.toString()]
    this.optionsDocked = next
  }

  // moves an option to be directly below another option.
  putOptionBehind: (number, number) => void = (messageId: number, topMessageId: number) => {
    this.optionsMessageIds = this.optionsMessageIds.filter(id => id !== messageId)
    const index = this.optionsMessageIds.indexOf(topMessageId)
    this.optionsMessageIds.splice(index + 1, 0, messageId)
  }

  // sends an option all the way to the back.
  bringOptionToBack: (number) => void = (messageId: number) => {
    this.optionsMessageIds = this.optionsMessageIds.filter(id => id !== messageId)
    this.optionsMessageIds.push(messageId)
  }
}

const chatStore: ChatStore = new ChatStore()
export default chatStore
