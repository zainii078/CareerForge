// src/lib/api.ts

// Vercel environment variables se URL fetch karein
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-backend-domain.com/api";

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

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Improved Request Function
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Ensure path starts with / and concat correctly
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${API_URL}${cleanPath}`, { ...options, headers });

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
    register: (data: any) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: any) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    me: () => request("/auth/me"),
    updateProfile: (data: any) => request("/auth/profile", { method: "PATCH", body: JSON.stringify(data) }),
  },
  resumes: {
    getPrimary: () => request("/resumes/primary"),
    update: (id: string, data: any) => request(`/resumes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    exportPdf: async (id: string, template?: string) => {
      const token = getToken();
      const res = await fetch(`${API_URL}/resumes/${id}/export/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ template }),
      });
      if (!res.ok) throw new Error("PDF export failed");
      return res.blob();
    },
  },
  ats: {
    analyze: (data: any) => request("/ats/analyze", { method: "POST", body: JSON.stringify(data) }),
    applySuggestions: (data: any) => request("/ats/apply-suggestions", { method: "POST", body: JSON.stringify(data) }),
  },
  jobs: {
    list: (params?: any) => {
      const q = new URLSearchParams(params).toString();
      return request(`/jobs/matches${q ? `?${q}` : ""}`);
    },
    create: (data: any) => request("/jobs", { method: "POST", body: JSON.stringify(data) }),
    apply: (jobId: string, data?: any) => request(`/jobs/${jobId}/apply`, { method: "POST", body: JSON.stringify(data || {}) }),
  },
  applications: {
    list: () => request("/applications"),
    updateStatus: (id: string, data: any) => request(`/applications/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  },
  dashboard: {
    jobSeekerStats: () => request("/dashboard/job-seeker"),
    platformStats: () => request("/dashboard/platform-stats"),
    analytics: () => request("/dashboard/analytics"),
  },
  recruiter: {
    stats: () => request("/recruiter/stats"),
    pipeline: () => request("/recruiter/pipeline"),
    activity: () => request("/recruiter/activity"),
    analytics: () => request("/recruiter/analytics"),
    candidates: (params?: any) => {
      const q = new URLSearchParams(params).toString();
      return request(`/recruiter/candidates${q ? `?${q}` : ""}`);
    },
    insights: (id: string) => request(`/recruiter/candidates/${id}/insights`),
    jobs: () => request("/recruiter/jobs"),
  },
};