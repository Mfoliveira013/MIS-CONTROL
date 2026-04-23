import { Router } from 'express';
import { listBoletos, createBoleto, updateBoletoStatus } from '../controllers/boletos.controller';

export const boletosRouter = Router();

boletosRouter.get('/', listBoletos);
boletosRouter.post('/', createBoleto);
boletosRouter.patch('/:id/status', updateBoletoStatus);
