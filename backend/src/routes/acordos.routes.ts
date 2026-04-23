import { Router } from 'express';
import { listAcordos } from '../controllers/acordos.controller';

export const acordosRouter = Router();

acordosRouter.get('/', listAcordos);
