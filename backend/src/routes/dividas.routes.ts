import { Router } from 'express';
import { listDividas } from '../controllers/dividas.controller';

export const dividasRouter = Router();

dividasRouter.get('/', listDividas);
