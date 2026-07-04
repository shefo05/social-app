import { apiClient } from "@/lib/api-client";
import type { AuthTokens, User } from "@/types";

interface MessageResponse {
  message: string;
  success: true;
}

export const authApi = {
  signup: (payload: {
    email: string;
    password: string;
    userName: string;
    phoneNumber: string;
  }) =>
    apiClient.post<MessageResponse>("/auth/signup", payload, { auth: false }),

  verifyAccount: (payload: { email: string; otp: string }) =>
    apiClient.post<MessageResponse>("/auth/verify-account", payload, {
      auth: false,
    }),

  sendOtp: (payload: { email: string }, options?: { auth?: boolean }) =>
    apiClient.post<MessageResponse>("/auth/send-otp", payload, {
      auth: options?.auth ?? false,
    }),

  login: (payload: { email: string; password: string }) =>
    apiClient.post<MessageResponse & { data: AuthTokens }>(
      "/auth/login",
      payload,
      { auth: false },
    ),

  resetPassword: (payload: { otp: string; newPassword: string }) =>
    apiClient.patch<MessageResponse>("/auth/reset-password", payload),

  // Note: the backend responds with `date` instead of `data` here (typo
  // in src/modules/auth/auth.controller.ts) - kept faithful to what the
  // API actually returns rather than what it should say.
  updateProfile: (
    payload: Partial<Pick<User, "email" | "phoneNumber" | "userName">>,
  ) =>
    apiClient.patch<MessageResponse & { date: { updatedUser: User } }>(
      "/auth/update",
      payload,
    ),

  logout: () => apiClient.post<void>("/auth/logout"),

  deleteAccount: () => apiClient.delete<void>("/auth/"),

  getMe: () =>
    apiClient.get<{
      message: string;
      data: { user: User; friends: unknown[] };
    }>("/user/"),
};
