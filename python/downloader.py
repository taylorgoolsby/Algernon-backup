import os
import requests

# Directory to store the downloaded weights
os.makedirs("data", exist_ok=True)

# URLs to download the model weights in `.ot` format from the `weights` directory
vae_url = "https://huggingface.co/lmz/rust-stable-diffusion-v1-5/resolve/main/weights/vae.ot"
unet_url = "https://huggingface.co/lmz/rust-stable-diffusion-v1-5/resolve/main/weights/unet.ot"

# Function to download a file from a given URL
def download_file(url, file_path):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(file_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    file.write(chunk)
        print(f"Downloaded {file_path}")
    else:
        print(f"Failed to download {file_path}. HTTP Status Code: {response.status_code}")

# Download the VAE and UNet weights in `.ot` format from the `weights` directory
download_file(vae_url, "./data/vae.ot")
download_file(unet_url, "./data/unet.ot")

print("Files downloaded successfully. You can now use these files with your Rust setup.")
