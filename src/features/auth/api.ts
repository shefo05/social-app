import { apiClient } from "@/lib/api-client";
import type { AuthResult, User } from "@/types";

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
    apiClient.post<MessageResponse & { data: AuthResult }>(
      "/auth/login",
      payload,
      { auth: false },
    ),

  // ID-token flow (Google Identity Services) - no redirect, no client
  // secret on this side. Same response shape as login(); backend decides
  // login-vs-signup based on whether the token's email matches an
  // existing account (see auth.service.ts googleAuth()).
  googleAuth: (payload: { idToken: string }) =>
    apiClient.post<MessageResponse & { data: AuthResult }>(
      "/auth/google",
      payload,
      { auth: false },
    ),

  resetPassword: (payload: { otp: string; newPassword: string }) =>
    apiClient.patch<MessageResponse>("/auth/reset-password", payload),

  // Unauthenticated recovery path - resetPassword above requires a valid
  // session, which a locked-out user doesn't have. Uses a distinct
  // `${email}:reset-otp` cache key server-side, separate from
  // signup/sendOtp's OTP.
  forgotPassword: (payload: { email: string }) =>
    apiClient.post<MessageResponse>("/auth/forgot-password", payload, {
      auth: false,
    }),

  resetPasswordConfirm: (payload: {
    email: string;
    otp: string;
    newPassword: string;
  }) =>
    apiClient.post<MessageResponse>("/auth/reset-password-confirm", payload, {
      auth: false,
    }),

  // Note: the backend responds with `date` instead of `data` here (typo
  // in src/modules/auth/auth.controller.ts) - kept faithful to what the
  // API actually returns rather than what it should say.
  // FormData when uploading an avatar (field name "avatar" - see
  // uploadAvatar() middleware), plain JSON for text field updates.
  updateProfile: (
    payload:
      | FormData
      | Partial<Pick<User, "email" | "phoneNumber" | "userName" | "bio">>,
  ) =>
    apiClient.patch<MessageResponse & { date: { updatedUser: User } }>(
      "/auth/update",
      payload,
    ),

  logout: () => apiClient.post<void>("/auth/logout"),

  // Was calling DELETE /auth/ (no such route - only /auth/delete-account
  // is registered), so every attempt 404'd against Express's default HTML
  // handler. That has no JSON body to parse, so the generic ApiError
  // fallback message showed instead of anything real - not the backend
  // hiding an error, the frontend was never reaching the backend at all.
  deleteAccount: () => apiClient.delete<void>("/auth/delete-account"),

  getMe: () =>
    apiClient.get<{
      message: string;
      data: { user: User; friends: unknown[] };
    }>("/user/"),

  // Initial presence snapshot - independent of socket connection timing,
  // since the socket might connect before or after this resolves. See
  // RealtimeGateway's presence:online/offline events for the live updates
  // that follow this.
  getOnlineFriends: () =>
    apiClient.get<{
      message: string;
      data: { onlineFriendIds: string[] };
    }>("/user/online-friends"),
};
