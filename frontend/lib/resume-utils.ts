import { Resume } from "./types";

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function calcResumeCompletion(resume: Resume | null) {
  if (!resume) return { percent: 0, missing: ["Create your resume"], filled: [] as string[] };
  const sections = [
    { label: "Full Name", filled: !!resume.personal_info?.full_name },
    { label: "Email", filled: !!resume.personal_info?.email },
    { label: "Phone", filled: !!resume.personal_info?.phone },
    { label: "Professional Summary", filled: !!resume.personal_info?.summary },
    { label: "Work Experience", filled: (resume.experience?.length || 0) > 0 },
    { label: "Education", filled: (resume.education?.length || 0) > 0 },
    { label: "Skills", filled: (resume.skills?.length || 0) > 0 },
    { label: "Projects", filled: (resume.projects?.length || 0) > 0 },
    { label: "Certifications", filled: (resume.certifications?.length || 0) > 0 },
    { label: "Languages", filled: (resume.languages?.length || 0) > 0 },
  ];
  const filled = sections.filter((s) => s.filled).map((s) => s.label);
  const missing = sections.filter((s) => !s.filled).map((s) => s.label);
  const percent = Math.round((filled.length / sections.length) * 100);
  return { percent, missing, filled };
}

export const JOB_DESC_STORAGE_KEY = "careerforge_job_description";

export function getStoredJobDescription(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(JOB_DESC_STORAGE_KEY) || "";
}

export function setStoredJobDescription(desc: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(JOB_DESC_STORAGE_KEY, desc);
}
