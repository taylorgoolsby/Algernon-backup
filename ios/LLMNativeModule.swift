// LLMNativeModule.swift

import Foundation
import MLX
import MLXRandom

@objc(LLMNativeModule)
class LLMNativeModule: NSObject, RCTBridgeModule {
    // This is required by the RCTBridgeModule protocol
    static func moduleName() -> String! {
        return "LLMNativeModule"
    }

    // This optional method allows the module to be initialized without requiring the bridge
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
  
    @objc(generateResponse:resolver:rejecter:)
    func generateResponse(fromText text: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {

        // In debug build, immediately resolve with a debug message
        resolve("MLX is not available in debug mode")
        
        // Use a Task to bridge async/await with the promise-based callback
//        Task {
//            do {
//                let response = try await runModelAsync(fromText: text)
//                resolve(response)
//            } catch {
//                reject("ModelError", "Failed to generate response: \(error.localizedDescription)", error)
//            }
//        }
        
    }
  
    let modelConfiguration = ModelConfiguration.phi4bit
    let temperature: Float = 0.6
    let maxTokens = 100
  
    @MainActor
    var running = false
    var output = ""
      
    // Example async function
    func runModelAsync(fromText prompt: String) async throws -> String {
        print("runModelAsync")
        do {
            let (model, tokenizer) = try await loadModel()

            await MainActor.run {
                running = true
                self.output = ""
            }

            // augment the prompt as needed
            let prompt = modelConfiguration.prepare(prompt: prompt)
            let promptTokens = MLXArray(tokenizer.encode(text: prompt))
            print("Prompt: \(prompt)")

            // each time you generate you will get something new
            MLXRandom.seed(UInt64(Date.timeIntervalSinceReferenceDate * 1000))

            var outputTokens = [Int]()

            for token in TokenIterator(prompt: promptTokens, model: model, temp: temperature) {
                let tokenId = token.item(Int.self)

                if tokenId == tokenizer.unknownTokenId {
                    print("Break unknown token")
                    break
                }
              
                if tokenId == tokenizer.eosTokenId {
                    print("Break eos token")
                    break
                }

                outputTokens.append(tokenId)
                let text = tokenizer.decode(tokens: outputTokens)
              
                print("Generating \(text)")

                // update the output -- this will make the view show the text as it generates
                await MainActor.run {
                    self.output = text
                }

                if outputTokens.count == maxTokens {
                    print("Break maxTokens")
                    break
                }
            }

            await MainActor.run {
                running = false
            }
        } catch {
            await MainActor.run {
                running = false
                output = "Failed: \(error)"
            }
        }
      return self.output
    }
  
    enum LoadState {
        case idle
        case loaded(LLMModel, Tokenizer)
    }
  
    var loadState = LoadState.idle
  
    /// load and return the model -- can be called multiple times, subsequent calls will
    /// just return the loaded model
    private func loadModel() async throws -> (LLMModel, Tokenizer) {
      switch loadState {
        case .idle:
            // limit the buffer cache
            MLX.GPU.set(cacheLimit: 20 * 1024 * 1024)

            let (model, tokenizer) = try await LLMLoader.load(configuration: modelConfiguration) {
                [modelConfiguration] progress in
                DispatchQueue.main.sync {
                    print("Downloading \(modelConfiguration.id): \(Int(progress.fractionCompleted * 100))%")
                }
            }
            print("Loaded \(modelConfiguration.id).  Weights: \(MLX.GPU.activeMemory / 1024 / 1024)M")
            loadState = .loaded(model, tokenizer)
            return (model, tokenizer)

        case .loaded(let model, let tokenizer):
            return (model, tokenizer)
        }
    }
}
