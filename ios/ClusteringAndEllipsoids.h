// ClusteringAndEllipsoids.h
#import <Foundation/Foundation.h>

@interface ClusteringAndEllipsoids : NSObject

- (NSDictionary *)performClusteringAndEllipsoids:(float *)data rows:(int)rows cols:(int)cols;
- (void)freeClusteringData:(NSDictionary *)clusteringResults;

@end
