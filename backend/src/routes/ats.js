const express = require("express");
const Resume = require("../models/Resume");
const ATSAnalysis = require("../models/ATSAnalysis");
const auth = require("../middleware/auth");
const { analyzeATS } = require("../services/aiService");

const router = express.Router();

router.post("/analyze", auth(), async (req, res) => {
  try {
    const { job_description, resume_id, job_id } = req.body;

    if (!job_description?.trim()) {
      return res.status(400).json({ error: "Job description is required" });
    }

    let resume = null;
    if (resume_id) {
      resume = await Resume.findOne({ _id: resume_id, user_id: req.user._id });
    } else {
      resume = await Resume.findOne({ user_id: req.user._id, is_primary: true });
    }

    if (!resume) {
      return res.status(404).json({ error: "Resume not found. Create a resume first." });
    }

    const analysisResult = await analyzeATS(resume.toPublicJSON(), job_description);

    const analysis = await ATSAnalysis.create({
      resume_id: resume._id,
      user_id: req.user._id,
      job_id: job_id || undefined,
      job_description,
      overall_score: analysisResult.overall_score,
      keyword_score: analysisResult.keyword_score,
      skills_score: analysisResult.skills_score,
      format_score: analysisResult.format_score,
      missing_keywords: analysisResult.missing_keywords,
      missing_skills: analysisResult.missing_skills,
      suggestions: analysisResult.suggestions,
      keyword_density: analysisResult.keyword_density,
      breakdown: analysisResult.breakdown,
    });

    resume.ats_score = analysisResult.overall_score;
    await resume.save();

    res.json(analysis.toPublicJSON());
  } catch (error) {
    console.error("ATS analyze error:", error.message);
    res.status(500).json({ error: "ATS analysis failed. Ensure AI service is running." });
  }
});

router.get("/analyses", auth(), async (req, res) => {
  try {
    const filter = { user_id: req.user._id };
    if (req.query.resume_id) filter.resume_id = req.query.resume_id;

    const analyses = await ATSAnalysis.find(filter).sort({ created_at: -1 }).limit(20);
    res.json(analyses.map((a) => a.toPublicJSON()));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
});

router.post("/apply-suggestions", auth(), async (req, res) => {
  try {
    const { analysis_id, suggestion_indices = [] } = req.body;
    const analysis = await ATSAnalysis.findOne({ _id: analysis_id, user_id: req.user._id });
    if (!analysis) return res.status(404).json({ error: "Analysis not found" });

    const resume = await Resume.findOne({ _id: analysis.resume_id, user_id: req.user._id });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const suggestions = analysis.suggestions.filter((_, i) =>
      suggestion_indices.length === 0 ? true : suggestion_indices.includes(i)
    );

    for (const suggestion of suggestions) {
      if (suggestion.type === "keyword" || suggestion.type === "skill") {
        const skillName = suggestion.suggested.replace(/^Add\s+/i, "").replace(/\s+to.*$/i, "").trim();
        const exists = resume.skills.some((s) => s.name?.toLowerCase() === skillName.toLowerCase());
        if (!exists && skillName) {
          resume.skills.push({
            id: require("uuid").v4(),
            name: skillName,
            level: "intermediate",
            category: suggestion.section || "Technical",
          });
        }
      }
      if (suggestion.type === "content" && suggestion.section === "Summary") {
        resume.personal_info.summary = suggestion.suggested;
      }
    }

    await resume.save();
    res.json(resume.toPublicJSON());
  } catch (error) {
    res.status(500).json({ error: "Failed to apply suggestions" });
  }
});

module.exports = router;
