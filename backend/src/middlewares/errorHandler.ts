import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[error]', err.message);
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    data: null,
    error: err.message || 'Erro interno do servidor',
  });
}
