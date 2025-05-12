from bertopic import BERTopic
from sklearn.feature_extraction.text import CountVectorizer
from typing import List, Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize BERTopic model
topic_model = BERTopic(
    vectorizer_model=CountVectorizer(ngram_range=(1, 2), stop_words='english')
)

def extract_topics(text: str) -> Dict[str, List[str]]:
    """
    Splits the input text into sentences and applies BERTopic to extract topics.
    Returns a dictionary with topics and keywords.
    """
    # Split input text into non-trivial sentences
    sentences = [line.strip() for line in text.split('\n') if len(line.strip()) > 10]

    if not sentences:
        logging.info("No valid sentences found.")
        return {"topics": []}

    topics, _ = topic_model.fit_transform(sentences)
    logging.info(f"Topics assigned: {topics}")

    topic_info = topic_model.get_topic_info()
    result = {}

    for _, row in topic_info.iterrows():
        topic_num = row['Topic']
        if topic_num == -1:
            continue  # Skip outliers
        keywords = [word for word, _ in topic_model.get_topic(topic_num)]
        result[f"Topic {topic_num}"] = keywords

    return {"topics": result if result else []}