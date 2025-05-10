from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from transformers import pipeline

from app.pdf_parser import extract_text_from_pdf
from app.sentiment import analyze_sentiment

# Initialize FastAPI app
app = FastAPI()

# Initialize text summarizer
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Request schema
class PDFRequest(BaseModel):
    file_path: str

# Comment classifier
def extract_feedback_categories(text: str):
    likes = []
    dislikes = []
    demands = []

    for line in text.split('\n'):
        lower_line = line.lower().strip()

        if not lower_line:
            continue

        if any(word in lower_line for word in ['love', 'like', 'amazing', 'great', 'awesome', 'enjoyed']):
            likes.append(line)
        elif any(word in lower_line for word in ['hate', 'bad', 'worst', 'boring', 'dislike', 'terrible', 'too long', 'annoying']):
            dislikes.append(line)
        elif any(word in lower_line for word in ['should', 'need', 'please', 'can you', 'add', 'include', 'want', 'make a']):
            demands.append(line)

    return {
        "likes": likes,
        "dislikes": dislikes,
        "demands": demands
    }

# Main API route
@app.post("/analyze")
def analyze_pdf(data: PDFRequest):
    file_path = data.file_path

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # Extract text from PDF
    text = extract_text_from_pdf(file_path)

    # Get feedback classification
    feedback = extract_feedback_categories(text)

    # Get sentiment analysis
    sentiment = analyze_sentiment(text)

    # Get summary (truncate if too long to avoid model overload)
    truncated_text = text[:2000] if len(text) > 2000 else text
    summary = summarizer(truncated_text, max_length=200, min_length=50, do_sample=False)

    # Final response
    return {
        "summary": {
            "sentiment": sentiment,
            "feedback": feedback,
            "text_summary": summary[0]['summary_text']
        },
        "text_preview": text[:500]
    }