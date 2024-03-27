from tokenizer import CodeGenTokenizer

def test_tokenizer(text):
    vocab_file = "vocab.json"
    merges_file = "merges.txt"

    tokenizer = CodeGenTokenizer(vocab_file, merges_file)

    # Tokenize the input text
    tokens = tokenizer._tokenize(text)
    print(f"Tokenized '{text}': {tokens}")

    # Convert tokens to IDs
    token_ids = [tokenizer._convert_token_to_id(token) for token in tokens]
    print(f"Token IDs: {token_ids}")

    # Convert IDs back to tokens
    decoded_tokens = [tokenizer._convert_id_to_token(token_id) for token_id in token_ids]
    print(f"Decoded Tokens: {decoded_tokens}")

    # Convert tokens back to string
    decoded_text = tokenizer.convert_tokens_to_string(decoded_tokens)
    print(f"Decoded Text: '{decoded_text}'")

# Test the tokenizer with the word "hi"
test_tokenizer("Hi, how are you?")
# test_tokenizer("ス")
# test_tokenizer("how")
