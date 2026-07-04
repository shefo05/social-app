import { useAuthStore } from "@/stores/auth.store";
import { ApiError, type ApiErrorBody } from "@/types/api";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://social-app-5f5n.onrender.com";

interface RequestOptions extends Omit<RequestInit, "body"> {
  /** Attach the stored access token as a Bearer header. Defaults to true. */
  auth?: boolean;
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, body, ...rest } = options;
  const token = auth ? useAuthStore.getState().accessToken : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  let parsed: Partial<ApiErrorBody> & Record<string, unknown> = {};
  try {
    parsed = await res.json();
  } catch {
    // empty/non-JSON body
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      // The backend has no /auth/refresh endpoint - a 401 here means the
      // access token is dead for good, not just due for a silent refresh.
      // Clear the session so route guards bounce the user to /login.
      useAuthStore.getState().logout();
    }
    throw new ApiError(res.status, parsed);
  }

  return parsed as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

export { API_URL };
