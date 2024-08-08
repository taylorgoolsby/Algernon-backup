import numpy as np
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_samples, silhouette_score
from scipy.linalg import svd
from sklearn.datasets import load_iris
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def perform_kmeans_clustering(data, rows, cols, k, max_iterations):
    np.random.seed(42)
    centroids = data[np.random.choice(rows, k, replace=False)]
    labels = np.zeros(rows, dtype=int)

    for iteration in range(max_iterations):
        distances = np.linalg.norm(data[:, np.newaxis] - centroids, axis=2)
        labels = np.argmin(distances, axis=1)
        new_centroids = np.array([data[labels == i].mean(axis=0) for i in range(k)])

        if np.all(centroids == new_centroids):
            break
        centroids = new_centroids

    return labels, centroids

def calculate_silhouette_score(data, labels, rows, cols, k):
    a = np.zeros(rows)
    b = np.zeros(rows)
    silhouette_scores = np.zeros(rows)
    cluster_silhouette_scores = np.zeros(k)
    cluster_counts = np.zeros(k)

    for i in range(rows):
        intra_cluster_dist = 0.0
        intra_cluster_count = 0
        inter_cluster_dists = {cluster: [] for cluster in range(k) if cluster != labels[i]}

        for j in range(rows):
            if i == j:
                continue

            dist = np.linalg.norm(data[i] - data[j])

            if labels[i] == labels[j]:
                intra_cluster_dist += dist
                intra_cluster_count += 1
            else:
                inter_cluster_dists[labels[j]].append(dist)

        a[i] = intra_cluster_dist / intra_cluster_count if intra_cluster_count > 0 else 0.0
        b[i] = min([np.mean(dists) for dists in inter_cluster_dists.values()]) if inter_cluster_dists else 0.0

    silhouette_sum = 0.0
    for i in range(rows):
        s = (b[i] - a[i]) / max(a[i], b[i])
        silhouette_scores[i] = s
        silhouette_sum += s
        cluster_silhouette_scores[labels[i]] += s
        cluster_counts[labels[i]] += 1

    for i in range(k):
        if cluster_counts[i] > 0:
            cluster_silhouette_scores[i] /= cluster_counts[i]

    average_silhouette_score = silhouette_sum / rows

    return {
        "averageSilhouetteScore": average_silhouette_score,
        "clusterSilhouetteScores": cluster_silhouette_scores,
        "silhouetteScores": silhouette_scores,
        "clusterCounts": cluster_counts
    }

def perform_pca(data, rows, cols, output_dim=3):
    # Print the input data
    print("Input Data:")
    for row in data:
        print(" ".join(map(str, row)))


    mean = np.mean(data, axis=0)
    # Print the mean of each feature
    print("Mean:")
    print(" ".join(map(str, mean)))

    centered_data = data - mean

    # Print the centered data
    print("Centered Data:")
    for row in centered_data:
        print(" ".join(map(str, row)))

    U, S, VT = svd(centered_data, full_matrices=False)

    # Print the U matrix
    print("U Matrix:")
    for row in U:
        print(" ".join(map(str, row)))

    # Print the S vector
    print("S Vector:")
    print(" ".join(map(str, S)))

    # Print the VT matrix
    print("VT Matrix:")
    for row in VT:
        print(" ".join(map(str, row)))

    reduced_data = U[:, :output_dim]
    return reduced_data

