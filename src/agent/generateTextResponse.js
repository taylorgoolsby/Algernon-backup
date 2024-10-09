// @flow

import { NativeEventEmitter, NativeModules } from 'react-native';
import type {ChatCompletionsResponse} from "../types/ChatCompletion";
import type { ModelConfig } from "../types/ModelConfig";

// Get the LLMNativeModule from NativeModules
const { LLMNativeModule } = NativeModules;

// Initialize the event emitter for listening to token generation events
const eventEmitter = new NativeEventEmitter(LLMNativeModule);

// Function to set up event listener for token generation
const setupTokenListener = (callback: (output: string) => void) => {
  // Add a listener for the 'onTokenGenerated' event
  const subscription = eventEmitter.addListener('onTokenGenerated', (event) => {
    const responseSoFar = event.responseSoFar;
    console.log('Tokens generated:', responseSoFar);

    // Here you can update the UI or pass the token to the callback function
    callback(responseSoFar);
  });

  // Return the subscription so it can be removed later if needed
  return subscription;
};

// Function to stream response from on-device generation
async function streamOnDevice(
  input: string,
  callback: (output: ChatCompletionsResponse) => void,
): void {
  console.log("input", input);

  let finishReason = null; // Variable to track if we've hit a stop condition

  // Set up the listener for token generation
  let lastResponse = ''
  const listener = setupTokenListener((response: string) => {
    // Check if we should stop, e.g., after a certain token limit (adjust this as needed)
    if (response.length > 8000) {  // Just an arbitrary condition for demo purposes
      finishReason = 'length';
      return
    }

    const delta = response.slice(lastResponse.length)
    lastResponse = response

    const event = {
      id: 'on-device-response', // Mock ID
      choices: [{
        index: 0,
        delta: {
          content: delta, // The generated text so far
          role: 'assistant', // Assuming this is always from the assistant
        },
        finish_reason: finishReason, // This would be 'stop' or another reason
      }],
      created: Date.now(),
      model: 'llama-3.2-1b', // You can change this to reflect your on-device model name
      usage: {
        completion_tokens: response.length, // Number of tokens in the response
        prompt_tokens: input.length, // Number of tokens in the input prompt
        total_tokens: response.length + input.length, // Total token usage
      },
    };

    callback(event);
  });

  // await is cleared when generation is done
  await LLMNativeModule.generateResponse(input);

  // Clean up listener when the generation is done
  listener.remove();

  const event = {
    id: 'on-device-response', // Mock ID
    choices: [{
      index: 0,
      delta: {
        content: '', // The generated text so far
        role: 'assistant', // Assuming this is always from the assistant
      },
      finish_reason: finishReason || 'stop', // This would be 'stop' or another reason
    }],
    created: Date.now(),
    model: 'llama-3.2-1b', // You can change this to reflect your on-device model name
    usage: {
      completion_tokens: lastResponse.length, // Number of tokens in the response
      prompt_tokens: input.length, // Number of tokens in the input prompt
      total_tokens: lastResponse.length + input.length, // Total token usage
    },
  };

  callback(event);
}

export async function syncTextResponse(
  model: ModelConfig,
  input: string,
): Promise<ChatCompletionsResponse> {
  return new Promise((resolve, reject) => {
    let buffer = ''; // To store the full response

    streamTextResponse(model, input, (output) => {
      const { choices } = output;

      // Accumulate the tokens in buffer
      buffer += choices[0]?.delta?.content || '';

      // Check if the stream has finished
      if (choices[0].finish_reason !== null) {
        // Construct the OpenAI-like API response
        const apiResponse = {
          id: output.id,
          object: 'chat.completion',
          created: output.created || Date.now(),
          model: output.model, // Update to match your on-device model
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: buffer, // Return the accumulated content
              },
              finish_reason: choices[0].finish_reason, // Indicate that the generation has finished
            },
          ],
          usage: {
            prompt_tokens: input.length,
            completion_tokens: buffer.length,
            total_tokens: input.length + buffer.length,
          },
        };

        // Resolve with the OpenAI-like response
        resolve(apiResponse);
      }
    });
  });
}

// This function will handle branching between on-device and cloud streaming in the future
export function streamTextResponse(
  model: ModelConfig,
  input: string,
  callback: (output: ChatCompletionsResponse) => void,
): void {
  // For now, this calls the on-device generation function
  return streamOnDevice(input, callback)
}
