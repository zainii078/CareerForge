// User Types
export type UserRole = "job_seeker" | "recruiter" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  company_name?: string | null;
  company_logo_url?: string | null;
  bio?: string | null;
  job_preference?: string | null;
  phone?: string | null;
  created_at: string;
}

// Resume Types
export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  github?: string;
  avatar_base64?: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  gpa?: string;
  achievements: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
  does_expire: boolean;
  expiry_date?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  start_date: string;
  end_date?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "basic" | "conversational" | "professional" | "native";
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  personal_info: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  template: string;
  ats_score: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// Job Types
export type JobStatus = "active" | "closed" | "draft";
export type JobType = "full-time" | "part-time" | "contract" | "internship" | "remote";

export interface Job {
  id: string;
  recruiter_id: string;
  title: string;
  company: string;
  location: string;
  department?: string;
  description: string;
  requirements: string[];
  skills_required: string[];
  salary_min?: number;
  salary_max?: number;
  job_type: JobType;
  status: JobStatus;
  applications_count: number;
  created_at: string;
}

// Application Types
export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "interviewed"
  | "rejected"
  | "hired";

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  resume_id: string;
  cover_letter?: string;
  status: ApplicationStatus;
  ats_match_score: number;
  notes?: string;
  created_at: string;
  job?: Job;
  applicant?: User;
  resume?: Resume;
}

// ATS Analysis Types
export interface ATSAnalysis {
  id: string;
  resume_id: string;
  job_id?: string;
  job_description: string;
  overall_score: number;
  keyword_score: number;
  skills_score: number;
  format_score: number;
  missing_keywords: string[];
  missing_skills: string[];
  suggestions: ATSSuggestion[];
  keyword_density: Record<string, number>;
  created_at: string;
}

export interface ATSSuggestion {
  type: "keyword" | "skill" | "format" | "content";
  section: string;
  original?: string;
  suggested: string;
  impact: "high" | "medium" | "low";
}

// Dashboard Types
export interface DashboardStats {
  ats_score: number;
  resume_completion: number;
  total_applications: number;
  interview_rate: number;
  job_match_percentage: number;
}

export interface RecruiterDashboardStats {
  open_jobs: number;
  total_applications: number;
  shortlisted: number;
  hired: number;
  interviewed?: number;
  pending?: number;
  applications_this_week?: number;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
}