def fit_single_3d_gaussian(cluster_points, n):
    mean = np.mean(cluster_points, axis=0)
    centered_data = cluster_points - mean

    # Print the centered reduced cluster points
    print("Centered Reduced Cluster Points:")
    print(centered_data)

    # Covariance matrix using numpy's np.cov
    covariance_matrix = np.cov(centered_data, rowvar=False)

    # Print the covariance matrix calculated by np.cov
    print("Covariance Matrix (np.cov):")
    print(covariance_matrix)

    # Covariance matrix using matrix multiplication and scaling
    centered_data_transposed = centered_data.T
    covariance_matrix_manual = np.dot(centered_data_transposed, centered_data) / (n - 1)

    # Print the covariance matrix calculated manually
    print("Covariance Matrix (Manual):")
    print(covariance_matrix_manual)

    # Eigenvalues and eigenvectors using np.linalg.eigh
    eigenvalues_eigh, eigenvectors_eigh = np.linalg.eigh(covariance_matrix)

    # Print eigenvalues and eigenvectors calculated by np.linalg.eigh
    print("Eigenvalues (eigh):")
    print(eigenvalues_eigh)
    print("Eigenvectors (eigh):")
    print(eigenvectors_eigh)

    # Eigenvalues and eigenvectors using SVD
    U, S, VT = np.linalg.svd(covariance_matrix)

    # Print S, U, and VT from SVD
    print("Singular Values (S):")
    print(S)
    print("U Matrix:")
    print(U)
    print("VT Matrix:")
    print(VT)

    # Compute eigenvalues from singular values
    eigenvalues_svd = S

    # Use the U matrix directly as the eigenvectors
    eigenvectors_svd = U

    # Use the results from np.linalg.eigh for the return value
    ellipsoid = {
        "mean": mean,
#         "eigenvalues": eigenvalues_eigh,
#         "eigenvectors": eigenvectors_eigh
        "eigenvalues": eigenvalues_svd,
        "eigenvectors": eigenvectors_svd
    }

    return ellipsoid

def perform_kmeans_with_silhouette_scoring(data, rows, cols, max_k, max_iterations):
    best_score = -np.inf
    best_k = 2
    best_labels = None
    best_centroids = None
    best_cluster_counts = None

    for k in range(2, max_k + 1):
        labels, centroids = perform_kmeans_clustering(data, rows, cols, k, max_iterations)
        silhouette_result = calculate_silhouette_score(data, labels, rows, cols, k)
        average_silhouette_score = silhouette_result["averageSilhouetteScore"]

        if average_silhouette_score > best_score:
            best_score = average_silhouette_score
            best_k = k
            best_labels = labels
            best_centroids = centroids
            best_cluster_counts = silhouette_result["clusterCounts"]

    return {
        "bestK": best_k,
        "bestScore": best_score,
        "bestLabels": best_labels,
        "bestCentroids": best_centroids,
        "bestClusterCounts": best_cluster_counts
    }

def perform_kmeans_with_silhouette_scoring_lib(data, max_k, max_iterations):
    best_score = -np.inf
    best_k = 2
    best_labels = None
    best_centroids = None
    best_cluster_counts = None

    for k in range(2, max_k + 1):
        kmeans = KMeans(n_clusters=k, max_iter=max_iterations, n_init=10, random_state=42)
        labels = kmeans.fit_predict(data)
        centroids = kmeans.cluster_centers_
        average_silhouette_score = silhouette_score(data, labels)

        if average_silhouette_score > best_score:
            best_score = average_silhouette_score
            best_k = k
            best_labels = labels
            best_centroids = centroids
            best_cluster_counts = np.bincount(labels, minlength=k)

    return {
        "bestK": best_k,
        "bestScore": best_score,
        "bestLabels": best_labels,
        "bestCentroids": best_centroids,
        "bestClusterCounts": best_cluster_counts
    }

def perform_pca_lib(data, rows, cols, output_dim=3):
    pca = PCA(n_components=output_dim)
    reduced_data = pca.fit_transform(data)
    return reduced_data

def fit_single_3d_gaussian_lib(cluster_points, n):
    mean = np.mean(cluster_points, axis=0)
    covariance_matrix = np.cov(cluster_points, rowvar=False)
    eigenvalues, eigenvectors = np.linalg.eigh(covariance_matrix)

    ellipsoid = {
        "mean": mean,
        "eigenvalues": eigenvalues,
        "eigenvectors": eigenvectors
    }

    return ellipsoid

# Load the IRIS dataset
iris = load_iris()
X = iris.data
y = iris.target
rows, cols = X.shape

# Print IRIS Data
print("IRIS Data (X):")
for i in range(rows):
    print(" ".join(map(str, X[i])))

# Perform K-Means Clustering with Silhouette Scoring (Ported)
kmeans_result_ported = perform_kmeans_with_silhouette_scoring(X, rows, cols, max_k=10, max_iterations=100)

# Perform K-Means Clustering with Silhouette Scoring (Library)
kmeans_result_lib = perform_kmeans_with_silhouette_scoring_lib(X, max_k=10, max_iterations=100)

