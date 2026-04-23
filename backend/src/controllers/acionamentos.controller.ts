import { Request, Response, NextFunction } from 'express';
import {
  listAcionamentosService,
  createAcionamentoService,
  getAcionamentosStatsService,
} from '../services/acionamentos.service';

export async function listAcionamentos(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, ambiente, tabulacao, operador, devedor_id, data_inicio, data_fim } = req.query as Record<string, string>;
    const result = await listAcionamentosService({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      ambiente: ambiente as never,
      tabulacao,
      operador,
      devedor_id,
      data_inicio,
      data_fim,
    });
    res.json({ success: true, ...result, error: null });
  } catch (e) {
    next(e);
  }
}

export async function createAcionamento(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await createAcionamentoService(req.body);
    res.status(201).json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}

export async function getAcionamentosStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getAcionamentosStatsService();
    res.json({ success: true, data, error: null });
  } catch (e) {
    next(e);
  }
}
