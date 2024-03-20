import Foundation
import Tiktoken

@objc(NativeTokenizer)
class NativeTokenizer: NSObject {
    // React Native requires this to be exposed for initialization checks
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc func tokenizeString(_ model: String, text: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task {
            do {
                var tokenIds: [Int] = []
                switch model {
                case "bert":
                    let vocab = try loadVocabulary()
                    let tokenizer = BertTokenizer(vocab: vocab)
                    tokenIds = tokenizer.tokenizeToIds(text: text)
                case "gpt-4", "gpt-3.5-turbo", "gpt-3", "gpt-2":
                    let encoder = try await Tiktoken.shared.getEncoding(model)
                    if let encoded = encoder?.encode(value: text) {
                        tokenIds = encoded
                    } else {
                        throw NSError(domain: "NativeTokenizer", code: 0, userInfo: [NSLocalizedDescriptionKey: "Encoding failed or returned nil"])
                    }
                default:
                    throw NSError(domain: "NativeTokenizer", code: 1, userInfo: [NSLocalizedDescriptionKey: "Unsupported model"])
                }
                resolve(tokenIds)
            } catch {
              reject("tokenization_error", error.localizedDescription, error)
            }
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
