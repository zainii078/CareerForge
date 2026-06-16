import os
import re
import json
from typing import Any

from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

TECH_KEYWORDS = [
    "react", "typescript", "javascript", "node.js", "nodejs", "python", "java",
    "aws", "docker", "kubernetes", "graphql", "mongodb", "postgresql", "sql",
    "ci/cd", "cicd", "agile", "scrum", "tailwind", "next.js", "nextjs", "fastapi",
    "express", "rest", "api", "git", "linux", "terraform", "azure", "gcp",
    "machine learning", "ai", "data analysis", "figma", "leadership", "testing",
]


def extract_keywords(text: str) -> list[str]:
    text_lower = text.lower()
    found = []
    for kw in TECH_KEYWORDS:
        if kw in text_lower:
            found.append(kw.title() if kw != "ci/cd" else "CI/CD")
    # Also extract capitalized tech terms from JD
    caps = re.findall(r"\b[A-Z][a-zA-Z+#./]{1,20}\b", text)
    for c in caps:
        if len(c) > 2 and c not in found:
            found.append(c)
    return list(dict.fromkeys(found))[:30]


def resume_text(resume: dict) -> str:
    parts = []
    pi = resume.get("personal_info", {})
    parts.append(pi.get("summary", ""))
    for exp in resume.get("experience", []):
        parts.append(exp.get("position", ""))
        parts.append(exp.get("description", ""))
        parts.extend(exp.get("achievements", []))
    for skill in resume.get("skills", []):
        parts.append(skill.get("name", ""))
    for proj in resume.get("projects", []):
        parts.append(proj.get("name", ""))
        parts.append(proj.get("description", ""))
        parts.extend(proj.get("technologies", []))
    return " ".join(parts).lower()


def keyword_density(resume: dict, keywords: list[str]) -> dict[str, int]:
    text = resume_text(resume)
    density = {}
    for kw in keywords:
        count = len(re.findall(re.escape(kw.lower()), text))
        density[kw] = count
    return density


def analyze_ats_rules(resume: dict, job_description: str) -> dict[str, Any]:
    jd_keywords = extract_keywords(job_description)
    resume_lower = resume_text(resume)
    resume_skills = {s.get("name", "").lower() for s in resume.get("skills", [])}

    found_keywords = [kw for kw in jd_keywords if kw.lower() in resume_lower]
    missing_keywords = [kw for kw in jd_keywords if kw.lower() not in resume_lower][:8]

    matched_skills = [s.get("name") for s in resume.get("skills", []) if s.get("name", "").lower() in job_description.lower()]
    missing_skills = [kw for kw in jd_keywords if kw.lower() not in resume_skills and kw.lower() not in resume_lower][:6]

    keyword_score = round((len(found_keywords) / max(len(jd_keywords), 1)) * 100)
    skills_score = round((len(matched_skills) / max(len(jd_keywords), 1)) * 100)
    skills_score = min(skills_score + 20, 100)

    pi = resume.get("personal_info", {})
    format_score = 70
    if pi.get("full_name") and pi.get("email") and pi.get("phone"):
        format_score += 10
    if resume.get("experience") and resume.get("education"):
        format_score += 10
    if pi.get("summary") and len(pi.get("summary", "")) > 50:
        format_score += 10
    format_score = min(format_score, 100)

    content_score = 60
    if resume.get("experience"):
        content_score += min(len(resume.get("experience", [])) * 8, 24)
    if any(exp.get("achievements") for exp in resume.get("experience", [])):
        content_score += 10
    content_score = min(content_score, 100)

    overall = round(keyword_score * 0.35 + skills_score * 0.3 + format_score * 0.2 + content_score * 0.15)

    suggestions = []
    for kw in missing_keywords[:4]:
        suggestions.append({
            "type": "keyword",
            "section": "Skills",
            "original": None,
            "suggested": f"Add {kw} to your skills section",
            "impact": "high" if keyword_score < 70 else "medium",
            "priority": "high" if keyword_score < 70 else "medium",
            "message": f"Add {kw} to your skills section",
        })

    if content_score < 75:
        suggestions.append({
            "type": "content",
            "section": "Experience",
            "suggested": "Add quantifiable achievements with metrics (e.g., 'Reduced deployment time by 40%')",
            "impact": "high",
            "priority": "high",
            "message": "Add more quantifiable achievements to your experience section",
        })

    if pi.get("summary") and len(pi.get("summary", "")) > 300:
        suggestions.append({
            "type": "format",
            "section": "Summary",
            "suggested": "Shorten your professional summary to 2-3 concise sentences for better ATS parsing",
            "impact": "low",
            "priority": "low",
            "message": "Consider shortening your summary for better ATS parsing",
        })

    density = keyword_density(resume, found_keywords + missing_keywords[:5])
    keyword_density_list = [
        {"keyword": k, "count": v, "recommended": "2-4" if v < 2 else "3-5"}
        for k, v in density.items()
    ]

    breakdown = {
        "keywords": {
            "score": keyword_score,
            "found": found_keywords,
            "missing": missing_keywords,
        },
        "skills": {
            "score": skills_score,
            "matched": matched_skills,
            "missing": missing_skills,
        },
        "format": {"score": format_score, "issues": []},
        "content": {
            "score": content_score,
            "suggestions": [s["message"] for s in suggestions if s["type"] == "content"],
        },
    }

    return {
        "overall_score": overall,
        "keyword_score": keyword_score,
        "skills_score": skills_score,
        "format_score": format_score,
        "missing_keywords": missing_keywords,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "keyword_density": density,
        "keyword_density_list": keyword_density_list,
        "breakdown": breakdown,
    }


