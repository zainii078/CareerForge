from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from services.analyzer import match_score, recruiter_insights

router = APIRouter()


class MatchRequest(BaseModel):
    resume: dict[str, Any]
    job_description: str


class InsightsRequest(BaseModel):
    candidate: dict[str, Any]
    job_description: str


@router.post("/match-score")
async def candidate_match(body: MatchRequest):
    return await match_score(body.resume, body.job_description)


@router.post("/insights")
async def candidate_insights(body: InsightsRequest):
    return await recruiter_insights(body.candidate, body.job_description)
