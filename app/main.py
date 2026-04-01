from fastapi import FastAPI
from pydantic import BaseModel
from app.detector import detect
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app = FastAPI()

class EmailRequest(BaseModel):
    email_text: str
    html: str | None = None
    raw_email: str | None = None

@app.post("/scan")
def scan(request: EmailRequest):
   result = detect(request.email_text)
   return result
