// Normalize: remove trailing slash from env var
const raw = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
const API_URL = raw.replace(/\/+$/, "");

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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${API_URL}${cleanPath}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/pdf")) {
    return res.blob() as unknown as Promise<T>;
  }

  return res.json();
}

// Build query string helper
function qs(params: Record<string, any>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
}

export const api = {
  auth: {
    register: (data: any) =>
      request<{ user: any; token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data: any) =>
      request<{ user: any; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () => request<{ user: any }>("/auth/me"),
    updateProfile: (data: any) =>
      request<{ user: any }>("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
  resumes: {
    getPrimary: () => request<any>("/resumes/primary"),
    update: (id: string, data: any) =>
      request<any>(`/resumes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    exportPdf: (id: string, template?: string) =>
      request<Blob>(`/resumes/${id}/export/pdf${template ? `?template=${template}` : ""}`, {
        method: "POST",
      }),
  },
  applications: {
    list: () => request<any[]>("/applications"),
  },
  jobs: {
    list: (params: Record<string, any> = {}) =>
      request<any[]>(`/jobs${qs(params)}`),
    create: (data: any) =>
      request<any>("/jobs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    apply: (jobId: string) =>
      request<any>(`/jobs/${jobId}/apply`, {
        method: "POST",
      }),
  },
  ats: {
    analyze: (data: any) =>
      request<ATSAnalysisResponse>("/ats/analyze", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    applySuggestions: (data: any) =>
      request<any>("/ats/apply-suggestions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  dashboard: {
    analytics: () => request<SeekerAnalytics>("/dashboard/analytics"),
    platformStats: () => request<PlatformStats>("/dashboard/platform-stats"),
  },
  recruiter: {
    stats: () => request<any>("/recruiter/stats"),
    pipeline: () => request<{ pipeline: { stage: string; count: number }[] }>("/recruiter/pipeline"),
    activity: () => request<any[]>("/recruiter/activity"),
    analytics: () => request<RecruiterAnalytics>("/recruiter/analytics"),
    candidates: (params: Record<string, any> = {}) =>
      request<Candidate[]>(`/recruiter/candidates${qs(params)}`),
    jobs: () => request<any[]>("/recruiter/jobs"),
    updateStatus: (id: string, status: string) => request<any>(`/recruiter/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    })
  },
};

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Shared Types ───────────────────────────────────────────────────────────

export interface SeekerAnalytics {
  status_counts: Record<string, number>;
  total_applications: number;
  interview_rate: number;
  offer_rate: number;
  ats_score?: number;
  resume_completion?: number;
  avg_match_score?: number;
  monthly_applications?: Array<{ month: string; count: number }>;
  skills_count?: number;
  experience_count?: number;
}

export interface ATSAnalysisResponse {
  id?: string;
  score: number;
  overall_score?: number;
  keywords: string[];
  missing_keywords: string[];
  suggestions: Array<{ text: string; section?: string; type?: string; priority?: string; message?: string; suggested?: string; impact?: string }>;
  breakdown?: {
    keywords: { score: number; found?: string[]; missing?: string[] };
    skills: { score: number; matched?: string[]; suggestions?: string[] };
    experience: { score: number };
    education: { score: number };
    format: { score: number };
    content: { score: number };
  };
  keyword_density?: Record<string, number>;
}

export interface PlatformStats {
  active_jobs: number;
  total_users: number;
  total_applications?: number;
}

export interface Candidate {
  id: string;
  name: string;
  avatar?: string;
  position: string;
  experience: string;
  skills: string[];
  match_score: number;
  status?: string;
  location: string;
  summary: string;
  ai_insights?: string[];
}

export interface RecruiterAnalytics {
  open_jobs: number;
  total_applications: number;
  avg_match_score: number;
  hire_rate: number;
  weekly_activity: Array<{ day: string; applications: number; screenings: number }>;
  status_breakdown: Array<{ status: string; count: number }>;
}