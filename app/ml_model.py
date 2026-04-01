import joblib

vectorizer = joblib.load("vectorizer.pkl")
model = joblib.load("model.pkl")

def predict(text):
    X = vectorizer.transform([text])
    return model.predict_proba(X)[0][1]