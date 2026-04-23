import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { api } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import type { Divida } from '../types';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

export default function Devedores() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['dividas', page, status, search],
    queryFn: () => api.getDividas({ page, limit: 15, status, search }),
  });

  const columns = [
    { key: 'devedor', header: 'Devedor', render: (r: Divida) => (
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{r.devedor?.nome ?? '—'}</p>
        <p className="text-xs text-slate-400">{r.devedor?.cpf_cnpj ?? '—'}</p>
      </div>
    )},
    { key: 'contrato', header: 'Contrato', render: (r: Divida) => (
      <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{r.contrato ?? '—'}</span>
    )},
    { key: 'valor_original', header: 'Valor Original', render: (r: Divida) => (
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{fmt(r.valor_original)}</span>
    )},
    { key: 'valor_atualizado', header: 'Valor Atualizado', render: (r: Divida) => (
      <span className="text-xs font-bold text-danger">{r.valor_atualizado ? fmt(r.valor_atualizado) : '—'}</span>
    )},
    { key: 'data_vencimento', header: 'Vencimento', render: (r: Divida) => (
      <span className="text-xs text-slate-500">{r.data_vencimento ?? '—'}</span>
    )},
    { key: 'status', header: 'Status', render: (r: Divida) => <StatusBadge status={r.status} /> },
    { key: 'contatos', header: 'Contato', render: (r: Divida) => (
      <div>
        <p className="text-xs text-slate-500 truncate max-w-[160px]">{r.devedor?.telefone ?? '—'}</p>
        <p className="text-xs text-slate-400 truncate max-w-[160px]">{r.devedor?.email ?? '—'}</p>
      </div>
    )},
    { key: '_count', header: 'Atividade', render: (r: Divida) => (
      <div className="flex gap-2 text-xs text-slate-500">
        <span title="Acionamentos">⚡ {r._count?.acionamentos ?? 0}</span>
        <span title="Boletos">📄 {r._count?.boletos ?? 0}</span>
        <span title="Acordos">🤝 {r._count?.acordos ?? 0}</span>
      </div>
    )},
  ];

  const statuses = ['em_aberto','negociando','acordo','pago','perdido'];

  return (
    <div>
      <PageHeader title="Carteira / Devedores" subtitle={`${data?.meta?.total ?? 0} registros`} />

      <div className="card p-4 mb-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 border border-border-light dark:border-border-dark">
          <Search size={14} className="text-slate-400" />
          <input
            className="bg-transparent text-sm outline-none flex-1 text-slate-700 dark:text-slate-300 placeholder-slate-400"
            placeholder="Buscar nome ou CPF/CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input text-sm flex-1 min-w-[160px]"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">Todos os status</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          className="btn-secondary text-sm"
          onClick={() => { setStatus(''); setSearch(''); setPage(1); }}
        >
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
