// PlotView.m
#import <OpenGLES/ES3/gl.h>
#import <OpenGLES/ES3/glext.h>
#import "PlotView.h"
#import <React/RCTViewManager.h>
#import "ClusteringAndEllipsoids.h"
#import "FaissBridge.h"
#import "CobaltMobileRN-Swift.h" // Import the Swift module

#define GLES_SILENCE_DEPRECATION

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
@property (nonatomic, assign) GLuint shaderProgram;
@property (nonatomic, assign) GLfloat *vertices;
@property (nonatomic, assign) GLsizei vertexCount;
@property (nonatomic, assign) GLuint vertexArray;   // Declare vertexArray
@property (nonatomic, assign) GLuint vertexBuffer;  // Declare vertexBuffer
@property (nonatomic, assign) CGPoint lastTouchLocation;
@property (nonatomic, assign) GLKMatrix4 rotationMatrix;
@property (nonatomic, assign) GLKMatrix4 projectionMatrix;

@end

@implementation PlotView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self setupGL];
        [self loadClusteringDataInBackground];
        self.rotationMatrix = GLKMatrix4Identity; // Initialize rotation matrix
    }
    return self;
}

- (void)loadClusteringDataInBackground {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
//        [self loadClusteringData];
        [self loadTestData];
    });
}

- (void)loadTestData {
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
        self.clusteringResults = [clusteringAndEllipsoids performClusteringAndEllipsoids:data rows:rowsCount cols:colsCount];
      
        // Trigger a redraw to render the ellipsoid
        dispatch_async(dispatch_get_main_queue(), ^{
            [self setNeedsDisplay];
        });

        // Free allocated memory
        free(data);
    }
    @catch (NSException *exception) {
        NSLog(@"An error occurred: %@\nStack trace: %@", exception.reason, exception.callStackSymbols);
    }
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
      
        // Trigger a redraw to render the ellipsoid
        dispatch_async(dispatch_get_main_queue(), ^{
            [self setNeedsDisplay];
        });

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

- (void)setupGL {
    self.context = [[EAGLContext alloc] initWithAPI:kEAGLRenderingAPIOpenGLES3];
    if (!self.context) {
        NSLog(@"Failed to create ES context");
    }

    [EAGLContext setCurrentContext:self.context];
    
    // Initialize shaders and program
    [self setupShaders];
    glEnable(GL_DEPTH_TEST);
    
    // Setup projection matrix
//    float aspectRatio = self.bounds.size.width / self.bounds.size.height;
    self.projectionMatrix = GLKMatrix4MakeOrtho(-1.0f, 1.0f, -1.0f, 1.0f, -1.0f, 1.0f);
}

- (void)setupShaders {
    const GLchar *vertexShaderSource = "#version 300 es\n"
                                       "layout(location = 0) in vec3 aPos;\n"
                                       "layout(location = 1) in vec3 aColor;\n"
                                       "out vec3 vertexColor;\n"
                                       "uniform mat4 uModelViewProjectionMatrix;\n"
                                       "void main() {\n"
                                       "   gl_Position = uModelViewProjectionMatrix * vec4(aPos, 1.0);\n"
                                       "   vertexColor = aColor;\n"
                                       "}\n";

    const GLchar *fragmentShaderSource = "#version 300 es\n"
                                         "precision mediump float;\n"
                                         "in vec3 vertexColor;\n"
                                         "out vec4 FragColor;\n"
                                         "void main() {\n"
                                         "   FragColor = vec4(vertexColor, 1.0);\n"
                                         "}\n";

    GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
    glCompileShader(vertexShader);
    [self checkShaderCompilation:vertexShader];

    GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
    glCompileShader(fragmentShader);
    [self checkShaderCompilation:fragmentShader];

    self.shaderProgram = glCreateProgram();
    glAttachShader(self.shaderProgram, vertexShader);
    glAttachShader(self.shaderProgram, fragmentShader);
    glLinkProgram(self.shaderProgram);
    [self checkProgramLinking:self.shaderProgram];

    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);
}

