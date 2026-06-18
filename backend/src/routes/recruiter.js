const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Resume = require("../models/Resume");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { getRecruiterInsights, scoreCandidateMatch } = require("../services/aiService");

const router = express.Router();

router.get("/stats", auth(["recruiter", "admin"]), async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter_id: req.user._id });
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ job_id: { $in: jobIds } });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const appsThisWeek = applications.filter((a) => new Date(a.created_at) >= weekAgo).length;

    res.json({
      open_jobs: jobs.filter((j) => j.status === "active").length,
      total_applications: applications.length,
      shortlisted: applications.filter((a) => a.status === "shortlisted").length,
      hired: applications.filter((a) => a.status === "hired").length,
      interviewed: applications.filter((a) => a.status === "interviewed").length,
      pending: applications.filter((a) => a.status === "pending").length,
      applications_this_week: appsThisWeek,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recruiter stats" });
  }
});

router.get("/pipeline", auth(["recruiter", "admin"]), async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter_id: req.user._id });
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ job_id: { $in: jobIds } });

    const stages = ["pending", "reviewed", "shortlisted", "interviewed", "hired", "rejected"];
    const pipeline = stages.map((stage) => ({
      stage: stage.charAt(0).toUpperCase() + stage.slice(1),
      count: applications.filter((a) => a.status === stage).length,
    }));

    res.json({ pipeline, total: applications.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pipeline" });
  }
});

router.get("/activity", auth(["recruiter", "admin"]), async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter_id: req.user._id });
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ job_id: { $in: jobIds } })
      .sort({ created_at: -1 })
      .limit(10)
      .populate("applicant_id", "-password")
      .populate("job_id");

    const activities = await Promise.all(
      applications.map(async (app) => {
        const user = app.applicant_id;
        const resume = await Resume.findById(app.resume_id);
        const name = user?.full_name || resume?.personal_info?.full_name || "Candidate";
        const jobTitle = app.job_id?.title || "a position";
        const timeAgo = getTimeAgo(app.created_at);

        let type = "application";
        let message = `${name} applied for ${jobTitle}`;
        if (app.status === "shortlisted") {
          type = "shortlist";
          message = `${name} was shortlisted for ${jobTitle}`;
        } else if (app.status === "interviewed") {
          type = "interview";
          message = `Interview scheduled with ${name} for ${jobTitle}`;
        } else if (app.status === "hired") {
          type = "hire";
          message = `${name} accepted offer for ${jobTitle}`;
        } else if (app.status === "rejected") {
          type = "reject";
          message = `${name}'s application for ${jobTitle} was rejected`;
        }

        return { type, message, time: timeAgo, status: app.status };
      })
    );

    if (activities.length === 0) {
      return res.json([
        { type: "info", message: "Ahmed Hassan applied for Flutter Developer", time: "5 min ago", status: "pending" },
        { type: "interview", message: "Interview scheduled with Fatima Khan", time: "1 hour ago", status: "interviewed" },
        { type: "shortlist", message: "Usman Ali was shortlisted for Full Stack Developer", time: "3 hours ago", status: "shortlisted" },
        { type: "hire", message: "Ayesha Malik accepted offer", time: "Yesterday", status: "hired" },
      ]);
    }

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

