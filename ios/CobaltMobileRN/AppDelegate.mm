#import "AppDelegate.h"
#import "ClusteringAndEllipsoids.h"
#import "SGESVDExample.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"CobaltMobileRN";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  [UIApplication sharedApplication].statusBarHidden = YES;
  
  // Load and test IRIS dataset
  [self loadAndTestIRISDataset];
//  [SGESVDExample runExample];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)loadAndTestIRISDataset {
  @try {
    NSString *path = [[NSBundle mainBundle] pathForResource:@"iris_dataset" ofType:@"csv"];
    NSError *error = nil;
    NSString *content = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:&error];
    
    if (error) {
      NSLog(@"Failed to read file: %@", error.localizedDescription);
      return;
    }

    NSArray *rows = [content componentsSeparatedByString:@"\n"];
    if (rows.count <= 1) {
      NSLog(@"CSV file doesn't contain enough rows.");
      return;
    }

    int rowsCount = (int)rows.count - 2; // Exclude header row and last row
    int colsCount = 4; // we have 4 features

    float *data = (float *)malloc(rowsCount * colsCount * sizeof(float));
    if (data == NULL) {
      NSLog(@"Failed to allocate memory for data array.");
      return;
    }

    int index = 0;

    for (int i = 1; i < rows.count - 1; i++) { // start from 1 to skip header and stop before the last row
      NSString *row = rows[i];
      NSArray *cols = [row componentsSeparatedByString:@","];

      if (cols.count < 5) {
        NSLog(@"Row %d doesn't contain enough columns or is invalid.", i);
        continue;
      }

      for (int j = 0; j < colsCount; j++) {
        data[index++] = [cols[j] floatValue];
      }
    }

    NSLog(@"IRIS Data:");
    for (int i = 0; i < rowsCount; ++i) {
      NSMutableString *dataString = [NSMutableString string];
      for (int j = 0; j < colsCount; ++j) {
        [dataString appendFormat:@"%f ", data[i * colsCount + j]];
      }
      NSLog(@"%@", dataString);
    }

    ClusteringAndEllipsoids *clusteringAndEllipsoids = [[ClusteringAndEllipsoids alloc] init];
    NSDictionary *result = [clusteringAndEllipsoids performClusteringAndEllipsoids:data rows:rowsCount cols:colsCount];
    
    // Convert pointers to arrays for printing
    float *bestCentroids = (float *)[result[@"bestCentroids"] pointerValue];
    int *bestLabels = (int *)[result[@"bestLabels"] pointerValue];
    int *bestClusterCounts = (int *)[result[@"bestClusterCounts"] pointerValue];
    float *reducedData = (float *)[result[@"reducedData"] pointerValue];

    NSLog(@"Best K: %@", result[@"bestK"]);
    NSLog(@"Best Score: %@", result[@"bestScore"]);

    NSLog(@"Best Labels:");
    NSMutableString *labelsString = [NSMutableString string];
    for (int i = 0; i < rowsCount; ++i) {
      [labelsString appendFormat:@"%d ", bestLabels[i]];
    }
    NSLog(@"%@", labelsString);

    NSLog(@"Best Centroids:");
    for (int i = 0; i < [result[@"bestK"] intValue]; ++i) {
      NSMutableString *centroidString = [NSMutableString string];
      for (int j = 0; j < colsCount; ++j) {
        [centroidString appendFormat:@"%f ", bestCentroids[i * colsCount + j]];
      }
      NSLog(@"%@", centroidString);
    }

    NSLog(@"Best Cluster Counts:");
    for (int i = 0; i < [result[@"bestK"] intValue]; ++i) {
      NSLog(@"%d", bestClusterCounts[i]);
    }

    NSLog(@"Reduced Data:");
    for (int i = 0; i < rowsCount; ++i) {
      NSMutableString *reducedDataString = [NSMutableString string];
      for (int j = 0; j < 3; ++j) { // reducedDim is 3
        [reducedDataString appendFormat:@"%f ", reducedData[i * 3 + j]];
      }
      NSLog(@"%@", reducedDataString);
    }

    NSLog(@"Best Ellipsoids:");
    for (NSDictionary *ellipsoid in result[@"bestEllipsoids"]) {
      NSLog(@"Mean: %@", ellipsoid[@"mean"]);
      NSLog(@"Eigenvalues: %@", ellipsoid[@"eigenvalues"]);
      NSLog(@"Eigenvectors: %@", ellipsoid[@"eigenvectors"]);
    }

    // Free allocated memory
    free(data);
  }
  @catch (NSException *exception) {
    NSLog(@"An error occurred: %@\nStack trace: %@", exception.reason, exception.callStackSymbols);
  }
}

@end
