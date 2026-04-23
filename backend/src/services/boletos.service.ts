import { Prisma, StatusBoleto } from '@prisma/client';
import { AppError } from '../middlewares/AppError';
import { toMeta, toPagination } from './helpers';
import { prisma } from './prismaClient';

interface ListParams {
  page?: number;
  limit?: number;
  status?: StatusBoleto;
  vencimento_ate?: string;
  devedor_id?: string;
}

export async function listBoletosService(params: ListParams) {
  const { page, limit, skip } = toPagination(params.page, params.limit);

  const where: Prisma.BoletoWhereInput = {
    ...(params.status ? { status: params.status } : {}),
    ...(params.vencimento_ate ? { vencimento: { lte: new Date(params.vencimento_ate) } } : {}),
    ...(params.devedor_id ? { devedor_id: params.devedor_id } : {}),
  };

  const [total, data] = await Promise.all([
    prisma.boleto.count({ where }),
    prisma.boleto.findMany({
      where,
      skip,
      take: limit,
      orderBy: { vencimento: 'asc' },
      include: {
        devedor: { select: { nome: true, cpf_cnpj: true, status_higienizacao: true } },
        divida: { select: { contrato: true, ambiente: true } },
        acordo: { select: { tipo_acordo: true, status: true } },
      },
    }),
  ]);

  return { data, meta: toMeta(total, page, limit) };
}

export async function markBoletoAsPaidService(id: string, operador?: string) {
  const boleto = await prisma.boleto.findUnique({
    where: { id },
    include: { divida: true },
  });

  if (!boleto) throw new AppError('Boleto não encontrado', 404);
  if (boleto.status === 'pago') throw new AppError('Boleto já está marcado como pago', 409);

  const updated = await prisma.boleto.update({
    where: { id },
    data: {
      status: 'pago',
      pago_em: new Date(),
    },
  });

  await prisma.recuperacao.create({
    data: {
      divida_id: boleto.divida_id,
      devedor_id: boleto.devedor_id,
      boleto_id: boleto.id,
      acordo_id: boleto.acordo_id,
      ambiente: boleto.divida.ambiente,
      valor_recuperado: boleto.valor,
      forma_pagamento: 'boleto',
      data_pagamento: new Date(),
      operador,
    },
  });

  return updated;
}
