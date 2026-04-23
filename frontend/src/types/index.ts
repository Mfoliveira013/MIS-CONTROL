export interface Devedor {
  id: string;
  nome: string;
  cpf_cnpj: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  created_at: string;
}

export interface Acionamento {
  id: string;
  devedor_id: string;
  devedor?: Pick<Devedor, 'nome' | 'cpf_cnpj'>;
  tipo: 'ligacao' | 'whatsapp' | 'email' | 'carta' | 'visita';
  status: 'realizado' | 'sem_contato' | 'promessa_pagamento' | 'recusou';
  operador?: string;
  observacao?: string;
  data_acionamento: string;
}

export interface Divida {
  id: string;
  devedor_id: string;
  devedor?: Pick<Devedor, 'nome' | 'cpf_cnpj' | 'telefone' | 'email'>;
  contrato?: string;
  valor_original: number;
  valor_atualizado?: number;
  data_vencimento?: string;
  status: 'em_aberto' | 'negociando' | 'acordo' | 'pago' | 'perdido';
  created_at: string;
  _count?: { boletos: number; acionamentos: number; acordos: number };
}

export interface Boleto {
  id: string;
  divida_id: string;
  devedor_id: string;
  devedor?: Pick<Devedor, 'nome' | 'cpf_cnpj'>;
  divida?: Pick<Divida, 'contrato'>;
  valor: number;
  vencimento: string;
  status: 'emitido' | 'pago' | 'vencido' | 'cancelado';
  codigo_barras?: string;
  linha_digitavel?: string;
  emitido_em: string;
  pago_em?: string;
}

export interface Recuperacao {
  id: string;
  divida_id: string;
  devedor_id: string;
  boleto_id?: string;
  devedor?: Pick<Devedor, 'nome' | 'cpf_cnpj'>;
  divida?: Pick<Divida, 'contrato'>;
  valor_recuperado: number;
  forma_pagamento?: 'boleto' | 'pix' | 'deposito' | 'acordo';
  data_pagamento: string;
  operador?: string;
  created_at: string;
}

export interface Acordo {
  id: string;
  divida_id: string;
  devedor_id: string;
  devedor?: Pick<Devedor, 'nome' | 'cpf_cnpj'>;
  divida?: Pick<Divida, 'contrato' | 'valor_original'>;
  valor_total?: number;
  num_parcelas?: number;
  valor_parcela?: number;
  data_primeiro_venc?: string;
  status: 'ativo' | 'quebrado' | 'quitado';
  operador?: string;
  created_at: string;
}

export interface DashboardResumo {
  totalAcionamentosMes: number;
  totalAcionamentosAnterior: number;
  variacaoAcionamentos: number;
  acionamentosSemContato: number;
  percentualSemContato: number;
  totalRecuperadoMes: number;
  metaMensal: number;
  percentualMeta: number;
  boletosEmitidos: number;
  valorBoletosEmitidos: number;
  taxaConversaoAcordos: number;
  carteiraTotalAberto: number;
  dividasStatus: { status: string; total: number }[];
}

export interface EvolucaoItem {
  data: string;
  valor: number;
  quantidade: number;
}

export interface AcionamentoStats {
  porTipo: { tipo: string; total: number }[];
  porStatus: { status: string; total: number }[];
  porOperador: { operador: string; total: number }[];
}

export interface RankingOperador {
  operador: string;
  total_recuperado: number;
  num_recuperacoes: number;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalRecuperado?: number;
  ticketMedio?: number;
}
