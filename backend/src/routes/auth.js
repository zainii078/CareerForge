const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Resume = require("../models/Resume");
const auth = require("../middleware/auth");

const router = express.Router();

function signToken(user) {
  return jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

router.post("/register", async (req, res) => {
  try {
    const { email, password, full_name, role = "job_seeker", company_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashed,
      full_name: full_name || null,
      role: ["job_seeker", "recruiter", "admin"].includes(role) ? role : "job_seeker",
      company_name: role === "recruiter" ? company_name || null : null,
      phone: req.body.phone || null,
      bio: req.body.bio || null,
    });

    const token = signToken(user);

    if (user.role === "job_seeker") {
      await Resume.create({
        user_id: user._id,
        title: "My Resume",
        personal_info: {
          full_name: full_name || "",
          email: user.email,
          phone: "",
          location: "",
          summary: "",
        },
        is_primary: true,
      });
    }

    res.status(201).json({ user: user.toPublicJSON(), token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user);
    res.json({ user: user.toPublicJSON(), token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", auth(), async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

router.patch("/profile", auth(), async (req, res) => {
  try {
    const allowed = ["full_name", "avatar_url", "company_name", "company_logo_url", "bio", "job_preference", "phone"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        req.user[key] = req.body[key];
      }
    }
    await req.user.save();
    res.json({ user: req.user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ error: "Profile update failed" });
  }
});

module.exports = router;