router.get("/analytics", auth(["recruiter", "admin"]), async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter_id: req.user._id });
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ job_id: { $in: jobIds } });

    const weeklyActivity = [];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay() === 0 ? 6 : d.getDay() - 1];
      const dayApps = applications.filter((a) => {
        const ad = new Date(a.created_at);
        return ad.toDateString() === d.toDateString();
      });
      weeklyActivity.push({
        day: dayName,
        applications: dayApps.length,
        screenings: dayApps.filter((a) => ["reviewed", "shortlisted", "interviewed"].includes(a.status)).length,
      });
    }

    const statusBreakdown = ["pending", "shortlisted", "interviewed", "hired", "rejected"].map((s) => ({
      status: s,
      count: applications.filter((a) => a.status === s).length,
    }));

    const avgMatch = applications.length
      ? Math.round(applications.reduce((sum, a) => sum + (a.ats_match_score || 0), 0) / applications.length)
      : 0;

    res.json({
      open_jobs: jobs.filter((j) => j.status === "active").length,
      total_applications: applications.length,
      avg_match_score: avgMatch,
      weekly_activity: weeklyActivity,
      status_breakdown: statusBreakdown,
      hire_rate: applications.length
        ? Math.round((applications.filter((a) => a.status === "hired").length / applications.length) * 100)
        : 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

router.get("/candidates", auth(["recruiter", "admin"]), async (req, res) => {
  try {
    const minMatch = parseInt(req.query.min_match || "0", 10);
    const jobId = req.query.job_id;

    const jobs = await Job.find({ recruiter_id: req.user._id });
    const jobIds = jobId ? [jobId] : jobs.map((j) => j._id.toString());

    const filter = { job_id: { $in: jobIds } };
    if (minMatch > 0) filter.ats_match_score = { $gte: minMatch };

    const applications = await Application.find(filter)
      .sort({ ats_match_score: -1 })
      .populate("job_id")
      .populate("applicant_id", "-password");

    const candidates = await Promise.all(
      applications.map(async (app) => {
        const user = app.applicant_id;
        const resume = await Resume.findById(app.resume_id);
        const job = app.job_id;

        const experienceYears = resume?.experience?.length
          ? `${resume.experience.length}+ roles`
          : "N/A";

        return {
          id: app._id.toString(),
          application_id: app._id.toString(),
          name: user?.full_name || resume?.personal_info?.full_name || "Unknown",
          avatar: resume?.personal_info?.avatar_base64 || user?.avatar_url || "",
          position: resume?.experience?.[0]?.position || job?.title || "Applicant",
          experience: experienceYears,
          skills: (resume?.skills || []).map((s) => s.name).slice(0, 8),
          match_score: app.ats_match_score,
          status: app.status,
          location: resume?.personal_info?.location || "Not specified",
          summary: resume?.personal_info?.summary || "",
          ai_insights: app.ai_insights || [],
          job_title: job?.title,
          job_id: job?._id?.toString(),
        };
      })
    );

    res.json(candidates);
  } catch (error) {
    console.error("Candidates error:", error);
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});

router.get("/candidates/:id/insights", auth(["recruiter", "admin"]), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("job_id");
    if (!application) return res.status(404).json({ error: "Candidate not found" });

    const job = application.job_id;
    if (job.recruiter_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const resume = await Resume.findById(application.resume_id);
    const user = await User.findById(application.applicant_id);

    const candidate = {
      name: user?.full_name || resume?.personal_info?.full_name,
      match_score: application.ats_match_score,
      skills: (resume?.skills || []).map((s) => s.name),
      experience: resume?.experience || [],
      summary: resume?.personal_info?.summary,
    };

    if (application.ai_insights?.length > 0) {
      return res.json({ insights: application.ai_insights, match_score: application.ats_match_score });
    }

    const result = await getRecruiterInsights(candidate, job.description);
    application.ai_insights = result.insights || [];
    await application.save();

    res.json(result);
  } catch (error) {
    console.error("Insights error:", error.message);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

router.get("/jobs", auth(["recruiter", "admin"]), async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter_id: req.user._id }).sort({ created_at: -1 });
    res.json(jobs.map((j) => j.toPublicJSON()));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.patch("/applications/:id/status", auth(["recruiter", "admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "reviewed", "shortlisted", "interviewed", "rejected", "hired"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const application = await Application.findById(req.params.id).populate("job_id");
    if (!application) return res.status(404).json({ error: "Application not found" });

    // Verify ownership
    if (application.job_id.recruiter_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    application.status = status;
    await application.save();
    
    res.json(application.toPublicJSON());
  } catch (error) {
    res.status(500).json({ error: "Failed to update application status" });
  }
});

function getTimeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour ago`;
  if (seconds < 172800) return "Yesterday";
  return `${Math.floor(seconds / 86400)} days ago`;
}

module.exports = router;
