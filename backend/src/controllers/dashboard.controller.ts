import { Request, Response, NextFunction } from 'express';
import { getResumoService, getEvolucaoService } from '../services/dashboard.service';

export async function getResumo(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getResumoService();
    res.json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}

export async function getEvolucao(req: Request, res: Response, next: NextFunction) {
  try {
    const periodo = (req.query.periodo as string) || 'mes';
    const data = await getEvolucaoService(periodo);
    res.json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}
