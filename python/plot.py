import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Paste the reduced data here
data_str = """
-0.846233 -0.200974 0.083784
-0.854786 0.175065 0.334830
-0.904604 0.150785 0.020778
-0.863676 0.282104 0.001994
-0.858939 -0.206548 -0.078484
-0.731334 -0.520605 -0.186574
-0.885101 0.108751 -0.309264
-0.829714 -0.082790 0.075484
-0.903861 0.479073 0.016846
-0.842994 0.127169 0.317184
-0.795752 -0.447683 0.148974
-0.825899 0.029822 -0.095084
-0.875291 0.219086 0.329852
-1.000000 0.428380 -0.038905
-0.835015 -0.851977 0.253917
-0.761302 -0.972651 -0.336609
-0.828968 -0.573139 -0.144637
-0.836025 -0.195257 0.008720
-0.708244 -0.620227 0.210842
-0.818842 -0.348060 -0.248442
-0.739710 -0.255478 0.374683
-0.806225 -0.287030 -0.241280
-0.997760 -0.060126 -0.356715
-0.737566 -0.033795 -0.008408
-0.752673 0.069223 -0.126537
-0.795672 0.151594 0.393903
-0.784888 -0.058220 -0.085128
-0.811529 -0.237580 0.153342
-0.833529 -0.195401 0.246052
-0.831379 0.190186 -0.010675
-0.818674 0.195759 0.151594
-0.768110 -0.270310 0.245524
-0.836187 -0.575172 -0.264950
-0.821905 -0.787117 -0.171629
-0.832786 0.132887 0.242120
-0.898123 -0.011566 0.271388
-0.829455 -0.413064 0.414436
-0.879444 -0.162527 -0.083462
-0.930678 0.410627 -0.054896
-0.819417 -0.132529 0.155526
-0.870730 -0.158651 -0.060837
-0.893315 0.753793 0.525664
-0.935494 0.300002 -0.219348
-0.766880 -0.102097 -0.317481
-0.710999 -0.289808 -0.365442
-0.854874 0.230522 0.179724
-0.804641 -0.340645 -0.183862
-0.890493 0.213658 -0.069748
-0.806048 -0.397944 0.068932
-0.851714 -0.040611 0.168194
0.284610 -0.478054 0.604516
0.184222 -0.200169 0.070169
0.335747 -0.341017 0.510668
-0.029234 0.668190 0.292373
0.228560 -0.015525 0.468630
0.101361 0.357818 -0.011094
0.230542 -0.173757 -0.188131
-0.294907 0.802222 0.028476
0.216031 -0.132012 0.616574
-0.083957 0.588741 -0.341237
-0.226160 1.000000 0.416453
0.064329 0.119750 -0.134137
-0.005967 0.457653 1.000000
0.199165 0.135534 0.130816
-0.131021 0.234042 -0.079004
0.182903 -0.312925 0.478068
0.106664 0.308368 -0.405715
-0.014194 0.293703 0.418302
0.187711 0.452433 0.732344
-0.068579 0.483256 0.368575
0.236589 0.105080 -0.586685
0.020505 0.093194 0.361495
0.288417 0.289291 0.523772
0.181156 0.179411 0.363169
0.122213 -0.071935 0.487942
0.175015 -0.207874 0.480252
0.298059 -0.144192 0.762852
0.362388 -0.161657 0.272198
0.150260 0.164724 -0.003322
-0.168533 0.319953 0.483391
-0.100876 0.575174 0.381243
-0.135493 0.556323 0.466791
-0.042594 0.278871 0.289143
0.311735 0.359869 0.023161
0.086071 0.407846 -0.565799
0.148427 -0.106120 -0.489515
0.266337 -0.267806 0.371552
0.150774 0.322812 0.890772
-0.011386 0.244397 -0.213651
-0.034050 0.557565 0.127921
0.050967 0.549069 0.078822
0.172348 0.067088 0.059074
-0.015777 0.347317 0.360885
-0.282202 0.807795 0.190744
0.020247 0.423468 0.022543
0.013110 0.202074 -0.069030
0.025727 0.263104 -0.061868
0.101619 0.027543 0.327858
-0.339739 0.613749 0.062722
0.003727 0.305283 0.030843
0.639729 0.048441 -1.000000
0.321768 0.476500 -0.362114
0.664085 -0.219539 0.197753
0.480268 0.177131 -0.103713
0.588105 0.071479 -0.347079
0.886428 -0.376298 0.524573
0.067046 0.944538 -0.705007
0.754095 -0.228324 0.623317
0.579905 0.225692 0.524390
0.749583 -0.552013 -0.536785
0.392012 -0.142517 -0.288014
0.432365 0.204334 0.097170
0.535561 -0.122856 -0.000436
0.302087 0.629449 -0.342284
0.370402 0.449778 -0.819659
0.461157 -0.049357 -0.614215
0.474045 0.009207 -0.015371
0.912075 -0.849685 -0.138740
1.000000 -0.153951 0.751939
0.289160 0.617579 0.519839
0.610275 -0.245517 -0.255942
0.260157 0.500117 -0.658519
0.915741 -0.307997 0.833647
0.314226 0.195820 0.134128
0.566856 -0.212787 -0.348125
0.663348 -0.383923 0.328050
0.277112 0.177113 -0.017656
0.286407 0.129361 -0.272634
0.523599 0.199858 -0.166636
0.598931 -0.311001 0.663598
0.728192 -0.243300 0.731490
0.839027 -1.000000 0.202924
0.533807 0.205576 -0.241700
0.330009 0.149621 0.256125
0.426066 0.419674 0.283136
0.795099 -0.480269 0.506909
0.529478 -0.065124 -0.965226
0.461340 0.003633 -0.177639
0.251702 0.165966 -0.342191
0.519041 -0.241041 0.007864
0.577890 -0.098142 -0.398380
0.466232 -0.269006 -0.110811
0.321768 0.476500 -0.362114
0.648795 -0.169511 -0.356952
0.607690 -0.189916 -0.648380
0.472455 -0.101082 -0.199153
0.353659 0.325297 0.213032
0.421237 -0.018758 -0.134046
0.460156 -0.047370 -0.949236
0.314631 0.255106 -0.453686
"""

