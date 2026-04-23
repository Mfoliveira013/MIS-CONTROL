import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  PhoneCall, DollarSign, FileText, Handshake,
  Wallet, PhoneOff, AlertTriangle, XCircle, Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../services/api';
import KpiCard from '../components/ui/KpiCard';
import StatusBadge from '../components/ui/StatusBadge';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

const PIE_COLORS = ['#DC2626', '#D97706', '#1B4FD8', '#059669', '#6B7280'];

const STATUS_LABELS: Record<string, string> = {
  em_aberto: 'Em Aberto', negociando: 'Negociando',
  acordo: 'Acordo', pago: 'Pago', perdido: 'Perdido',
};

const TIPO_LABELS: Record<string, string> = {
  ligacao: 'Ligação', whatsapp: 'WhatsApp', email: 'E-mail', carta: 'Carta', visita: 'Visita',
};

const BAR_COLORS = ['#1B4FD8', '#059669', '#D97706', '#6B7280', '#DC2626'];

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { data: resumoData, isLoading: loadingResumo } = useQuery({
    queryKey: ['dashboard-resumo'],
    queryFn: () => api.getDashboardResumo(),
  });

  const { data: evolucaoData } = useQuery({
    queryKey: ['dashboard-evolucao'],
    queryFn: () => api.getEvolucao('mes'),
  });

  const { data: statsData } = useQuery({
    queryKey: ['acionamentos-stats'],
    queryFn: () => api.getAcionamentosStats(),
  });

  const { data: rankingData } = useQuery({
    queryKey: ['ranking-operadores'],
    queryFn: () => api.getRankingOperadores(),
  });

  const { data: boletosVencidos } = useQuery({
    queryKey: ['boletos-vencidos'],
    queryFn: () => api.getBoletos({ status: 'vencido', limit: 5 }),
  });

  const { data: acordosQuebrados } = useQuery({
    queryKey: ['acordos-quebrados'],
    queryFn: () => api.getAcordos({ status: 'quebrado', limit: 5 }),
  });

  const { data: promessas } = useQuery({
    queryKey: ['promessas'],
    queryFn: () => api.getAcionamentos({ status: 'promessa_pagamento', limit: 5 }),
  });

  const resumo = resumoData?.data;
  const evolucao = evolucaoData?.data ?? [];
  const stats = statsData?.data;
  const ranking = rankingData?.data ?? [];

  if (loadingResumo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          title="Acionamentos (mês)"
          value={resumo?.totalAcionamentosMes?.toLocaleString('pt-BR') ?? '—'}
          subtitle={`Anterior: ${resumo?.totalAcionamentosAnterior?.toLocaleString('pt-BR') ?? '—'}`}
          icon={PhoneCall}
          iconColor="text-primary" iconBg="bg-primary/10"
          trend={resumo?.variacaoAcionamentos}
        />
        <KpiCard
          title="Recuperado (mês)"
          value={resumo ? fmt(resumo.totalRecuperadoMes) : '—'}
          subtitle={`Meta: ${resumo ? fmt(resumo.metaMensal) : '—'}`}
          icon={DollarSign}
          iconColor="text-success" iconBg="bg-success/10"
          progress={resumo?.percentualMeta}
        />
        <KpiCard
          title="Boletos Emitidos"
          value={resumo?.boletosEmitidos ?? '—'}
          subtitle={resumo ? `Valor: ${fmt(resumo.valorBoletosEmitidos)}` : undefined}
          icon={FileText}
          iconColor="text-warning" iconBg="bg-warning/10"
        />
        <KpiCard
          title="Taxa de Conversão"
          value={`${resumo?.taxaConversaoAcordos ?? '—'}%`}
          subtitle="Acordos ativos vs total"
          icon={Handshake}
          iconColor="text-primary" iconBg="bg-primary/10"
        />
        <KpiCard
          title="Carteira em Aberto"
          value={resumo ? fmt(resumo.carteiraTotalAberto) : '—'}
          subtitle="Total de dívidas em aberto"
          icon={Wallet}
          iconColor="text-danger" iconBg="bg-danger/10"
        />
        <KpiCard
          title="Sem Contato"
          value={`${resumo?.percentualSemContato ?? '—'}%`}
          subtitle={`${resumo?.acionamentosSemContato ?? '—'} acionamentos`}
          icon={PhoneOff}
          iconColor="text-slate-500" iconBg="bg-slate-100 dark:bg-slate-700"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line Chart */}
        <ChartCard title="Recuperações nos últimos 30 dias (R$)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={evolucao}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis
                dataKey="data"
                tickFormatter={(v) => format(new Date(v + 'T00:00:00'), 'd/M')}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v: number) => [fmt(v), 'Recuperado']}
                labelFormatter={(l) => format(new Date(l + 'T00:00:00'), 'dd/MM/yyyy')}
                contentStyle={{ background: 'var(--tooltip-bg, #fff)', border: '1px solid #e2e8f0', borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="valor" stroke="#1B4FD8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart acionamentos */}
        <ChartCard title="Acionamentos por Tipo">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={(stats?.porTipo ?? []).map((d) => ({ ...d, nome: TIPO_LABELS[d.tipo] ?? d.tipo }))}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis dataKey="nome" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {(stats?.porTipo ?? []).map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie Chart */}
        <ChartCard title="Status das Dívidas">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={(resumo?.dividasStatus ?? []).map((d) => ({
                  name: STATUS_LABELS[d.status] ?? d.status,
                  value: d.total,
                }))}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {(resumo?.dividasStatus ?? []).map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Ranking operadores */}
        <ChartCard title="Top 5 Operadores por Recuperação (R$)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ranking.slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis type="number" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="operador" width={120} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v: number) => [fmt(v), 'Recuperado']} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="total_recuperado" fill="#1B4FD8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AlertList
          title="Boletos Vencidos"
          icon={<AlertTriangle size={15} className="text-danger" />}
          iconBg="bg-danger/10"
          items={(boletosVencidos?.data ?? []).map((b) => ({
            label: b.devedor?.nome ?? '—',
            sub: `CTR: ${b.divida?.contrato ?? '—'}`,
            value: fmt(b.valor),
            status: b.status,
          }))}
        />
        <AlertList
          title="Acordos Quebrados"
          icon={<XCircle size={15} className="text-danger" />}
          iconBg="bg-danger/10"
          items={(acordosQuebrados?.data ?? []).map((a) => ({
            label: a.devedor?.nome ?? '—',
            sub: a.operador ?? '—',
            value: fmt(a.valor_total ?? 0),
            status: a.status,
          }))}
        />
        <AlertList
          title="Promessas de Pagamento"
          icon={<Clock size={15} className="text-warning" />}
          iconBg="bg-warning/10"
          items={(promessas?.data ?? []).map((a) => ({
            label: a.devedor?.nome ?? '—',
            sub: a.operador ?? '—',
            value: format(new Date(a.data_acionamento), 'dd/MM', { locale: ptBR }),
            status: a.status,
          }))}
        />
      </div>
    </div>
  );
}

function AlertList({ title, icon, iconBg, items }: {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  items: { label: string; sub: string; value: string; status: string }[];
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
        <span className="ml-auto text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">Nenhum item</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{item.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{item.sub}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.value}</span>
                <StatusBadge status={item.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
