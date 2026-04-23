import { Request, Response, NextFunction } from 'express';
import { listRecuperacoesService, createRecuperacaoService, getRankingOperadoresService } from '../services/recuperacoes.service';

export async function listRecuperacoes(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, ambiente, operador, data_inicio, data_fim } = req.query as Record<string, string>;
    const result = await listRecuperacoesService({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      ambiente: ambiente as never,
      operador,
      data_inicio,
      data_fim,
    });
    res.json({ success: true, ...result, error: null });
  } catch (e) { next(e); }
}

export async function createRecuperacao(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await createRecuperacaoService(req.body);
    res.status(201).json({ success: true, data, error: null });
  } catch (e) { next(e); }
}

export async function getRankingOperadores(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getRankingOperadoresService(req.query.ambiente as never);
    res.json({ success: true, data, error: null });
  } catch (e) { next(e); }
}
