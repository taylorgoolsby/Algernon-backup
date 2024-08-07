// ClusteringAndEllipsoids.m
#import "ClusteringAndEllipsoids.h"
#import <Accelerate/Accelerate.h>

@implementation ClusteringAndEllipsoids

- (NSDictionary *)performClusteringAndEllipsoids:(float *)data rows:(int)rows cols:(int)cols {
    int maxK = 10; // Maximum number of clusters to test
    int maxIterations = 100;

    // Perform k-means clustering with silhouette scoring to find the best number of clusters
    NSDictionary *bestKMeansResult = [self performKMeansWithSilhouetteScoring:data rows:rows cols:cols maxK:maxK maxIterations:maxIterations];

    int bestK = [bestKMeansResult[@"bestK"] intValue];
    int *bestLabels = [bestKMeansResult[@"bestLabels"] pointerValue];
    float *bestCentroids = [bestKMeansResult[@"bestCentroids"] pointerValue];
    NSMutableArray *allLabels = bestKMeansResult[@"allLabels"];
    NSMutableArray *allCentroids = bestKMeansResult[@"allCentroids"];
    NSMutableArray *allClusterSilhouetteScores = bestKMeansResult[@"allClusterSilhouetteScores"];
    NSMutableArray *allSilhouetteScores = bestKMeansResult[@"allSilhouetteScores"];
    NSMutableArray *allClusterCounts = bestKMeansResult[@"allClusterCounts"];

    // Perform PCA to reduce dimensions to 3D
    int reducedDim = 3;
    float *reducedData = malloc(rows * reducedDim * sizeof(float));
    [self performPCA:data rows:rows cols:cols output:reducedData outputDim:reducedDim];
    
    // Fit 3D Gaussian and obtain ellipsoids
    NSMutableArray *ellipsoids = [self fit3DGaussianAndGetEllipsoid:reducedData rows:rows labels:bestLabels numClusters:bestK reducedDim:reducedDim clusterCounts:allClusterCounts];
    
    NSDictionary *resultDict = @{
        @"bestK": @(bestK),
        @"bestCentroids": [NSValue valueWithPointer:bestCentroids],
        @"bestLabels": [NSValue valueWithPointer:bestLabels],
        @"bestEllipsoids": ellipsoids,
        @"allLabels": allLabels,
        @"allCentroids": allCentroids,
        @"allClusterSilhouetteScores": allClusterSilhouetteScores,
        @"allSilhouetteScores": allSilhouetteScores,
        @"allClusterCounts": allClusterCounts,
        @"reducedData": [NSValue valueWithPointer:reducedData]
    };
    
    return resultDict;
}

- (NSDictionary *)performKMeansWithSilhouetteScoring:(float *)data rows:(int)rows cols:(int)cols maxK:(int)maxK maxIterations:(int)maxIterations {
    float bestScore = -FLT_MAX; // Initialize to minimum value to find maximum silhouette score
    int bestK = 2;
    int *bestLabels = NULL;
    float *bestCentroids = NULL;

    NSMutableArray *allLabels = [NSMutableArray array];
    NSMutableArray *allCentroids = [NSMutableArray array];
    NSMutableArray *allClusterSilhouetteScores = [NSMutableArray array];
    NSMutableArray *allSilhouetteScores = [NSMutableArray array];
    NSMutableArray *allClusterCounts = [NSMutableArray array];

    for (int k = 2; k <= maxK; ++k) {
        int *labels = malloc(rows * sizeof(int));
        float *centroids = malloc(k * cols * sizeof(float));
        [self performKMeansClustering:data rows:rows cols:cols k:k maxIterations:maxIterations labels:labels centroids:centroids];
        
        NSDictionary *silhouetteResult = [self calculateSilhouetteScore:data labels:labels rows:rows cols:cols k:k];
        float averageSilhouetteScore = [silhouetteResult[@"averageSilhouetteScore"] floatValue];
        float *clusterSilhouetteScores = [silhouetteResult[@"clusterSilhouetteScores"] pointerValue];
        float *silhouetteScoresArray = [silhouetteResult[@"silhouetteScores"] pointerValue];
        int *clusterCounts = [silhouetteResult[@"clusterCounts"] pointerValue];
        
        // Add labels and centroids to the array to free later
        [allLabels addObject:[NSValue valueWithPointer:labels]];
        [allCentroids addObject:[NSValue valueWithPointer:centroids]];
        [allClusterSilhouetteScores addObject:[NSValue valueWithPointer:clusterSilhouetteScores]];
        [allSilhouetteScores addObject:[NSValue valueWithPointer:silhouetteScoresArray]];
        [allClusterCounts addObject:[NSValue valueWithPointer:clusterCounts]];

        // Choose the k with the highest average silhouette score
        if (averageSilhouetteScore > bestScore) {
            bestScore = averageSilhouetteScore;
            bestK = k;
            bestLabels = labels;
            bestCentroids = centroids;
        }
    }

    return @{
        @"bestK": @(bestK),
        @"bestLabels": [NSValue valueWithPointer:bestLabels],
        @"bestCentroids": [NSValue valueWithPointer:bestCentroids],
        @"allLabels": allLabels,
        @"allCentroids": allCentroids,
        @"allClusterSilhouetteScores": allClusterSilhouetteScores,
        @"allSilhouetteScores": allSilhouetteScores,
        @"allClusterCounts": allClusterCounts
    };
}


