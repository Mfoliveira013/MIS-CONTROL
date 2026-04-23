import { Request, Response, NextFunction } from 'express';
import {
  listDividasService,
  getDividaByIdService,
  createDividaService,
  updateDividaStatusService,
} from '../services/dividas.service';
import { AppError } from '../middlewares/AppError';

export async function listDividas(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, ambiente, status, devedor_id, contrato, search } = req.query as Record<string, string>;
    const result = await listDividasService({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      ambiente: ambiente as never,
      status: status as never,
      devedor_id,
      contrato,
      search,
    });
    res.json({ success: true, ...result, error: null });
  } catch (e) { next(e); }
}

export async function getDividaById(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getDividaByIdService(req.params.id);
    if (!data) throw new AppError('Dívida não encontrada', 404);
    res.json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}

export async function createDivida(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await createDividaService(req.body);
    res.status(201).json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}

export async function updateDividaStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;
    const data = await updateDividaStatusService(req.params.id, status);
    res.json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}
