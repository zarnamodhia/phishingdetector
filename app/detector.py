from app.features import url_features, keyword_features
from app.ml_model import predict


def detect(email_text):
    score = 0
    reasons = []

    u_score = url_features(email_text)
    if u_score:
        reasons.append("Detected suspicious or shortened URL")
    score += u_score

    k_score = keyword_features(email_text)
    if k_score:
        reasons.append("Detected urgency/scam keywords")
    score += k_score

    ml_score = predict(email_text)
    if ml_score > 0.7:
        reasons.append("ML model strongly predicts phishing")
    score += ml_score * 5

    if score >= 8:
        label = "Phishing"
    elif score >= 4:
        label = "Suspicious"
    else:
        label = "Safe"
    confidence = round(min(score / 10, 1.0), 2)
    return {
        "label": label,
        "score": round(score, 2),
        "confidence":confidence,
        "reasons": reasons
    }