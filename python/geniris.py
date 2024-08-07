import pandas as pd
from sklearn.datasets import load_iris

# Load IRIS dataset
iris = load_iris()
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
df['target'] = iris.target

# Save to CSV
df.to_csv('iris_dataset.csv', index=False)

