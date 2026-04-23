import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { api } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import type { Acordo } from '../types';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function Acordos() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['acordos', page, status],
    queryFn: () => api.getAcordos({ page, limit: 15, status }),
  });

  const columns = [
    { key: 'devedor', header: 'Devedor', render: (r: Acordo) => (
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{r.devedor?.nome ?? '—'}</p>
        <p className="text-xs text-slate-400">{r.devedor?.cpf_cnpj ?? '—'}</p>
      </div>
    )},
    { key: 'contrato', header: 'Contrato', render: (r: Acordo) => (
      <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{r.divida?.contrato ?? '—'}</span>
    )},
    { key: 'valor_total', header: 'Valor Total', render: (r: Acordo) => (
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {r.valor_total ? fmt(r.valor_total) : '—'}
      </span>
    )},
    { key: 'parcelas', header: 'Parcelas', render: (r: Acordo) => (
      <span className="text-xs text-slate-600 dark:text-slate-300">
        {r.num_parcelas ?? '—'}x de {r.valor_parcela ? fmt(r.valor_parcela) : '—'}
      </span>
    )},
    { key: 'data_primeiro_venc', header: '1º Venc.', render: (r: Acordo) => (
      <span className="text-xs text-slate-500">
        {r.data_primeiro_venc
          ? format(new Date(r.data_primeiro_venc + 'T00:00:00'), 'dd/MM/yyyy')
          : '—'}
      </span>
    )},
    { key: 'status', header: 'Status', render: (r: Acordo) => <StatusBadge status={r.status} /> },
    { key: 'operador', header: 'Operador', render: (r: Acordo) => (
      <span className="text-xs text-slate-500">{r.operador ?? '—'}</span>
    )},
  ];

  const byStatus = [
    { s: 'ativo', label: 'Ativos' },
    { s: 'quebrado', label: 'Quebrados' },
    { s: 'quitado', label: 'Quitados' },
  ];

  return (
    <div>
      <PageHeader title="Acordos" subtitle={`${data?.meta?.total ?? 0} registros`} />

      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-center">
        {byStatus.map(({ s, label }) => (
          <button
            key={s}
            onClick={() => { setStatus(s === status ? '' : s); setPage(1); }}
            className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
              status === s
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
        {status && (
          <button
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
            onClick={() => setStatus('')}
          >
            Ver todos
          </button>
        )}
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
