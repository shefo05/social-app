export interface ApiErrorDetail {
  path: string;
  message: string;
}

export interface ApiErrorBody {
  message: string;
  success: false;
  details?: ApiErrorDetail[];
}

export class ApiError extends Error {
  status: number;
  details?: ApiErrorDetail[];

  constructor(status: number, body: Partial<ApiErrorBody>) {
    super(body.message || "Something went wrong. Please try again.");
    this.name = "ApiError";
    this.status = status;
    this.details = body.details;
  }
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** login() and googleAuth() both return this - reactivated is set when a
 * soft-deleted account signed back in within its grace period; isNewUser
 * only ever comes from googleAuth() (password signup is a separate,
 * OTP-gated flow with no equivalent "just created" moment here). */
export interface AuthResult extends AuthTokens {
  reactivated?: boolean;
  isNewUser?: boolean;
}
