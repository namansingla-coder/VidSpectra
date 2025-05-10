from transformers import pipeline

# Load once
sentiment_model = pipeline("sentiment-analysis")

def analyze_sentiment(text: str):
    return sentiment_model(text[:512])  # Truncate long text for safety