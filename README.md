# VidSpectra
# 🧠 Comment Insight Analyzer

A web app that analyzes video comments (from platforms like YouTube) to extract viewer insights — including what users like, dislike, and demand — in both English and Hindi. Built using React, Tailwind CSS, AdonisJS, and a Python NLP microservice.

---

## 🚀 Features

- Upload and parse comments from PDF files  
- Multilingual support (English + Hindi)  
- Sentiment analysis using transformer models  
- Topic/demand extraction  
- Spam/bot comment filtering  
- Export viewer insights as a downloadable PDF  
- Modular architecture with AdonisJS + Python NLP microservice  

---

## 🛠 Tech Stack

| Layer        | Tech Used                              |
|--------------|-----------------------------------------|
| Frontend     | React, Tailwind CSS                     |
| Backend      | AdonisJS (Node.js)                      |
| NLP Engine   | Python (FastAPI or Flask + Transformers)|
| PDF Parsing  | `pdf-parse` (Node) / `PyMuPDF` (Python) |
| NLP Models   | Hugging Face: `DistilBERT`, `IndicBERT` |
| Deployment   | Local / Render / Railway (optional)     |

---

## 📁 Folder Structure
comment-insight-analyzer/
├── frontend/        # React + Tailwind
├── backend/         # AdonisJS
├── nlp-service/     # Python NLP logic (FastAPI/Flask)
└── shared/          # Sample PDFs, docs

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/comment-insight-analyzer.git
cd comment-insight-analyzer
```

### 2. Frontend Setup (React + Tailwind)
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup (AdonisJS)
```bash
cd backend
npm install
node ace serve --watch
```

### 4. NLP Microservice Setup (Python)
```bash
cd nlp-service
pip install -r requirements.txt
uvicorn app.main:app --reload  # or: flask run
```


## 🧪 Workflow
	1. User uploads a PDF of video comments.
	2. Backend extracts comment text and sends it to Python NLP service.
	3. NLP pipeline performs:
		• Language detection
		• Spam filtering
		• Sentiment analysis
		• Topic/demand extraction
	4. Backend returns results to frontend.
	5. User views insights and can download as a PDF.

---

### 📌 Future Improvements
	• Advanced spam detection using ML models
	• Interactive dashboard with charts (likes, dislikes, trends)
	• Support for more regional languages
	• YouTube API integration for real-time comment fetching

---

## 👨‍💻 Author

	Naman Singla
	https://namansingla-blog.netlify.app
	https://www.linkedin.com/in/namansingla7642

---

## 📄 License

This project is open-source under the MIT License.
---

Let me know when you're ready for the `requirements.txt` and starter Python backend files (`main.py`, `sentiment.py`, etc.).



