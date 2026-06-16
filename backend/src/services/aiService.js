const axios = require("axios");
const { analyzeATSFallback, scoreMatchFallback } = require("./atsFallback");

const AI_BASE = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const aiClient = axios.create({
  baseURL: AI_BASE,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

async function analyzeATS(resume, jobDescription) {
  try {
    const { data } = await aiClient.post("/api/ats/analyze", {
      resume,
      job_description: jobDescription,
    });
    return data;
  } catch (err) {
    console.warn("AI service unavailable, using fallback ATS:", err.message);
    return analyzeATSFallback(resume, jobDescription);
  }
}

async function generatePDF(resume, template = "modern") {
  try {
    const response = await aiClient.post(
      "/api/pdf/generate",
      { resume, template },
      { responseType: "arraybuffer" }
    );
    return response.data;
  } catch (err) {
    console.warn("AI PDF service unavailable:", err.message);
    throw new Error("PDF generation requires AI service. Start it with: npm run dev:ai");
  }
}

async function getRecruiterInsights(candidate, jobDescription) {
  const { data } = await aiClient.post("/api/recruiter/insights", {
    candidate,
    job_description: jobDescription,
  });
  return data;
}

async function scoreCandidateMatch(resume, jobDescription) {
  try {
    const { data } = await aiClient.post("/api/recruiter/match-score", {
      resume,
      job_description: jobDescription,
    });
    return data;
  } catch (err) {
    console.warn("AI service unavailable, using fallback match score:", err.message);
    return scoreMatchFallback(resume, jobDescription);
  }
}

module.exports = {
  analyzeATS,
  generatePDF,
  getRecruiterInsights,
  scoreCandidateMatch,
};
