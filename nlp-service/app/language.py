from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException
from typing import List

def detect_language(text: str) -> str:
    try:
        return detect(text)
    except LangDetectException:
        return "unknown"

def filter_english_hinglish_lines(lines: List[str]) -> List[str]:
    english_lines = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        lang = detect_language(line)
        if lang in ['en', 'hi']:  # keep English or Hinglish
            english_lines.append(line)
    return english_lines