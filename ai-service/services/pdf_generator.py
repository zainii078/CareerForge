from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer


def _styles(template: str):
    styles = getSampleStyleSheet()
    accents = {
        "modern": colors.HexColor("#2563eb"),
        "professional": colors.HexColor("#0f766e"),
        "minimal": colors.HexColor("#111827"),
        "creative": colors.HexColor("#8b5cf6"),
        "executive": colors.HexColor("#b45309"),
        "technical": colors.HexColor("#0ea5e9"),
        "clean": colors.HexColor("#0f172a"),
        "classic": colors.HexColor("#1d4ed8"),
        "bold": colors.HexColor("#dc2626"),
        "elegant": colors.HexColor("#9333ea"),
        "startup": colors.HexColor("#14b8a6"),
        "consultant": colors.HexColor("#334155"),
    }
    accent = accents.get(template, colors.HexColor("#2563eb"))

    centered_templates = {"modern", "minimal", "executive", "clean", "bold", "startup"}
    align_center = TA_CENTER if template in centered_templates else TA_LEFT

    return {
        "name": ParagraphStyle(
            "Name",
            parent=styles["Heading1"],
            fontSize=28 if template == "executive" else 24 if template == "bold" else 22,
            textColor=accent,
            alignment=align_center,
            spaceAfter=8,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=styles["Normal"],
            fontSize=9,
            alignment=align_center,
            textColor=colors.grey,
            spaceAfter=12,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=styles["Heading2"],
            fontSize=12,
            textColor=accent,
            alignment=TA_LEFT,
            spaceBefore=12,
            spaceAfter=6,
            borderPadding=2,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            leftIndent=0,
            rightIndent=0,
            spaceAfter=4,
        ),
        "bold": ParagraphStyle(
            "Bold",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            fontName="Helvetica-Bold",
            leftIndent=0,
            rightIndent=0,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=styles["Italic"],
            fontSize=10,
            textColor=colors.HexColor("#6b7280"),
            alignment=align_center,
            spaceAfter=10,
        ),
    }


def generate_resume_pdf(resume: dict, template: str = "modern") -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
    )

    s = _styles(template)
    story = []
    pi = resume.get("personal_info", {})

    story.append(Paragraph(pi.get("full_name", "Resume"), s["name"]))
    contact_parts = [
        p for p in [pi.get("email"), pi.get("phone"), pi.get("location"), pi.get("linkedin"), pi.get("github")] if p
    ]
    if contact_parts:
        story.append(Paragraph(" | ".join(contact_parts), s["contact"]))

    if template == "professional":
        story.append(Paragraph("Professional document designed for recruiters and hiring managers.", s["subtitle"]))
    elif template == "creative":
        story.append(Paragraph("A bold resume layout for creative and product roles.", s["subtitle"]))
    elif template == "executive":
        story.append(Paragraph("Executive summary style with premium presentation.", s["subtitle"]))
    elif template == "startup":
        story.append(Paragraph("Startup-ready format with modern visual hierarchy.", s["subtitle"]))
    elif template == "consultant":
        story.append(Paragraph("Consultant-focused resume with polished experience sections.", s["subtitle"]))

    border_color = colors.HexColor("#e5e7eb")
    if template in ["creative", "bold"]:
        border_color = colors.HexColor("#c084fc")
    elif template == "executive":
        border_color = colors.HexColor("#f59e0b")
    story.append(HRFlowable(width="100%", thickness=1.5, color=border_color))

    if pi.get("summary"):
        story.append(Paragraph("PROFESSIONAL SUMMARY", s["section"]))
        story.append(Paragraph(pi["summary"], s["body"]))
        story.append(Spacer(1, 8))

    if resume.get("experience"):
        heading = "EXPERIENCE"
        if template == "executive":
            heading = "LEADERSHIP & EXPERIENCE"
        elif template == "technical":
            heading = "TECHNICAL EXPERIENCE"
        story.append(Paragraph(heading, s["section"]))
        for exp in resume["experience"]:
            title = f"<b>{exp.get('position', '')}</b> — {exp.get('company', '')}"
            dates = f"{exp.get('start_date', '')} – {exp.get('end_date') or 'Present'}"
            story.append(Paragraph(f"{title} | {dates}", s["bold"]))
            if exp.get("location"):
                story.append(Paragraph(exp["location"], s["body"]))
            if exp.get("description"):
                story.append(Paragraph(exp["description"], s["body"]))
            for ach in exp.get("achievements", []):
                story.append(Paragraph(f"• {ach}", s["body"]))
            story.append(Spacer(1, 4))

    if resume.get("education"):
        story.append(Paragraph("EDUCATION", s["section"]))
        for edu in resume["education"]:
            line = f"<b>{edu.get('degree', '')} in {edu.get('field', '')}</b> — {edu.get('institution', '')}"
            story.append(Paragraph(line, s["bold"]))
            story.append(Paragraph(f"{edu.get('start_date', '')} – {edu.get('end_date', '')}", s["body"]))
            story.append(Spacer(1, 4))

    if resume.get("skills"):
        story.append(Paragraph("SKILLS", s["section"]))
        skills_text = ", ".join(
            f"{sk.get('name', '')}{' (' + sk.get('level', '') + ')' if sk.get('level') else ''}" for sk in resume["skills"]
        )
        story.append(Paragraph(skills_text, s["body"]))
        story.append(Spacer(1, 6))

    if resume.get("projects"):
        story.append(Paragraph("PROJECTS", s["section"]))
        for proj in resume["projects"]:
            story.append(Paragraph(f"<b>{proj.get('name', '')}</b>", s["bold"]))
            story.append(Paragraph(proj.get("description", ""), s["body"]))
            if proj.get("technologies"):
                story.append(Paragraph(f"Tech: {', '.join(proj['technologies'])}", s["body"]))
            story.append(Spacer(1, 4))

    if resume.get("certifications"):
        story.append(Paragraph("CERTIFICATIONS", s["section"]))
        for cert in resume["certifications"]:
            story.append(Paragraph(f"• {cert.get('name', '')} — {cert.get('issuer', '')} ({cert.get('date', '')})", s["body"]))

    if resume.get("languages"):
        story.append(Paragraph("LANGUAGES", s["section"]))
        langs = ", ".join(f"{l.get('name', '')} ({l.get('proficiency', '')})" for l in resume["languages"])
        story.append(Paragraph(langs, s["body"]))

    if template == "minimal":
        story.append(Spacer(1, 8))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#d1d5db")))

    doc.build(story)
    return buffer.getvalue()