- (NSDictionary *)calculateSilhouetteScore:(float *)data labels:(int *)labels rows:(int)rows cols:(int)cols k:(int)k {
    float *a = malloc(rows * sizeof(float));
    float *b = malloc(rows * sizeof(float));
    float *silhouetteScores = malloc(rows * sizeof(float));
    float *clusterSilhouetteScores = malloc(k * sizeof(float));
    int *clusterCounts = malloc(k * sizeof(int));
    
    memset(clusterSilhouetteScores, 0, k * sizeof(float));
    memset(clusterCounts, 0, k * sizeof(int));

    for (int i = 0; i < rows; ++i) {
        float intraClusterDist = 0.0;
        int intraClusterCount = 0;
        float *interClusterDists = malloc(k * sizeof(float));
        int *interClusterCounts = malloc(k * sizeof(int));
        memset(interClusterDists, 0, k * sizeof(float));
        memset(interClusterCounts, 0, k * sizeof(int));

        for (int j = 0; j < rows; ++j) {
            if (i == j) continue;

            float dist = 0.0;
            for (int l = 0; l < cols; ++l) {
                float diff = data[i * cols + l] - data[j * cols + l];
                dist += diff * diff;
            }
            dist = sqrtf(dist);

            if (labels[i] == labels[j]) {
                intraClusterDist += dist;
                intraClusterCount++;
            } else {
                interClusterDists[labels[j]] += dist;
                interClusterCounts[labels[j]]++;
            }
        }

        a[i] = intraClusterCount > 0 ? intraClusterDist / intraClusterCount : 0.0;

        float minInterClusterDist = FLT_MAX;
        for (int j = 0; j < k; ++j) {
            if (j != labels[i] && interClusterCounts[j] > 0) {
                float meanDist = interClusterDists[j] / interClusterCounts[j];
                if (meanDist < minInterClusterDist) {
                    minInterClusterDist = meanDist;
                }
            }
        }
        b[i] = minInterClusterDist;

        free(interClusterDists);
        free(interClusterCounts);
    }

    float silhouetteSum = 0.0;
    for (int i = 0; i < rows; ++i) {
        float s = (b[i] - a[i]) / fmaxf(a[i], b[i]);
        silhouetteScores[i] = s;
        silhouetteSum += s;
        clusterSilhouetteScores[labels[i]] += s;
        clusterCounts[labels[i]]++;
    }

    for (int i = 0; i < k; ++i) {
        if (clusterCounts[i] > 0) {
            clusterSilhouetteScores[i] /= clusterCounts[i];
        }
    }

    float averageSilhouetteScore = silhouetteSum / rows;

    NSDictionary *result = @{
        @"averageSilhouetteScore": @(averageSilhouetteScore),
        @"clusterSilhouetteScores": [NSValue valueWithPointer:clusterSilhouetteScores],
        @"silhouetteScores": [NSValue valueWithPointer:silhouetteScores],
        @"clusterCounts": [NSValue valueWithPointer:clusterCounts]
    };

    free(a);
    free(b);

    return result;
}

