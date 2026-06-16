const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    full_name: { type: String, default: null },
    avatar_url: { type: String, default: null },
    role: {
      type: String,
      enum: ["job_seeker", "recruiter", "admin"],
      default: "job_seeker",
    },
    company_name: { type: String, default: null },
    company_logo_url: { type: String, default: null },
    bio: { type: String, default: null },
    job_preference: { type: String, default: null },
    phone: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    email: this.email,
    full_name: this.full_name,
    avatar_url: this.avatar_url,
    role: this.role,
    company_name: this.company_name,
    company_logo_url: this.company_logo_url,
    bio: this.bio,
    job_preference: this.job_preference,
    phone: this.phone,
    created_at: this.created_at?.toISOString?.() || new Date().toISOString(),
  };
};

module.exports = mongoose.model("User", userSchema);
