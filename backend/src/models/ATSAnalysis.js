const mongoose = require("mongoose");

const atsAnalysisSchema = new mongoose.Schema(
  {
    resume_id: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    job_description: { type: String, required: true },
    overall_score: { type: Number, default: 0 },
    keyword_score: { type: Number, default: 0 },
    skills_score: { type: Number, default: 0 },
    format_score: { type: Number, default: 0 },
    missing_keywords: { type: [String], default: [] },
    missing_skills: { type: [String], default: [] },
    suggestions: { type: Array, default: [] },
    keyword_density: { type: Object, default: {} },
    breakdown: { type: Object, default: {} },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

atsAnalysisSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    resume_id: this.resume_id.toString(),
    job_id: this.job_id?.toString?.(),
    job_description: this.job_description,
    overall_score: this.overall_score,
    keyword_score: this.keyword_score,
    skills_score: this.skills_score,
    format_score: this.format_score,
    missing_keywords: this.missing_keywords,
    missing_skills: this.missing_skills,
    suggestions: this.suggestions,
    keyword_density: this.keyword_density,
    breakdown: this.breakdown,
    created_at: this.created_at?.toISOString?.() || new Date().toISOString(),
  };
};

module.exports = mongoose.model("ATSAnalysis", atsAnalysisSchema);