- (void)performKMeansClustering:(float *)data rows:(int)rows cols:(int)cols k:(int)k maxIterations:(int)maxIterations labels:(int *)labels centroids:(float *)centroids {
    // Initialize centroids (randomly select k points from the data as initial centroids)
    for (int i = 0; i < k; ++i) {
        int index = arc4random_uniform(rows);
        for (int j = 0; j < cols; ++j) {
            centroids[i * cols + j] = data[index * cols + j];
        }
    }
    
    int *counts = malloc(k * sizeof(int));
    float *sums = malloc(k * cols * sizeof(float));

    for (int iter = 0; iter < maxIterations; ++iter) {
        memset(counts, 0, k * sizeof(int));
        memset(sums, 0, k * cols * sizeof(float));

        // Assign each point to the nearest centroid
        for (int i = 0; i < rows; ++i) {
            float minDist = FLT_MAX;
            int bestCluster = 0;
            for (int j = 0; j < k; ++j) {
                float dist = 0;
                for (int l = 0; l < cols; ++l) {
                    float diff = data[i * cols + l] - centroids[j * cols + l];
                    dist += diff * diff;
                }
                if (dist < minDist) {
                    minDist = dist;
                    bestCluster = j;
                }
            }
            labels[i] = bestCluster;
            counts[bestCluster]++;
            for (int l = 0; l < cols; ++l) {
                sums[bestCluster * cols + l] += data[i * cols + l];
            }
        }

        // Update centroids
        for (int j = 0; j < k; ++j) {
            if (counts[j] == 0) continue; // Avoid division by zero
            for (int l = 0; l < cols; ++l) {
                centroids[j * cols + l] = sums[j * cols + l] / counts[j];
            }
        }
    }

    free(counts);
    free(sums);
}

- (void)performPCA:(float *)data rows:(int)rows cols:(int)cols output:(float *)output outputDim:(int)outputDim {
    // Temporary array to store the centered data
    float *centeredData = malloc(rows * cols * sizeof(float));
    memcpy(centeredData, data, rows * cols * sizeof(float));

    // Center the data by subtracting the mean of each feature
    float *mean = malloc(cols * sizeof(float));
    vDSP_meanv(centeredData, 1, mean, cols);
    for (__LAPACK_int i = 0; i < rows; ++i) {
        vDSP_vsub(mean, 1, &centeredData[i * cols], 1, &centeredData[i * cols], 1, cols);
    }

    // Perform SVD
    float *U = malloc(rows * rows * sizeof(float));
    float *S = malloc(MIN(rows, cols) * sizeof(float));
    float *VT = malloc(cols * cols * sizeof(float));
    __LAPACK_int lda = rows;
    __LAPACK_int ldu = rows;
    __LAPACK_int ldvt = cols;
    __LAPACK_int info;
    __LAPACK_int lwork = -1;
    float wkopt;

    // Query for optimal workspace size
    sgesvd_("A", "A", (__LAPACK_int *)&rows, (__LAPACK_int *)&cols, centeredData, &lda, S, U, &ldu, VT, &ldvt, &wkopt, &lwork, &info);
    lwork = (__LAPACK_int)wkopt;
    float *work = malloc(lwork * sizeof(float));

    // Actual SVD computation
    sgesvd_("A", "A", (__LAPACK_int *)&rows, (__LAPACK_int *)&cols, centeredData, &lda, S, U, &ldu, VT, &ldvt, work, &lwork, &info);

    if (info > 0) {
        NSLog(@"The algorithm computing SVD failed to converge.");
        free(mean);
        free(U);
        free(S);
        free(VT);
        free(work);
        free(centeredData);
        return;
    }

    // Reduce dimensions by selecting the first outputDim columns of U
    for (__LAPACK_int i = 0; i < rows; ++i) {
        for (__LAPACK_int j = 0; j < outputDim; ++j) {
            output[i * outputDim + j] = U[i * rows + j];
        }
    }

    free(mean);
    free(U);
    free(S);
    free(VT);
    free(work);
    free(centeredData);
}

