//      

                                                                           
                                                                           
                                                           
import MessageInterface from "../schema/Message/MessageInterface.js";
import Responder from "./Responder.js";
import { MessageRole } from "../schema/Message/MessageSchema.mjs";

export default class ChatIteration {
  static iterate(
    windowId        ,
    model             ,
    userPrompt        ,
    onMessageFromAgent                                      ,
    onUpdateMessage                                      ,
    onError                       ,
  ) {
    Promise.resolve().then(async () => {
      try {
        await MessageInterface.insert(windowId, MessageRole.USER, userPrompt, true);

        const allMessages = await MessageInterface.getAll(windowId);

        console.log("allMessages", allMessages);

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
