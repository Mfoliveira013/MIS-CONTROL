import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { api } from '../services/api';
import { mockDevedores } from '../services/mockData';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import type { Acionamento } from '../types';

type FilterState = { tipo: string; status: string; operador: string; search: string };

export default function Acionamentos() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({ tipo: '', status: '', operador: '', search: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['acionamentos', page, filters],
    queryFn: () => api.getAcionamentos({ page, limit: 15, ...filters }),
  });

  const { register, handleSubmit, reset } = useForm();

  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.createAcionamento(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['acionamentos'] }); setModalOpen(false); reset(); },
  });

  const columns = [
    { key: 'devedor', header: 'Devedor', render: (r: Acionamento) => (
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{r.devedor?.nome ?? '—'}</p>
        <p className="text-xs text-slate-400">{r.devedor?.cpf_cnpj ?? '—'}</p>
      </div>
    )},
    { key: 'tipo', header: 'Tipo', render: (r: Acionamento) => <StatusBadge status={r.tipo} /> },
    { key: 'status', header: 'Status', render: (r: Acionamento) => <StatusBadge status={r.status} /> },
    { key: 'operador', header: 'Operador', render: (r: Acionamento) => <span className="text-xs">{r.operador ?? '—'}</span> },
    { key: 'data_acionamento', header: 'Data', render: (r: Acionamento) => (
      <span className="text-xs text-slate-500">{format(new Date(r.data_acionamento), 'dd/MM/yyyy HH:mm')}</span>
    )},
    { key: 'observacao', header: 'Observação', render: (r: Acionamento) => (
      <span className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">{r.observacao ?? '—'}</span>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Acionamentos"
        subtitle={`${data?.meta?.total ?? 0} registros`}
        action={
          <button className="btn-primary text-sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Novo Acionamento
          </button>
        }
      />

      {/* Filters */}
      <div className="card p-4 mb-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[180px] bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 border border-border-light dark:border-border-dark">
          <Search size={14} className="text-slate-400" />
          <input
            className="bg-transparent text-sm outline-none flex-1 text-slate-700 dark:text-slate-300 placeholder-slate-400"
            placeholder="Buscar devedor ou CPF..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>
        {(['tipo', 'status'] as const).map((field) => (
          <select
            key={field}
            className="input text-sm flex-1 min-w-[140px]"
            value={filters[field]}
            onChange={(e) => setFilters((f) => ({ ...f, [field]: e.target.value }))}
          >
            <option value="">{field === 'tipo' ? 'Todos os tipos' : 'Todos os status'}</option>
            {field === 'tipo'
              ? ['ligacao','whatsapp','email','carta','visita'].map((v) => <option key={v} value={v}>{v}</option>)
              : ['realizado','sem_contato','promessa_pagamento','recusou'].map((v) => <option key={v} value={v}>{v}</option>)
            }
          </select>
        ))}
        <button className="btn-secondary text-sm" onClick={() => { setFilters({ tipo:'',status:'',operador:'',search:'' }); setPage(1); }}>
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

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title="Novo Acionamento"
        footer={
          <>
            <button className="btn-secondary text-sm" onClick={() => { setModalOpen(false); reset(); }}>Cancelar</button>
            <button className="btn-primary text-sm" onClick={handleSubmit((d) => mutation.mutate(d as Record<string, unknown>))}>
              Salvar
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Devedor</label>
            <select className="input" {...register('devedor_id', { required: true })}>
              <option value="">Selecionar...</option>
              {mockDevedores.slice(0, 20).map((d) => (
                <option key={d.id} value={d.id}>{d.nome} — {d.cpf_cnpj}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Tipo</label>
              <select className="input" {...register('tipo', { required: true })}>
                {['ligacao','whatsapp','email','carta','visita'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" {...register('status', { required: true })}>
                {['realizado','sem_contato','promessa_pagamento','recusou'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Operador</label>
            <input className="input" placeholder="Nome do operador" {...register('operador')} />
          </div>
          <div>
            <label className="label">Observação</label>
            <textarea className="input resize-none" rows={3} placeholder="Detalhes do contato..." {...register('observacao')} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
