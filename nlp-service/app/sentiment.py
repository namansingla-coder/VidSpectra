from transformers import pipeline
import gdown
import zipfile
import os

def download_and_extract_model():
    if not os.path.exists("finetuned_sentiment_model"):
        file_id = "1jMT-Ord3pNSNPLEkSdnNUtuUpfXf_0kM"
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, "model.zip", quiet=False)
        with zipfile.ZipFile("model.zip", 'r') as zip_ref:
            zip_ref.extractall("finetuned_sentiment_model")

# Download model if not present
download_and_extract_model()

# ✅ Get absolute path to avoid Hugging Face repo ID validation error
model_path = os.path.abspath("finetuned_sentiment_model")

# ✅ Load model from absolute path
sentiment_model = pipeline(
    "text-classification",
    model=model_path,
    tokenizer=model_path
)

def analyze_sentiment(text: str):
    return sentiment_model(text[:512])