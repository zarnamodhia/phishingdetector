import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Load dataset
df = pd.read_csv("emails.csv")   # change filename

texts = df["text_combined"]               # column name may differ
labels = df["label"]             # 1 phishing, 0 safe

# Train
vectorizer = TfidfVectorizer(
    max_features=7000,
    ngram_range=(1,2),
    stop_words="english"
)
X = vectorizer.fit_transform(texts)

model = LogisticRegression()
model.fit(X, labels)

# Save
joblib.dump(vectorizer, "vectorizer.pkl")
joblib.dump(model, "model.pkl")

print("✅ Trained on real dataset")