import numpy as np
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_samples
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
    centered_data = data - np.mean(data, axis=0)
    U, S, VT = svd(centered_data, full_matrices=False)
    reduced_data = U[:, :output_dim] * S[:output_dim]
    return reduced_data

def perform_pca(data, rows, cols, output_dim=3):
    centered_data = data - np.mean(data, axis=0)
    U, S, VT = svd(centered_data, full_matrices=False)
    reduced_data = U[:, :output_dim] * S[:output_dim]

    # Align the signs of the principal components with those from the library PCA
    for i in range(output_dim):
        if np.sign(reduced_data[0, i]) != np.sign(reduced_data_lib[0, i]):
            reduced_data[:, i] = -reduced_data[:, i]

    return reduced_data


def fit_single_3d_gaussian(cluster_points, n):
    mean = np.mean(cluster_points, axis=0)
    centered_data = cluster_points - mean
    covariance_matrix = np.cov(centered_data, rowvar=False)
    eigenvalues, eigenvectors = np.linalg.eigh(covariance_matrix)

    ellipsoid = {
        "mean": mean,
        "eigenvalues": eigenvalues,
        "eigenvectors": eigenvectors
    }

    return ellipsoid

def perform_kmeans_clustering_lib(data, rows, cols, k, max_iterations):
    kmeans = KMeans(n_clusters=k, max_iter=max_iterations, n_init=10, random_state=42)
    labels = kmeans.fit_predict(data)
    centroids = kmeans.cluster_centers_
    return labels, centroids

def calculate_silhouette_score_lib(data, labels, rows, cols, k):
    silhouette_scores = silhouette_samples(data, labels)
    average_silhouette_score = np.mean(silhouette_scores)
    cluster_silhouette_scores = np.zeros(k)
    cluster_counts = np.zeros(k)

    for i in range(k):
        cluster_silhouette_scores[i] = np.mean(silhouette_scores[labels == i])
        cluster_counts[i] = np.sum(labels == i)

    return {
        "averageSilhouetteScore": average_silhouette_score,
        "clusterSilhouetteScores": cluster_silhouette_scores,
        "silhouetteScores": silhouette_scores,
        "clusterCounts": cluster_counts
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

# Test PCA
reduced_data_ported = perform_pca(X, rows, cols, output_dim=3)
reduced_data_lib = perform_pca_lib(X, rows, cols, output_dim=3)

# Fit 3D Gaussian and get ellipsoids
ellipsoid_ported = fit_single_3d_gaussian(reduced_data_ported, len(reduced_data_ported))
ellipsoid_lib = fit_single_3d_gaussian_lib(reduced_data_lib, len(reduced_data_lib))

# Plotting
fig = plt.figure(figsize=(14, 6))

# Ported PCA Reduced Data
ax1 = fig.add_subplot(121, projection='3d')
ax1.scatter(reduced_data_ported[:, 0], reduced_data_ported[:, 1], reduced_data_ported[:, 2], c=y[:len(reduced_data_ported)], cmap='viridis', edgecolor='k')
ax1.set_title('Ported PCA Reduced Data')
ax1.set_xlabel('PC1')
ax1.set_ylabel('PC2')
ax1.set_zlabel('PC3')

# Draw ellipsoid for ported data
u, v = np.mgrid[0:2 * np.pi:20j, 0:np.pi:10j]
x = np.cos(u) * np.sin(v)
y_ = np.sin(u) * np.sin(v)
z = np.cos(v)
for i in range(len(ellipsoid_ported["eigenvalues"])):
    scale = np.sqrt(ellipsoid_ported["eigenvalues"][i])
    ellipsoid_data = np.array([x.ravel(), y_.ravel(), z.ravel()])
    ellipsoid_data = np.dot(ellipsoid_ported["eigenvectors"], ellipsoid_data) * scale
    x_ellipsoid = ellipsoid_data[0, :].reshape(x.shape) + ellipsoid_ported["mean"][0]
    y_ellipsoid = ellipsoid_data[1, :].reshape(y_.shape) + ellipsoid_ported["mean"][1]
    z_ellipsoid = ellipsoid_data[2, :].reshape(z.shape) + ellipsoid_ported["mean"][2]
    ax1.plot_wireframe(x_ellipsoid, y_ellipsoid, z_ellipsoid, color='r', alpha=0.1)

# Library PCA Reduced Data
ax2 = fig.add_subplot(122, projection='3d')
ax2.scatter(reduced_data_lib[:, 0], reduced_data_lib[:, 1], reduced_data_lib[:, 2], c=y[:len(reduced_data_lib)], cmap='viridis', edgecolor='k')
ax2.set_title('Library PCA Reduced Data')
ax2.set_xlabel('PC1')
ax2.set_ylabel('PC2')
ax2.set_zlabel('PC3')

# Draw ellipsoid for library data
for i in range(len(ellipsoid_lib["eigenvalues"])):
    scale = np.sqrt(ellipsoid_lib["eigenvalues"][i])
    ellipsoid_data = np.array([x.ravel(), y_.ravel(), z.ravel()])
    ellipsoid_data = np.dot(ellipsoid_lib["eigenvectors"], ellipsoid_data) * scale
    x_ellipsoid = ellipsoid_data[0, :].reshape(x.shape) + ellipsoid_lib["mean"][0]
    y_ellipsoid = ellipsoid_data[1, :].reshape(y_.shape) + ellipsoid_lib["mean"][1]
    z_ellipsoid = ellipsoid_data[2, :].reshape(z.shape) + ellipsoid_lib["mean"][2]
    ax2.plot_wireframe(x_ellipsoid, y_ellipsoid, z_ellipsoid, color='r', alpha=0.1)

plt.show()
