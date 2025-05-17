#!/bin/bash
echo "Downloading model..."
python app/sentiment.py  # This should download and extract your model
echo "Starting FastAPI app..."
uvicorn app.main:app --host 0.0.0.0 --port 10000