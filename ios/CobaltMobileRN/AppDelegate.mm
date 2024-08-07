#import "AppDelegate.h"
#import "ClusteringAndEllipsoids.h"

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

    // Print the parsed data
//    NSLog(@"Parsed IRIS Data:");
//    for (int i = 0; i < rowsCount; i++) {
//      NSMutableString *rowString = [NSMutableString string];
//      for (int j = 0; j < colsCount; j++) {
//        [rowString appendFormat:@"%f ", data[i * colsCount + j]];
//      }
//      NSLog(@"%@", rowString);
//    }

    ClusteringAndEllipsoids *clusteringAndEllipsoids = [[ClusteringAndEllipsoids alloc] init];
    NSDictionary *result = [clusteringAndEllipsoids performClusteringAndEllipsoids:data rows:rowsCount cols:colsCount];
    
    NSLog(@"Clustering and Ellipsoids Results: %@", result);
    
    free(data);
  }
  @catch (NSException *exception) {
    NSLog(@"An error occurred: %@\nStack trace: %@", exception.reason, exception.callStackSymbols);
  }
}

@end
