import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()  # 🔥 Load environment variables from .env

API_KEY = os.getenv('YOUTUBE_API_KEY')
if not API_KEY:
    raise ValueError("❌ YOUTUBE_API_KEY is not set. Check your .env file.")

VIDEO_IDS = [
    "6B8vh41NklE",
    "9eorW2IdK8M",
    "jwzpLt0T75I",
    "jk6thMe6Vq8",
    "p1SX5DH6h24",
    "Zrt77f7nTqY"
]

def fetch_comments(video_id):
    comments = []
    next_page_token = None

    while True:
        url = "https://www.googleapis.com/youtube/v3/commentThreads"
        params = {
            "part": "snippet",
            "videoId": video_id,
            "key": API_KEY,
            "maxResults": 100,
            "pageToken": next_page_token,
            "textFormat": "plainText"
        }
        res = requests.get(url, params=params)
        data = res.json()

        if "error" in data:
            print(f"❌ API error for video {video_id}:")
            print(json.dumps(data["error"], indent=2))
            break

        for item in data.get("items", []):
            text = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
            comments.append({"video_id": video_id, "text": text})

        next_page_token = data.get("nextPageToken")
        if not next_page_token:
            break

    print(f"✅ Fetched {len(comments)} comments from {video_id}")
    return comments

if __name__ == "__main__":
    all_comments = []
    for vid in VIDEO_IDS:
        print(f"📥 Fetching comments for video ID: {vid}")
        all_comments.extend(fetch_comments(vid))

    with open("youtube_comments_raw.json", "w") as f:
        json.dump(all_comments, f, indent=2)

    print(f"✅ Saved {len(all_comments)} comments from {len(VIDEO_IDS)} videos")