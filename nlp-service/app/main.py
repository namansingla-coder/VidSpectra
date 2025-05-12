# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from transformers import pipeline
from app.sentiment import analyze_sentiment
from app.pdf_parser import extract_text_from_pdf
from app.spam_filter import filter_spam
from app.language import detect_language
from app.topic_model import extract_topics  # ✅ Topic modeling
from app.language import filter_english_hinglish_lines
app = FastAPI()
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

class PDFRequest(BaseModel):
    file_path: str

class TextRequest(BaseModel):
    raw_text: str

def extract_feedback_categories(text: str):
    likes, dislikes, demands = [], [], []
    for line in text.split('\n'):
        line_lower = line.lower().strip()
        if not line_lower:
            continue
        if any(word in line_lower for word in ['love', 'like', 'amazing', 'great', 'awesome', 'enjoyed']):
            likes.append(line)
        elif any(word in line_lower for word in ['hate', 'bad', 'worst', 'boring', 'dislike']):
            dislikes.append(line)
        elif any(word in line_lower for word in ['should', 'need', 'please', 'can you', 'add', 'include']):
            demands.append(line)
    return {"likes": likes, "dislikes": dislikes, "demands": demands}

def preprocess_text(text: str) -> str:
    """Clean, language-filter, and remove spam from a multiline string."""
    lines = text.split('\n')
    english_lines = filter_english_hinglish_lines(lines)  # 👈 updated call
    clean_lines = filter_spam(english_lines)
    return '\n'.join(clean_lines)

@app.post("/analyze")
def analyze_pdf(data: PDFRequest):
    if not os.path.exists(data.file_path):
        raise HTTPException(status_code=404, detail="File not found")

    text = extract_text_from_pdf(data.file_path)
    filtered_text = preprocess_text(text)

    feedback = extract_feedback_categories(filtered_text)
    sentiment = analyze_sentiment(filtered_text)
    summary = summarizer(filtered_text[:2000], max_length=200, min_length=50, do_sample=False)
    # Ensure topics is always a list
    topics = extract_topics(filtered_text)
    if isinstance(topics, str):
        try:
            import ast
            topics = ast.literal_eval(topics)
        except Exception:
            topics = [topics]
    elif not isinstance(topics, list):
        topics = [str(topics)]  # ✅ Topic modeling

    return {
        "summary": {
            "sentiment": sentiment,
            "feedback": feedback,
            "text_summary": summary[0]['summary_text'],
            "topics": topics
        },
        "text_preview": filtered_text[:500]
    }

@app.post("/analyze-text")
def analyze_raw_text(data: TextRequest):
    filtered_text = preprocess_text(data.raw_text)

    feedback = extract_feedback_categories(filtered_text)
    sentiment = analyze_sentiment(filtered_text)
    summary = summarizer(filtered_text[:2000], max_length=200, min_length=50, do_sample=False)
    topics = extract_topics(filtered_text)
    if isinstance(topics, str):
        try:
            import ast
            topics = ast.literal_eval(topics)
        except Exception:
            topics = [topics]
    elif not isinstance(topics, list):
        topics = [str(topics)]  #  # ✅ Topic modeling

    return {
        "summary": {
            "sentiment": sentiment,
            "feedback": feedback,
            "text_summary": summary[0]['summary_text'],
            "topics": topics
        }
    }