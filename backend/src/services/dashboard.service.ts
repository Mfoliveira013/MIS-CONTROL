import { prisma } from './prismaClient';

export async function getResumoService() {
  const now = new Date();
  const inicioMesAtual = new Date(now.getFullYear(), now.getMonth(), 1);
  const inicioMesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const fimMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    totalAcionamentosMes,
    totalAcionamentosAnterior,
    semContatoMes,
    recuperadoMes,
    boletosEmitidos,
    valorBoletos,
    carteira,
  ] = await Promise.all([
    prisma.acionamento.count({ where: { data_acionamento: { gte: inicioMesAtual } } }),
    prisma.acionamento.count({ where: { data_acionamento: { gte: inicioMesAnterior, lte: fimMesAnterior } } }),
    prisma.acionamento.count({ where: { status: 'sem_contato', data_acionamento: { gte: inicioMesAtual } } }),
    prisma.recuperacao.aggregate({
      _sum: { valor_recuperado: true },
      where: { data_pagamento: { gte: inicioMesAtual } },
    }),
    prisma.boleto.count({ where: { status: 'emitido' } }),
    prisma.boleto.aggregate({ _sum: { valor: true }, where: { status: 'emitido' } }),
    prisma.divida.aggregate({ _sum: { valor_original: true }, where: { status: 'em_aberto' } }),
  ]);

  const recMes = Number(recuperadoMes._sum.valor_recuperado ?? 0);
  const metaMensal = Number(process.env.META_MENSAL ?? 250000);
  const variacaoAcionamentos =
    totalAcionamentosAnterior > 0
      ? ((totalAcionamentosMes - totalAcionamentosAnterior) / totalAcionamentosAnterior) * 100
      : 0;

  const [acordosAtivos, acordosTotal, dividasStatus] = await Promise.all([
    prisma.acordo.count({ where: { status: 'ativo' } }),
    prisma.acordo.count(),
    prisma.divida.groupBy({ by: ['status'], _count: { id: true } }),
  ]);

  return {
    totalAcionamentosMes,
    totalAcionamentosAnterior,
    variacaoAcionamentos: parseFloat(variacaoAcionamentos.toFixed(1)),
    acionamentosSemContato: semContatoMes,
    percentualSemContato:
      totalAcionamentosMes > 0
        ? parseFloat(((semContatoMes / totalAcionamentosMes) * 100).toFixed(1))
        : 0,
    totalRecuperadoMes: recMes,
    metaMensal,
    percentualMeta:
      metaMensal > 0 ? parseFloat(((recMes / metaMensal) * 100).toFixed(1)) : 0,
    boletosEmitidos,
    valorBoletosEmitidos: Number(valorBoletos._sum.valor ?? 0),
    taxaConversaoAcordos:
      acordosTotal > 0
        ? parseFloat(((acordosAtivos / acordosTotal) * 100).toFixed(1))
        : 0,
    carteiraTotalAberto: Number(carteira._sum.valor_original ?? 0),
    dividasStatus: dividasStatus.map((d) => ({ status: d.status, total: d._count.id })),
  };
}

export async function getEvolucaoService(periodo: string) {
  const dias = periodo === 'semana' ? 7 : periodo === 'mes' ? 30 : 90;
  const desde = new Date();
  desde.setDate(desde.getDate() - dias);

  const rows = await prisma.$queryRaw<
    { dia: Date; total: string; quantidade: string }[]
  >`
    SELECT
      date_trunc('day', data_pagamento)::date AS dia,
      SUM(valor_recuperado)                   AS total,
      COUNT(*)                                AS quantidade
    FROM recuperacoes
    WHERE data_pagamento >= ${desde}
    GROUP BY dia
    ORDER BY dia ASC
  `;

  return rows.map((r) => ({
    data: r.dia.toISOString().slice(0, 10),
    valor: parseFloat(r.total),
    quantidade: parseInt(r.quantidade),
  }));
}
