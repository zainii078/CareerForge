from io import BytesIO
import base64
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Image, Table, TableStyle

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
        "academic": colors.HexColor("#4338ca"),
        "vibrant": colors.HexColor("#f43f5e"),
        "corporate": colors.HexColor("#1e3a8a"),
        "sleek": colors.HexColor("#0284c7"),
        "dynamic": colors.HexColor("#ea580c"),
        "refined": colors.HexColor("#7e22ce"),
        "crisp": colors.HexColor("#047857"),
        "futuristic": colors.HexColor("#0ea5e9"),
    }
    accent = accents.get(template, colors.HexColor("#2563eb"))

    centered_templates = {"modern", "minimal", "executive", "clean", "bold", "startup", "dynamic", "vibrant", "refined"}
    align_center = TA_CENTER if template in centered_templates else TA_LEFT

    return {
        "name": ParagraphStyle(
            "Name",
            parent=styles["Heading1"],
            fontSize=28 if template in ["executive", "corporate", "classic"] else 24 if template in ["bold", "vibrant"] else 22,
            textColor=accent,
            alignment=align_center,
            spaceAfter=8,
            fontName="Helvetica-Bold",
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
            fontSize=13 if template in ["creative", "vibrant", "dynamic"] else 12,
            textColor=accent,
            alignment=TA_LEFT,
            spaceBefore=14,
            spaceAfter=6,
            borderPadding=2,
            fontName="Helvetica-Bold",
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

def get_image_from_base64(base64_str, width=1.2*inch, height=1.2*inch):
    if not base64_str:
        return None
    try:
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        img_data = base64.b64decode(base64_str)
        img_stream = BytesIO(img_data)
        img = Image(img_stream, width=width, height=height)
        return img
    except Exception as e:
        print(f"Failed to load image: {e}")
        return None

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
    
    # Process Header (Image + Text)
    avatar_b64 = pi.get("avatar_base64")
    name_para = Paragraph(pi.get("full_name", "Resume"), s["name"])
    
    contact_parts = [
        p for p in [pi.get("email"), pi.get("phone"), pi.get("location"), pi.get("linkedin"), pi.get("github")] if p
    ]
    contact_para = Paragraph(" | ".join(contact_parts), s["contact"]) if contact_parts else None
    
    img = get_image_from_base64(avatar_b64)
    if img:
        if template in ["modern", "minimal", "executive", "clean", "bold", "startup", "dynamic", "vibrant", "refined"]:
            # Centered template: Stack image on top
            story.append(img)
            story.append(Spacer(1, 8))
            story.append(name_para)
            if contact_para: story.append(contact_para)
        else:
            # Left aligned template: Side by side
            text_data = [[name_para], [contact_para]] if contact_para else [[name_para]]
            t = Table([[img, text_data]], colWidths=[1.5*inch, None])
            t.setStyle(TableStyle([
                ('ALIGN', (0,0), (0,0), 'LEFT'),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ]))
            story.append(t)
            story.append(Spacer(1, 10))
    else:
        story.append(name_para)
        if contact_para: story.append(contact_para)

    # Subtitles for some templates
    subtitles = {
        "professional": "Professional document designed for recruiters and hiring managers.",
        "creative": "A bold resume layout for creative and product roles.",
        "executive": "Executive summary style with premium presentation.",
        "startup": "Startup-ready format with modern visual hierarchy.",
        "consultant": "Consultant-focused resume with polished experience sections.",
        "academic": "Detailed academic curriculum vitae format.",
        "vibrant": "Vibrant and energetic visual layout.",
        "corporate": "Standardized corporate formatting.",
        "sleek": "Sleek and highly optimized presentation.",
        "dynamic": "Dynamic action-oriented layout.",
        "refined": "Refined typography and spacing.",
        "crisp": "Crisp boundaries and distinct sections.",
        "futuristic": "Forward-looking and tech-focused design."
    }
    if template in subtitles:
        story.append(Paragraph(subtitles[template], s["subtitle"]))

    # Border colors
    border_color = colors.HexColor("#e5e7eb")
    if template in ["creative", "bold", "vibrant"]:
        border_color = colors.HexColor("#c084fc")
    elif template in ["executive", "dynamic"]:
        border_color = colors.HexColor("#f59e0b")
    elif template in ["corporate", "academic", "classic"]:
        border_color = colors.HexColor("#1d4ed8")
    elif template in ["sleek", "futuristic", "technical"]:
        border_color = colors.HexColor("#0ea5e9")
        
    story.append(HRFlowable(width="100%", thickness=1.5, color=border_color))

    if pi.get("summary"):
        story.append(Paragraph("PROFESSIONAL SUMMARY", s["section"]))
        story.append(Paragraph(pi["summary"], s["body"]))
        story.append(Spacer(1, 8))

    if resume.get("experience"):
        heading = "EXPERIENCE"
        if template in ["executive", "corporate"]:
            heading = "LEADERSHIP & EXPERIENCE"
        elif template in ["technical", "futuristic"]:
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

    if template in ["minimal", "clean", "refined", "crisp"]:
        story.append(Spacer(1, 8))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#d1d5db")))

    doc.build(story)
    return buffer.getvalue()
