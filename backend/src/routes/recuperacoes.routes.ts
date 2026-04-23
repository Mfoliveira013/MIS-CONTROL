import { Router } from 'express';
import { listRecuperacoes, createRecuperacao, getRankingOperadores } from '../controllers/recuperacoes.controller';

export const recuperacoesRouter = Router();

recuperacoesRouter.get('/', listRecuperacoes);
recuperacoesRouter.post('/', createRecuperacao);
recuperacoesRouter.get('/ranking', getRankingOperadores);
