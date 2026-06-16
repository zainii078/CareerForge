import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import ats, pdf, recruiter

load_dotenv()

app = FastAPI(
    title="CareerForge AI Service",
    description="ATS analysis, PDF generation, and recruiter insights",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ats.router, prefix="/api/ats", tags=["ATS"])
app.include_router(pdf.router, prefix="/api/pdf", tags=["PDF"])
app.include_router(recruiter.router, prefix="/api/recruiter", tags=["Recruiter"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "careerforge-ai", "openai": bool(os.getenv("OPENAI_API_KEY"))}
