export const TABULACOES_EJ = [
  'NAO_ASSOCIADO',
  'ESGOTADO_TENTATIVAS',
  'TELEFONE_OCUPADO',
  'OBITO_901',
  'ASSINATURA_DOCUMENTO',
  'DESCONHECIDO',
  'BOLETO_PAGO_308',
  'RETORNO_FILA_713',
] as const;

export const TABULACOES_JD = [
  'OCUPADO',
  'ACORDO_REALIZADO',
  'BOLETO_ENVIADO_306',
  'RECADO',
  'RCS_EM_LOTE',
  'SEM_PROPOSTA_201',
  'DESCONHECE_CLIENTE',
  'NAO_ATENDE_101',
  'COM_PROMESSA_302',
  'PEDIU_LIGAR_DEPOIS',
  'EMAIL_EM_LOTE',
  'COM_PROPOSTA_301',
  'WHATSAPP_EM_LOTE',
] as const;

export const TABULACOES_BY_AMBIENTE = {
  extrajudicial: TABULACOES_EJ,
  judicial: TABULACOES_JD,
} as const;

export const OPERADORES_DEFAULT = [
  'Ana Lima',
  'Carlos Melo',
  'Patrícia Sousa',
  'Rafael Dias',
  'Juliana Costa',
] as const;
