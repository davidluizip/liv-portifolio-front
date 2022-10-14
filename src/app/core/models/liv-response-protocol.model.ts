export interface LivResponseProtocol<T = unknown> {
  status: number;
  data: T;
  error?: ErrorResponse;
}

export interface LivSuccessResponse<T = unknown> {
  status: number;
  data: T;
}

export interface LivErrorResponse {
  status: number;
  error: ErrorResponse;
}

export interface LivErrorStackResponse {
  url: string;
  [key: string]: string;
}

interface ErrorResponse {
  stack: LivErrorStackResponse;
  message: string;
}
