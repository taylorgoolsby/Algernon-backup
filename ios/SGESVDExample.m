#import "SGESVDExample.h"
#import <Accelerate/Accelerate.h>

@implementation SGESVDExample

+ (void)runExample {
    /* Parameters */
    #define M 6
    #define N 5
    #define LDA M
    #define LDU M
    #define LDVT N

    /* Locals */
    int m = M, n = N, lda = LDA, ldu = LDU, ldvt = LDVT, info, lwork;
    float wkopt;
    float *work;
    /* Local arrays */
    float s[N], u[LDU*M], vt[LDVT*N];
    float a[LDA*N] = {
        8.79f,  6.11f, -9.15f,  9.57f, -3.49f,  9.84f,
        9.93f,  6.91f, -7.93f,  1.64f,  4.02f,  0.15f,
        9.83f,  5.04f,  4.86f,  8.83f,  9.80f, -8.99f,
        5.45f, -0.27f,  4.85f,  0.74f, 10.00f, -6.02f,
        3.16f,  7.98f,  3.01f,  5.80f,  4.27f, -5.31f
    };

    NSLog(@"SGESVD Example Program Results");

    /* Query and allocate the optimal workspace */
    lwork = -1;

    NSLog(@"Inputs to sgesvd_ (workspace query):");
    NSLog(@"jobu: A");
    NSLog(@"jobvt: A");
    NSLog(@"m: %d", m);
    NSLog(@"n: %d", n);
    NSLog(@"lda: %d", lda);
    NSLog(@"ldu: %d", ldu);
    NSLog(@"ldvt: %d", ldvt);
    NSLog(@"a: ");
    for (int i = 0; i < m; ++i) {
        NSMutableString *rowString = [NSMutableString stringWithCapacity:n * 10];
        for (int j = 0; j < n; ++j) {
            [rowString appendFormat:@" %6.2f", a[i + j * lda]];
        }
        NSLog(@"%@", rowString);
    }

    sgesvd_("A", "A", &m, &n, a, &lda, s, u, &ldu, vt, &ldvt, &wkopt, &lwork, &info);
    NSLog(@"Info after workspace query: %d", info);

    if (info != 0) {
        NSLog(@"The workspace query failed with info: %d", info);
        return;
    }

    lwork = (int)wkopt;
    work = (float*)malloc(lwork * sizeof(float));

    /* Print the inputs to sgesvd before the actual computation */
    NSLog(@"Inputs to sgesvd_ (SVD computation):");
    NSLog(@"jobu: A");
    NSLog(@"jobvt: A");
    NSLog(@"m: %d", m);
    NSLog(@"n: %d", n);
    NSLog(@"lda: %d", lda);
    NSLog(@"ldu: %d", ldu);
    NSLog(@"ldvt: %d", ldvt);
    NSLog(@"lwork: %d", lwork);
    NSLog(@"a: ");
    for (int i = 0; i < m; ++i) {
        NSMutableString *rowString = [NSMutableString stringWithCapacity:n * 10];
        for (int j = 0; j < n; ++j) {
            [rowString appendFormat:@" %6.2f", a[i + j * lda]];
        }
        NSLog(@"%@", rowString);
    }

    sgesvd_("A", "A", &m, &n, a, &lda, s, u, &ldu, vt, &ldvt, work, &lwork, &info);
    NSLog(@"Info after SVD computation: %d", info);

    /* Check for convergence */
    if (info > 0) {
        NSLog(@"The algorithm computing SVD failed to converge.");
        free(work);
        return;
    }

    /* Print singular values */
    printMatrix(@"Singular values", 1, n, s, 1);
    /* Print left singular vectors */
    printMatrix(@"Left singular vectors (stored columnwise)", m, n, u, ldu);
    /* Print right singular vectors */
    printMatrix(@"Right singular vectors (stored rowwise)", n, n, vt, ldvt);

    /* Free workspace */
    free(work);
}

@end

void printMatrix(NSString *desc, int m, int n, float *a, int lda) {
    NSLog(@"\n%@", desc);
    for (int i = 0; i < m; i++) {
        NSMutableString *rowString = [NSMutableString stringWithCapacity:n * 10];
        for (int j = 0; j < n; j++) {
            [rowString appendFormat:@" %6.2f", a[i + j * lda]];
        }
        NSLog(@"%@", rowString);
    }
}
