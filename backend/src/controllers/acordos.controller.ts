import { Request, Response, NextFunction } from 'express';
import {
  listAcordosService,
  getAcordoByIdService,
  createAcordoService,
  updateAcordoStatusService,
} from '../services/acordos.service';
import { AppError } from '../middlewares/AppError';

export async function listAcordos(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, ambiente, status, operador } = req.query as Record<string, string>;
    const result = await listAcordosService({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      ambiente: ambiente as never,
      status: status as never,
      operador,
    });
    res.json({ success: true, ...result, error: null });
  } catch (e) { next(e); }
}

export async function getAcordoById(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getAcordoByIdService(req.params.id);
    if (!data) throw new AppError('Acordo não encontrado', 404);
    res.json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}

export async function createAcordo(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await createAcordoService(req.body);
    res.status(201).json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}

export async function updateAcordoStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await updateAcordoStatusService(req.params.id, req.body.status);
    res.json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}
