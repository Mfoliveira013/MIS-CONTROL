import { subDays, format } from 'date-fns';
import type {
  DashboardResumo, EvolucaoItem, AcionamentoStats,
  RankingOperador, Acionamento, Boleto, Recuperacao, Acordo, Divida, Devedor,
} from '../types';

const operadores = ['Carlos Mendes','Ana Paula Souza','Roberto Lima','Fernanda Costa','Diego Alves','Juliana Reis','Marcelo Santos','Patricia Gomes'];
const nomes = [
  'Joao Silva Santos','Maria Oliveira Lima','Pedro Costa Ferreira','Ana Paula Rodrigues','Carlos Eduardo Mendes',
  'Fernanda Cristina Alves','Roberto Carlos Souza','Juliana Beatriz Pereira','Marcos Antonio Gomes','Luciana Reis Carvalho',
  'Daniel Felipe Martins','Patricia Helena Barbosa','Ricardo Luiz Teixeira','Debora Cristiane Nascimento','Gustavo Henrique Ribeiro',
  'Simone Aparecida Castro','Thiago Alexandre Moreira','Vanessa Lima Ferreira','Andre Luiz Cardoso','Camila Souza Machado',
  'Bruno Rodrigues Medeiros','Aline Gomes Cunha','Leandro Alves Pinto','Priscila Fernandes Araujo','Diego Costa Vieira',
  'Renata Marques Oliveira','Felipe Santos Cruz','Cristiane Pereira Ramos','Eduardo Melo Correia','Marcia Aparecida Dias',
];
const cpfs = [
  '384.752.190-41','521.873.640-52','267.194.830-63','948.371.260-74','135.627.890-85',
  '782.435.190-96','459.183.670-07','826.594.130-18','317.462.850-29','694.218.730-30',
  '183.749.260-41','547.832.190-52','921.564.380-63','368.145.790-74','754.293.180-85',
  '192.847.360-96','436.918.270-07','875.243.190-18','294.617.380-29','631.582.940-30',
  '178.394.620-41','563.271.840-52','927.483.160-63','384.196.750-74','751.829.430-85',
  '218.473.960-96','694.352.810-07','137.826.490-18','483.619.270-29','926.473.810-30',
];

const rnd = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(arr: T[]): T => arr[rnd(arr.length)];
const fmtDate = (d: Date) => format(d, 'yyyy-MM-dd');
const uuid = () => crypto.randomUUID();

function makeDevedores(): Devedor[] {
  return nomes.map((nome, i) => ({
    id: uuid(), nome, cpf_cnpj: cpfs[i],
    telefone: `(11) 9${1000+rnd(8999)}-${1000+rnd(8999)}`,
    email: `${nome.split(' ')[0].toLowerCase()}${rnd(99)}@gmail.com`,
    endereco: `Rua das Flores, ${100+rnd(800)} - São Paulo - SP`,
    created_at: fmtDate(subDays(new Date(), 300+rnd(200))),
  }));
}

const devedores = makeDevedores();

function makeAcionamentos(): Acionamento[] {
  const tipos: Acionamento['tipo'][] = ['ligacao','whatsapp','email','carta','visita'];
  const statuses: Acionamento['status'][] = ['realizado','sem_contato','promessa_pagamento','recusou'];
  return Array.from({ length: 60 }, (_, i) => {
    const dev = devedores[i % devedores.length];
    return {
      id: uuid(), devedor_id: dev.id,
      devedor: { nome: dev.nome, cpf_cnpj: dev.cpf_cnpj },
      tipo: pick(tipos), status: pick(statuses),
      operador: pick(operadores),
      observacao: pick(['Sem contato no horário comercial','Promessa para próxima semana','Recusou negociação','Contato realizado com sucesso']),
      data_acionamento: new Date(Date.now() - rnd(60)*86400000).toISOString(),
    };
  });
}

function makeBoletos(): Boleto[] {
  const statuses: Boleto['status'][] = ['emitido','pago','vencido','cancelado'];
  return Array.from({ length: 40 }, (_, i) => {
    const dev = devedores[i % devedores.length];
    const st = pick(statuses);
    const venc = subDays(new Date(), rnd(90)-30);
    return {
      id: uuid(), divida_id: uuid(), devedor_id: dev.id,
      devedor: { nome: dev.nome, cpf_cnpj: dev.cpf_cnpj },
      divida: { contrato: `CTR-${String(i+1).padStart(6,'0')}` },
      valor: 500 + rnd(15000), vencimento: fmtDate(venc), status: st,
      codigo_barras: `34191.09008 60766.123456 88107.590008 1 ${Date.now()}`,
      linha_digitavel: `341910900860766869066881075900081000000000000`,
      emitido_em: new Date(Date.now()-rnd(30)*86400000).toISOString(),
      pago_em: st === 'pago' ? new Date(Date.now()-rnd(10)*86400000).toISOString() : undefined,
    };
  });
}

