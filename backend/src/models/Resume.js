const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "My Resume" },
    personal_info: {
      full_name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: String,
      website: String,
      github: String,
      summary: { type: String, default: "" },
    },
    education: { type: Array, default: [] },
    experience: { type: Array, default: [] },
    skills: { type: Array, default: [] },
    certifications: { type: Array, default: [] },
    projects: { type: Array, default: [] },
    languages: { type: Array, default: [] },
    template: { type: String, default: "modern" },
    ats_score: { type: Number, default: 0 },
    is_primary: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

resumeSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    user_id: this.user_id.toString(),
    title: this.title,
    personal_info: this.personal_info,
    education: this.education,
    experience: this.experience,
    skills: this.skills,
    certifications: this.certifications,
    projects: this.projects,
    languages: this.languages,
    template: this.template,
    ats_score: this.ats_score,
    is_primary: this.is_primary,
    created_at: this.created_at?.toISOString?.() || new Date().toISOString(),
    updated_at: this.updated_at?.toISOString?.() || new Date().toISOString(),
  };
};

module.exports = mongoose.model("Resume", resumeSchema);
