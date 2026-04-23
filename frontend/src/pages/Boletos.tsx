import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import type { Boleto } from '../types';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function Boletos() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['boletos', page, status, search],
    queryFn: () => api.getBoletos({ page, limit: 15, status, search }),
  });

  const mutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: string }) =>
      api.updateBoletoStatus(id, newStatus),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['boletos'] }),
  });

  const columns = [
    { key: 'devedor', header: 'Devedor', render: (r: Boleto) => (
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{r.devedor?.nome ?? '—'}</p>
        <p className="text-xs text-slate-400">{r.devedor?.cpf_cnpj ?? '—'}</p>
      </div>
    )},
    { key: 'contrato', header: 'Contrato', render: (r: Boleto) => (
      <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{r.divida?.contrato ?? '—'}</span>
    )},
    { key: 'valor', header: 'Valor', render: (r: Boleto) => (
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{fmt(r.valor)}</span>
    )},
    { key: 'vencimento', header: 'Vencimento', render: (r: Boleto) => (
      <span className="text-xs text-slate-500">{format(new Date(r.vencimento + 'T00:00:00'), 'dd/MM/yyyy')}</span>
    )},
    { key: 'status', header: 'Status', render: (r: Boleto) => <StatusBadge status={r.status} /> },
    { key: 'emitido_em', header: 'Emitido em', render: (r: Boleto) => (
      <span className="text-xs text-slate-400">{format(new Date(r.emitido_em), 'dd/MM/yyyy')}</span>
    )},
    { key: 'actions', header: '', render: (r: Boleto) => r.status === 'emitido' ? (
      <button
        className="text-xs text-success hover:underline font-medium"
        onClick={() => mutation.mutate({ id: r.id, newStatus: 'pago' })}
      >
        Marcar pago
      </button>
    ) : null },
  ];

  return (
    <div>
      <PageHeader
        title="Boletos"
        subtitle={`${data?.meta?.total ?? 0} registros`}
        action={
          <button className="btn-primary text-sm">
            <Plus size={16} /> Emitir Boleto
          </button>
        }
      />

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
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">Todos os status</option>
          {['emitido','pago','vencido','cancelado'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="flex gap-2">
          {['emitido','pago','vencido','cancelado'].map((s) => {
            const counts: Record<string, number> = {
              emitido: data?.meta?.total ?? 0,
            };
            return (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  status === s
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {s}
              </button>
            );
            void counts;
          })}
          <button
            className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
            onClick={() => { setStatus(''); setPage(1); }}
          >
            Todos
          </button>
        </div>
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
