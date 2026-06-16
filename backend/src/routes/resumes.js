const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Resume = require("../models/Resume");
const auth = require("../middleware/auth");
const { generatePDF } = require("../services/aiService");

const router = express.Router();

function ensureIds(items = []) {
  return items.map((item) => ({
    ...item,
    id: item.id || uuidv4(),
  }));
}

router.get("/", auth(), async (req, res) => {
  try {
    const resumes = await Resume.find({ user_id: req.user._id }).sort({ updated_at: -1 });
    res.json(resumes.map((r) => r.toPublicJSON()));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

router.get("/primary", auth(), async (req, res) => {
  try {
    let resume = await Resume.findOne({ user_id: req.user._id, is_primary: true });
    if (!resume) {
      resume = await Resume.findOne({ user_id: req.user._id });
    }
    if (!resume) {
      return res.status(404).json({ error: "No resume found" });
    }
    res.json(resume.toPublicJSON());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

router.get("/:id", auth(), async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json(resume.toPublicJSON());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

router.post("/", auth(), async (req, res) => {
  try {
    const resume = await Resume.create({
      user_id: req.user._id,
      ...req.body,
      education: ensureIds(req.body.education),
      experience: ensureIds(req.body.experience),
      skills: ensureIds(req.body.skills),
      certifications: ensureIds(req.body.certifications),
      projects: ensureIds(req.body.projects),
      languages: ensureIds(req.body.languages),
    });
    res.status(201).json(resume.toPublicJSON());
  } catch (error) {
    res.status(500).json({ error: "Failed to create resume" });
  }
});

router.put("/:id", auth(), async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const fields = [
      "title",
      "personal_info",
      "education",
      "experience",
      "skills",
      "certifications",
      "projects",
      "languages",
      "template",
      "ats_score",
      "is_primary",
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        if (["education", "experience", "skills", "certifications", "projects", "languages"].includes(field)) {
          resume[field] = ensureIds(req.body[field]);
        } else {
          resume[field] = req.body[field];
        }
      }
    }

    if (req.body.is_primary) {
      await Resume.updateMany({ user_id: req.user._id, _id: { $ne: resume._id } }, { is_primary: false });
    }

    await resume.save();
    res.json(resume.toPublicJSON());
  } catch (error) {
    console.error("Resume update error:", error);
    res.status(500).json({ error: "Failed to update resume" });
  }
});

router.post("/:id/export/pdf", auth(), async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const template = req.body.template || resume.template || "modern";
    const pdfBuffer = await generatePDF(resume.toPublicJSON(), template);

    const filename = `${(resume.personal_info?.full_name || "resume").replace(/\s+/g, "_")}_${template}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("PDF export error:", error.message);
    res.status(500).json({ error: "PDF generation failed. Ensure AI service is running." });
  }
});

router.delete("/:id", auth(), async (req, res) => {
  try {
    const result = await Resume.deleteOne({ _id: req.params.id, user_id: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Resume not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete resume" });
  }
});

module.exports = router;
