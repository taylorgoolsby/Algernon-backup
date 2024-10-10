import requests
import json
import csv
import torch
import clip
import os
import time
from datasets import load_dataset

# Load the XSum dataset
dataset = load_dataset("xsum")
train_data = dataset['train']

# Load the CLIP model (RN101) and move it to the appropriate device
clip_model, preprocess = clip.load("RN101")
device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model.to(device)

# Define the maximum character length for the input sentence
max_char_length = 150

# API settings
url = "http://localhost:1234/v1/chat/completions"
headers = {
    "Content-Type": "application/json"
}
model_name = "MaziyarPanahi/Mistral-7B-Instruct-v0.3-GGUF"

# Output file and progress tracking
output_file = "sentence_to_word_summary.tsv"
progress_file = "progress.txt"

# Load the progress if it exists
if os.path.exists(progress_file):
    with open(progress_file, 'r') as pf:
        start_index = int(pf.read().strip())
else:
    start_index = 0

# Create or open the TSV file in append mode
with open(output_file, mode='a', newline='') as file:
    writer = csv.writer(file, delimiter='\t')

    # If the file is new, write the header
    if start_index == 0:
        writer.writerow(["Sentence", "Embedding", "Word Summary"])

    # Loop over each training sample starting from the last processed index
#     for i, sample in enumerate(train_data, start=start_index):
    index = start_index
    for i in range(index, len(train_data) - 1):
        sample = train_data[i]
        print("Processing sample at index:", i)

        # Handle the case where sample might be a dictionary (as expected for the XSum dataset)
        if isinstance(sample, dict) and 'summary' in sample:
            sentence = sample['summary']  # Take the one-sentence summary
        else:
            sentence = sample

        # Truncate the sentence to 150 characters if necessary
        if len(sentence) > max_char_length:
            sentence = sentence[:max_char_length]

        # Convert the sentence into a CLIP embedding
        text_tokens = clip.tokenize([sentence]).to(device)
        with torch.no_grad():
            text_embedding = clip_model.encode_text(text_tokens).cpu().numpy().squeeze()

        # Prepare the request payload
        data = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": "Generate exactly three words that sums up the sentence. No quotes. No explanation. No numbers. Comma separated only. Do not use | or +. Only words. No special characters. Only use real words. The words should ppear in order of importance, like PCA. Only use common words. Avoid uncommon words. Avoid compound words or phrases."},
                {"role": "user", "content": sentence}
            ],
            "temperature": 0.7,
            "max_tokens": -1,
            "stream": True  # Enable streaming
        }

        try:
            # Send the request to the Mistral model with streaming enabled
            response = requests.post(url, headers=headers, data=json.dumps(data), stream=True)

            buffer = ""
            word_summary = ""

            # Process the streamed response
            for chunk in response.iter_content(chunk_size=512):
                if chunk:
                    buffer += chunk.decode('utf-8')
                    items = buffer.split('\n\n')

                    for item in items:
                        item = item.strip()
                        if not item:
                            continue

                        if item.startswith('data: '):
                            item = item[len('data: '):]

                        if item == "[DONE]":
                            break

                        try:
                            parsed_payload = json.loads(item)
                            delta_content = parsed_payload['choices'][0].get('delta', {}).get('content', '')

                            word_summary += delta_content

                            # Stop if the word summary exceeds 40 characters
                            if len(word_summary) > 120:
                                word_summary = word_summary[:120]
                                break

                        except json.JSONDecodeError:
                            # Buffer might contain incomplete JSON, continue to collect more chunks
                            continue

                    # Clean buffer if we processed everything up to the end
                    buffer = ""

            print(f"Word Summary: {word_summary}")

            # Remove quotes, asterisks, periods, colons, hyphens, and parentheses
            word_summary = word_summary.replace('"', '').replace("'", "").replace('*', '')
            word_summary = word_summary.replace('.', '').replace(':', '').replace('-', '')
            word_summary = word_summary.replace('(', '').replace(')', '')

            # Convert to lowercase
            word_summary = word_summary.lower()

            # Return the word_summary as a comma-separated string with each word stripped
            if ',' in word_summary:
                word_summary = ','.join(word.strip() for word in word_summary.split(','))
            else:
                word_summary = ','.join(word.strip() for word in word_summary.split())

        except Exception as e:
            print(f"Error processing sentence at index {i}: {e}")
            continue

        # Print the sentence, embedding, and its word summary
        print(f"Embedding: {text_embedding}")
        print(f"Sentence: {sentence}")
        print(f"Word Summary: {word_summary}")
        time.sleep(0.1)

        # Save the sentence, embedding (as JSON string), and word summary to the TSV file
        writer.writerow([sentence, json.dumps(text_embedding.tolist()), word_summary])

        # Save the progress
        with open(progress_file, 'w') as pf:
            pf.write(str(i + 1))

        # Calculate and print the percentage done
        percentage_done = (i + 1) / len(dataset['train']) * 100
        print(f"Progress: {percentage_done:.2f}% complete")

        # To avoid overloading the server, consider adding a short delay
        # if i % 10 == 0:
        #     time.sleep(1)

print(f"Saved the sentence-to-word summaries to '{output_file}'")
