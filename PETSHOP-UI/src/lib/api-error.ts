import { ApiErrorResponse } from "@/types/auth";

export class ApiError extends Error {
  public status: number;
  public code: string;
  public details: string[];
  public traceId?: string;

  constructor(status: number, body: ApiErrorResponse) {
    super(body.message ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code ?? `HTTP_${status}`;
    this.details = body.details ?? [];
    this.traceId = body.traceId;
  }
}