- (void)drawRect:(CGRect)rect {
    CGFloat scale = [UIScreen mainScreen].scale;
    glViewport(0, 0, self.bounds.size.width * scale, self.bounds.size.height * scale);

    glClearColor(1.0f, 1.0f, 1.0f, 1.0f);  // Set the clear color to white
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // Use the shader program
    glUseProgram(self.shaderProgram);

    // Apply the projection matrix and rotation matrix
    GLKMatrix4 modelViewProjectionMatrix = GLKMatrix4Multiply(self.projectionMatrix, self.rotationMatrix);
    GLuint mvpMatrixLocation = glGetUniformLocation(self.shaderProgram, "uModelViewProjectionMatrix");
    glUniformMatrix4fv(mvpMatrixLocation, 1, GL_FALSE, modelViewProjectionMatrix.m);

    // Draw the crosshair and reduced data
    [self drawCrosshair];
    [self drawReducedData];
}

- (void)drawCrosshair {
    // Define the crosshair vertices and colors
    GLfloat vertices[] = {
        // X axis (negative part black, positive part red)
        -1.0f, 0.0f, 0.0f,  0.0f, 0.0f, 0.0f,  // Start point (black)
         1.0f, 0.0f, 0.0f,  1.0f, 0.0f, 0.0f,  // End point (red)
        // Y axis (negative part black, positive part green)
         0.0f, -1.0f, 0.0f,  0.0f, 0.0f, 0.0f,  // Start point (black)
         0.0f,  1.0f, 0.0f,  0.0f, 1.0f, 0.0f,  // End point (green)
        // Z axis (negative part black, positive part blue)
         0.0f, 0.0f, -1.0f,  0.0f, 0.0f, 0.0f,  // Start point (black)
         0.0f, 0.0f,  1.0f,  0.0f, 0.0f, 1.0f   // End point (blue)
    };

    self.vertexCount = 6; // 6 lines with 2 vertices each

    // Set up vertex array and buffer
    glGenVertexArrays(1, &_vertexArray);
    glGenBuffers(1, &_vertexBuffer);

    glBindVertexArray(self.vertexArray);

    glBindBuffer(GL_ARRAY_BUFFER, self.vertexBuffer);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    // Position attribute
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(GLfloat), (GLvoid *)0);
    glEnableVertexAttribArray(0);

    // Color attribute
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(GLfloat), (GLvoid *)(3 * sizeof(GLfloat)));
    glEnableVertexAttribArray(1);

    glBindBuffer(GL_ARRAY_BUFFER, 0);

    // Draw the 3D crosshair
    glDrawArrays(GL_LINES, 0, self.vertexCount * 2);

    // Cleanup
    glBindVertexArray(0);
    glDeleteVertexArrays(1, &_vertexArray);
    glDeleteBuffers(1, &_vertexBuffer);
}

- (void)drawReducedData {
    if (!self.clusteringResults) {
        return; // Exit early if clustering results are not available
    }

    // Retrieve reduced data and labels
    float *reducedData = [(NSValue *)self.clusteringResults[@"reducedData"] pointerValue];
    int *labels = [(NSValue *)self.clusteringResults[@"bestLabels"] pointerValue];
    int rowsCount = [(NSNumber *)self.clusteringResults[@"rows"] intValue];

    // Generate vertex data and colors based on labels
    GLfloat *vertices = (GLfloat *)malloc(rowsCount * 3 * sizeof(GLfloat));
    GLfloat *colors = (GLfloat *)malloc(rowsCount * 3 * sizeof(GLfloat));

    for (int i = 0; i < rowsCount; i++) {
        vertices[i * 3 + 0] = reducedData[i * 3 + 0];
        vertices[i * 3 + 1] = reducedData[i * 3 + 1];
        vertices[i * 3 + 2] = reducedData[i * 3 + 2];

        // Print the reduced data values
        NSLog(@"Reduced Data [%d]: x=%f, y=%f, z=%f", i, vertices[i * 3 + 0], vertices[i * 3 + 1], vertices[i * 3 + 2]);

        // Assign colors based on labels (for simplicity, map labels 0, 1, 2 to red, green, blue)
        switch (labels[i]) {
            case 0:
                colors[i * 3 + 0] = 1.0f; // Red
                colors[i * 3 + 1] = 0.0f;
                colors[i * 3 + 2] = 0.0f;
                break;
            case 1:
                colors[i * 3 + 0] = 0.0f;
                colors[i * 3 + 1] = 1.0f; // Green
                colors[i * 3 + 2] = 0.0f;
                break;
            case 2:
                colors[i * 3 + 0] = 0.0f;
                colors[i * 3 + 1] = 0.0f;
                colors[i * 3 + 2] = 1.0f; // Blue
                break;
            default:
                colors[i * 3 + 0] = 0.0f;
                colors[i * 3 + 1] = 0.0f;
                colors[i * 3 + 2] = 0.0f; // Black for other labels
                break;
        }
    }

    // Set up vertex array and buffer for reduced data
    GLuint dataVAO, dataVBO, colorVBO;
    glGenVertexArrays(1, &dataVAO);
    glGenBuffers(1, &dataVBO);
    glGenBuffers(1, &colorVBO);

    glBindVertexArray(dataVAO);

    glBindBuffer(GL_ARRAY_BUFFER, dataVBO);
    glBufferData(GL_ARRAY_BUFFER, rowsCount * 3 * sizeof(GLfloat), vertices, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(GLfloat), (GLvoid *)0);
    glEnableVertexAttribArray(0);

    glBindBuffer(GL_ARRAY_BUFFER, colorVBO);
    glBufferData(GL_ARRAY_BUFFER, rowsCount * 3 * sizeof(GLfloat), colors, GL_STATIC_DRAW);
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(GLfloat), (GLvoid *)0);
    glEnableVertexAttribArray(1);

    glBindBuffer(GL_ARRAY_BUFFER, 0);

    // Draw the reduced data points
    glDrawArrays(GL_POINTS, 0, rowsCount);

    // Cleanup
    glBindVertexArray(0);
    glDeleteVertexArrays(1, &dataVAO);
    glDeleteBuffers(1, &dataVBO);
    glDeleteBuffers(1, &colorVBO);

    free(vertices);
    free(colors);
}

