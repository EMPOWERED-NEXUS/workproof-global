export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly errors?: Record<string, string[]>;
  readonly code?: string;

  constructor(
    message: string,
    statusCode = 400,
    errors?: Record<string, string[]>,
    isOperational = true,
    code?: string,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    this.code = code;
  }

  static badRequest(message: string, errors?: Record<string, string[]>, code?: string): AppError {
    return new AppError(message, 400, errors, true, code);
  }

  static unauthorized(message = "Authentication required."): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message = "You do not have permission to perform this action."): AppError {
    return new AppError(message, 403);
  }

  static notFound(message = "Resource not found."): AppError {
    return new AppError(message, 404);
  }

  static conflict(message: string): AppError {
    return new AppError(message, 409);
  }
}
