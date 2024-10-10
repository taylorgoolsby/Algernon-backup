// @flow

import type { AppendMessageOutput } from "../types/AppendMessageOutput.js";
import type { UpdateMessageOutput } from "../types/UpdateMessageOutput.js";
import type { ModelConfig } from "../types/ModelConfig.js";
import MessageInterface from "../schema/Message/MessageInterface.js";
import GeneralResponse from "./GeneralResponse.js";
import { MessageRole } from "../schema/Message/MessageSchema.mjs";
import ShortTermSummarization from "./ShortTermSummarization.js";
import LongTermAnnotation from "./LongTermAnnotation.js";
import Browser from "./Browser";
import type { MessageSQL } from "../schema/Message/MessageSchema.mjs";

export default class ChatIteration {
  static iterationQueue: Array<() => void> = [];
  static isIterationRunning: boolean = false;

  static async queueIteration(
    windowId: number,
    model: ModelConfig,
    userPrompt: string,
    onAppendMessage: (output: AppendMessageOutput) => any,
    onUpdateMessage: (output: UpdateMessageOutput) => any,
    onError: (error: Error) => any,
  ) {
    try {
      // Render message on screen immediately with empty response:
      const userMessage = await MessageInterface.insert(windowId, MessageRole.USER, userPrompt, null, true);
      onAppendMessage({
        windowId,
        message: userMessage,
      })
      const emptyResponse = await MessageInterface.insert(
        windowId,
        MessageRole.ASSISTANT,
        '',
        userMessage.messageId,
        false
      )
      const output: AppendMessageOutput = {
        windowId,
        message: emptyResponse,
      }
      onAppendMessage(output)

      // Create an iteration task (a function) that runs `iterate`
      const iterationTask = () => {
        ChatIteration.iterate(windowId, model, userPrompt, onAppendMessage, onUpdateMessage, onError, userMessage, emptyResponse);
      };

      // Check if an iteration is currently running
      if (!this.isIterationRunning) {
        // If no iteration is running, execute the task immediately
        this.isIterationRunning = true;
        iterationTask();
      } else {
        // If an iteration is already running, queue this task
        this.iterationQueue.push(iterationTask);
      }

    } catch (error) {
      onError(error);
    }
  }

  static runNextIteration() {
    // Mark the current iteration as done
    this.isIterationRunning = false;

    // If there are more iterations queued, dequeue and run the next one
    if (this.iterationQueue.length > 0) {
      const nextTask = this.iterationQueue.shift();
      if (nextTask) {
        this.isIterationRunning = true;
        nextTask();
      }
    }
  }

  static iterate(
    windowId: number,
    model: ModelConfig,
    userPrompt: string,
    onAppendMessage: (output: AppendMessageOutput) => any,
    onUpdateMessage: (output: UpdateMessageOutput) => any,
    onError: (error: Error) => any,
    userMessage: MessageSQL,
    emptyResponse: MessageSQL,
  ) {
    Promise.resolve().then(async () => {
      try {
        // const userMessage = await MessageInterface.insert(windowId, MessageRole.USER, userPrompt, null, true);
        //
        // onAppendMessage({
        //   windowId,
        //   message: userMessage,
        // })

        const allMessages = await MessageInterface.getAll(windowId);
        const lastAgentMessage = allMessages[allMessages.length - 2]
        const lastUserMessage = allMessages[allMessages.length - 1]

        // Show a blank message in the UI while waiting:
        // const emptyResponse = await MessageInterface.insert(
        //   windowId,
        //   MessageRole.ASSISTANT,
        //   '',
        //   userMessage.messageId,
        //   false
        // )
        // const output: AppendMessageOutput = {
        //   windowId,
        //   message: emptyResponse,
        // }
        // onAppendMessage(output)

        // const searchSummary: string = (await Browser.checkAndSearch(model, lastUserMessage)) ?? ''
        const searchSummary: string = ''

        const shortTermSummary = ''
        // const shortTermSummary = await ShortTermSummarization.performCompletion(
        //   windowId,
        //   model,
        //   allMessages,
        // )

        // LongTermAnnotation.backgroundAnnotate(model, lastUserMessage)
        // const longTermSummary = ''
        // const longTermSummary = await LongTermAnnotation.searchAndSummarize(
        //   model,
        //   shortTermSummary,
        //   lastUserMessage,
        // )
        const longTermSummary = ''

        const finalResponse = await GeneralResponse.beginStreaming(
          windowId,
          model,
          emptyResponse,
          shortTermSummary,
          longTermSummary,
          searchSummary,
          allMessages,
          userPrompt,
          onAppendMessage,
          onUpdateMessage,
        );

        // LongTermAnnotation.backgroundAnnotate(model, finalResponse)
      } catch (err) {
        console.error(err);
        onError(err);
      }
      this.runNextIteration();
    })
  }
}
