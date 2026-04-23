🚀 MIS - Management Information System

Sistema completo para gestão de cobranças, acordos e recuperação de crédito.

📌 Sobre o Projeto

O MIS (Management Information System) é uma aplicação fullstack voltada para gestão de dívidas e recuperação financeira, permitindo controle de:

📊 Dashboard com métricas
💰 Acordos
📄 Boletos
📞 Acionamentos
👥 Devedores
📈 Recuperações
🧠 Funcionalidades
📊 Dashboard
KPIs de recuperação
Visão geral de performance
💰 Acordos
Criação e gerenciamento de acordos
Controle de status
📄 Boletos
Emissão e listagem
Acompanhamento de pagamento
📞 Acionamentos
Registro de contatos com clientes
👥 Devedores
Gestão de clientes inadimplentes
📈 Recuperações
Monitoramento de valores recuperados
🏗️ Arquitetura do Projeto
📦 MIS
 ┣ 📂 backend        # API Node.js + Prisma
 ┣ 📂 frontend       # React + Vite + Tailwind
 ┣ 📂 database       # Scripts SQL
 ┣ 📜 docker-compose.yml
 ┗ 📜 README.md
🚀 Tecnologias Utilizadas
💻 Backend
Node.js
TypeScript
Express
Prisma ORM
🎨 Frontend
React
Vite
TailwindCSS
Context API
🗄️ Banco de Dados
PostgreSQL (via Prisma)
🐳 DevOps
Docker
Docker Compose
Nginx
⚙️ Como Rodar o Projeto
🔧 Pré-requisitos
Docker + Docker Compose
▶️ Subir tudo com Docker
docker-compose up --build

A aplicação estará disponível em:

Frontend: http://localhost
Backend: http://localhost:3000
⚙️ Rodar manualmente (dev)
Backend
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
Frontend
cd frontend
npm install
npm run dev
🧪 Estrutura da API

Principais rotas:

/api/dashboard
/api/acordos
/api/boletos
/api/acionamentos
/api/dividas
/api/recuperacoes
🧩 Destaques Técnicos
Arquitetura modular (controllers, services, routes)
Separação clara entre frontend e backend
Uso de Prisma para ORM
Componentização no React
Sistema preparado para escala
🖼️ Interface

Interface moderna com:

Sidebar
Topbar
Tabelas dinâmicas
KPIs visuais
Modais reutilizáveis
📊 Status do Projeto




🤝 Contribuição
# Fork
git checkout -b feature/minha-feature


# Commit
git commit -m "feat: nova feature"


# Push
git push origin feature/minha-feature
🧭 Roadmap


📬 Contato
👤 Mauricio EMAIL: mfo.oliveira0013@gmail.com
🔗 GitHub: https://github.com/Mfoliveira013
⭐ Se curtir

Dá uma estrela no repositório ⭐
