const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Resume = require("../models/Resume");
const auth = require("../middleware/auth");
const { scoreCandidateMatch } = require("../services/aiService");
const { extractKeywords } = require("../services/atsFallback");

const router = express.Router();

router.get("/", auth(), async (req, res) => {
  try {
    const filter = { status: req.query.status || "active" };
    if (req.query.search) {
      const search = req.query.search;
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { skills_required: { $regex: search, $options: "i" } },
      ];
    }
    if (req.query.job_type && req.query.job_type !== "all") {
      filter.job_type = req.query.job_type;
    }

    const jobs = await Job.find(filter).sort({ created_at: -1 });
    res.json(jobs.map((j) => j.toPublicJSON()));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.get("/matches", auth(), async (req, res) => {
  try {
    const resume = await Resume.findOne({ user_id: req.user._id, is_primary: true });
    const jobs = await Job.find({ status: "active" }).sort({ created_at: -1 });

    const jobDescription = req.query.job_description || req.user.job_preference || "";
    if (!resume) {
      const fallback = jobs.map((j) => ({ ...j.toPublicJSON(), match_score: 0 }));
      return res.json(fallback);
    }

    const resumeData = resume.toPublicJSON();
    const compareText = `${jobDescription.trim() || resumeData.personal_info?.summary || ""}`.trim();
    const results = [];

    for (const job of jobs) {
      try {
        const desc = compareText ? `${job.description}\n${compareText}` : job.description;
        const match = await scoreCandidateMatch(resumeData, desc);
        results.push({ ...job.toPublicJSON(), match_score: match.match_score || 0 });
      } catch {
        results.push({ ...job.toPublicJSON(), match_score: 50 });
      }
    }

    results.sort((a, b) => b.match_score - a.match_score);
    res.json(results);
  } catch (error) {
    console.error("Job matches error:", error);
    res.status(500).json({ error: "Failed to fetch job matches" });
  }
});

router.get("/:id", auth(), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job.toPublicJSON());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

router.post("/", auth(["recruiter", "admin"]), async (req, res) => {
  try {
    const job = await Job.create({
      recruiter_id: req.user._id,
      title: req.body.title,
      company: req.body.company,
      location: req.body.location || "",
      department: req.body.department || "",
      description: req.body.description,
      requirements: Array.isArray(req.body.requirements) ? req.body.requirements : [],
      skills_required: Array.isArray(req.body.skills_required) ? req.body.skills_required : [],
      salary_min: req.body.salary_min,
      salary_max: req.body.salary_max,
      job_type: req.body.job_type || "full-time",
      status: req.body.status || "active",
      applications_count: 0,
    });
    res.status(201).json(job.toPublicJSON());
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ error: "Failed to create job" });
  }
});

router.patch("/:id", auth(["recruiter", "admin"]), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiter_id: req.user._id });
    if (!job) return res.status(404).json({ error: "Job not found" });

    const fields = [
      "title",
      "company",
      "location",
      "department",
      "description",
      "requirements",
      "skills_required",
      "salary_min",
      "salary_max",
      "job_type",
      "status",
    ];
    for (const field of fields) {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    }
    await job.save();
    res.json(job.toPublicJSON());
  } catch (error) {
    res.status(500).json({ error: "Failed to update job" });
  }
});

router.delete("/:id", auth(["recruiter", "admin"]), async (req, res) => {
  try {
    const result = await Job.deleteOne({ _id: req.params.id, recruiter_id: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Job not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

router.post("/:id/apply", auth(["job_seeker"]), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.status !== "active") {
      return res.status(404).json({ error: "Job not available" });
    }

    const existing = await Application.findOne({
      job_id: job._id,
      applicant_id: req.user._id,
    });
    if (existing) {
      return res.status(409).json({ error: "Already applied to this job" });
    }

    let resume = null;
    if (req.body.resume_id) {
      resume = await Resume.findOne({ _id: req.body.resume_id, user_id: req.user._id });
    } else {
      resume = await Resume.findOne({ user_id: req.user._id, is_primary: true });
    }
    if (!resume) {
      return res.status(400).json({ error: "Create a resume before applying" });
    }

    let matchScore = 0;
    let insights = [];
    try {
      const match = await scoreCandidateMatch(resume.toPublicJSON(), job.description);
      matchScore = match.match_score || 0;
      insights = match.insights || [];
    } catch {
      matchScore = 50;
    }

    const application = await Application.create({
      job_id: job._id,
      applicant_id: req.user._id,
      resume_id: resume._id,
      cover_letter: req.body.cover_letter || "",
      ats_match_score: matchScore,
      ai_insights: insights,
    });

    job.applications_count += 1;
    await job.save();

    res.status(201).json(application.toPublicJSON({ job: job.toPublicJSON() }));
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

module.exports = router;