function makeRecuperacoes(): Recuperacao[] {
  const formas: Recuperacao['forma_pagamento'][] = ['boleto','pix','deposito','acordo'];
  return Array.from({ length: 35 }, (_, i) => {
    const dev = devedores[i % devedores.length];
    return {
      id: uuid(), divida_id: uuid(), devedor_id: dev.id,
      devedor: { nome: dev.nome, cpf_cnpj: dev.cpf_cnpj },
      divida: { contrato: `CTR-${String(i+1).padStart(6,'0')}` },
      valor_recuperado: 500 + rnd(20000),
      forma_pagamento: pick(formas),
      data_pagamento: fmtDate(subDays(new Date(), rnd(45))),
      operador: pick(operadores),
      created_at: new Date().toISOString(),
    };
  });
}

function makeAcordos(): Acordo[] {
  const statuses: Acordo['status'][] = ['ativo','quebrado','quitado'];
  return Array.from({ length: 25 }, (_, i) => {
    const dev = devedores[i % devedores.length];
    const total = 2000 + rnd(30000);
    const parcelas = 2 + rnd(10);
    return {
      id: uuid(), divida_id: uuid(), devedor_id: dev.id,
      devedor: { nome: dev.nome, cpf_cnpj: dev.cpf_cnpj },
      divida: { contrato: `CTR-${String(i+1).padStart(6,'0')}`, valor_original: total*1.2 },
      valor_total: total, num_parcelas: parcelas,
      valor_parcela: parseFloat((total/parcelas).toFixed(2)),
      data_primeiro_venc: fmtDate(subDays(new Date(), -rnd(30))),
      status: pick(statuses),
      operador: pick(operadores),
      created_at: new Date().toISOString(),
    };
  });
}

function makeDividas(): Divida[] {
  const statuses: Divida['status'][] = ['em_aberto','negociando','acordo','pago','perdido'];
  return Array.from({ length: 50 }, (_, i) => {
    const dev = devedores[i % devedores.length];
    const val = 1500 + rnd(48000);
    return {
      id: uuid(), devedor_id: dev.id,
      devedor: { nome: dev.nome, cpf_cnpj: dev.cpf_cnpj, telefone: dev.telefone, email: dev.email },
      contrato: `CTR-${String(i+1).padStart(6,'0')}`,
      valor_original: val, valor_atualizado: val * (1 + rnd(35)/100),
      data_vencimento: fmtDate(subDays(new Date(), rnd(700))),
      status: pick(statuses), created_at: new Date().toISOString(),
      _count: { boletos: rnd(3), acionamentos: 2+rnd(6), acordos: rnd(2) },
    };
  });
}

export const mockAcionamentos = makeAcionamentos();
export const mockBoletos = makeBoletos();
export const mockRecuperacoes = makeRecuperacoes();
export const mockAcordos = makeAcordos();
export const mockDividas = makeDividas();
export const mockDevedores = devedores;

export const mockDashboardResumo: DashboardResumo = {
  totalAcionamentosMes: 487,
  totalAcionamentosAnterior: 412,
  variacaoAcionamentos: 18.2,
  acionamentosSemContato: 147,
  percentualSemContato: 30.2,
  totalRecuperadoMes: 183450,
  metaMensal: 250000,
  percentualMeta: 73.4,
  boletosEmitidos: 124,
  valorBoletosEmitidos: 520800,
  taxaConversaoAcordos: 38.5,
  carteiraTotalAberto: 3250000,
  dividasStatus: [
    { status: 'em_aberto', total: 145 },
    { status: 'negociando', total: 67 },
    { status: 'acordo', total: 34 },
    { status: 'pago', total: 89 },
    { status: 'perdido', total: 21 },
  ],
};

export const mockEvolucao: EvolucaoItem[] = Array.from({ length: 30 }, (_, i) => ({
  data: fmtDate(subDays(new Date(), 29 - i)),
  valor: 2000 + rnd(18000),
  quantidade: 1 + rnd(8),
}));

export const mockAcionamentosStats: AcionamentoStats = {
  porTipo: [
    { tipo: 'ligacao', total: 187 },
    { tipo: 'whatsapp', total: 145 },
    { tipo: 'email', total: 97 },
    { tipo: 'carta', total: 42 },
    { tipo: 'visita', total: 16 },
  ],
  porStatus: [
    { status: 'realizado', total: 210 },
    { status: 'sem_contato', total: 147 },
    { status: 'promessa_pagamento', total: 98 },
    { status: 'recusou', total: 32 },
  ],
  porOperador: operadores.map((op) => ({ operador: op, total: 20+rnd(80) })),
};

export const mockRankingOperadores: RankingOperador[] = [
  { operador: 'Carlos Mendes', total_recuperado: 42500, num_recuperacoes: 18 },
  { operador: 'Ana Paula Souza', total_recuperado: 38200, num_recuperacoes: 15 },
  { operador: 'Roberto Lima', total_recuperado: 35100, num_recuperacoes: 14 },
  { operador: 'Fernanda Costa', total_recuperado: 28800, num_recuperacoes: 11 },
  { operador: 'Diego Alves', total_recuperado: 22400, num_recuperacoes: 9 },
];

export const mockAlertasBoletos = mockBoletos.filter((b) => b.status === 'vencido').slice(0, 5);
export const mockAlertasAcordos = mockAcordos.filter((a) => a.status === 'quebrado').slice(0, 5);
export const mockPromessas = mockAcionamentos.filter((a) => a.status === 'promessa_pagamento').slice(0, 5);
