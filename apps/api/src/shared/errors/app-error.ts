export type AppErrorOptions = {
  code: string;
  message: string;
  statusCode?: number;
  details?: unknown;
};

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor({ code, message, statusCode = 500, details }: AppErrorOptions) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
