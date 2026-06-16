const TECH_KEYWORDS = [
  "react", "typescript", "javascript", "node.js", "nodejs", "python", "java", "flutter", "dart",
  "aws", "docker", "kubernetes", "graphql", "mongodb", "postgresql", "sql", "full stack", "fullstack",
  "ci/cd", "cicd", "agile", "scrum", "tailwind", "next.js", "nextjs", "fastapi", "express", "rest",
  "api", "git", "linux", "terraform", "azure", "gcp", "machine learning", "ai", "data analysis",
  "figma", "leadership", "testing", "django", "spring", "angular", "vue", "firebase", "redux",
];

function extractKeywords(text) {
  const textLower = text.toLowerCase();
  const found = [];
  for (const kw of TECH_KEYWORDS) {
    if (textLower.includes(kw)) {
      found.push(kw === "ci/cd" ? "CI/CD" : kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }
  const caps = text.match(/\b[A-Z][a-zA-Z+#./]{1,20}\b/g) || [];
  for (const c of caps) {
    if (c.length > 2 && !found.includes(c)) found.push(c);
  }
  return [...new Set(found)].slice(0, 30);
}

function resumeText(resume) {
  const parts = [];
  const pi = resume.personal_info || {};
  parts.push(pi.summary || "");
  for (const exp of resume.experience || []) {
    parts.push(exp.position || "", exp.description || "");
    parts.push(...(exp.achievements || []));
  }
  for (const skill of resume.skills || []) parts.push(skill.name || "");
  for (const proj of resume.projects || []) {
    parts.push(proj.name || "", proj.description || "");
    parts.push(...(proj.technologies || []));
  }
  return parts.join(" ").toLowerCase();
}

function keywordDensity(resume, keywords) {
  const text = resumeText(resume);
  const density = {};
  for (const kw of keywords) {
    const regex = new RegExp(kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    density[kw] = (text.match(regex) || []).length;
  }
  return density;
}

function analyzeATSFallback(resume, jobDescription) {
  const jdKeywords = extractKeywords(jobDescription);
  const resumeLower = resumeText(resume);
  const resumeSkills = new Set((resume.skills || []).map((s) => (s.name || "").toLowerCase()));

  const foundKeywords = jdKeywords.filter((kw) => resumeLower.includes(kw.toLowerCase()));
  const missingKeywords = jdKeywords.filter((kw) => !resumeLower.includes(kw.toLowerCase())).slice(0, 8);

  const matchedSkills = (resume.skills || [])
    .map((s) => s.name)
    .filter((name) => jobDescription.toLowerCase().includes(name.toLowerCase()));
  const missingSkills = jdKeywords
    .filter((kw) => !resumeSkills.has(kw.toLowerCase()) && !resumeLower.includes(kw.toLowerCase()))
    .slice(0, 6);

  let keywordScore = Math.round((foundKeywords.length / Math.max(jdKeywords.length, 1)) * 100);
  let skillsScore = Math.round((matchedSkills.length / Math.max(jdKeywords.length, 1)) * 100);
  skillsScore = Math.min(skillsScore + 20, 100);

  const pi = resume.personal_info || {};
  let formatScore = 70;
  if (pi.full_name && pi.email && pi.phone) formatScore += 10;
  if (resume.experience?.length && resume.education?.length) formatScore += 10;
  if (pi.summary && pi.summary.length > 50) formatScore += 10;
  formatScore = Math.min(formatScore, 100);

  let contentScore = 60;
  if (resume.experience?.length) contentScore += Math.min(resume.experience.length * 8, 24);
  if ((resume.experience || []).some((exp) => exp.achievements?.length)) contentScore += 10;
  contentScore = Math.min(contentScore, 100);

  const overallScore = Math.round(
    keywordScore * 0.35 + skillsScore * 0.3 + formatScore * 0.2 + contentScore * 0.15
  );

  const suggestions = [];
  for (const kw of missingKeywords.slice(0, 4)) {
    suggestions.push({
      type: "keyword",
      section: "Skills",
      suggested: `Add ${kw} to your skills section`,
      impact: keywordScore < 70 ? "high" : "medium",
      priority: keywordScore < 70 ? "high" : "medium",
      message: `Add ${kw} to your skills section`,
    });
  }

  if (contentScore < 75) {
    suggestions.push({
      type: "content",
      section: "Experience",
      suggested: "Add quantifiable achievements with metrics (e.g., 'Reduced deployment time by 40%')",
      impact: "high",
      priority: "high",
      message: "Add more quantifiable achievements to your experience section",
    });
  }

  if (pi.summary && pi.summary.length > 300) {
    suggestions.push({
      type: "format",
      section: "Summary",
      suggested: "Shorten your professional summary to 2-3 concise sentences",
      impact: "low",
      priority: "low",
      message: "Consider shortening your summary for better ATS parsing",
    });
  }

  const density = keywordDensity(resume, [...foundKeywords, ...missingKeywords.slice(0, 5)]);

  return {
    overall_score: overallScore,
    keyword_score: keywordScore,
    skills_score: skillsScore,
    format_score: formatScore,
    missing_keywords: missingKeywords,
    missing_skills: missingSkills,
    suggestions,
    keyword_density: density,
    breakdown: {
      keywords: { score: keywordScore, found: foundKeywords, missing: missingKeywords },
      skills: { score: skillsScore, matched: matchedSkills, missing: missingSkills },
      format: { score: formatScore, issues: [] },
      content: {
        score: contentScore,
        suggestions: suggestions.filter((s) => s.type === "content").map((s) => s.message),
      },
    },
  };
}

function scoreMatchFallback(resume, jobDescription) {
  const analysis = analyzeATSFallback(resume, jobDescription);
  return {
    match_score: analysis.overall_score,
    insights: analysis.suggestions.slice(0, 3).map((s) => s.message),
  };
}

module.exports = { analyzeATSFallback, scoreMatchFallback, extractKeywords };
