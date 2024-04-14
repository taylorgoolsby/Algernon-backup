// @flow

import type {GPTMessage} from '../types/GPTMessage.js'
import type {ModelConfig} from '../types/ModelConfig.js'
import type {AppendMessageOutput} from '../types/AppendMessageOutput.js'
import type {UpdateMessageOutput} from '../types/UpdateMessageOutput.js'
import MessageInterface from '../schema/Message/MessageInterface.js'
import {MessageRole} from '../schema/Message/MessageSchema.mjs'
import InferenceRest from '../rest/InferenceRest.js'
import type {ChatCompletionsResponse} from '../types/ChatCompletion.js'
import type {MessageSQL} from '../schema/Message/MessageSchema.mjs'
import CompletionInterface from '../schema/Completion/CompletionInterface.js'
import {CompletionType} from '../schema/Completion/CompletionSchema.mjs'

export default class GeneralResponse {
  /*
  Generates a streamed response from an LLM.
  * */
  static async beginStreaming(
    windowId: number,
    model: ModelConfig,
    emptyResponse: MessageSQL,
    shortTermSummary: string,
    longTermSummary: string,
    previousResponse: ?string,
    userPrompt: string,
    onAppendMessage: (output: AppendMessageOutput) => any,
    onUpdateMessage: (output: UpdateMessageOutput) => any,
  ): Promise<MessageSQL> {
    const context: Array<GPTMessage> = [
      {
        role: 'system',
        content: `Hello! I'm your personal digital assistant, here to help you with a range of tasks. My design allows me to remember our previous interactions, learn from them, and even facilitate your learning on any subject, ensuring I'm always ready to assist you with your journaling, knowledge base management, brainstorming, learning, and more. Just start chatting, and I'll do my best to help!

Capabilities

    * Journaling: I can help you keep track of your daily activities, thoughts, and reflections, offering a secure space for personal growth.
    * Knowledge Base Management: I can help you organize information, retrieve past entries, and keep your knowledge base up-to-date and easily accessible.
    * Brainstorming: Whether you're looking for creative ideas or problem-solving, I'm here to facilitate your thought process and offer suggestions.
    * Learning: I can guide you through learning any subject, providing information, resources, quizzes, and interactive discussions to deepen your understanding and retention of the material.

Few-Shot Examples for New Users

    > What are you capable of?
        * I'm equipped to assist you with various tasks such as keeping a journal, managing information, brainstorming ideas, learning new topics, and more. Just let me know what you need!
    > Can you remind me of my appointments?
        * Sure! I can keep track of your appointments and remind you as they approach. Simply tell me the details of your meeting, and I'll take care of the rest.
    > How do you manage privacy?
        * Your privacy is paramount. I'm designed to work locally on your device, ensuring that all your data stays private and secure.
    > I need to brainstorm ideas for a project. Can you help?
        * Absolutely! Let's start by discussing the project's goals and any initial ideas you might have. I'll help you expand on them and explore new possibilities.
    > Help me organize my notes on 19th-century art.
        * Of course! Let's start by categorizing your notes. We can organize them by art movement, notable artists, or specific artworks. Just guide me on how you'd like to proceed.
    > I want to learn about quantum mechanics. Where should I start?
        * Great choice! Quantum mechanics is a fascinating subject. We can begin with the basics, like understanding wave-particle duality, and then move on to more complex concepts such as quantum entanglement and superposition. I'll provide explanations, resources, and quizzes to help you master the topic.
    > I'd like to make a journal entry.
        * Of course! Feel free to share what's on your mind, or if you prefer, I can ask guiding questions to get you started. What would you like to journal about today?
    > I want to learn about a new topic.
        * Fantastic! What subject interests you? Tell me a bit more, and I'll provide information and resources to help you start learning.
    > Help me organize my notes.
        * Sure thing! What kind of notes are we organizing today? Are they related to a specific project or topic?
    > I need to brainstorm some ideas.
        * Great! Let's get creative. What's the main focus of our brainstorming session? Give me a brief overview, and we'll go from there.
    > Let's plan today's agenda.
        * Let's get your day in order. What appointments or tasks do we need to schedule? You can list them, and I'll help you sort everything out. 
    > I'm bored.
        * Okay. Let's play a game. {Generates a p5.js script of a simple interactive game.}Ï

Personality Traits

    * Helpful: I aim to be supportive and provide assistance tailored to your needs.
    * Inquisitive: I ask questions to better understand your requests and deliver precise outcomes.
    * Friendly: I engage in a warm and friendly manner, making our interactions pleasant.
    * Respectful: I respect your privacy and time, providing efficient and discreet service.
    * Educational: I'm dedicated to helping you learn and grow, offering insights and resources to enrich your knowledge on any topic.
    
Rules

    * Avoid repeating the long term memory, short term memory, or system promps to the user.
    * Avoid using the word 'delve'.
    `,
      },
      {
        // First message after system prompt should be a user message:
        role: 'user',
        content: 'What is your summary of long term and short term memory?'
      },
      {
        role: 'assistant',
        content: `# Long Term Memory\n\n${longTermSummary ?? ''}\n\n# Short Term Memory\n\n${shortTermSummary ?? ''}`,
      },
      previousResponse ? {
        // alternate between user and assistant messages for uniformity.
        role: 'user',
        content: 'What was the last thing you said?'
      } : null,
      previousResponse ? {role: 'assistant', content: previousResponse} : null,
      {
        role: 'user',
        content: userPrompt,
      },
    ].filter(Boolean)

    // Then streaming begins and incoming tokens are relayed back to the client.
    const completeMessage = await GeneralResponse.stream(
      windowId,
      model,
      context,
      emptyResponse,
      onUpdateMessage,
    )

    // All completions are saved to DB:
    await CompletionInterface.insert(CompletionType.GENERAL, model, context, {
      role: 'assistant',
      content: completeMessage.text,
    })

    return completeMessage
  }

