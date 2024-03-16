import Foundation
import CoreML

@objc(TextFeatureExtractor)
class TextFeatureExtractor: NSObject {
    private let bertModel: all_MiniLM_L6_v2_coreml_float32
    private let vocab: [String: Int]
    private let tokenizer: BertTokenizer
  
    // React Native requires this to be exposed for initialization checks
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override init() {
        // Load the CoreML model
        let config = MLModelConfiguration()
        self.bertModel = try! all_MiniLM_L6_v2_coreml_float32(configuration: config)
        
        // Path to vocab.txt in the main bundle
        if let vocabPath = Bundle.main.path(forResource: "MiniLM-vocab", ofType: "txt") {
            do {
                // Load the contents of the file
                let vocabString = try String(contentsOfFile: vocabPath, encoding: .utf8)
                
                // Split the string into lines and enumerate them to create a dictionary
                let lines = vocabString.components(separatedBy: .newlines)
                self.vocab = Dictionary(uniqueKeysWithValues: lines.enumerated().filter { !$0.element.isEmpty }.map { ($0.element, $0.offset) })
            } catch {
                fatalError("Unable to load vocab.txt: \(error)")
            }
        } else {
            fatalError("vocab.txt not found in the main bundle.")
        }
      
      self.tokenizer = BertTokenizer(vocab: self.vocab)
    }

    @objc(extractFeatures:resolver:rejecter:)
    func extractFeatures(fromText text: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        // Preprocess and tokenize the text
        let tokenizedOutput = tokenizer.tokenizeToIds(text: text)
        guard let inputIdsMultiArray = try? MLMultiArray(shape: [1, 512], dataType: .float32),
              let attentionMaskMultiArray = try? MLMultiArray(shape: [1, 512], dataType: .float32) else {
            rejecter("MLMULTIARRAY_ERROR", "Could not create MLMultiArrays.", nil)
            return
        }

        // Fill in the input IDs and attention mask arrays
        for i in 0..<512 {
            let index = i < tokenizedOutput.count ? tokenizedOutput[i] : tokenizer.padTokenId
            inputIdsMultiArray[i] = NSNumber(value: index)
            attentionMaskMultiArray[i] = NSNumber(value: i < tokenizedOutput.count ? 1 : 0)
        }
      
//        checkInputValues(inputIds: inputIdsMultiArray, attentionMask: attentionMaskMultiArray)

        // Assume your model has an initializer like this (verify the exact names):
        let modelInput = all_MiniLM_L6_v2_coreml_float32Input(input_ids: inputIdsMultiArray, attention_mask: attentionMaskMultiArray)

        // Perform the prediction
        guard let predictionOutput = try? bertModel.prediction(input: modelInput),
              let hiddenStates = predictionOutput.featureValue(for: "hidden_states")?.multiArrayValue else {
            rejecter("MODEL_PREDICTION_ERROR", "Failed to perform prediction with the Core ML model", nil)	
            return
        }
      
        // Assuming hiddenStates.shape = [1, 512, 384]
        let sequenceLength = hiddenStates.shape[1].intValue
        let embeddingSize = hiddenStates.shape[2].intValue
        // Example: Print the first 10 embeddings for the first 5 tokens
        for i in 0..<5 { // Tokens
            print("Token \(i):")
            for j in 0..<10 { // Embeddings for each token
                let index = i * embeddingSize + j // Calculate the correct index
                let value = hiddenStates[index].floatValue // Get the value at the calculated index
                print("  Embedding \(j): \(value)")
            }
        }

        let features = meanPooling(hiddenStates: hiddenStates, attentionMask: attentionMaskMultiArray)
        let normalizedFeatures = normalizeVector(features)

        // Resolve the promise with the features
        resolver(normalizedFeatures)
    }
  
    // Assuming inputIdsMultiArray and attentionMaskMultiArray have been properly initialized and populated
    func checkInputValues(inputIds: MLMultiArray, attentionMask: MLMultiArray) {
        print("Checking input IDs:")
        for i in 0..<10 {
            let value = inputIds[i].intValue // Assuming these are integer values
            print("Input ID at index \(i): \(value)")
            // Optionally, add a condition to check for unexpected values
            if value < 0 || value > vocab.count { // Example condition, adjust based on your model's expected input range
                print("Warning: Unexpected value at index \(i): \(value)")
            }
        }
        
        print("Checking attention mask:")
        for i in 0..<10 {
            let value = attentionMask[i].intValue // Assuming these are integer values
            print("Attention mask at index \(i): \(value)")
            // Optionally, add a condition to check for unexpected values
            if value != 0 && value != 1 { // Attention mask values are expected to be 0 or 1
                print("Warning: Unexpected value at index \(i): \(value)")
            }
        }
    }


    private func meanPooling(hiddenStates: MLMultiArray, attentionMask: MLMultiArray) -> [Float] {
        let sequenceLength = hiddenStates.shape[1].intValue
        let embeddingSize = hiddenStates.shape[2].intValue
        var sumVectors = Array(repeating: Float(0), count: embeddingSize)
        var validTokenCount: Float = 0
        
        for i in 0..<sequenceLength {
            if attentionMask[i].intValue == 1 { // Consider only tokens with attention mask = 1
                validTokenCount += 1
                for j in 0..<embeddingSize {
                    let index = i * embeddingSize + j
                    sumVectors[j] += hiddenStates[index].floatValue
                }
            }
        }
        
        guard validTokenCount > 0 else { return sumVectors }
        return sumVectors.map { $0 / validTokenCount } // Mean pooling
    }
  
    private func normalizeVector(_ vector: [Float]) -> [Float] {
        let norm = l2Norm(vector)
        guard norm > 0 else { return vector }
        return vector.map { $0 / norm }
    }
  
    private func l2Norm(_ vector: [Float]) -> Float {
        return sqrt(vector.reduce(0) { sum, element in sum + element * element })
    }
    
    // Placeholder for converting emojis to text representation
    private func convertEmojisToText(_ text: String) -> String {
        // Convert emojis to a text representation
        // e.g., "🤗" -> ":hugging_face:"
        // You can use a pre-built library or a custom mapping for emojis
      return text
    }
}
