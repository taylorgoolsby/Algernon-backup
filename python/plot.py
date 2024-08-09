import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Paste the reduced data here
data_str = """
-0.342187 0.431729 0.668220
-0.635385 -0.346490 -0.475637
0.462600 0.544714 -0.489170
0.514971 -0.629953 0.296587
"""

# Paste the labels here
labels_str = "0 0 0 0"

# Ellipsoid data
ellipsoids_str = """
Mean: (
    "1.490116e-08",
    "-6.705523e-08",
    "1.490116e-08"
)
Eigenvalues: (
    "0.3333333",
    "0.3333333",
    "0.3333332"
)
Eigenvectors: (
        (
        "-1",
        "1.212867e-07",
        "1.421085e-14"
    ),
        (
        "-8.195639e-08",
        "-0.6757245",
        "-0.7371542"
    ),
        (
        "-8.940697e-08",
        "-0.7371542",
        "0.6757245"
    )
)
"""

# Convert the string data to a NumPy array
data = np.array([list(map(float, line.split())) for line in data_str.strip().split('\n')])

# Convert the labels to a NumPy array
labels = np.array(list(map(int, labels_str.split())))

# Parse the ellipsoids data
import re

def parse_ellipsoids(ellipsoids_str):
    means = re.findall(r'Mean: \(\s*\"([\d\.\-e]+)\",\s*\"?([\d\.\-e]+)?\"?,\s*\"?([\d\.\-e]+)?\"?\s*\)', ellipsoids_str)
    eigenvalues = re.findall(r'Eigenvalues: \(\s*\"([\d\.\-e]+)\",\s*\"([\d\.\-e]+)\",\s*\"([\d\.\-e]+)\"\s*\)', ellipsoids_str)
    eigenvectors = re.findall(r'Eigenvectors: \(\s*\(\s*\"([\d\.\-e]+)\",\s*\"([\d\.\-e]+)\",\s*\"([\d\.\-e]+)\"\s*\),\s*\(\s*\"([\d\.\-e]+)\",\s*\"([\d\.\-e]+)\",\s*\"([\d\.\-e]+)\"\s*\),\s*\(\s*\"([\d\.\-e]+)\",\s*\"([\d\.\-e]+)\",\s*\"([\d\.\-e]+)\"\s*\)\s*\)', ellipsoids_str)

    ellipsoids = []
    for mean, eigvals, eigvecs in zip(means, eigenvalues, eigenvectors):
        mean = np.array([float(m) if m else 0 for m in mean], dtype=float)
        eigvals = np.array(eigvals, dtype=float)
        eigvecs = np.array(eigvecs, dtype=float).reshape(3, 3)
        ellipsoids.append({"mean": mean, "eigenvalues": eigvals, "eigenvectors": eigvecs})

    return ellipsoids

ellipsoids = parse_ellipsoids(ellipsoids_str)

print("\nEllipsoids: \n", ellipsoids)

# Plotting the reduced data with labels and ellipsoids
fig = plt.figure(figsize=(8, 6))
ax = fig.add_subplot(111, projection='3d')
scatter = ax.scatter(data[:, 0], data[:, 1], data[:, 2], c=labels, cmap='viridis', edgecolor='k')
legend1 = ax.legend(*scatter.legend_elements(), title="Labels")
ax.add_artist(legend1)
ax.set_title('Reduced Data')
ax.set_xlabel('PC1')
ax.set_ylabel('PC2')
ax.set_zlabel('PC3')

# Draw ellipsoids as lines
for ellipsoid in ellipsoids:
    mean = ellipsoid["mean"]
    eigvals = ellipsoid["eigenvalues"]
    eigvecs = ellipsoid["eigenvectors"]
    for i in range(3):
        start = mean - np.sqrt(eigvals[i]) * eigvecs[:, i]
        end = mean + np.sqrt(eigvals[i]) * eigvecs[:, i]
        ax.plot([start[0], end[0]], [start[1], end[1]], [start[2], end[2]], color='k')

plt.show()
