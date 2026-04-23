import { Prisma, StatusHigienizacao } from '@prisma/client';
import { prisma } from './prismaClient';
import { toMeta, toPagination } from './helpers';

interface DevedorListParams {
  page?: number;
  limit?: number;
  nome?: string;
  cpf_cnpj?: string;
  status_higienizacao?: StatusHigienizacao;
}

export async function listDevedoresService(params: DevedorListParams) {
  const { page, limit, skip } = toPagination(params.page, params.limit);

  const where: Prisma.DevedorWhereInput = {
    ...(params.nome
      ? { nome: { contains: params.nome, mode: 'insensitive' } }
      : {}),
    ...(params.cpf_cnpj
      ? { cpf_cnpj: { contains: params.cpf_cnpj } }
      : {}),
    ...(params.status_higienizacao
      ? { status_higienizacao: params.status_higienizacao }
      : {}),
  };

  const [total, data] = await Promise.all([
    prisma.devedor.count({ where }),
    prisma.devedor.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
  ]);

  return { data, meta: toMeta(total, page, limit) };
}

export async function getDevedorByIdService(id: string) {
  const devedor = await prisma.devedor.findUnique({
    where: { id },
    include: {
      dividas: {
        include: {
          acordos: true,
          boletos: true,
        },
        orderBy: { created_at: 'desc' },
      },
      acionamentos: {
        orderBy: { data_acionamento: 'desc' },
        take: 20,
      },
      acordos: {
        orderBy: { created_at: 'desc' },
      },
    },
  });

  return devedor;
}

export async function createDevedorService(payload: {
  nome: string;
  cpf_cnpj: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  status_higienizacao?: StatusHigienizacao;
}) {
  return prisma.devedor.create({
    data: {
      ...payload,
      status_higienizacao: payload.status_higienizacao ?? 'pendente',
    },
  });
}

export async function updateDevedorService(
  id: string,
  payload: Partial<{
    nome: string;
    cpf_cnpj: string;
    telefone: string;
    email: string;
    endereco: string;
    status_higienizacao: StatusHigienizacao;
  }>
) {
  return prisma.devedor.update({
    where: { id },
    data: payload,
  });
}
