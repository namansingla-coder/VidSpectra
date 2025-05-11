import requests
import json
import os

API_KEY = os.getenv('YOUTUBE_API_KEY')
VIDEO_ID = "6B8vh41NklE"# Replace with your video ID

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
        res = requests.get(url, params=params).json()
        for item in res.get("items", []):
            text = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
            comments.append({"text": text})

        next_page_token = res.get("nextPageToken")
        if not next_page_token:
            break

    return comments

if __name__ == "__main__":
    comments = fetch_comments(VIDEO_ID)
    with open("youtube_comments_raw.json", "w") as f:
        json.dump(comments, f, indent=2)
    print(f"✅ Saved {len(comments)} comments")