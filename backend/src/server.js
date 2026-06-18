require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resumes");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");
const atsRoutes = require("./routes/ats");
const recruiterRoutes = require("./routes/recruiter");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

// Build CORS origins from environment
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
];
if (process.env.FRONTEND_URL) {
  // Support comma-separated origins
  process.env.FRONTEND_URL.split(",").forEach((u) => {
    const trimmed = u.trim().replace(/\/+$/, "");
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}
console.log("🌐 CORS allowed origins:", allowedOrigins);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));

// Health Check Route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "careerforge-backend" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error Handling Middleware
app.use((err, _req, res, _next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Database Connection
connectDB().then(() => {
  console.log("✅ Database connected successfully");
}).catch((err) => {
  console.error("❌ Database connection failed:", err);
});

// Server Start (Local ke liye, Vercel khud manage karega)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Vercel ke liye export
module.exports = app;