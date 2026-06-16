const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume_id: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    cover_letter: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "interviewed", "rejected", "hired"],
      default: "pending",
    },
    ats_match_score: { type: Number, default: 0 },
    ai_insights: { type: [String], default: [] },
    notes: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

applicationSchema.methods.toPublicJSON = function (extras = {}) {
  return {
    id: this._id.toString(),
    job_id: this.job_id?.toString?.() || this.job_id,
    applicant_id: this.applicant_id?.toString?.() || this.applicant_id,
    resume_id: this.resume_id?.toString?.() || this.resume_id,
    cover_letter: this.cover_letter,
    status: this.status,
    ats_match_score: this.ats_match_score,
    ai_insights: this.ai_insights,
    notes: this.notes,
    created_at: this.created_at?.toISOString?.() || new Date().toISOString(),
    ...extras,
  };
};

module.exports = mongoose.model("Application", applicationSchema);
