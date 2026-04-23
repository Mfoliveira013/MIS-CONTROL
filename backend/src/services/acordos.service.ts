import { AmbienteCobranca, Prisma, StatusAcordo, TipoAcordo } from '@prisma/client';
import { AppError } from '../middlewares/AppError';
import { addMonths, toMeta, toPagination } from './helpers';
import { prisma } from './prismaClient';

interface ListParams {
  page?: number;
  limit?: number;
  ambiente?: AmbienteCobranca;
  status?: StatusAcordo;
  operador?: string;
}

function makeBoletoCodigo(seed: number) {
  const rand = `${Date.now()}${seed}`.slice(-14);
  const codigo = `34191.09008 60766.${String(seed).padStart(6, '0')} 88107.590008 1 ${rand}`;
  return {
    codigo_barras: codigo,
    linha_digitavel: codigo.replace(/\D/g, '').slice(0, 47),
  };
}

export async function listAcordosService(params: ListParams) {
  const { page, limit, skip } = toPagination(params.page, params.limit);

  const where: Prisma.AcordoWhereInput = {
    ...(params.ambiente ? { ambiente: params.ambiente } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.operador ? { operador: { contains: params.operador, mode: 'insensitive' } } : {}),
  };

  const [total, data] = await Promise.all([
    prisma.acordo.count({ where }),
    prisma.acordo.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        devedor: { select: { nome: true, cpf_cnpj: true } },
        divida: { select: { contrato: true, valor_original: true, ambiente: true, numero_processo: true } },
        boletos: true,
      },
    }),
  ]);

  return { data, meta: toMeta(total, page, limit) };
}

export async function getAcordoByIdService(id: string) {
  return prisma.acordo.findUnique({
    where: { id },
    include: {
      devedor: true,
      divida: true,
      boletos: { orderBy: { vencimento: 'asc' } },
      recuperacoes: { orderBy: { data_pagamento: 'desc' } },
    },
  });
}

export async function createAcordoService(payload: {
  divida_id: string;
  devedor_id: string;
  ambiente: AmbienteCobranca;
  tipo_acordo: TipoAcordo;
  valor_total: number;
  num_parcelas?: number;
  valor_entrada?: number;
  valor_parcela?: number;
  data_primeiro_venc?: string;
  desconto_aplicado?: number;
  status?: StatusAcordo;
  operador?: string;
  numero_processo?: string;
  audiencia_prevista?: string;
}) {
  const divida = await prisma.divida.findUnique({ where: { id: payload.divida_id } });
  if (!divida) throw new AppError('Dívida não encontrada', 404);

  if (payload.ambiente !== divida.ambiente) {
    throw new AppError('Ambiente do acordo deve ser igual ao ambiente da dívida', 422);
  }

  if (payload.ambiente === 'judicial' && !payload.numero_processo) {
    throw new AppError('Número de processo é obrigatório para acordo judicial', 422);
  }

  if (payload.tipo_acordo === 'parcelado' && (!payload.num_parcelas || !payload.data_primeiro_venc)) {
    throw new AppError('Acordo parcelado exige número de parcelas e data da primeira parcela', 422);
  }

  const acordo = await prisma.acordo.create({
    data: {
      divida_id: payload.divida_id,
      devedor_id: payload.devedor_id,
      ambiente: payload.ambiente,
      tipo_acordo: payload.tipo_acordo,
      valor_total: payload.valor_total,
      num_parcelas: payload.num_parcelas,
      valor_entrada: payload.valor_entrada,
      valor_parcela: payload.valor_parcela,
      data_primeiro_venc: payload.data_primeiro_venc ? new Date(payload.data_primeiro_venc) : undefined,
      desconto_aplicado: payload.desconto_aplicado,
      status: payload.status ?? 'ativo',
      operador: payload.operador,
      numero_processo: payload.numero_processo,
      audiencia_prevista: payload.audiencia_prevista ? new Date(payload.audiencia_prevista) : undefined,
    },
  });

  await prisma.divida.update({ where: { id: payload.divida_id }, data: { status: 'acordo' } });

  if (payload.tipo_acordo === 'parcelado' && payload.num_parcelas && payload.data_primeiro_venc) {
    const firstDate = new Date(payload.data_primeiro_venc);
    const parcela = payload.valor_parcela ?? payload.valor_total / payload.num_parcelas;

    for (let i = 0; i < payload.num_parcelas; i += 1) {
      const vencimento = addMonths(firstDate, i);
      const codigo = makeBoletoCodigo(i + 1);

      await prisma.boleto.create({
        data: {
          divida_id: payload.divida_id,
          devedor_id: payload.devedor_id,
          acordo_id: acordo.id,
          valor: parcela,
          vencimento,
          status: 'emitido',
          ...codigo,
        },
      });
    }
  }

  if (payload.tipo_acordo === 'a_vista' && payload.data_primeiro_venc) {
    const codigo = makeBoletoCodigo(1);
    await prisma.boleto.create({
      data: {
        divida_id: payload.divida_id,
        devedor_id: payload.devedor_id,
        acordo_id: acordo.id,
        valor: payload.valor_total,
        vencimento: new Date(payload.data_primeiro_venc),
        status: 'emitido',
        ...codigo,
      },
    });
  }

  return prisma.acordo.findUnique({
    where: { id: acordo.id },
    include: { devedor: { select: { nome: true, cpf_cnpj: true } }, divida: true, boletos: true },
  });
}

export async function updateAcordoStatusService(id: string, status: StatusAcordo) {
  return prisma.acordo.update({
    where: { id },
    data: { status },
  });
}
