import { Router } from 'express';
import { getResumo, getEvolucao } from '../controllers/dashboard.controller';

export const dashboardRouter = Router();

dashboardRouter.get('/resumo', getResumo);
dashboardRouter.get('/evolucao', getEvolucao);
