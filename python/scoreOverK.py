import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA
from mpl_toolkits.mplot3d import Axes3D

# Load the Iris dataset
iris = load_iris()
X = iris.data

print(len(X))

# Initialize lists to store the number of clusters, silhouette scores, and max points in any cluster
k_values = []
silhouette_scores = []
max_points_in_cluster = []

# Perform k-means clustering for k from 2 to n (number of data points)
for k in range(2, len(X) + 1):
    kmeans = KMeans(n_clusters=k, random_state=42)
    labels = kmeans.fit_predict(X)
    silhouette_avg = silhouette_score(X, labels)

    # Calculate the maximum number of points in any cluster
    unique, counts = np.unique(labels, return_counts=True)
    max_points = np.max(counts)
    min_points = np.min(counts)

    k_values.append(k)
    silhouette_scores.append(silhouette_avg)
    max_points_in_cluster.append(max_points)

    # Print the labels when k equals the number of points in X
    if k == len(X):
        print("Labels for k=150:", labels)

# Plot the silhouette scores over the range of k
plt.figure(figsize=(10, 6))
plt.plot(k_values, silhouette_scores, marker='o', label='Silhouette Score')
plt.title('Silhouette Scores for K-Means Clustering on Iris Dataset')
plt.xlabel('Number of clusters (k)')
plt.ylabel('Silhouette Score')
plt.grid(True)
plt.show()

# Plot the maximum number of points in any cluster over the range of k
plt.figure(figsize=(10, 6))
plt.plot(k_values, max_points_in_cluster, marker='o', color='red', label='Max Points in Cluster')
plt.title('Maximum Number of Points in Any Cluster for K-Means on Iris Dataset')
plt.xlabel('Number of clusters (k)')
plt.ylabel('Max Points in Cluster')
plt.grid(True)
plt.show()

# PCA to reduce the Iris data to 3D
pca = PCA(n_components=3)
X_pca = pca.fit_transform(X)

# Perform k-means clustering for k = 10
kmeans = KMeans(n_clusters=10, random_state=42)
labels = kmeans.fit_predict(X)

# Plotting the 3D PCA projection with the labels for k = 10
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Scatter plot, using the labels to determine the color
scatter = ax.scatter(X_pca[:, 0], X_pca[:, 1], X_pca[:, 2], c=labels, cmap='viridis', s=50)

# Add color bar
legend1 = ax.legend(*scatter.legend_elements(), title="Clusters")
ax.add_artist(legend1)

ax.set_title('3D PCA of Iris Data with K-Means Labels (k=10)')
ax.set_xlabel('PCA Component 1')
ax.set_ylabel('PCA Component 2')
ax.set_zlabel('PCA Component 3')
plt.show()
