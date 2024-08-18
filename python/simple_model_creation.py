import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader

# Ensure reproducibility
torch.manual_seed(0)

# Sample paragraph
paragraph = "This is a sample paragraph for training our RNN. The RNN will learn to predict the next word based on the current word."

# 1. Create the dictionary of words (vocabulary)
words = paragraph.lower().split()
vocab = sorted(set(words))
vocab_size = len(vocab)

# 2. Create a word-to-index and index-to-word mapping
word_to_idx = {word: i for i, word in enumerate(vocab)}
idx_to_word = {i: word for i, word in enumerate(vocab)}

# 3. Prepare the dataset
class WordPredictionDataset(Dataset):
    def __init__(self, words, word_to_idx):
        self.words = words
        self.word_to_idx = word_to_idx
        self.inputs = []
        self.outputs = []
        self.prepare_data()

    def prepare_data(self):
        for i in range(len(self.words) - 1):
            input_word = self.words[i]
            output_word = self.words[i + 1]
            input_vector = self.word_to_one_hot(input_word)
            output_vector = self.word_to_one_hot(output_word)
            self.inputs.append(input_vector)
            self.outputs.append(output_vector)

    def word_to_one_hot(self, word):
        one_hot_vector = np.zeros(len(self.word_to_idx))
        one_hot_vector[self.word_to_idx[word]] = 1
        return one_hot_vector

    def __len__(self):
        return len(self.inputs)

    def __getitem__(self, idx):
        return torch.FloatTensor(self.inputs[idx]), torch.FloatTensor(self.outputs[idx])

dataset = WordPredictionDataset(words, word_to_idx)
dataloader = DataLoader(dataset, batch_size=1, shuffle=True)

# 4. Define the RNN model with symmetric and L2-normed weights
class SymmetricL2NormedRNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(SymmetricL2NormedRNN, self).__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size

        # Define layers
        self.rnn = nn.RNN(input_size, hidden_size, nonlinearity='relu', batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

        # Initialize weights with symmetry and L2 norm
        self._initialize_weights()

    def _initialize_weights(self):
        # Initialize RNN weights
        for name, param in self.rnn.named_parameters():
            if 'weight_ih' in name or 'weight_hh' in name:
                if param.shape[0] == param.shape[1]:  # Ensure symmetry only for square matrices
                    param.data = (param.data + param.data.t()) / 2

                # Normalize rows to have unit L2 norm
                row_norms = torch.norm(param.data, p=2, dim=1, keepdim=True)
                param.data = param.data / row_norms

        # Ensure positive determinant by making small adjustments if necessary
        self.fc.weight.data = self.fc.weight.data.abs() + 1e-5

    def forward(self, x):
        out, _ = self.rnn(x)
        out = self.fc(out)
        return out

# Hyperparameters
input_size = vocab_size
hidden_size = 50  # You can adjust this
output_size = vocab_size
learning_rate = 0.001
num_epochs = 100  # Training for 3 epochs

# Instantiate the model
model = SymmetricL2NormedRNN(input_size, hidden_size, output_size)

# Loss and optimizer
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=learning_rate)

# 5. Training the model over 3 epochs
for epoch in range(num_epochs):
    model.train()
    for i, (inputs, targets) in enumerate(dataloader):
        inputs = inputs.unsqueeze(0)  # Adding batch dimension
        targets = targets.unsqueeze(0)

        # Forward pass
        outputs = model(inputs)
        loss = criterion(outputs, targets)

        # Backward pass and optimization
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if (i + 1) % 100 == 0:
            print(f'Epoch [{epoch+1}/{num_epochs}], Step [{i+1}/{len(dataloader)}], Loss: {loss.item():.4f}')

    # 6. Testing the model after each epoch
    model.eval()
    test_sentence = words[:len(words)-1]
    predicted_sentence = []

    with torch.no_grad():
        for word in test_sentence:
            input_vector = dataset.word_to_one_hot(word)
            input_vector = torch.FloatTensor(input_vector).unsqueeze(0).unsqueeze(0)
            output_vector = model(input_vector)
            predicted_word = idx_to_word[torch.argmax(output_vector).item()]
            predicted_sentence.append(predicted_word)

    print(f'--- After Epoch {epoch+1} ---')
    print(f'Original Sentence: {" ".join(words)}')
    print(f'Predicted Sentence: {" ".join(predicted_sentence)}')

# Save the model for CoreML conversion
torch.save(model.state_dict(), "rnn_model.pth")
