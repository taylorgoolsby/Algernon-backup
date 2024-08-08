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
        [self loadClusteringData];
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

- (void)loadClusteringData {
    FaissBridge *faissBridge = [FaissBridge sharedInstance];
    NSDictionary *faissData = [faissBridge getVectors];
    
    if (faissData) {
        int ntotal = [faissData[@"ntotal"] intValue];
        int dimension = [faissData[@"dimension"] intValue];
        float *database = [faissData[@"database"] pointerValue];

        ClusteringAndEllipsoids *clustering = [[ClusteringAndEllipsoids alloc] init];
        self.clusteringResults = [clustering performClusteringAndEllipsoids:database rows:ntotal cols:dimension];

        free(database);
        
        [self loadAnnotations];
    } else {
        NSLog(@"Failed to load data from FAISS");
    }
}

- (void)loadAnnotations {
    DatabaseModule *databaseModule = [DatabaseModule new];
    [databaseModule fetchAnnotations:^(NSArray *results) {
        self.annotations = results;
        [self setNeedsDisplay];
    } reject:^(NSString *code, NSString *message, NSError *error) {
        NSLog(@"Error loading annotations: %@", message);
    }];
}

- (void)drawRect:(CGRect)rect {
    glClearColor(0.65f, 0.65f, 0.65f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // Render the clustering results here
    if (self.clusteringResults && self.annotations) {
        // Render points and ellipsoids using the results
        [self renderClusteringResults:self.clusteringResults];
        // Optionally use self.annotations for additional rendering
    }
}

- (void)renderClusteringResults:(NSDictionary *)results {
    // Render centroids as points
    float *centroids = [(NSValue *)results[@"bestCentroids"] pointerValue];
    int bestK = [results[@"bestK"] intValue];
    int *bestLabels = [(NSValue *)results[@"bestLabels"] pointerValue];

    glEnableVertexAttribArray(GLKVertexAttribPosition);
    for (int i = 0; i < bestK; i++) {
        float x = centroids[i * 3];
        float y = centroids[i * 3 + 1];
        float z = centroids[i * 3 + 2];
        GLKVector3 point = GLKVector3Make(x, y, z);
        glVertexAttribPointer(GLKVertexAttribPosition, 3, GL_FLOAT, GL_FALSE, 0, &point);
        [self.effect prepareToDraw];
        glDrawArrays(GL_POINTS, 0, 1);
    }
    glDisableVertexAttribArray(GLKVertexAttribPosition);

    // Render ellipsoids
    NSMutableArray *ellipsoids = results[@"bestEllipsoids"];
    for (NSDictionary *ellipsoid in ellipsoids) {
        // Code to render ellipsoid using the mean and eigenvalues/eigenvectors
        [self renderEllipsoid:ellipsoid];
    }
}

- (void)renderEllipsoid:(NSDictionary *)ellipsoid {
    // Extract mean and eigenvalues/eigenvectors from ellipsoid dictionary
    NSArray *mean = ellipsoid[@"mean"];
    NSArray *eigenvalues = ellipsoid[@"eigenvalues"];
    NSArray *eigenvectors = ellipsoid[@"eigenvectors"];

    // Code to render the ellipsoid using OpenGL
    // You need to create a shader to handle Gaussian splatting
}

@end
