// PlotView.m
#import "PlotView.h"
#import <React/RCTViewManager.h>
#import "ClusteringAndEllipsoids.h"
#import "FaissBridge.h"
#import "CobaltMobileRN-Swift.h" // Import the Swift module

@implementation PlotViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [[PlotView alloc] init];
}

@end

@interface PlotView ()

@property (nonatomic, strong) EAGLContext *context;
@property (nonatomic, strong) GLKBaseEffect *effect;
@property (nonatomic, strong) NSDictionary *clusteringResults;
@property (nonatomic, strong) NSArray *annotations;

@end

@implementation PlotView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self setupGL];
        [self loadClusteringDataInBackground];
    }
    return self;
}

- (void)setupGL {
    self.context = [[EAGLContext alloc] initWithAPI:kEAGLRenderingAPIOpenGLES3];
    if (!self.context) {
        NSLog(@"Failed to create ES context");
    }
    
    self.context = self.context;
    self.drawableDepthFormat = GLKViewDrawableDepthFormat24;

    [EAGLContext setCurrentContext:self.context];

    self.effect = [[GLKBaseEffect alloc] init];
    
    glEnable(GL_DEPTH_TEST);
}

- (void)loadClusteringDataInBackground {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self loadClusteringData];
    });
}

- (void)loadClusteringData {
  NSLog(@"Loading PlotView data");
  
    FaissBridge *faissBridge = [FaissBridge sharedInstance];
    NSDictionary *faissData = [faissBridge getVectors];
    
    if (faissData) {
        int ntotal = [faissData[@"ntotal"] intValue];
        int dimension = [faissData[@"dimension"] intValue];
        float *database = [faissData[@"database"] pointerValue];
      
        NSLog(@"ntotal: %d, dimension: %d", ntotal, dimension);

        // Print vectors
        for (int i = 0; i < ntotal; i++) {
            NSMutableString *vectorString = [NSMutableString stringWithString:@"Vector: "];
            for (int j = 0; j < dimension; j++) {
                [vectorString appendFormat:@"%f ", database[i * dimension + j]];
            }
            NSLog(@"%@", vectorString);
        }

        ClusteringAndEllipsoids *clustering = [[ClusteringAndEllipsoids alloc] init];
        self.clusteringResults = [clustering performClusteringAndEllipsoids:database rows:ntotal cols:dimension];
      
        // Print clustering results labels
        int *bestLabels = [(NSValue *)self.clusteringResults[@"bestLabels"] pointerValue];
        for (int i = 0; i < ntotal; i++) {
            NSLog(@"Label[%d]: %d", i, bestLabels[i]);
        }

        // Print reduced data
        float *reducedData = [(NSValue *)self.clusteringResults[@"reducedData"] pointerValue];
        int reducedDim = 3; // Assuming the reduced dimension is 3
        for (int i = 0; i < ntotal; i++) {
            NSMutableString *reducedDataString = [NSMutableString stringWithString:@"Reduced Data: "];
            for (int j = 0; j < reducedDim; j++) {
                [reducedDataString appendFormat:@"%f ", reducedData[i * reducedDim + j]];
            }
            NSLog(@"%@", reducedDataString);
        }
      
        NSMutableArray *ellipsoids = self.clusteringResults[@"bestEllipsoids"];
        for (NSDictionary *ellipsoid in ellipsoids) {
            NSLog(@"Mean: %@", ellipsoid[@"mean"]);
            NSLog(@"Eigenvalues: %@", ellipsoid[@"eigenvalues"]);
            NSLog(@"Eigenvectors: %@", ellipsoid[@"eigenvectors"]);
        }

        free(database);

        // Load annotations after clustering
//        [self loadAnnotations];
    } else {
        NSLog(@"Failed to load data from FAISS");
    }
}

- (void)loadAnnotations {
    DatabaseModule *databaseModule = [DatabaseModule new];
    [databaseModule fetchAnnotations:^(NSArray *results) {
        self.annotations = results;

        // Print annotations
        for (NSDictionary *annotation in results) {
            NSLog(@"Annotation: %@", annotation);
        }

        // Perform rendering on the main thread
        dispatch_async(dispatch_get_main_queue(), ^{
            [self setNeedsDisplay];
        });
    } reject:^(NSString *code, NSString *message, NSError *error) {
        NSLog(@"Error loading annotations: %@", message);
    }];
}

- (void)drawRect:(CGRect)rect {
    glClearColor(0.65f, 0.65f, 0.65f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // For now, we are not rendering clustering results or annotations
    // This is just to ensure we have a simple blank screen rendered initially
    // Future rendering logic will be added here once the data is loaded
    // and non-blocking behavior is confirmed
}

- (void)dealloc {
  ClusteringAndEllipsoids *clustering = [[ClusteringAndEllipsoids alloc] init];
  [clustering freeClusteringData:self.clusteringResults];
}

@end
