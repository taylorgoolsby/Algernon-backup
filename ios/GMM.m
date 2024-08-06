// GMM.m
#import "GMM.h"

@implementation GMM

- (instancetype)initWithMaxIterations:(int)maxIterations tolerance:(double)tolerance {
    self = [super init];
    if (self) {
        self.means = @[];
        self.covariances = @[];
        self.weights = @[];
        self.maxIterations = maxIterations;
        self.tolerance = tolerance;
    }
    return self;
}

- (void)fitWithData:(float *)data rows:(int)rows cols:(int)cols {
    int bestNComponents = 1;
    double bestSilhouetteScore = -1.0;
    
    for (int nComponents = 2; nComponents <= 10; nComponents++) {
        // Fit GMM with nComponents
        [self initializeParametersWithData:data rows:rows cols:cols nComponents:nComponents];
        for (int iteration = 0; iteration < self.maxIterations; iteration++) {
            NSArray<NSArray<NSNumber *> *> *responsibilities = [self eStepWithData:data rows:rows cols:cols];
            [self mStepWithData:data responsibilities:responsibilities rows:rows cols:cols];
        }
        
        // Predict cluster labels
        int *labels = [self predictWithData:data rows:rows cols:cols];
        
        // Calculate silhouette score
        double silhouetteScore = [self silhouetteScoreWithData:data labels:labels rows:rows cols:cols];
        free(labels);
        
        // Update best number of components if silhouette score improves
        if (silhouetteScore > bestSilhouetteScore) {
            bestSilhouetteScore = silhouetteScore;
            bestNComponents = nComponents;
        }
    }
    
    // Refit the model with the best number of components
    [self initializeParametersWithData:data rows:rows cols:cols nComponents:bestNComponents];
    for (int iteration = 0; iteration < self.maxIterations; iteration++) {
        NSArray<NSArray<NSNumber *> *> *responsibilities = [self eStepWithData:data rows:rows cols:cols];
        [self mStepWithData:data responsibilities:responsibilities rows:rows cols:cols];
    }
}

- (void)initializeParametersWithData:(float *)data rows:(int)rows cols:(int)cols nComponents:(int)nComponents {
    int d = cols;
    
    // Random initialization of means, covariances, and weights
    NSMutableArray *means = [NSMutableArray arrayWithCapacity:nComponents];
    for (int i = 0; i < nComponents; i++) {
        NSMutableArray *mean = [NSMutableArray arrayWithCapacity:d];
        for (int j = 0; j < d; j++) {
            mean[j] = @(0.0); // Replace with random values as needed
        }
        means[i] = mean;
    }
    self.means = means;
    
    NSMutableArray *covariances = [NSMutableArray arrayWithCapacity:nComponents];
    for (int i = 0; i < nComponents; i++) {
        NSMutableArray *covariance = [NSMutableArray arrayWithCapacity:d];
        for (int j = 0; j < d; j++) {
            NSMutableArray *row = [NSMutableArray arrayWithCapacity:d];
            for (int k = 0; k < d; k++) {
                row[k] = @(0.0); // Replace with random values as needed
            }
            covariance[j] = row;
        }
        covariances[i] = covariance;
    }
    self.covariances = covariances;
    
    NSMutableArray *weights = [NSMutableArray arrayWithCapacity:nComponents];
    for (int i = 0; i < nComponents; i++) {
        weights[i] = @(1.0 / nComponents); // Equal weights initially
    }
    self.weights = weights;
}

- (NSArray<NSArray<NSNumber *> *> *)eStepWithData:(float *)data rows:(int)rows cols:(int)cols {
    int n = rows;
    int k = (int)self.means.count;
    NSMutableArray *responsibilities = [NSMutableArray arrayWithCapacity:n];
    
    for (int i = 0; i < n; i++) {
        NSMutableArray *resp = [NSMutableArray arrayWithCapacity:k];
        float total = 0.0;
        
        for (int j = 0; j < k; j++) {
            float sum = 0.0;
            for (int d = 0; d < cols; d++) {
                float diff = data[i * cols + d] - [self.means[j][d] floatValue];
                sum += diff * diff / [self.covariances[j][d][d] floatValue];
            }
            float expValue = exp(-0.5 * sum);
            float weight = [self.weights[j] floatValue];
            float detCov = 1.0;
            for (int d = 0; d < cols; d++) {
                detCov *= [self.covariances[j][d][d] floatValue];
            }
            float gauss = expValue / sqrt(pow(2 * M_PI, cols) * detCov);
            float respValue = weight * gauss;
            resp[j] = @(respValue);
            total += respValue;
        }
        
        for (int j = 0; j < k; j++) {
            resp[j] = @([resp[j] floatValue] / total);
        }
        responsibilities[i] = resp;
    }
    return responsibilities;
}

- (void)mStepWithData:(float *)data responsibilities:(NSArray<NSArray<NSNumber *> *> *)responsibilities rows:(int)rows cols:(int)cols {
    int n = rows;
    int k = (int)self.means.count;

    // Update weights
    NSMutableArray *newWeights = [NSMutableArray arrayWithCapacity:k];
    for (int j = 0; j < k; j++) {
        float sumResp = 0.0;
        for (int i = 0; i < n; i++) {
            sumResp += [responsibilities[i][j] floatValue];
        }
        newWeights[j] = @(sumResp / n);
    }
    self.weights = newWeights;

    // Update means
    NSMutableArray *newMeans = [NSMutableArray arrayWithCapacity:k];
    for (int j = 0; j < k; j++) {
        NSMutableArray *mean = [NSMutableArray arrayWithCapacity:cols];
        for (int d = 0; d < cols; d++) {
            float sum = 0.0;
            for (int i = 0; i < n; i++) {
                sum += [responsibilities[i][j] floatValue] * data[i * cols + d];
            }
            mean[d] = @(sum / [self.weights[j] floatValue]);
        }
        newMeans[j] = mean;
    }
    self.means = newMeans;

    // Update covariances
    NSMutableArray *newCovariances = [NSMutableArray arrayWithCapacity:k];
    for (int j = 0; j < k; j++) {
        NSMutableArray *covariance = [NSMutableArray arrayWithCapacity:cols];
        for (int d1 = 0; d1 < cols; d1++) {
            NSMutableArray *row = [NSMutableArray arrayWithCapacity:cols];
            for (int d2 = 0; d2 < cols; d2++) {
                float sum = 0.0;
                for (int i = 0; i < n; i++) {
                    float diff1 = data[i * cols + d1] - [self.means[j][d1] floatValue];
                    float diff2 = data[i * cols + d2] - [self.means[j][d2] floatValue];
                    sum += [responsibilities[i][j] floatValue] * diff1 * diff2;
                }
                row[d2] = @(sum / [self.weights[j] floatValue]);
            }
            covariance[d1] = row;
        }
        newCovariances[j] = covariance;
    }
    self.covariances = newCovariances;
}

- (int *)predictWithData:(float *)data rows:(int)rows cols:(int)cols {
    int n = rows;
    int *predictions = (int *)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        predictions[i] = 0; // Predict closest cluster here
    }
    return predictions;
}

- (double)silhouetteScoreWithData:(float *)data labels:(int *)labels rows:(int)rows cols:(int)cols {
    // Calculate the silhouette score for the clustering
    return 0.0;
}

@end
