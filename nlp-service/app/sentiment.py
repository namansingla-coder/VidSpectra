from transformers import pipeline
import gdown
import zipfile
import os

def download_and_extract_model():
    if not os.path.exists("finetuned_sentiment_model"):
        file_id = "1jMT-Ord3pNSNPLEkSdnNUtuUpfXf_0kM"  # replace with your file ID
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, "model.zip", quiet=False)
        with zipfile.ZipFile("model.zip", 'r') as zip_ref:
            zip_ref.extractall("finetuned_sentiment_model")
download_and_extract_model()  # Make sure the model is available

sentiment_model = pipeline(
    "text-classification",
    model="naman-eliza/finetuned-sentiment-model",
    tokenizer="naman-eliza/finetuned-sentiment-model"
)

def analyze_sentiment(text: str):
    return sentiment_model(text[:512])