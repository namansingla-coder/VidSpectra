from transformers import pipeline

sentiment_model = pipeline(
    "text-classification",
    model="./finetuned_sentiment_model",
    tokenizer="./finetuned_sentiment_model"
)

def analyze_sentiment(text: str):
    return sentiment_model(text[:512])