import json
import base64
import os
import re
from urllib.parse import urlparse, unquote

HAR_FILE = "web.archive.org.har"
OUT_DIR = "har_extracted"

def safe_filename_from_url(url):
    parsed = urlparse(url)
    path = unquote(parsed.path)

    # Wayback URLs often contain the original URL inside the path.
    # Keep it simple and make a safe local filename.
    if not path or path.endswith("/"):
        path += "index.html"

    filename = parsed.netloc + path

    # Remove unsafe Windows filename chars
    filename = re.sub(r'[<>:"\\|?*]', "_", filename)
    filename = filename.strip("_")

    return filename

os.makedirs(OUT_DIR, exist_ok=True)

with open(HAR_FILE, "r", encoding="utf-8") as f:
    har = json.load(f)

count = 0

for entry in har.get("log", {}).get("entries", []):
    request = entry.get("request", {})
    response = entry.get("response", {})
    content = response.get("content", {})

    url = request.get("url", "")
    text = content.get("text")

    if not url or text is None:
        continue

    encoding = content.get("encoding")

    try:
        if encoding == "base64":
            data = base64.b64decode(text)
        else:
            data = text.encode("utf-8", errors="replace")
    except Exception as e:
        print(f"Skipping {url}: {e}")
        continue

    filename = safe_filename_from_url(url)
    out_path = os.path.join(OUT_DIR, filename)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    with open(out_path, "wb") as out:
        out.write(data)

    count += 1
    print(f"Extracted: {out_path}")

print(f"\nDone. Extracted {count} files to {OUT_DIR}")