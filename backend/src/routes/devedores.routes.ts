import { Router } from 'express';
import {
  listDevedores,
  getDevedorById,
  createDevedor,
  updateDevedor,
} from '../controllers/devedores.controller';

export const devedoresRouter = Router();

devedoresRouter.get('/', listDevedores);
devedoresRouter.get('/:id', getDevedorById);
devedoresRouter.post('/', createDevedor);
devedoresRouter.patch('/:id', updateDevedor);
