from transformers import AutoTokenizer, AutoModelForCausalLM

# Load tokenizer and model
tokenizer_name = "mlx-community/phi-2-hf-4bit-mlx"
tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
model = AutoModelForCausalLM.from_pretrained(tokenizer_name)

# Encoding the input prompt
input_prompt = "Hi, how are you?"
input_ids = tokenizer.encode(input_prompt, return_tensors='pt')

# Generating tokens (text) with the model
output_tokens = model.generate(input_ids, max_length=50, num_return_sequences=1)

# Decoding the generated tokens back to text
generated_text = tokenizer.decode(output_tokens[0], skip_special_tokens=True)

print(f"Generated Text: {generated_text}")