async def analyze_ats_ai(resume: dict, job_description: str) -> dict[str, Any] | None:
    if not OPENAI_API_KEY:
        return None

    try:
        from openai import OpenAI

        client = OpenAI(api_key=OPENAI_API_KEY)
        prompt = f"""Analyze this resume against the job description for ATS compatibility.
Return ONLY valid JSON with keys: overall_score, keyword_score, skills_score, format_score,
missing_keywords (array), missing_skills (array), suggestions (array of objects with type, section, suggested, impact, priority, message),
keyword_density (object), breakdown (object with keywords, skills, format, content sub-objects).

Job Description:
{job_description[:3000]}

Resume JSON:
{json.dumps(resume)[:4000]}"""

        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are an ATS resume analyzer. Return only JSON."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"OpenAI ATS error: {e}")
        return None


async def analyze_ats(resume: dict, job_description: str) -> dict[str, Any]:
    ai_result = await analyze_ats_ai(resume, job_description)
    if ai_result:
        return ai_result
    return analyze_ats_rules(resume, job_description)


async def match_score(resume: dict, job_description: str) -> dict[str, Any]:
    analysis = analyze_ats_rules(resume, job_description)
    insights = []
    for skill in analysis["breakdown"]["skills"]["matched"][:3]:
        insights.append(f"Strong match: {skill} experience aligns with job requirements")
    for kw in analysis["missing_keywords"][:2]:
        insights.append(f"Gap: Missing keyword '{kw}' mentioned in job description")
    if resume.get("experience"):
        exp = resume["experience"][0]
        insights.append(f"{exp.get('position', 'Role')} at {exp.get('company', 'previous company')}")

    return {
        "match_score": analysis["overall_score"],
        "insights": insights,
    }


async def recruiter_insights(candidate: dict, job_description: str) -> dict[str, Any]:
    insights = []
    name = candidate.get("name", "Candidate")
    score = candidate.get("match_score", 0)

    if score >= 85:
        insights.append(f"{name} is an excellent match ({score}%) for this role.")
    elif score >= 70:
        insights.append(f"{name} is a good potential fit ({score}%) with some skill gaps.")
    else:
        insights.append(f"{name} shows partial alignment ({score}%) — review carefully.")

    for skill in (candidate.get("skills") or [])[:4]:
        if skill.lower() in job_description.lower():
            insights.append(f"Has required skill: {skill}")

    for exp in (candidate.get("experience") or [])[:2]:
        pos = exp.get("position", "")
        company = exp.get("company", "")
        if pos:
            insights.append(f"{pos} experience at {company}")

    if candidate.get("summary"):
        insights.append(f"Summary highlights: {candidate['summary'][:120]}...")

    return {"insights": insights[:6], "match_score": score}
