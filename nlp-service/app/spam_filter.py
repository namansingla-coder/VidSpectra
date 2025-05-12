import re
from typing import List

SPAM_KEYWORDS = [
    "free", "subscribe", "click here", "check out", "buy now", "giveaway",
    "visit", "earn money", "bit.ly", "t.co", "discount", "promotion",
    "http", "https", "dm me", "join us", "make money"
]

def is_spam(comment: str) -> bool:
    comment_lower = comment.lower()

    if re.search(r"http[s]?://", comment_lower):
        return True
    if any(keyword in comment_lower for keyword in SPAM_KEYWORDS):
        return True
    if len(re.findall(r"[^\w\s]", comment)) > 10:
        return True
    if re.search(r"(.)\1{3,}", comment_lower):
        return True
    if len(comment.split()) < 2:
        return True

    return False

def filter_spam(comments: List[str]) -> List[str]:
    return [comment for comment in comments if not is_spam(comment)]