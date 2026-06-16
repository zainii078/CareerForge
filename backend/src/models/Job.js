const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    recruiter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "" },
    department: { type: String, default: "" },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    skills_required: { type: [String], default: [] },
    salary_min: Number,
    salary_max: Number,
    job_type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      default: "full-time",
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    applications_count: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

jobSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    recruiter_id: this.recruiter_id.toString(),
    title: this.title,
    company: this.company,
    location: this.location,
    department: this.department,
    description: this.description,
    requirements: this.requirements,
    skills_required: this.skills_required,
    salary_min: this.salary_min,
    salary_max: this.salary_max,
    job_type: this.job_type,
    status: this.status,
    applications_count: this.applications_count,
    created_at: this.created_at?.toISOString?.() || new Date().toISOString(),
  };
};

module.exports = mongoose.model("Job", jobSchema);
