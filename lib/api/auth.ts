import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/api/config";
import { apiFetch, parseJson } from "@/lib/api/http";

export type UserRole = "admin" | "normal_user";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
};

type ApiErrorBody = {
  error?: string;
};

export function homePathForRole(role?: string | null): string {
  return role === "admin" ? "/admin" : "/staging";
}

export function storeAuthSession(token: string, user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function storeAuthToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function registerAccount(
  email: string,
  password: string,
  role: UserRole = "normal_user",
) {
  const response = await apiFetch("/api/auth/register", {
    method: "POST",
    skipAuth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await parseJson<{ user?: AuthUser } & ApiErrorBody>(response);

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data.user!;
}

export async function loginAccount(email: string, password: string) {
  const response = await apiFetch("/api/auth/login", {
    method: "POST",
    skipAuth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJson<
    { token?: string; user?: AuthUser } & ApiErrorBody
  >(response);

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return { token: data.token!, user: data.user! };
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await apiFetch("/api/auth/me");
  const data = await parseJson<{ user?: AuthUser } & ApiErrorBody>(response);

  if (!response.ok) {
    throw new Error(data.error || "Authentication required");
  }

  return data.user!;
}
