from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from services.analyzer import analyze_ats

router = APIRouter()


class ATSRequest(BaseModel):
    resume: dict[str, Any]
    job_description: str


@router.post("/analyze")
async def ats_analyze(body: ATSRequest):
    return await analyze_ats(body.resume, body.job_description)
