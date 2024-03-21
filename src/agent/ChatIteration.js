// @flow

import type { AppendMessageOutput } from "../types/AppendMessageOutput.js";
import type { UpdateMessageOutput } from "../types/UpdateMessageOutput.js";
import type { ModelConfig } from "../types/ModelConfig.js";
import MessageInterface from "../schema/Message/MessageInterface.js";
import GeneralResponse from "./GeneralResponse.js";
import { MessageRole } from "../schema/Message/MessageSchema.mjs";
import ShortTermSummarization from "./ShortTermSummarization.js";
import LongTermAnnotation from "./LongTermAnnotation.js";

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
        const lastMessage = allMessages[allMessages.length - 1]

        // Show a blank message in the UI while waiting:
        const emptyResponse = await MessageInterface.insert(
          windowId,
          MessageRole.ASSISTANT,
          '',
          false
        )
        const output: AppendMessageOutput = {
          windowId,
          message: emptyResponse,
        }
        onAppendMessage(output)

        // const shortTermSummary = ''
        const shortTermSummary = await ShortTermSummarization.performCompletion(
          windowId,
          model,
          allMessages,
        )

        LongTermAnnotation.backgroundAnnotate(model, lastMessage)
        // const longTermSummary = ''
        const longTermSummary = await LongTermAnnotation.searchAndSummarize(
          model,
          shortTermSummary,
          lastMessage,
        )

        await GeneralResponse.beginStreaming(
          windowId,
          model,
          emptyResponse,
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
