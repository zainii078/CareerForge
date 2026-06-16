const express = require("express");
const Application = require("../models/Application");
const Resume = require("../models/Resume");
const User = require("../models/User");
const Job = require("../models/Job");
const auth = require("../middleware/auth");

const router = express.Router();

function calcCompletion(resume) {
  if (!resume) return { percent: 0, missing: ["Create your resume"], filled: [] };
  const sections = [
    { key: "full_name", label: "Full Name", filled: !!resume.personal_info?.full_name },
    { key: "email", label: "Email", filled: !!resume.personal_info?.email },
    { key: "phone", label: "Phone", filled: !!resume.personal_info?.phone },
    { key: "summary", label: "Professional Summary", filled: !!resume.personal_info?.summary },
    { key: "experience", label: "Work Experience", filled: resume.experience?.length > 0 },
    { key: "education", label: "Education", filled: resume.education?.length > 0 },
    { key: "skills", label: "Skills", filled: resume.skills?.length > 0 },
    { key: "projects", label: "Projects", filled: resume.projects?.length > 0 },
    { key: "certifications", label: "Certifications", filled: resume.certifications?.length > 0 },
    { key: "languages", label: "Languages", filled: resume.languages?.length > 0 },
  ];
  const filled = sections.filter((s) => s.filled).map((s) => s.label);
  const missing = sections.filter((s) => !s.filled).map((s) => s.label);
  const percent = Math.round((filled.length / sections.length) * 100);
  return { percent, missing, filled };
}

router.get("/job-seeker", auth(["job_seeker"]), async (req, res) => {
  try {
    const resume = await Resume.findOne({ user_id: req.user._id, is_primary: true });
    const applications = await Application.find({ applicant_id: req.user._id });
    const completion = calcCompletion(resume);

    const interviewed = applications.filter((a) =>
      ["interviewed", "shortlisted", "hired"].includes(a.status)
    ).length;
    const interviewRate = applications.length
      ? Math.round((interviewed / applications.length) * 100)
      : 0;

    res.json({
      ats_score: resume?.ats_score || 0,
      resume_completion: completion.percent,
      completion_missing: completion.missing,
      completion_filled: completion.filled,
      total_applications: applications.length,
      interview_rate: interviewRate,
      job_match_percentage: resume?.ats_score || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

router.get("/platform-stats", auth(), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const jobSeekers = await User.countDocuments({ role: "job_seeker" });
    const recruiters = await User.countDocuments({ role: "recruiter" });
    const activeJobs = await Job.countDocuments({ status: "active" });
    const totalApplications = await Application.countDocuments();

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({ created_at: { $gte: weekAgo } });
    const newJobsThisWeek = await Job.countDocuments({ created_at: { $gte: weekAgo }, status: "active" });

    const myApplications = req.user.role === "job_seeker"
      ? await Application.countDocuments({ applicant_id: req.user._id })
      : 0;

    res.json({
      total_users: totalUsers,
      job_seekers: jobSeekers,
      recruiters: recruiters,
      active_jobs: activeJobs,
      total_applications: totalApplications,
      new_users_this_week: newUsersThisWeek,
      new_jobs_this_week: newJobsThisWeek,
      my_applications: myApplications,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch platform stats" });
  }
});

router.get("/analytics", auth(["job_seeker"]), async (req, res) => {
  try {
    const resume = await Resume.findOne({ user_id: req.user._id, is_primary: true });
    const applications = await Application.find({ applicant_id: req.user._id }).populate("job_id");

    const statusCounts = {
      pending: 0, reviewed: 0, shortlisted: 0, interviewed: 0, rejected: 0, hired: 0,
    };
    applications.forEach((a) => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });

    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.toLocaleString("default", { month: "short" });
      const count = applications.filter((a) => {
        const ad = new Date(a.created_at);
        return ad.getMonth() === d.getMonth() && ad.getFullYear() === d.getFullYear();
      }).length;
      monthlyData.push({ month, applications: count });
    }

    const avgMatch = applications.length
      ? Math.round(applications.reduce((s, a) => s + (a.ats_match_score || 0), 0) / applications.length)
      : 0;

    const completion = calcCompletion(resume);

    res.json({
      ats_score: resume?.ats_score || 0,
      resume_completion: completion.percent,
      total_applications: applications.length,
      avg_match_score: avgMatch,
      status_counts: statusCounts,
      monthly_applications: monthlyData,
      skills_count: resume?.skills?.length || 0,
      experience_count: resume?.experience?.length || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

module.exports = router;
