# Dashboard Cobrança Extrajudicial

Sistema completo de gestão para setor de cobrança extrajudicial.

## Stack

- **Banco de dados:** PostgreSQL 15
- **Backend:** Node.js + Express + Prisma ORM (TypeScript)
- **Frontend:** React 18 + Vite + Tailwind CSS + Recharts

---

## Início Rápido — Docker (recomendado)

```bash
# Suba todos os serviços (DB + API + UI)
docker-compose up -d

# Acompanhe os logs
docker-compose logs -f
```

| Serviço  | URL                    |
|----------|------------------------|
| Frontend | http://localhost       |
| Backend  | http://localhost:3001  |
| Postgres | localhost:5432         |

> O seed é aplicado automaticamente na primeira execução.

---

## Desenvolvimento local

### Pré-requisitos
- Node.js 20+
- PostgreSQL 15 rodando localmente

### Backend

```bash
cd backend
cp .env.example .env
# Edite DATABASE_URL em .env com suas credenciais

npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

A API estará disponível em `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O app estará disponível em `http://localhost:5173`.

> Por padrão o frontend usa **dados mock** embutidos (sem precisar da API).  
> Para conectar à API real, crie `frontend/.env` com:
> ```
> VITE_USE_MOCK=false
> VITE_API_URL=http://localhost:3001/api
> ```

---

## Estrutura do Projeto

```
MIS/
├── database/
│   └── init.sql              # Schema + indexes + view + seed SQL
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     # Modelos Prisma
│   │   └── seed.ts           # Seed TypeScript
│   └── src/
│       ├── index.ts          # Entry point Express
│       ├── routes/           # Routers por entidade
│       ├── controllers/      # Handlers HTTP
│       ├── services/         # Lógica de negócio + Prisma
│       └── middlewares/      # Error handler
├── frontend/
│   └── src/
│       ├── pages/            # Dashboard, Acionamentos, Boletos, etc.
│       ├── components/
│       │   ├── layout/       # Sidebar, TopBar, Layout
│       │   └── ui/           # KpiCard, DataTable, StatusBadge, Modal...
│       ├── services/         # api.ts + mockData.ts
│       ├── context/          # ThemeContext (dark/light)
│       └── types/            # TypeScript types
└── docker-compose.yml
```

---

## Endpoints da API

| Método | Rota                          | Descrição                        |
|--------|-------------------------------|----------------------------------|
| GET    | /api/dashboard/resumo         | KPIs do mês atual                |
| GET    | /api/dashboard/evolucao       | Evolução de recuperações         |
| GET    | /api/acionamentos             | Lista paginada + filtros         |
| POST   | /api/acionamentos             | Criar acionamento                |
| GET    | /api/acionamentos/stats       | Totais por tipo/status/operador  |
| GET    | /api/boletos                  | Lista paginada + filtros         |
| POST   | /api/boletos                  | Emitir boleto                    |
| PATCH  | /api/boletos/:id/status       | Atualizar status                 |
| GET    | /api/recuperacoes             | Lista paginada + filtros         |
| POST   | /api/recuperacoes             | Registrar recuperação            |
| GET    | /api/recuperacoes/ranking     | Top operadores                   |
| GET    | /api/dividas                  | Carteira de dívidas              |
| GET    | /api/acordos                  | Lista de acordos                 |

---

## Variáveis de Ambiente — Backend

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/cobranca
PORT=3001
NODE_ENV=development
META_MENSAL=250000
```
