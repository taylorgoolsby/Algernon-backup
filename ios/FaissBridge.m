// FaissBridge.m
#import "FaissBridge.h"
#include "IndexFlat_c.h"
#include "faiss_c.h"
#include "index_io_c.h"

@implementation FaissBridge {
    FaissIndex* index;
}

// To expose this module to React Native
RCT_EXPORT_MODULE();

// Method to add a vector to the index
RCT_EXPORT_METHOD(addVector:(NSArray<NSNumber *> *)vector
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    // Ensure the index is loaded or initialized
    if (!index) {
        // Attempt to read the index from file first
        if (![self readIndexFromFile]) {
            // If reading fails, initialize a new index
            [self initializeAndTrainIndexWithDimension:(int)vector.count];
        }
    }
    
    // Convert NSArray to C array
    float *c_vector = malloc(vector.count * sizeof(float));
    if (!c_vector) {
        reject(@"memory_error", @"Failed to allocate memory for vector", nil);
        return;
    }
    for (NSUInteger i = 0; i < vector.count; ++i) {
        c_vector[i] = [vector[i] floatValue];
    }
    
    // Add the vector to the index
    if (faiss_Index_add((FaissIndex *)index, 1, c_vector) != 0) {
        free(c_vector);
        reject(@"add_error", @"Failed to add vector to index", nil);
        return;
    }
    free(c_vector);
    
    // Write the updated index to file
    if (![self writeIndexToFile]) {
        reject(@"write_error", @"Failed to write updated index to file", nil);
        return;
    }
    
    // Return success
    resolve(@(YES));
}

// Method to search the index for the k nearest vectors
RCT_EXPORT_METHOD(searchVectors:(NSArray<NSNumber *> *)queryVector
                  numberOfResults:(NSInteger)k
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    // Ensure the index is loaded
    if (!index && ![self readIndexFromFile]) {
        reject(@"index_error", @"Index is not initialized or loaded", nil);
        return;
    }
    
    // Convert NSArray to C array for the query vector
    float *c_query = malloc(queryVector.count * sizeof(float));
    if (!c_query) {
        reject(@"memory_error", @"Failed to allocate memory for query vector", nil);
        return;
    }
    for (NSUInteger i = 0; i < queryVector.count; ++i) {
        c_query[i] = [queryVector[i] floatValue];
    }
    
    // Allocate memory for results
    faiss_idx_t *labels = malloc(k * sizeof(faiss_idx_t));
    float *distances = malloc(k * sizeof(float));
    if (!labels || !distances) {
        free(c_query);
        free(labels);
        free(distances);
        reject(@"memory_error", @"Failed to allocate memory for search results", nil);
        return;
    }
    
    // Perform the search
    faiss_Index_search((FaissIndex *)index, 1, c_query, k, distances, labels);
    
    // Convert search results to NSArray
    NSMutableArray *results = [NSMutableArray arrayWithCapacity:k];
    for (NSUInteger i = 0; i < k; ++i) {
        [results addObject:@{@"label": @(labels[i]), @"distance": @(distances[i])}];
    }
    
    // Clean up
    free(c_query);
    free(labels);
    free(distances);
    
    // Return the search results
    resolve(results);
}

// Initialize the index with the given dimension
- (void)initializeAndTrainIndexWithDimension:(int)d {
    if (!index) {
        // Since it's an IndexFlat, no training is required, just initialize
        // Decide the metric type based on your needs, METRIC_INNER_PRODUCT for inner product,
        // METRIC_L2 for L2 distance (squared Euclidean)
        faiss_IndexFlat_new_with(&index, (idx_t)d, METRIC_INNER_PRODUCT);
        
        // No training needed for IndexFlat, but if you had a type of index that required training,
        // you would call faiss_Index_train here.
    }
}

// Remember to deallocate the index when it's no longer needed
- (void)dealloc {
    if (index) {
        faiss_IndexFlat_free(index);
        index = NULL;
    }
}

// Method to get the file path for the FAISS index within the app's document directory
- (NSString *)indexPath {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths firstObject];
    return [documentsDirectory stringByAppendingPathComponent:@"index.faiss"];
}

// Write the index to file
- (BOOL)writeIndexToFile {
    NSString *filePath = [self indexPath];
    const char *c_filePath = [filePath UTF8String];
    if (faiss_write_index_fname((FaissIndex *)index, c_filePath) != 0) {
        NSLog(@"Failed to write index to file");
        return NO;
    }
    return YES;
}

// New method to read and load the index from file
- (BOOL)readIndexFromFile {
    NSString *filePath = [self indexPath];
    const char *c_filePath = [filePath UTF8String];
    
    // Attempt to read the index from the file
    FaissIndex *tempIndex = NULL; // Use appropriate index type
    if (faiss_read_index_fname(c_filePath, 0, &tempIndex) != 0) {
        NSLog(@"Failed to read index from file");
        return NO;
    }
    
    // If there's an existing index, free it before replacing
    if (index != NULL) {
        faiss_Index_free((FaissIndex *)index);
    }
    
    // Update the index reference to the newly loaded index
    index = (FaissIndexFlat*)tempIndex; // Cast as necessary for your specific index type
    
    return YES;
}

@end
