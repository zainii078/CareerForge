from typing import Any, Optional

from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel

from services.pdf_generator import generate_resume_pdf

router = APIRouter()


class PDFRequest(BaseModel):
    resume: dict[str, Any]
    template: Optional[str] = "modern"


@router.post("/generate")
async def generate_pdf(body: PDFRequest):
    pdf_bytes = generate_resume_pdf(body.resume, body.template or "modern")
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"},
    )
