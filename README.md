# Ligra - SaaS para Gestão de Ligas de Esportes de Raquete

Plataforma desenvolvida para gerenciar ligas amadoras de esportes de raquete (Padel, Tênis, Beach Tennis, Pickleball). 

## Tecnologias 🚀
- Next.js 14 (App Router)
- React, Tailwind CSS
- Prisma ORM + PostgreSQL (Neon)
- NextAuth.js (Auth.js)

## Instalação e Execução Local 💻

1. **Clone e Instale:**
\`\`\`bash
git clone https://github.com/ramonsl/ligra.git
cd ligra
npm install
\`\`\`

2. **Configuração de Variáveis:**
Copie o arquivo \`.env.example\` para \`.env\` e preencha as variáveis locais.
\`\`\`bash
cp .env.example .env
\`\`\`

3. **Banco de Dados:**
Certifique-se de configurar a \`DATABASE_URL\` e execute as migrations do Prisma:
\`\`\`bash
npx prisma db push
# ou npx prisma migrate dev
\`\`\`

4. **Inicie o servidor:**
\`\`\`bash
npm run dev
\`\`\`
O app estará rodando em \`http://localhost:3000\`.

## ⚙️ Variáveis de Ambiente e Ambientes Railway (Issue #4)

O projeto está configurado para possuir dois ambientes na Vercel/Railway:
- **Test:** branch \`develop\` faz deploy automático
- **Prod:** branch \`main\` faz deploy automático (com banco dedicado e isolado)

As variáveis no \`.env\` devem ser populadas nos respectivos painéis do Railway.

## 🧪 Testes Automatizados (Playwright/Jest)

\`\`\`bash
npm run test       # Testes unitários
npm run test:e2e   # Testes E2E (Playwright)
\`\`\`

---
*Para gerar o Admin Master de fundação, utilize o seed:*
\`\`\`bash
npx prisma db seed
\`\`\`
*(É necessário ter ADMIN_EMAIL e ADMIN_INITIAL_PASSWORD no .env).*
