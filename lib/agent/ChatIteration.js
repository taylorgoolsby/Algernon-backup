//      

                                                                           
                                                                           
                                                           
import MessageInterface from "../schema/Message/MessageInterface.js";
import GeneralResponse from "./GeneralResponse.js";
import { MessageRole } from "../schema/Message/MessageSchema.mjs";
import ShortTermSummarization from "./ShortTermSummarization.js";
import LongTermAnnotation from "./LongTermAnnotation.js";

export default class ChatIteration {
  static iterate(
    windowId        ,
    model             ,
    userPrompt        ,
    onAppendMessage                                      ,
    onUpdateMessage                                      ,
    onError                       ,
  ) {
    Promise.resolve().then(async () => {
      try {
        const userMessage = await MessageInterface.insert(windowId, MessageRole.USER, userPrompt, true);

        onAppendMessage({
          windowId,
          message: userMessage,
        })

        const allMessages = await MessageInterface.getAll(windowId);
        const lastAgentMessage = allMessages[allMessages.length - 2]
        const lastUserMessage = allMessages[allMessages.length - 1]

        // Show a blank message in the UI while waiting:
        const emptyResponse = await MessageInterface.insert(
          windowId,
          MessageRole.ASSISTANT,
          '',
          false
        )
        const output                      = {
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

        LongTermAnnotation.backgroundAnnotate(model, lastUserMessage)
        // const longTermSummary = ''
        const longTermSummary = await LongTermAnnotation.searchAndSummarize(
          model,
          shortTermSummary,
          lastUserMessage,
        )

        const finalResponse = await GeneralResponse.beginStreaming(
          windowId,
          model,
          emptyResponse,
          shortTermSummary,
          longTermSummary,
          lastAgentMessage?.text,
          userPrompt,
          onAppendMessage,
          onUpdateMessage,
        );

        console.log("finalResponse", finalResponse);

        LongTermAnnotation.backgroundAnnotate(model, finalResponse)
      } catch (err) {
        console.error(err);
        onError(err);
      }
    })
  }
}
