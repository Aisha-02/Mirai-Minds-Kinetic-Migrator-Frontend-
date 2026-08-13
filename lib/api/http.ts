import { API_BASE, AUTH_TOKEN_KEY } from "@/lib/api/config";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function authHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Unexpected response from server");
  }
}

export async function readApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    return data.error || data.message || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

type ApiFetchOptions = RequestInit & {
  /** Skip Authorization header */
  skipAuth?: boolean;
};

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { skipAuth, headers: initHeaders, ...rest } = options;
  const headers = skipAuth
    ? new Headers(initHeaders)
    : authHeaders(initHeaders);

  return fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
  });
}
