//      

                                                                           
                                                                           
                                                           
import MessageInterface from "../schema/Message/MessageInterface.js";
import Responder from "./Responder.js";

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
