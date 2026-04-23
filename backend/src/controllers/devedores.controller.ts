import { Request, Response, NextFunction } from 'express';
import {
  listDevedoresService,
  getDevedorByIdService,
  createDevedorService,
  updateDevedorService,
} from '../services/devedores.service';
import { AppError } from '../middlewares/AppError';

export async function listDevedores(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, nome, cpf_cnpj, status_higienizacao } = req.query as Record<string, string>;
    const result = await listDevedoresService({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      nome,
      cpf_cnpj,
      status_higienizacao: status_higienizacao as never,
    });
    res.json({ success: true, ...result, error: null });
  } catch (e) {
    next(e);
  }
}

export async function getDevedorById(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getDevedorByIdService(req.params.id);
    if (!data) throw new AppError('Devedor não encontrado', 404);
    res.json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}

export async function createDevedor(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await createDevedorService(req.body);
    res.status(201).json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}

export async function updateDevedor(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await updateDevedorService(req.params.id, req.body);
    res.json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}
