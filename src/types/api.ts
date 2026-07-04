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
