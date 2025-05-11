import requests
import json

API_KEY = "YOUR_YOUTUBE_API_KEY"
VIDEO_ID = "dQw4w9WgXcQ"  # Replace with your video ID

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
        items = res.get("items", [])
        for item in items:
            text = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
            comments.append({"text": text})

        next_page_token = res.get("nextPageToken")
        if not next_page_token:
            break

    return comments

if __name__ == "__main__":
    data = fetch_comments(VIDEO_ID)
    with open("youtube_comments_raw.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"Saved {len(data)} comments to youtube_comments_raw.json")