# Paste the labels here
labels_str = "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1"

# Ellipsoid data
ellipsoids_str = """
Mean: (
    "-0.8044212",
    "-0.05579869",
    "0.03052511"
)
Eigenvalues: (
    "0.1628761",
    "0.04494615",
    "0.01777935"
)
Eigenvectors: (
        (
        "0.09133316",
        "0.02006962",
        "-0.9956182"
    ),
        (
        "0.9759778",
        "0.1967883",
        "0.0934983"
    ),
        (
        "0.1978024",
        "-0.9802406",
        "-0.001614202"
    )
)
Mean: (
    "0.3135517",
    "0.0938597",
    "0.05351982"
)
Eigenvalues: (
    "0.2047975",
    "0.1696981",
    "0.02737094"
)
Eigenvectors: (
        (
        "0.01036784",
        "-0.5858889",
        "-0.8103252"
    ),
        (
        "-0.1719675",
        "0.7972504",
        "-0.5786355"
    ),
        (
        "0.9850481",
        "0.1453488",
        "-0.09248807"
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

def check_orthogonality_and_unit_length(eigenvectors):
    orthogonal = True
    unit_length = True

    for i in range(3):
        # Check if the eigenvector is unit length
        norm = np.linalg.norm(eigenvectors[:, i])
        print(f"Norm of eigenvector {i+1}: {norm:.6f}")
        if not np.isclose(norm, 1, atol=1e-6):
            unit_length = False

        # Check orthogonality with other eigenvectors
        for j in range(i + 1, 3):
            dot_product = np.dot(eigenvectors[:, i], eigenvectors[:, j])
            print(f"Dot product of eigenvector {i+1} and eigenvector {j+1}: {dot_product:.6f}")
            if not np.isclose(dot_product, 0, atol=1e-6):
                orthogonal = False

    return orthogonal, unit_length

def construct_covariance_matrix(eigvals, eigvecs):
    # Construct the diagonal matrix from the eigenvalues
    Lambda = np.diag(eigvals)
    # Construct the covariance matrix
    covariance_matrix = eigvecs @ Lambda @ eigvecs.T
    return covariance_matrix

def compute_covariance_from_data(points):
    # Center the data by subtracting the mean
    mean = np.mean(points, axis=0)
    centered_data = points - mean

    # Compute the covariance matrix as data * dataTranspose
    covariance_matrix = (centered_data.T @ centered_data) / (centered_data.shape[0] - 1)
#     covariance_matrix = (centered_data.T @ centered_data)

    return covariance_matrix

for i, ellipsoid in enumerate(ellipsoids):
    print(f"\nEllipsoid {i+1}:")
    orthogonal, unit_length = check_orthogonality_and_unit_length(ellipsoid["eigenvectors"])
    if orthogonal:
        print("Axes are orthogonal.")
    else:
        print("Axes are not orthogonal.")

    if unit_length:
        print("Eigenvectors are of unit length.")
    else:
        print("Eigenvectors are not of unit length.")

    # Construct and print the covariance matrix
    covariance_matrix = construct_covariance_matrix(ellipsoid["eigenvalues"], ellipsoid["eigenvectors"])
    print(f"Covariance Matrix:\n{covariance_matrix}\n")

    # Filter data points belonging to the current ellipsoid's label
    ellipsoid_data = data[labels == i]

    # Compute and print the covariance matrix from the data points
    data_covariance_matrix = compute_covariance_from_data(ellipsoid_data)
    print(f"Covariance Matrix (from data points):\n{data_covariance_matrix}\n")

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
