from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from transformers import pipeline
from app.sentiment import analyze_sentiment
from app.pdf_parser import extract_text_from_pdf

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

@app.post("/analyze")
def analyze_pdf(data: PDFRequest):
    if not os.path.exists(data.file_path):
        raise HTTPException(status_code=404, detail="File not found")
    text = extract_text_from_pdf(data.file_path)
    feedback = extract_feedback_categories(text)
    sentiment = analyze_sentiment(text)
    summary = summarizer(text[:2000], max_length=200, min_length=50, do_sample=False)
    return {
        "summary": {
            "sentiment": sentiment,
            "feedback": feedback,
            "text_summary": summary[0]['summary_text']
        },
        "text_preview": text[:500]
    }

@app.post("/analyze-text")
def analyze_raw_text(data: TextRequest):
    text = data.raw_text
    feedback = extract_feedback_categories(text)
    sentiment = analyze_sentiment(text)
    summary = summarizer(text[:2000], max_length=200, min_length=50, do_sample=False)
    return {
        "summary": {
            "sentiment": sentiment,
            "feedback": feedback,
            "text_summary": summary[0]['summary_text']
        }
    }