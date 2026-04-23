import { AmbienteCobranca, FormaPagamento, Prisma } from '@prisma/client';
import { toMeta, toPagination } from './helpers';
import { prisma } from './prismaClient';

interface ListParams {
  page?: number;
  limit?: number;
  ambiente?: AmbienteCobranca;
  operador?: string;
  forma_pagamento?: FormaPagamento;
  data_inicio?: string;
  data_fim?: string;
}

export async function listRecuperacoesService(params: ListParams) {
  const { page, limit, skip } = toPagination(params.page, params.limit);

  const where: Prisma.RecuperacaoWhereInput = {
    ...(params.ambiente ? { ambiente: params.ambiente } : {}),
    ...(params.operador ? { operador: { contains: params.operador, mode: 'insensitive' } } : {}),
    ...(params.forma_pagamento ? { forma_pagamento: params.forma_pagamento } : {}),
    ...(params.data_inicio || params.data_fim
      ? {
          data_pagamento: {
            ...(params.data_inicio ? { gte: new Date(params.data_inicio) } : {}),
            ...(params.data_fim ? { lte: new Date(params.data_fim) } : {}),
          },
        }
      : {}),
  };

  const [total, data, agg] = await Promise.all([
    prisma.recuperacao.count({ where }),
    prisma.recuperacao.findMany({
      where,
      skip,
      take: limit,
      orderBy: { data_pagamento: 'desc' },
      include: {
        devedor: { select: { nome: true, cpf_cnpj: true } },
        divida: { select: { contrato: true, ambiente: true } },
      },
    }),
    prisma.recuperacao.aggregate({
      _sum: { valor_recuperado: true },
      _avg: { valor_recuperado: true },
      where,
    }),
  ]);

  return {
    data,
    meta: {
      ...toMeta(total, page, limit),
      totalRecuperado: Number(agg._sum.valor_recuperado ?? 0),
      ticketMedio: Number(agg._avg.valor_recuperado ?? 0),
    },
  };
}

export async function createRecuperacaoService(body: {
  divida_id: string;
  devedor_id: string;
  boleto_id?: string;
  acordo_id?: string;
  ambiente: AmbienteCobranca;
  valor_recuperado: number;
  forma_pagamento: FormaPagamento;
  data_pagamento: string;
  operador?: string;
}) {
  return prisma.recuperacao.create({
    data: {
      ...body,
      data_pagamento: new Date(body.data_pagamento),
    },
    include: {
      devedor: { select: { nome: true, cpf_cnpj: true } },
      divida: { select: { contrato: true } },
    },
  });
}

export async function getRankingOperadoresService(ambiente?: AmbienteCobranca) {
  const ranking = await prisma.recuperacao.groupBy({
    by: ['operador', 'ambiente'],
    _sum: { valor_recuperado: true },
    _avg: { valor_recuperado: true },
    _count: { id: true },
    where: ambiente ? { ambiente } : undefined,
    orderBy: { _sum: { valor_recuperado: 'desc' } },
    take: 20,
  });

  return ranking.map((r) => ({
    ambiente: r.ambiente,
    operador: r.operador ?? 'N/A',
    total_recuperado: Number(r._sum.valor_recuperado ?? 0),
    ticket_medio: Number(r._avg.valor_recuperado ?? 0),
    num_recuperacoes: r._count.id,
  }));
}
