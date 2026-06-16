const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("careerforge_token");
}

export function setToken(token: string) {
  localStorage.setItem("careerforge_token", token);
}

export function clearToken() {
  localStorage.removeItem("careerforge_token");
  localStorage.removeItem("careerforge_user");
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("careerforge_user");
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: unknown) {
  localStorage.setItem("careerforge_user", JSON.stringify(user));
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/pdf")) {
    return res.blob() as Promise<T>;
  }

  return res.json();
}

export const api = {
  auth: {
    register: (data: {
      email: string;
      password: string;
      full_name: string;
      role?: string;
      company_name?: string;
    }) => request<{ user: unknown; token: string }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),

    login: (data: { email: string; password: string }) =>
      request<{ user: unknown; token: string }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),

    me: () => request<{ user: unknown }>("/auth/me"),

    updateProfile: (data: {
      full_name?: string;
      avatar_url?: string;
      bio?: string;
      job_preference?: string;
      phone?: string;
      company_name?: string;
    }) => request<{ user: unknown }>("/auth/profile", { method: "PATCH", body: JSON.stringify(data) }),
  },

  resumes: {
    getPrimary: () => request<import("./types").Resume>("/resumes/primary"),
    update: (id: string, data: Partial<import("./types").Resume>) =>
      request<import("./types").Resume>(`/resumes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    exportPdf: async (id: string, template?: string) => {
      const token = getToken();
      const res = await fetch(`${API_URL}/resumes/${id}/export/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ template }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || "PDF export failed");
      }
      return res.blob();
    },
  },

  ats: {
    analyze: (data: { job_description: string; resume_id?: string }) =>
      request<ATSAnalysisResponse>("/ats/analyze", { method: "POST", body: JSON.stringify(data) }),

    applySuggestions: (data: { analysis_id: string; suggestion_indices?: number[] }) =>
      request<import("./types").Resume>("/ats/apply-suggestions", { method: "POST", body: JSON.stringify(data) }),
  },

  jobs: {
    list: (params?: { status?: string; search?: string; job_type?: string; job_description?: string }) => {
      const q = new URLSearchParams(
        Object.entries(params || {}).reduce(
          (acc, [k, v]) => (v ? { ...acc, [k]: String(v) } : acc),
          {} as Record<string, string>
        )
      ).toString();
      return request<(import("./types").Job & { match_score?: number })[]>(`/jobs/matches${q ? `?${q}` : ""}`);
    },
    create: (data: Partial<import("./types").Job> & { title: string; company: string; description: string }) =>
      request<import("./types").Job>("/jobs", { method: "POST", body: JSON.stringify(data) }),
    apply: (jobId: string, data?: { cover_letter?: string; resume_id?: string }) =>
      request<import("./types").Application>(`/jobs/${jobId}/apply`, { method: "POST", body: JSON.stringify(data || {}) }),
  },

  applications: {
    list: () => request<import("./types").Application[]>("/applications"),
    updateStatus: (id: string, data: { status: string; notes?: string }) =>
      request<import("./types").Application>(`/applications/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  },

  dashboard: {
    jobSeekerStats: () => request<import("./types").DashboardStats & { completion_missing?: string[]; completion_filled?: string[] }>("/dashboard/job-seeker"),
    platformStats: () => request<PlatformStats>("/dashboard/platform-stats"),
    analytics: () => request<SeekerAnalytics>("/dashboard/analytics"),
  },

  recruiter: {
    stats: () => request<import("./types").RecruiterDashboardStats>("/recruiter/stats"),
    pipeline: () => request<{ pipeline: { stage: string; count: number }[]; total: number }>("/recruiter/pipeline"),
    activity: () => request<{ type: string; message: string; time: string; status: string }[]>("/recruiter/activity"),
    analytics: () => request<RecruiterAnalytics>("/recruiter/analytics"),
    candidates: (params?: { min_match?: number; job_id?: string }) => {
      const q = new URLSearchParams(
        Object.entries(params || {}).reduce(
          (acc, [k, v]) => ({ ...acc, [k]: String(v) }),
          {} as Record<string, string>
        )
      ).toString();
      return request<Candidate[]>(`/recruiter/candidates${q ? `?${q}` : ""}`);
    },
    insights: (id: string) => request<{ insights: string[]; match_score: number }>(`/recruiter/candidates/${id}/insights`),
    jobs: () => request<import("./types").Job[]>("/recruiter/jobs"),
  },
};

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  position: string;
  experience: string;
  skills: string[];
  match_score: number;
  status: string;
  location: string;
  summary: string;
  ai_insights: string[];
  job_title?: string;
}

export interface ATSAnalysisResponse {
  id: string;
  overall_score: number;
  keyword_score: number;
  skills_score: number;
  format_score: number;
  missing_keywords: string[];
  missing_skills: string[];
  suggestions: Array<{
    type: string;
    section: string;
    suggested: string;
    impact: string;
    priority?: string;
    message?: string;
  }>;
  keyword_density: Record<string, number>;
  breakdown: {
    keywords: { score: number; found: string[]; missing: string[] };
    skills: { score: number; matched: string[]; missing: string[] };
    format: { score: number; issues: string[] };
    content: { score: number; suggestions: string[] };
  };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export interface PlatformStats {
  total_users: number;
  job_seekers: number;
  recruiters: number;
  active_jobs: number;
  total_applications: number;
  new_users_this_week: number;
  new_jobs_this_week: number;
  my_applications: number;
}

export interface SeekerAnalytics {
  ats_score: number;
  resume_completion: number;
  total_applications: number;
  avg_match_score: number;
  status_counts: Record<string, number>;
  monthly_applications: { month: string; applications: number }[];
  skills_count: number;
  experience_count: number;
}

export interface RecruiterAnalytics {
  open_jobs: number;
  total_applications: number;
  avg_match_score: number;
  weekly_activity: { day: string; applications: number; screenings: number }[];
  status_breakdown: { status: string; count: number }[];
  hire_rate: number;
}
