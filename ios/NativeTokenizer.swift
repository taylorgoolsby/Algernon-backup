import Foundation
import Tiktoken

@objc(NativeTokenizer)
class NativeTokenizer: NSObject {
    private var encoderCache: Encoding?
  
    // React Native requires this to be exposed for initialization checks
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
  
    @objc func processMessages(_ systemMessage: String,
                               nonSystemMessages: NSArray,
                               previousSummary: String,
                               modelName: String,
                               tokenLimit: Int,
                               resolver resolve: @escaping RCTPromiseResolveBlock,
                               rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task {
            do {
                var input = ""
              
                // Initialize encoder outside of the loop to reuse it
                let encodeFunction: ((String) -> [Int]) = try await initializeEncoder(modelName: modelName)
                
                // Iterate over nonSystemMessages in reverse order
                for index in stride(from: nonSystemMessages.count - 1, through: 0, by: -1) {
//                    print("index: \(index)")
                    guard let messageDict = nonSystemMessages[index] as? [String: Any],
                        let role = messageDict["role"] as? String,
                        let text = messageDict["text"] as? String else {
                      continue
                    }
                  
//                    print("role: \(role)")
//                    print("text: \(text)")
                    
                    // Construct next input string
                  let nextInput = "\(role.lowercased()): \(text)\n\n\(input)"
                    // Content including systemMessage and previousSummary
                    let content = "\(systemMessage)\(nextInput)previous summary: \(previousSummary)"
                    // Tokenize the content to check against the token limit
                    let tokenIds = encodeFunction(content)
                  
                    if tokenLimit < tokenIds.count {
                        break
                    }
//                    print("building: \(input)")
                    input = nextInput
                }
              
                input += "previous summary: \(previousSummary)"
              
                // Resolve with the final input string that fits within the token limit
                resolve(input)
            } catch {
                // If there was an error during processing, reject the promise
                reject("processing_error", error.localizedDescription, error)
            }
        }
    }
  
    // Function to initialize the encoder and return a closure for encoding texts
    private func initializeEncoder(modelName: String) async throws -> ((String) -> [Int]) {
        switch modelName {
        case "bert":
            let vocab = try loadVocabulary()
            let tokenizer = BertTokenizer(vocab: vocab)
            return { text in
                return tokenizer.tokenizeToIds(text: text)
            }
        case "gpt-4", "gpt-3.5-turbo", "gpt-3", "gpt-2":
            guard let encoder = try await Tiktoken.shared.getEncoding(modelName) else {
                throw NSError(domain: "NativeTokenizer", code: 2, userInfo: [NSLocalizedDescriptionKey: "Unable to get encoder."])
            }
            return { text in
                return encoder.encode(value: text)
            }
        default:
          throw NSError(domain: "NativeTokenizer", code: 1, userInfo: [NSLocalizedDescriptionKey: "Unsupported model"])
        }
    }

    private func loadVocabulary() throws -> [String: Int] {
        guard let vocabPath = Bundle.main.path(forResource: "MiniLM-vocab", ofType: "txt") else {
            throw NSError(domain: "NativeTokenizer", code: 2, userInfo: [NSLocalizedDescriptionKey: "vocab.txt not found in the main bundle."])
        }

        do {
            let vocabString = try String(contentsOfFile: vocabPath, encoding: .utf8)
            let lines = vocabString.components(separatedBy: .newlines)
            return Dictionary(uniqueKeysWithValues: lines.enumerated().filter { !$0.element.isEmpty }.map { ($0.element, $0.offset) })
        } catch {
            throw NSError(domain: "NativeTokenizer", code: 3, userInfo: [NSLocalizedDescriptionKey: "Unable to load vocab.txt"])
        }
    }
}