- (NSMutableArray *)fit3DGaussianAndGetEllipsoid:(float *)reducedData rows:(int)rows labels:(int *)labels numClusters:(int)numClusters reducedDim:(int)reducedDim clusterCounts:(NSMutableArray *)allClusterCounts {
    NSMutableArray *ellipsoids = [NSMutableArray arrayWithCapacity:numClusters];
    
    for (int i = 0; i < numClusters; ++i) {
        int clusterSize = [allClusterCounts[i] intValue];
        
        // Allocate memory for cluster points
        float *clusterPoints = malloc(clusterSize * reducedDim * sizeof(float));
        int index = 0;
        for (int j = 0; j < rows; ++j) {
            if (labels[j] == i) {
                memcpy(&clusterPoints[index * reducedDim], &reducedData[j * reducedDim], reducedDim * sizeof(float));
                index++;
            }
        }
        
        // Fit 3D Gaussian and get ellipsoid
        NSDictionary *ellipsoid = [self fitSingle3DGaussian:clusterPoints size:clusterSize];
        [ellipsoids addObject:ellipsoid];
        
        free(clusterPoints);
    }
    
    return ellipsoids;
}

- (NSDictionary *)fitSingle3DGaussian:(float *)clusterPoints size:(int)n {
    // Fit 3D Gaussian and obtain the ellipsoid
    float mean[3] = {0.0, 0.0, 0.0};
    
    // Calculate the mean using Accelerate
    vDSP_meanv(clusterPoints, 1, mean, n);
    
    // Calculate the covariance matrix using Accelerate
    float *centeredData = malloc(n * 3 * sizeof(float));
    for (int i = 0; i < n; ++i) {
        centeredData[i * 3] = clusterPoints[i * 3] - mean[0];
        centeredData[i * 3 + 1] = clusterPoints[i * 3 + 1] - mean[1];
        centeredData[i * 3 + 2] = clusterPoints[i * 3 + 2] - mean[2];
    }

    // Transpose centered data
    float *centeredDataTransposed = malloc(n * 3 * sizeof(float));
    vDSP_mtrans(centeredData, 1, centeredDataTransposed, 1, n, 3);

    // Initialize the covariance matrix
    float covariance[3][3] = {0.0};

    // Multiply transposed centered data with centered data to get the covariance matrix
    vDSP_mmul(centeredDataTransposed, 1, centeredData, 1, (float *)covariance, 1, 3, 3, n);

    // Scale the covariance matrix
    float scale = 1.0 / (n - 1);
    vDSP_vsmul((float *)covariance, 1, &scale, (float *)covariance, 1, 9);

    free(centeredData);
    free(centeredDataTransposed);
    
    // Decompose the covariance matrix to get the axes of the ellipsoid
    float eigenvalues[3];
    float eigenvectors[3][3];
    __LAPACK_int n_ = 3;
    __LAPACK_int info;
    __LAPACK_int lwork = -1;
    float wkopt;
    
    // Query for optimal workspace size
    sgesvd_("A", "A", (__LAPACK_int *)&n_, (__LAPACK_int *)&n_, (float *)covariance, (__LAPACK_int *)&n_, eigenvalues, (float *)eigenvectors, (__LAPACK_int *)&n_, (float *)eigenvectors, (__LAPACK_int *)&n_, &wkopt, &lwork, &info);
    lwork = (__LAPACK_int)wkopt;
    float *work = malloc(lwork * sizeof(float));
    
    // Actual SVD computation
    sgesvd_("A", "A", (__LAPACK_int *)&n_, (__LAPACK_int *)&n_, (float *)covariance, (__LAPACK_int *)&n_, eigenvalues, (float *)eigenvectors, (__LAPACK_int *)&n_, (float *)eigenvectors, (__LAPACK_int *)&n_, work, &lwork, &info);
    
    free(work);
    
    if (info > 0) {
        NSLog(@"The algorithm computing SVD failed to converge.");
        return @{};
    }
    
    // The eigenvalues are the lengths of the axes of the ellipsoid
    // The eigenvectors are the directions of the axes
    NSDictionary *ellipsoid = @{
        @"mean": @[@(mean[0]), @(mean[1]), @(mean[2])],
        @"eigenvalues": @[@(eigenvalues[0]), @(eigenvalues[1]), @(eigenvalues[2])],
        @"eigenvectors": @[
            @[@(eigenvectors[0][0]), @(eigenvectors[0][1]), @(eigenvectors[0][2])],
            @[@(eigenvectors[1][0]), @(eigenvectors[1][1]), @(eigenvectors[1][2])],
            @[@(eigenvectors[2][0]), @(eigenvectors[2][1]), @(eigenvectors[2][2])]
        ]
    };
    
    return ellipsoid;
}

@end
