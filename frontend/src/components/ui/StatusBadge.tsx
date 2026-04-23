const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  realizado:          { label: 'Realizado',          cls: 'bg-success/10 text-success' },
  sem_contato:        { label: 'Sem Contato',        cls: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' },
  promessa_pagamento: { label: 'Promessa',            cls: 'bg-warning/10 text-warning' },
  recusou:            { label: 'Recusou',             cls: 'bg-danger/10 text-danger' },
  em_aberto:          { label: 'Em Aberto',           cls: 'bg-danger/10 text-danger' },
  negociando:         { label: 'Negociando',          cls: 'bg-warning/10 text-warning' },
  acordo:             { label: 'Acordo',              cls: 'bg-primary/10 text-primary' },
  pago:               { label: 'Pago',                cls: 'bg-success/10 text-success' },
  perdido:            { label: 'Perdido',             cls: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400' },
  emitido:            { label: 'Emitido',             cls: 'bg-primary/10 text-primary' },
  vencido:            { label: 'Vencido',             cls: 'bg-danger/10 text-danger' },
  cancelado:          { label: 'Cancelado',           cls: 'bg-slate-100 dark:bg-slate-700 text-slate-500' },
  ativo:              { label: 'Ativo',               cls: 'bg-success/10 text-success' },
  quebrado:           { label: 'Quebrado',            cls: 'bg-danger/10 text-danger' },
  quitado:            { label: 'Quitado',             cls: 'bg-primary/10 text-primary' },
  boleto:             { label: 'Boleto',              cls: 'bg-primary/10 text-primary' },
  pix:                { label: 'PIX',                 cls: 'bg-success/10 text-success' },
  deposito:           { label: 'Depósito',            cls: 'bg-warning/10 text-warning' },
  ligacao:            { label: 'Ligação',             cls: 'bg-primary/10 text-primary' },
  whatsapp:           { label: 'WhatsApp',            cls: 'bg-success/10 text-success' },
  email:              { label: 'E-mail',              cls: 'bg-warning/10 text-warning' },
  carta:              { label: 'Carta',               cls: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' },
  visita:             { label: 'Visita',              cls: 'bg-danger/10 text-danger' },
};

interface Props {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const cfg = STATUS_MAP[status] ?? { label: status, cls: 'bg-slate-100 text-slate-600' };
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${cfg.cls}
        ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'}`}
    >
      {cfg.label}
    </span>
  );
}
