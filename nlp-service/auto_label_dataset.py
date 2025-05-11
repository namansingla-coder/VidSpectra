import json

with open("youtube_comments_raw.json") as f:
    data = json.load(f)

labeled = []
for item in data:
    text = item["text"].lower()
    label = None
    if any(w in text for w in ["love", "great", "awesome", "good", "best"]):
        label = 0
    elif any(w in text for w in ["hate", "bad", "worst", "boring", "dislike"]):
        label = 1
    elif any(w in text for w in ["please", "need", "add", "feature", "can you", "should"]):
        label = 2

    if label is not None:
        item["label"] = label
        labeled.append(item)

with open("sentiment_dataset.json", "w") as f:
    json.dump(labeled, f, indent=2)

print(f"✅ Auto-labeled {len(labeled)} comments")