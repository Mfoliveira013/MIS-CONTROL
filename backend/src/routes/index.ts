import { Router } from 'express';
import { dashboardRouter } from './dashboard.routes';
import { acionamentosRouter } from './acionamentos.routes';
import { boletosRouter } from './boletos.routes';
import { recuperacoesRouter } from './recuperacoes.routes';
import { dividasRouter } from './dividas.routes';
import { acordosRouter } from './acordos.routes';
import { devedoresRouter } from './devedores.routes';

export const router = Router();

router.use('/dashboard', dashboardRouter);
router.use('/acionamentos', acionamentosRouter);
router.use('/boletos', boletosRouter);
router.use('/recuperacoes', recuperacoesRouter);
router.use('/dividas', dividasRouter);
router.use('/acordos', acordosRouter);
router.use('/devedores', devedoresRouter);
