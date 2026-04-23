import { AmbienteCobranca, Prisma, StatusDivida } from '@prisma/client';
import { AppError } from '../middlewares/AppError';
import { toMeta, toPagination } from './helpers';
import { prisma } from './prismaClient';

interface ListParams {
  page?: number;
  limit?: number;
  ambiente?: AmbienteCobranca;
  status?: StatusDivida;
  devedor_id?: string;
  contrato?: string;
  search?: string;
}

export async function listDividasService(params: ListParams) {
  const { page, limit, skip } = toPagination(params.page, params.limit);

  const where: Prisma.DividaWhereInput = {
    ...(params.ambiente ? { ambiente: params.ambiente } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.devedor_id ? { devedor_id: params.devedor_id } : {}),
    ...(params.contrato
      ? { contrato: { contains: params.contrato, mode: 'insensitive' } }
      : {}),
    ...(params.search
      ? {
          devedor: {
            OR: [
              { nome: { contains: params.search, mode: 'insensitive' } },
              { cpf_cnpj: { contains: params.search } },
            ],
          },
        }
      : {}),
  };

  const [total, data] = await Promise.all([
    prisma.divida.count({ where }),
    prisma.divida.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        devedor: { select: { nome: true, cpf_cnpj: true, telefone: true, email: true, status_higienizacao: true } },
        _count: { select: { boletos: true, acionamentos: true, acordos: true } },
      },
    }),
  ]);

  return { data, meta: toMeta(total, page, limit) };
}

export async function getDividaByIdService(id: string) {
  return prisma.divida.findUnique({
    where: { id },
    include: {
      devedor: true,
      acionamentos: { orderBy: { data_acionamento: 'desc' } },
      acordos: { orderBy: { created_at: 'desc' } },
      boletos: { orderBy: { vencimento: 'desc' } },
      recuperacoes: { orderBy: { data_pagamento: 'desc' } },
    },
  });
}

export async function createDividaService(payload: {
  devedor_id: string;
  contrato?: string;
  valor_original: number;
  valor_atualizado?: number;
  data_vencimento?: string;
  status?: StatusDivida;
  ambiente: AmbienteCobranca;
  numero_processo?: string;
}) {
  if (payload.ambiente === 'judicial' && !payload.numero_processo) {
    throw new AppError('Número de processo é obrigatório para dívidas do ambiente judicial', 422);
  }

  return prisma.divida.create({
    data: {
      devedor_id: payload.devedor_id,
      contrato: payload.contrato,
      valor_original: payload.valor_original,
      valor_atualizado: payload.valor_atualizado,
      data_vencimento: payload.data_vencimento ? new Date(payload.data_vencimento) : undefined,
      status: payload.status ?? 'em_aberto',
      ambiente: payload.ambiente,
      numero_processo: payload.numero_processo,
    },
  });
}

export async function updateDividaStatusService(id: string, status: StatusDivida) {
  return prisma.divida.update({
    where: { id },
    data: { status },
  });
}
