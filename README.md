# Phishing Email Detector

## Setup
pip install -r requirements.txt

## Run API
uvicorn app.main:app --reload

## Example Request
POST /scan
{
  "email_text": "Your account is suspended! Click here http://bit.ly/fake"
}