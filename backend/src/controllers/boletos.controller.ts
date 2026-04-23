import { Request, Response, NextFunction } from 'express';
import { listBoletosService, markBoletoAsPaidService } from '../services/boletos.service';

export async function listBoletos(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, status, vencimento_ate, devedor_id } = req.query as Record<string, string>;
    const result = await listBoletosService({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      status: status as never,
      vencimento_ate,
      devedor_id,
    });
    res.json({ success: true, ...result, error: null });
  } catch (e) { next(e); }
}

export async function markBoletoAsPaid(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await markBoletoAsPaidService(req.params.id, req.body.operador);
    res.json({ success: true, data, error: null });
  } catch (e) { next(e); }
}