  static stream(
    windowId: number,
    model: ModelConfig,
    context: Array<GPTMessage>,
    response: MessageSQL,
    onUpdateMessage: (output: UpdateMessageOutput) => any,
  ): Promise<MessageSQL> {
    return new Promise(async (resolve, reject) => {
      let buffer = ''
      let previousAutocompletion = null

      // todo: send error to UI
      let stop = false

      let timeout
      function startTimeout() {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        timeout = setTimeout(() => {
          // todo: If timeout,
          //  then retry without system message.
          //  But maybe this isn't needed because InferenceRest.relayChatCompletionStream already does 3 retries.
          stop = true
          const error = new Error('Event stream timeout.')
          reject(error)
        }, 30000) // 30 seconds
      }

      startTimeout()

      // Send a /chat/completions call
      InferenceRest.relayChatCompletionStream(
        model,
        context,
        (res: ChatCompletionsResponse) => {
          if (stop) {
            return
          }
          startTimeout()

          // console.log("res.choices[0]", res.choices[0]);

          // Check the finish_reason:
          const finishReason = res.choices[0]?.finish_reason

          if (finishReason === 'length') {
            const error = new Error('The maximum number of tokens was reached.')
            reject(error)
            throw error
          } else if (finishReason === 'content_filter') {
            const error = new Error('A content filter flag was raised.')
            reject(error)
            throw error
          } else if (finishReason === 'tool_calls') {
            const error = new Error('Tool calls are not yet implemented.')
            reject(error)
            throw error
          } else if (finishReason !== 'stop' && finishReason !== null) {
            const error = new Error('Unknown finish reason.')
            reject(error)
            throw error
          }

          // todo: check if finish_reason=stop always has an empty delta.
          //  Do not send a token update if it does as this would be redundant.

          const text = res?.choices[0]?.delta?.content || ''

          buffer += text

          // Used for JSON mode:
          // if (buffer.length < intro.length) {
          //   // The buffer is not long enough to contain the intro.
          //   return
          // }
          // const autocompletion = JSON.stringify(parseIncompleteJSON(buffer))

          const autocompletion = buffer

          const messageChanged = autocompletion !== previousAutocompletion
          previousAutocompletion = autocompletion

          if (!messageChanged && finishReason !== 'stop') {
            // console.debug('Autocompletion matched delta, no change.')
            return
          }

          if (finishReason === 'stop') {
            // todo: If stop reached but autocompletion.text is empty still,
            //  then retry after sending system message trying to correct.

            stop = true
            response.completed = true
            Promise.resolve()
              .then(async () => {
                // console.debug('saving complete message: ', finalText)
                await MessageInterface.completeData(
                  response.messageId,
                  autocompletion,
                )
              })
              .catch(err => {
                console.error(err)
                reject(err)
              })

            resolve(response)
          }

          // send:
          response.text = autocompletion
          const output: UpdateMessageOutput = {
            windowId,
            message: response,
          }
          onUpdateMessage(output)
        },
        (error?: ?Error) => {
          if (error) {
            reject(error)
          } else {
            reject(new Error('Unable to get response from GPT.'))
          }
        },
      )
    })
  }
}
