// GMM.h
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface GMM : NSObject

@property (nonatomic, strong) NSArray<NSArray<NSNumber *> *> *means;
@property (nonatomic, strong) NSArray<NSArray<NSArray<NSNumber *> *> *> *covariances;
@property (nonatomic, strong) NSArray<NSNumber *> *weights;
@property (nonatomic, assign) int maxIterations;
@property (nonatomic, assign) double tolerance;

- (instancetype)initWithMaxIterations:(int)maxIterations tolerance:(double)tolerance;

- (void)fitWithData:(float *)data rows:(int)rows cols:(int)cols;
- (int *)predictWithData:(float *)data rows:(int)rows cols:(int)cols;
- (double)silhouetteScoreWithData:(float *)data labels:(int *)labels rows:(int)rows cols:(int)cols;

@end

NS_ASSUME_NONNULL_END