- (void)dealloc {
    ClusteringAndEllipsoids *clustering = [[ClusteringAndEllipsoids alloc] init];
    [clustering freeClusteringData:self.clusteringResults];

    if (_vertexArray) {
        glDeleteVertexArrays(1, &_vertexArray);
    }
    if (_vertexBuffer) {
        glDeleteBuffers(1, &_vertexBuffer);
    }
    if (_shaderProgram) {
        glDeleteProgram(_shaderProgram);
    }
}

- (void)checkShaderCompilation:(GLuint)shader {
    GLint success;
    glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
    if (!success) {
        GLchar infoLog[512];
        glGetShaderInfoLog(shader, 512, NULL, infoLog);
        NSLog(@"ERROR::SHADER::COMPILATION_FAILED\n%s", infoLog);
    }
}

- (void)checkProgramLinking:(GLuint)program {
    GLint success;
    glGetProgramiv(program, GL_LINK_STATUS, &success);
    if (!success) {
        GLchar infoLog[512];
        glGetProgramInfoLog(program, 512, NULL, infoLog);
        NSLog(@"ERROR::PROGRAM::LINKING_FAILED\n%s", infoLog);
    }
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    UITouch *touch = [touches anyObject];
    self.lastTouchLocation = [touch locationInView:self];
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    UITouch *touch = [touches anyObject];
    CGPoint currentTouchLocation = [touch locationInView:self];

    // Calculate the rotation based on the difference between the last and current touch location
    CGFloat dx = currentTouchLocation.x - self.lastTouchLocation.x;
    CGFloat dy = currentTouchLocation.y - self.lastTouchLocation.y;

    // Swap the roles of X and Y for the rotation
    float angleX = GLKMathDegreesToRadians(dx / 2.0f);
    float angleY = GLKMathDegreesToRadians(dy / 2.0f);

    // Create the rotation matrices for the Y and X axes
    GLKMatrix4 rotationX = GLKMatrix4MakeRotation(angleY, 1.0f, 0.0f, 0.0f); // Y axis movement affects X rotation
    GLKMatrix4 rotationY = GLKMatrix4MakeRotation(angleX, 0.0f, 1.0f, 0.0f); // X axis movement affects Y rotation

    // To maintain Y-up, apply the rotationY first, followed by rotationX
    self.rotationMatrix = GLKMatrix4Multiply(GLKMatrix4Multiply(rotationX, self.rotationMatrix), rotationY);

    // Update the last touch location
    self.lastTouchLocation = currentTouchLocation;

    // Request a redraw
    [self setNeedsDisplay];
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    self.lastTouchLocation = CGPointZero;
}

@end
