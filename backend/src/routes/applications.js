const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Resume = require("../models/Resume");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth(), async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "job_seeker") {
      filter.applicant_id = req.user._id;
    }
    if (req.query.status) filter.status = req.query.status;

    const applications = await Application.find(filter)
      .sort({ created_at: -1 })
      .populate("job_id")
      .populate("applicant_id", "-password");

    const result = await Promise.all(
      applications.map(async (app) => {
        const job = app.job_id;
        const applicant = app.applicant_id;
        const resume = await Resume.findById(app.resume_id);

        return app.toPublicJSON({
          job: job?.toPublicJSON?.() || null,
          applicant: applicant?.toPublicJSON?.() || null,
          resume: resume?.toPublicJSON?.() || null,
        });
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

router.patch("/:id", auth(["recruiter", "admin"]), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("job_id");
    if (!application) return res.status(404).json({ error: "Application not found" });

    const job = application.job_id;
    if (req.user.role === "recruiter" && job.recruiter_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (req.body.status) application.status = req.body.status;
    if (req.body.notes !== undefined) application.notes = req.body.notes;
    await application.save();

    res.json(application.toPublicJSON({ job: job.toPublicJSON() }));
  } catch (error) {
    res.status(500).json({ error: "Failed to update application" });
  }
});

module.exports = router;
