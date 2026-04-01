from urllib.parse import urlparse
from app.utils import extract_urls
from app.config import SUSPICIOUS_WORDS, SHORTENERS


def url_features(text):
    score = 0
    urls = extract_urls(text)

    for url in urls:
        domain = urlparse(url).netloc.lower()

        if any(short in domain for short in SHORTENERS):
            score += 2

        if domain.count('.') > 3:
            score += 2

    return score


def keyword_features(text):
    score = 0
    for word in SUSPICIOUS_WORDS:
        if word in text.lower():
            score += 2
    return score