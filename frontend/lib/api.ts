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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${API_URL}${cleanPath}`, { ...options, headers });

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

export const api = {
  auth: {
    register: (data: any) => request<{ user: any; token: string }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: any) => request<{ user: any; token: string }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    me: () => request<{ user: any }>("/auth/me"),
    updateProfile: (data: any) => request<{ user: any }>("/auth/profile", { method: "PATCH", body: JSON.stringify(data) }),
  },
  // Baki services yahan add rahegi (yahi structure follow karein)
};