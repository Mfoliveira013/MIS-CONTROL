import { AmbienteCobranca, Prisma } from '@prisma/client';
import { AppError } from '../middlewares/AppError';
import { toMeta, toPagination } from './helpers';
import { prisma } from './prismaClient';
import { TABULACOES_BY_AMBIENTE } from './constants';

interface ListParams {
  page?: number;
  limit?: number;
  ambiente?: AmbienteCobranca;
  tabulacao?: string;
  operador?: string;
  devedor_id?: string;
  data_inicio?: string;
  data_fim?: string;
}

function validateTabulacao(ambiente: AmbienteCobranca, tabulacao: string) {
  if (!TABULACOES_BY_AMBIENTE[ambiente].includes(tabulacao as never)) {
    throw new AppError(`Tabulação ${tabulacao} inválida para ambiente ${ambiente}`, 422);
  }
}

export async function listAcionamentosService(params: ListParams) {
  const { page, limit, skip } = toPagination(params.page, params.limit);

  const where: Prisma.AcionamentoWhereInput = {
    ...(params.ambiente ? { ambiente: params.ambiente } : {}),
    ...(params.tabulacao ? { tabulacao: params.tabulacao } : {}),
    ...(params.operador ? { operador: { contains: params.operador, mode: 'insensitive' } } : {}),
    ...(params.devedor_id ? { devedor_id: params.devedor_id } : {}),
    ...(params.data_inicio || params.data_fim
      ? {
          data_acionamento: {
            ...(params.data_inicio ? { gte: new Date(params.data_inicio) } : {}),
            ...(params.data_fim ? { lte: new Date(params.data_fim) } : {}),
          },
        }
      : {}),
  };

  const [total, data] = await Promise.all([
    prisma.acionamento.count({ where }),
    prisma.acionamento.findMany({
      where,
      skip,
      take: limit,
      orderBy: { data_acionamento: 'desc' },
      include: {
        devedor: { select: { nome: true, cpf_cnpj: true, status_higienizacao: true } },
        divida: { select: { contrato: true, numero_processo: true, ambiente: true } },
      },
    }),
  ]);

  return { data, meta: toMeta(total, page, limit) };
}

export async function createAcionamentoService(body: {
  devedor_id: string;
  divida_id?: string;
  ambiente: AmbienteCobranca;
  tabulacao: string;
  operador?: string;
  observacao?: string;
  acordo_id?: string;
}) {
  validateTabulacao(body.ambiente, body.tabulacao);

  const devedor = await prisma.devedor.findUnique({ where: { id: body.devedor_id } });
  if (!devedor) throw new AppError('Devedor não encontrado', 404);
  if (devedor.status_higienizacao === 'obito') {
    throw new AppError('Não é permitido registrar acionamento para devedor com status ÓBITO', 422);
  }

  let divida = null;
  if (body.divida_id) {
    divida = await prisma.divida.findUnique({ where: { id: body.divida_id } });
    if (!divida) throw new AppError('Dívida não encontrada', 404);
  }

  if (body.ambiente === 'judicial' && body.tabulacao === 'ACORDO_REALIZADO' && !body.acordo_id) {
    throw new AppError('Para ACORDO_REALIZADO é obrigatório informar um acordo ativo vinculado', 422);
  }

  const created = await prisma.acionamento.create({
    data: {
      devedor_id: body.devedor_id,
      divida_id: body.divida_id,
      ambiente: body.ambiente,
      tabulacao: body.tabulacao,
      operador: body.operador,
      observacao: body.observacao,
      data_acionamento: new Date(),
    },
    include: { devedor: { select: { nome: true, cpf_cnpj: true } } },
  });

  if (body.tabulacao === 'RETORNO_FILA_713' && divida) {
    await prisma.divida.update({
      where: { id: divida.id },
      data: {
        status: 'em_aberto',
        tentativas_acionamento: { increment: 1 },
      },
    });
  }

  if (body.tabulacao === 'OBITO_901') {
    await prisma.devedor.update({
      where: { id: body.devedor_id },
      data: { status_higienizacao: 'obito' },
    });
  }

  if (body.tabulacao === 'BOLETO_PAGO_308') {
    const boleto = await prisma.boleto.findFirst({
      where: {
        devedor_id: body.devedor_id,
        status: { in: ['emitido', 'vencido'] },
      },
      orderBy: { emitido_em: 'desc' },
      include: { divida: true },
    });

    if (boleto) {
      await prisma.boleto.update({
        where: { id: boleto.id },
        data: { status: 'pago', pago_em: new Date() },
      });

      await prisma.recuperacao.create({
        data: {
          divida_id: boleto.divida_id,
          devedor_id: boleto.devedor_id,
          boleto_id: boleto.id,
          ambiente: boleto.divida.ambiente,
          valor_recuperado: boleto.valor,
          forma_pagamento: 'boleto',
          data_pagamento: new Date(),
          operador: body.operador,
        },
      });
    }
  }

  return created;
}

export async function getAcionamentosStatsService() {
  const [porTabulacao, porOperador, porAmbiente] = await Promise.all([
    prisma.acionamento.groupBy({ by: ['tabulacao', 'ambiente'], _count: { id: true } }),
    prisma.acionamento.groupBy({ by: ['operador', 'ambiente'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
    prisma.acionamento.groupBy({ by: ['ambiente'], _count: { id: true } }),
  ]);

  return {
    porTabulacao: porTabulacao.map((r) => ({ ambiente: r.ambiente, tabulacao: r.tabulacao, total: r._count.id })),
    porOperador: porOperador.map((r) => ({ ambiente: r.ambiente, operador: r.operador ?? 'N/A', total: r._count.id })),
    porAmbiente: porAmbiente.map((r) => ({ ambiente: r.ambiente, total: r._count.id })),
  };
}
