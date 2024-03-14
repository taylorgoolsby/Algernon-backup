// LLMNativeModule.m

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(LLMNativeModule, NSObject)
// Method signature for the exposed Swift method
RCT_EXTERN_METHOD(generateResponse:(NSString *)text resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end
