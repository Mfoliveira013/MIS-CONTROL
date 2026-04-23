import axios from 'axios';
import {
  mockDashboardResumo, mockEvolucao, mockAcionamentosStats,
  mockRankingOperadores, mockAcionamentos, mockBoletos,
  mockRecuperacoes, mockAcordos, mockDividas,
} from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const http = axios.create({ baseURL: BASE_URL });

function paginate<T>(items: T[], page = 1, limit = 20) {
  const total = items.length;
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export const api = {
  getDashboardResumo: async () => {
    if (USE_MOCK) return { success: true, data: mockDashboardResumo };
    const r = await http.get('/dashboard/resumo');
    return r.data;
  },

  getEvolucao: async (periodo = 'mes') => {
    if (USE_MOCK) return { success: true, data: mockEvolucao };
    const r = await http.get('/dashboard/evolucao', { params: { periodo } });
    return r.data;
  },

  getAcionamentos: async (params: Record<string, unknown> = {}) => {
    if (USE_MOCK) {
      const filtered = mockAcionamentos.filter((a) => {
        if (params.tipo && a.tipo !== params.tipo) return false;
        if (params.status && a.status !== params.status) return false;
        if (params.operador && !a.operador?.toLowerCase().includes(String(params.operador).toLowerCase())) return false;
        return true;
      });
      return { success: true, ...paginate(filtered, Number(params.page) || 1, Number(params.limit) || 20) };
    }
    const r = await http.get('/acionamentos', { params });
    return r.data;
  },

  createAcionamento: async (body: Record<string, unknown>) => {
    if (USE_MOCK) return { success: true, data: { id: crypto.randomUUID(), ...body } };
    const r = await http.post('/acionamentos', body);
    return r.data;
  },

  getAcionamentosStats: async () => {
    if (USE_MOCK) return { success: true, data: mockAcionamentosStats };
    const r = await http.get('/acionamentos/stats');
    return r.data;
  },

  getBoletos: async (params: Record<string, unknown> = {}) => {
    if (USE_MOCK) {
      const filtered = mockBoletos.filter((b) => !params.status || b.status === params.status);
      return { success: true, ...paginate(filtered, Number(params.page) || 1, Number(params.limit) || 20) };
    }
    const r = await http.get('/boletos', { params });
    return r.data;
  },

  createBoleto: async (body: Record<string, unknown>) => {
    if (USE_MOCK) return { success: true, data: { id: crypto.randomUUID(), ...body, status: 'emitido' } };
    const r = await http.post('/boletos', body);
    return r.data;
  },

  updateBoletoStatus: async (id: string, status: string) => {
    if (USE_MOCK) return { success: true, data: { id, status } };
    const r = await http.patch(`/boletos/${id}/status`, { status });
    return r.data;
  },

  getRecuperacoes: async (params: Record<string, unknown> = {}) => {
    if (USE_MOCK) {
      const filtered = mockRecuperacoes.filter((r) => !params.operador || r.operador === params.operador);
      const total = filtered.reduce((s, r) => s + r.valor_recuperado, 0);
      const result = paginate(filtered, Number(params.page) || 1, Number(params.limit) || 20);
      return { success: true, ...result, meta: { ...result.meta, totalRecuperado: total, ticketMedio: total / (filtered.length || 1) } };
    }
    const r = await http.get('/recuperacoes', { params });
    return r.data;
  },

  createRecuperacao: async (body: Record<string, unknown>) => {
    if (USE_MOCK) return { success: true, data: { id: crypto.randomUUID(), ...body } };
    const r = await http.post('/recuperacoes', body);
    return r.data;
  },

  getRankingOperadores: async () => {
    if (USE_MOCK) return { success: true, data: mockRankingOperadores };
    const r = await http.get('/recuperacoes/ranking');
    return r.data;
  },

  getDividas: async (params: Record<string, unknown> = {}) => {
    if (USE_MOCK) {
      const filtered = mockDividas.filter((d) => !params.status || d.status === params.status);
      return { success: true, ...paginate(filtered, Number(params.page) || 1, Number(params.limit) || 20) };
    }
    const r = await http.get('/dividas', { params });
    return r.data;
  },

  getAcordos: async (params: Record<string, unknown> = {}) => {
    if (USE_MOCK) {
      const filtered = mockAcordos.filter((a) => !params.status || a.status === params.status);
      return { success: true, ...paginate(filtered, Number(params.page) || 1, Number(params.limit) || 20) };
    }
    const r = await http.get('/acordos', { params });
    return r.data;
  },
};
