//      

                                                                           
                                                                           
                                                           
import MessageInterface from "../schema/Message/MessageInterface.js";
import Responder from "./Responder.js";
import { MessageRole } from "../schema/Message/MessageSchema.mjs";

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

        const shortTermSummary = ''
        const longTermSummary = ''

        await Responder.beginStreaming(
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
