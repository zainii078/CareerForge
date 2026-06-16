require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resumes");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");
const atsRoutes = require("./routes/ats");
const recruiterRoutes = require("./routes/recruiter");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');

// Isay apne existing code se replace karein
app.use(cors({
  origin: ["https://career-forge-3jgi.vercel.app", "http://localhost:3000"], // Aapka Frontend ka live URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "careerforge-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  try {
    console.log("🚀 Starting CareerForge Backend...");
    console.log("📡 Connecting to MongoDB...");

    console.log("Checking environment...");
console.log("PORT found:", process.env.PORT); 
console.log("MONGODB_URI found:", process.env.MONGODB_URI ? "YES" : "NO");
    
    await connectDB();
    
    console.log("✅ Database connection verified!");
    
    app.listen(PORT, () => {
      console.log(`\n✅ CareerForge Backend Server Running!`);
      console.log(`🌐 URL: http://127.0.0.1:${PORT}`);
      console.log(`📊 Health Check: http://127.0.0.1:${PORT}/api/health`);
      console.log(`🔐 JWT Expires In: ${process.env.JWT_EXPIRES_IN}`);
      console.log(`🤖 AI Service: ${process.env.AI_SERVICE_URL}`);
      console.log(`🎨 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`\n✨ Server ready to accept requests!\n`);
    });
  } catch (err) {
    console.error("\n❌ Failed to start server:", err.message);
    console.error("💡 Troubleshooting:");
    console.error("   1. Check MongoDB URI in .env file");
    console.error("   2. Verify IP whitelist in MongoDB Atlas");
    console.error("   3. Check internet connection");
    process.exit(1);
  }
}

start();