# Perform PCA
reduced_data_ported = perform_pca(X, rows, cols, output_dim=3)
reduced_data_lib = perform_pca_lib(X, rows, cols, output_dim=3)

# Fit 3D Gaussian and get ellipsoids based on best k
ellipsoids_ported = []
ellipsoids_lib = []

for cluster in range(kmeans_result_ported["bestK"]):
    cluster_points = reduced_data_ported[kmeans_result_ported["bestLabels"] == cluster]
    ellipsoid = fit_single_3d_gaussian(cluster_points, len(cluster_points))
    ellipsoids_ported.append(ellipsoid)

for cluster in range(kmeans_result_lib["bestK"]):
    cluster_points = reduced_data_lib[kmeans_result_lib["bestLabels"] == cluster]
    ellipsoid = fit_single_3d_gaussian_lib(cluster_points, len(cluster_points))
    ellipsoids_lib.append(ellipsoid)

# Print best values for comparison
print("Best K (Ported):", kmeans_result_ported["bestK"])
print("Best Score (Ported):", kmeans_result_ported["bestScore"])

print("Best K (Library):", kmeans_result_lib["bestK"])
print("Best Score (Library):", kmeans_result_lib["bestScore"])

print("\nBest Labels (Ported):", " ".join(map(str, kmeans_result_ported["bestLabels"])))
print("\nBest Labels (Library):", " ".join(map(str, kmeans_result_lib["bestLabels"])))

print("\nBest Centroids (Ported):\n", kmeans_result_ported["bestCentroids"])
print("\nBest Centroids (Library):\n", kmeans_result_lib["bestCentroids"])

print("\nBest Cluster Counts (Ported):\n", kmeans_result_ported["bestClusterCounts"])
print("\nBest Cluster Counts (Library):\n", kmeans_result_lib["bestClusterCounts"])

print("\nPorted Reduced Data (PCA):\n", reduced_data_ported)
print("\nLibrary Reduced Data (PCA):\n", reduced_data_lib)

print("\nPorted Ellipsoid:\n", ellipsoids_ported)
print("\nLibrary Ellipsoid:\n", ellipsoids_lib)

# Plotting
fig = plt.figure(figsize=(14, 6))

# Ported PCA Reduced Data
ax1 = fig.add_subplot(121, projection='3d')
ax1.scatter(reduced_data_ported[:, 0], reduced_data_ported[:, 1], reduced_data_ported[:, 2], c=kmeans_result_ported["bestLabels"], cmap='viridis', edgecolor='k')
ax1.set_title('Ported PCA Reduced Data')
ax1.set_xlabel('PC1')
ax1.set_ylabel('PC2')
ax1.set_zlabel('PC3')

# Draw ellipsoid for ported data
for ellipsoid in ellipsoids_ported:
    mean = ellipsoid["mean"]
    eigenvalues = ellipsoid["eigenvalues"]
    eigenvectors = ellipsoid["eigenvectors"]
    for i in range(3):
        start = mean - np.sqrt(eigenvalues[i]) * eigenvectors[:, i]
        end = mean + np.sqrt(eigenvalues[i]) * eigenvectors[:, i]
        ax1.plot([start[0], end[0]], [start[1], end[1]], [start[2], end[2]], color='k')

# Library PCA Reduced Data
ax2 = fig.add_subplot(122, projection='3d')
ax2.scatter(reduced_data_lib[:, 0], reduced_data_lib[:, 1], reduced_data_lib[:, 2], c=kmeans_result_lib["bestLabels"], cmap='viridis', edgecolor='k')
ax2.set_title('Library PCA Reduced Data')
ax2.set_xlabel('PC1')
ax2.set_ylabel('PC2')
ax2.set_zlabel('PC3')

# Draw ellipsoid for library data
for ellipsoid in ellipsoids_lib:
    mean = ellipsoid["mean"]
    eigenvalues = ellipsoid["eigenvalues"]
    eigenvectors = ellipsoid["eigenvectors"]
    for i in range(3):
        start = mean - np.sqrt(eigenvalues[i]) * eigenvectors[:, i]
        end = mean + np.sqrt(eigenvalues[i]) * eigenvectors[:, i]
        ax2.plot([start[0], end[0]], [start[1], end[1]], [start[2], end[2]], color='k')

plt.show()
