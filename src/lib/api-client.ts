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
    // The backend's isAuthenticated middleware also throws 401 for
    // ownership checks unrelated to session validity (e.g. "you are not
    // authorized to delete this post" - see post/comment/request
    // services), so a blanket `status === 401` would wrongly log out a
    // still-valid session. Only the middleware's own token-rejection
    // message means the session is actually dead. The backend has no
    // /auth/refresh endpoint, so once dead it's dead for good - clear the
    // session so route guards bounce the user to /login.
    if (res.status === 401 && auth && parsed.message === "invalid or expired token") {
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
