// @flow

import type { AppendMessageOutput } from "../types/AppendMessageOutput.js";
import type { UpdateMessageOutput } from "../types/UpdateMessageOutput.js";
import type { ModelConfig } from "../types/ModelConfig.js";
import MessageInterface from "../schema/Message/MessageInterface.js";
import Responder from "./Responder.js";

export default class ChatIteration {
  static iterate(
    windowId: number,
    model: ModelConfig,
    userPrompt: string,
    onMessageFromAgent: (output: AppendMessageOutput) => any,
    onUpdateMessage: (output: UpdateMessageOutput) => any,
    onError: (error: Error) => any,
  ) {
    Promise.resolve().then(async () => {
      try {
        const allMessages = await MessageInterface.getAll(windowId);

        const shortTermSummary = ''
        const longTermSummary = ''

        await Responder.beginStreaming(
          windowId,
          model,
          shortTermSummary,
          longTermSummary,
          userPrompt,
          onMessageFromAgent,
          onUpdateMessage,
        );
      } catch (err) {
        console.error(err);
        onError(err);
      }
    })
  }
}
