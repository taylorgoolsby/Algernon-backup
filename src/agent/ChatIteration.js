// @flow

import type { AppendMessageOutput } from "../types/AppendMessageOutput.js";
import type { UpdateMessageOutput } from "../types/UpdateMessageOutput.js";
import type { ModelConfig } from "../types/ModelConfig.js";
import MessageInterface from "../schema/Message/MessageInterface.js";
import GeneralResponse from "./GeneralResponse.js";
import { MessageRole } from "../schema/Message/MessageSchema.mjs";
import ShortTermSummarization from "./ShortTermSummarization.js";

export default class ChatIteration {
  static iterate(
    windowId: number,
    model: ModelConfig,
    userPrompt: string,
    onAppendMessage: (output: AppendMessageOutput) => any,
    onUpdateMessage: (output: UpdateMessageOutput) => any,
    onError: (error: Error) => any,
  ) {
    Promise.resolve().then(async () => {
      try {
        const userMessage = await MessageInterface.insert(windowId, MessageRole.USER, userPrompt, true);

        onAppendMessage({
          windowId,
          message: userMessage,
        })

        const allMessages = await MessageInterface.getAll(windowId);

        // const shortTermSummary = ''
        const shortTermSummary = await ShortTermSummarization.performCompletion(
          windowId,
          model,
          allMessages,
        )
        const longTermSummary = ''

        await GeneralResponse.beginStreaming(
          windowId,
          model,
          shortTermSummary,
          longTermSummary,
          userPrompt,
          onAppendMessage,
          onUpdateMessage,
        );
      } catch (err) {
        console.error(err);
        onError(err);
      }
    })
  }
}
