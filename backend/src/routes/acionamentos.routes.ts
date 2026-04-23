import { Router } from 'express';
import {
  listAcionamentos,
  createAcionamento,
  getAcionamentosStats,
} from '../controllers/acionamentos.controller';

export const acionamentosRouter = Router();

acionamentosRouter.get('/', listAcionamentos);
acionamentosRouter.post('/', createAcionamento);
acionamentosRouter.get('/stats', getAcionamentosStats);
