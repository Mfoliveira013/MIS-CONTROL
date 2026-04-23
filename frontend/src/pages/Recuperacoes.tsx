import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import type { Recuperacao } from '../types';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function Recuperacoes() {
  const [page, setPage] = useState(1);
  const [forma, setForma] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['recuperacoes', page, forma, search],
    queryFn: () => api.getRecuperacoes({ page, limit: 15, forma_pagamento: forma }),
  });

  const { data: rankingData } = useQuery({
    queryKey: ['ranking-operadores'],
    queryFn: () => api.getRankingOperadores(),
  });

  const ranking = rankingData?.data ?? [];
  const totalRecuperado = data?.meta?.totalRecuperado ?? 0;

  const columns = [
    { key: 'devedor', header: 'Devedor', render: (r: Recuperacao) => (
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{r.devedor?.nome ?? '—'}</p>
        <p className="text-xs text-slate-400">{r.devedor?.cpf_cnpj ?? '—'}</p>
      </div>
    )},
    { key: 'contrato', header: 'Contrato', render: (r: Recuperacao) => (
      <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{r.divida?.contrato ?? '—'}</span>
    )},
    { key: 'valor_recuperado', header: 'Valor', render: (r: Recuperacao) => (
      <span className="text-sm font-bold text-success">{fmt(r.valor_recuperado)}</span>
    )},
    { key: 'forma_pagamento', header: 'Forma', render: (r: Recuperacao) => (
      <StatusBadge status={r.forma_pagamento ?? 'boleto'} />
    )},
    { key: 'operador', header: 'Operador', render: (r: Recuperacao) => (
      <span className="text-xs text-slate-600 dark:text-slate-400">{r.operador ?? '—'}</span>
    )},
    { key: 'data_pagamento', header: 'Data', render: (r: Recuperacao) => (
      <span className="text-xs text-slate-500">
        {format(new Date(r.data_pagamento + 'T00:00:00'), 'dd/MM/yyyy')}
      </span>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Recuperações"
        subtitle={`Total recuperado: ${fmt(totalRecuperado)}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Summary card */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase font-medium">Total Recuperado</p>
              <p className="text-2xl font-bold text-success">{fmt(totalRecuperado)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-medium">Registros</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {data?.meta?.total ?? 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-medium">Ticket Médio</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {fmt(data?.meta?.ticketMedio ?? 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Top operador */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} className="text-warning" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Top Operadores</h3>
          </div>
          <ul className="space-y-2">
            {ranking.slice(0, 3).map((r, i) => (
              <li key={r.operador} className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-400 text-yellow-900'
                  : i === 1 ? 'bg-slate-300 text-slate-700'
                  : 'bg-amber-600 text-white'
                }`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{r.operador}</p>
                  <p className="text-xs text-success font-semibold">{fmt(r.total_recuperado)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[180px] bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 border border-border-light dark:border-border-dark">
          <Search size={14} className="text-slate-400" />
          <input
            className="bg-transparent text-sm outline-none flex-1 text-slate-700 dark:text-slate-300 placeholder-slate-400"
            placeholder="Buscar devedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input text-sm flex-1 min-w-[140px]"
          value={forma}
          onChange={(e) => { setForma(e.target.value); setPage(1); }}
        >
          <option value="">Todas as formas</option>
          {['boleto','pix','deposito','acordo'].map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <button className="btn-secondary text-sm" onClick={() => { setForma(''); setSearch(''); setPage(1); }}>
          Limpar
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        keyField="id"
        loading={isLoading}
        total={data?.meta?.total}
        page={page}
        limit={15}
        onPageChange={setPage}
      />
    </div>
  );
}
