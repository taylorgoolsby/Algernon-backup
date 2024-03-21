#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(NativeTokenizer, NSObject)
RCT_EXTERN_METHOD(processMessages:(NSString *)systemMessage
                  nonSystemMessages:(NSArray *)nonSystemMessages
                  previousSummary:(NSString *)previousSummary
                  modelName:(NSString *)modelName
                  tokenLimit:(NSInteger)tokenLimit
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
