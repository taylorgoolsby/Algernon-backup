#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(NativeTokenizer, NSObject)
RCT_EXTERN_METHOD(tokenizeString:(NSString *)model text:(NSString *)text resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end
