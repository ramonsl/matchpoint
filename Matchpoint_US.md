# Matchpoint — User Stories & Requisitos

**Versão:** 1.0 | **Data:** Abril 2025 | **Status:** Em revisão

---

## Sumário

1. [Requisitos Não Funcionais](#1-requisitos-não-funcionais)
2. [Atores do Sistema](#2-atores-do-sistema)
3. [Autenticação e Controle de Acesso](#3-autenticação-e-controle-de-acesso)
4. [Landing Page](#4-landing-page)
5. [Jogador](#5-jogador)
6. [Organizador](#6-organizador)
7. [Admin Master (SaaS)](#7-admin-master-saas)
8. [Regras de Negócio Transversais](#8-regras-de-negócio-transversais)

---

## 1. Requisitos Não Funcionais

| ID      | Requisito                 | Detalhe                                                                                                                                                                                 |
| ------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RNF-01  | **Frontend**              | React + Next.js 14 (App Router)                                                                                                                                                         |
| RNF-02  | **Banco de dados**        | PostgreSQL via Neon (serverless)                                                                                                                                                        |
| RNF-03  | **ORM**                   | Prisma                                                                                                                                                                                  |
| RNF-04  | **Autenticação**          | NextAuth.js com providers: e-mail/senha e Google OAuth                                                                                                                                  |
| RNF-05  | **Notificações push**     | Integração com WhatsApp Business API (ex: Twilio ou Z-API)                                                                                                                              |
| RNF-06  | **Hospedagem**            | Railway (frontend + API routes do Next.js)                                                                                                                                              |
| RNF-06a | **Ambientes**             | Dois ambientes isolados: `test` e `prod`, cada um com seu próprio serviço no Railway e banco Neon separado                                                                              |
| RNF-06b | **Variáveis de ambiente** | Cada ambiente possui seu próprio conjunto de variáveis no Railway (`DATABASE_URL`, `GEOCODING_API_KEY`, `NEXTAUTH_SECRET`, etc.); nenhuma variável de produção é compartilhada com test |
| RNF-06c | **Deploy**                | Branch `main` faz deploy automático em `prod`; branch `develop` faz deploy automático em `test`                                                                                         |
| RNF-06d | **URLs**                  | `test`: `test.matchpoint.app` · `prod`: `matchpoint.app` (ou domínio equivalente configurado no Railway)                                                                                          |
| RNF-07  | **Estilização**           | Tailwind CSS                                                                                                                                                                            |
| RNF-08  | **Tempo de resposta**     | Páginas carregam em < 2s em conexão 4G                                                                                                                                                  |
| RNF-09  | **Disponibilidade**       | ≥ 99,5% uptime mensal                                                                                                                                                                   |
| RNF-10  | **Segurança**             | Senhas com bcrypt (salt ≥ 12), HTTPS obrigatório, tokens JWT com expiração de 7 dias                                                                                                    |
| RNF-11  | **Mobile-first**          | Layout responsivo; experiência primária em tela de 375px                                                                                                                                |
| RNF-12  | **Internacionalização**   | Português como idioma padrão; estrutura preparada para i18n                                                                                                                             |
| RNF-13  | **Acessibilidade**        | WCAG 2.1 nível AA nas páginas públicas                                                                                                                                                  |
| RNF-14  | **Monitoramento**         | Logs de erro via Sentry; métricas básicas via Vercel Analytics                                                                                                                          |

---

## 2. Atores do Sistema

```
Admin Master (SaaS)
│   Acesso total à plataforma. Gerencia planos, organizadores e métricas globais.
│
├── Organizador
│   │   Cria e gerencia ligas. Pode também ser jogador em suas próprias ligas.
│   │
│   └── Jogador
│           Inscreve-se em ligas, joga, registra e valida resultados.
```

> Um **Jogador** pode se tornar **Organizador** ao criar sua primeira liga.
> Um **Organizador** mantém o perfil de Jogador e pode competir em ligas que organiza ou em outras ligas.
> O **Admin Master** não participa de ligas; opera o backoffice do SaaS.

---

## 3. Autenticação e Controle de Acesso

---

### US-AUTH-01 — Cadastro de novo usuário

**Como** visitante do Matchpoint,
**quero** criar uma conta com nome, e-mail e senha,
**para** acessar a plataforma como jogador.

#### Critérios de aceite

- [ ] O formulário exibe os campos: Nome completo, E-mail, Senha e Confirmar senha
- [ ] E-mail deve ser único no sistema; cadastro com e-mail já existente exibe mensagem "E-mail já cadastrado"
- [ ] Senha deve ter mínimo 8 caracteres, 1 letra maiúscula, 1 número; caso contrário exibe mensagem de erro específica
- [ ] Após cadastro, sistema envia e-mail de verificação para o endereço informado
- [ ] Conta sem e-mail verificado não pode acessar funcionalidades protegidas; exibe banner "Verifique seu e-mail"
- [ ] Cadastro via Google OAuth cria conta automaticamente verificada sem necessidade de senha
- [ ] Dados são persistidos na tabela `users` do banco Neon via Prisma

---

### US-AUTH-02 — Login

**Como** usuário cadastrado,
**quero** fazer login com e-mail e senha (ou Google),
**para** acessar minha conta.

#### Critérios de aceite

- [ ] Login com e-mail/senha válidos redireciona para o dashboard do usuário
- [ ] Login com credenciais inválidas exibe "E-mail ou senha incorretos" (sem especificar qual)
- [ ] Após 5 tentativas falhas consecutivas, conta é bloqueada por 15 minutos; usuário vê mensagem com tempo restante
- [ ] Opção "Lembrar-me" mantém sessão ativa por 30 dias via cookie seguro
- [ ] Login via Google OAuth funciona e vincula à conta existente se o e-mail coincidir
- [ ] Sessão autenticada gera token JWT com expiração de 7 dias

---

### US-AUTH-03 — Recuperação de senha

**Como** usuário que esqueceu a senha,
**quero** redefinir minha senha via e-mail,
**para** recuperar acesso à minha conta.

#### Critérios de aceite

- [ ] Tela "Esqueci minha senha" solicita apenas o e-mail
- [ ] Sistema envia e-mail com link de redefinição em até 2 minutos
- [ ] Link de redefinição expira em 1 hora; após expiração exibe "Link expirado, solicite novamente"
- [ ] Link só pode ser usado uma vez; segunda tentativa exibe "Link já utilizado"
- [ ] Nova senha segue as mesmas regras de US-AUTH-01
- [ ] Após redefinição, todas as sessões ativas do usuário são invalidadas

---

### US-AUTH-04 — Controle de acesso por papel (RBAC)

**Como** sistema,
**quero** garantir que cada ator acesse apenas o que lhe é permitido,
**para** proteger dados e funcionalidades sensíveis.

#### Critérios de aceite

- [ ] Usuário sem liga criada tem papel `PLAYER`
- [ ] Ao criar uma liga, usuário recebe papel `ORGANIZER` (mantém `PLAYER`)
- [ ] Admin Master tem papel `ADMIN`; não pode ser atribuído via interface; somente via seed ou migração protegida
- [ ] Rotas `/admin/*` retornam 403 para qualquer papel diferente de `ADMIN`
- [ ] Rotas `/organizer/*` retornam 403 para papel `PLAYER`
- [ ] API routes validam papel no servidor; não confiam apenas no frontend
- [ ] Tentativas de acesso não autorizado são registradas em log

---

## 4. Landing Page

---

### US-LP-01 — Apresentação do produto

**Como** visitante que chegou ao Matchpoint pela primeira vez,
**quero** entender rapidamente o que é o produto e para que serve,
**para** decidir se vale criar uma conta.

#### Critérios de aceite

- [ ] Página carrega em < 2s em conexão 4G (medido via Lighthouse)
- [ ] Hero section exibe: nome "Matchpoint", tagline clara, botão "Criar liga grátis" e botão "Entrar"
- [ ] Seção "Como funciona" exibe os 3 passos principais: Criar liga → Convidar atletas → Jogar e acompanhar
- [ ] Seção de esportes suportados lista: Padel, Tênis, Beach Tennis, Pickleball e outros
- [ ] Seção de features destaca: geração automática de rodadas, ranking por saldo de games, notificações via WhatsApp
- [ ] Seção de depoimentos/social proof (pode ser placeholder na v1)
- [ ] Footer com links: Termos de uso, Política de privacidade, Contato
- [ ] Página é responsiva e navegável em mobile (375px)
- [ ] Score de acessibilidade Lighthouse ≥ 90

---

### US-LP-02 — Call to action e conversão

**Como** visitante convencido do produto,
**quero** criar minha conta diretamente da landing page,
**para** começar a usar sem fricção.

#### Critérios de aceite

- [ ] Botão "Criar liga grátis" na hero section redireciona para `/register`
- [ ] Botão "Entrar" redireciona para `/login`
- [ ] CTA secundário no final da página repete o botão "Criar liga grátis"
- [ ] Página não exige login para ser visualizada; é totalmente pública
- [ ] Meta tags OG e Twitter Card preenchidas para compartilhamento em redes sociais

---

## 5. Jogador

---

### US-P-01 — Buscar e solicitar inscrição em uma liga

**Como** jogador,
**quero** encontrar uma liga e solicitar minha inscrição,
**para** participar de um ranking com meu grupo.

#### Critérios de aceite

- [ ] Jogador pode buscar ligas por nome ou código de convite
- [ ] Card da liga exibe: nome, esporte, gênero, número de atletas e status (aberta/fechada)
- [ ] Botão "Solicitar inscrição" envia pedido ao organizador
- [ ] Se a liga for de inscrição automática, jogador é adicionado imediatamente sem aprovação
- [ ] Jogador recebe notificação quando inscrição for aprovada ou recusada
- [ ] Jogador não pode se inscrever em liga com gênero incompatível com seu perfil; botão fica desabilitado com tooltip explicativo
- [ ] Jogador não pode se inscrever em liga que já atingiu o máximo de atletas

---

### US-P-02 — Visualizar minha posição no ranking

**Como** jogador inscrito em uma liga,
**quero** ver minha posição e saldo no ranking,
**para** saber como estou em relação aos outros atletas.

#### Critérios de aceite

- [ ] Tela exibe tabela de classificação com: posição, nome, saldo acumulado e rodadas jogadas
- [ ] Meu próprio registro está destacado visualmente (ex: fundo colorido)
- [ ] Saldo é calculado como soma de (games ganhos − games perdidos) em todos os jogos realizados
- [ ] Ranking atualiza em tempo real após confirmação de qualquer resultado
- [ ] Em caso de empate no saldo, a posição é determinada pelo confronto direto entre os empatados
- [ ] Tabela exibe os atletas de um único grupo; seletor permite trocar de grupo se houver mais de um
- [ ] Jogadores com W.O. têm ícone indicativo na tabela

---

### US-P-03 — Visualizar minha rodada atual

**Como** jogador,
**quero** ver os 3 jogos da minha rodada atual,
**para** saber com quem jogo, contra quem e qual o prazo.

#### Critérios de aceite

- [ ] Tela lista os 3 jogos da rodada com: parceiro, adversários, status e placar (se já realizado)
- [ ] Status possíveis por jogo: "a jogar", "concluído", "em disputa", "W.O."
- [ ] Prazo da rodada é exibido com contador regressivo em dias
- [ ] Barra de progresso mostra quantos jogos foram concluídos (ex: "2 de 3")
- [ ] Alerta visual aparece quando faltam ≤ 48 horas para o prazo
- [ ] Jogo com prazo expirado sem resultado exibe "W.O. aplicado" com data

---

### US-P-04 — Combinar data e local de um jogo

**Como** jogador,
**quero** propor uma data, horário e local para um jogo,
**para** combinar com meus parceiro e adversários.

#### Critérios de aceite

- [ ] Jogador pode propor data, horário e local (texto livre) para qualquer jogo pendente da sua rodada
- [ ] Os outros 3 jogadores recebem notificação via app e WhatsApp com a proposta
- [ ] Cada jogador pode confirmar ou propor nova data; último a confirmar fecha o agendamento
- [ ] Agendamento confirmado exibe data, hora e local no card do jogo
- [ ] Jogo agendado pode ser reagendado por qualquer dos 4 jogadores; abre novo ciclo de confirmação
- [ ] Sistema não impede o jogo de ser realizado sem agendamento prévio; registro do resultado é independente

---

### US-P-05 — Registrar resultado de um jogo

**Como** jogador,
**quero** registrar o placar de um jogo que realizei,
**para** que meu saldo no ranking seja atualizado.

#### Critérios de aceite

- [ ] Qualquer um dos 4 jogadores pode registrar o resultado
- [ ] Formulário solicita: games da dupla A e games da dupla B (ex: 6 e 4)
- [ ] Valores aceitos: inteiros entre 0 e 7
- [ ] Não é possível registrar resultado para jogo com prazo expirado (W.O. já aplicado)
- [ ] Após envio, os outros 3 jogadores recebem notificação para confirmar
- [ ] Jogo fica com status "aguardando confirmação" até que os 3 confirmem ou haja disputa
- [ ] Saldo do jogador não é atualizado no ranking até o resultado ser confirmado

---

### US-P-06 — Confirmar ou contestar resultado

**Como** jogador que recebeu notificação de resultado registrado,
**quero** confirmar ou contestar o placar informado,
**para** garantir que o ranking reflita o resultado real.

#### Critérios de aceite

- [ ] Notificação exibe o placar registrado e os 4 jogadores da partida
- [ ] Botões "Confirmar" e "Contestar" ficam disponíveis por 48 horas após o registro
- [ ] Se os 3 outros confirmarem, resultado é salvo e ranking atualizado automaticamente
- [ ] Se qualquer jogador contestar, abre votação formal entre os 4
- [ ] Votação exibe: placar informado, nome de quem registrou, e botões para cada jogador votar
- [ ] Maioria simples (3×1 ou 4×0) encerra a votação e salva o resultado vencedor
- [ ] Empate (2×2) escalona ao organizador; jogadores veem "Disputa enviada ao organizador"
- [ ] Após 48h sem resposta de algum jogador, voto ausente conta como confirmação automática

---

### US-P-07 — Visualizar histórico de resultados

**Como** jogador,
**quero** ver o histórico de todas as rodadas e jogos anteriores,
**para** acompanhar minha evolução ao longo da temporada.

#### Critérios de aceite

- [ ] Tela exibe lista de todas as rodadas com status: concluída, em andamento, pendente
- [ ] Ao expandir uma rodada, exibe os 3 jogos com parceiro, adversários, placar e saldo obtido
- [ ] Saldo acumulado é exibido ao final de cada rodada
- [ ] Jogos com W.O. são identificados visualmente
- [ ] Histórico inclui todas as ligas em que o jogador participou

---

### US-P-08 — Gerenciar perfil

**Como** jogador,
**quero** atualizar meus dados de perfil com informações pessoais e esportivas,
**para** que outros jogadores e organizadores me identifiquem corretamente e eu apareça nas ligas certas.

#### Critérios de aceite

**Dados básicos**

- [ ] Jogador pode editar: nome de exibição, foto de perfil e telefone (para WhatsApp)
- [ ] Telefone é obrigatório para receber notificações via WhatsApp; campo com validação de formato (aceita formatos BR: `(51) 99999-9999`)
- [ ] Alteração de e-mail exige confirmação no novo endereço antes de ser aplicada
- [ ] Alteração de senha exige informar a senha atual
- [ ] Jogador define gênero (Masculino / Feminino) — usado para filtrar ligas compatíveis
- [ ] Foto de perfil aceita JPG/PNG até 5MB; armazenada em storage externo (Railway Volume ou S3-compatible)

**Localização**

- [ ] Jogador pode informar sua cidade usando o mesmo autocomplete de API definido em US-O-01
- [ ] Cidade do jogador é usada para sugerir ligas próximas na busca (US-P-01)

**Informações esportivas**

- [ ] Jogador pode selecionar os esportes que pratica (multi-seleção): Padel, Tênis, Beach Tennis, Pickleball, Outro
- [ ] Para cada esporte selecionado, campos adicionais ficam disponíveis:
  - [ ] **Posição em quadra** (Padel / Beach Tennis): `Esquerda`, `Direita` ou `Ambos`
  - [ ] **Lado preferido** (Tênis duplas): `Vantagem`, `Igualdade` ou `Ambos`
  - [ ] **Nível de jogo** (todos os esportes): `Iniciante`, `Intermediário`, `Avançado`, `Competitivo`
- [ ] Campos esportivos são opcionais; perfil sem essas informações pode ser salvo normalmente
- [ ] Posição e nível são exibidos no card do jogador dentro de uma liga, visíveis para o organizador e outros atletas
- [ ] Organizador pode filtrar atletas por posição e nível ao visualizar a lista de inscritos na liga

**Visibilidade**

- [ ] Jogador pode definir se seu perfil é público (visível para qualquer usuário logado) ou privado (visível apenas para membros das suas ligas)
- [ ] Perfil público exibe: nome, foto, esportes, posição, nível e histórico de ligas participadas
- [ ] Perfil privado exibe apenas: nome e foto

---

## 6. Organizador

---

### US-O-01 — Criar uma liga

**Como** organizador,
**quero** criar uma nova liga configurando todas as suas regras,
**para** que meu grupo possa começar a competir.

#### Critérios de aceite

- [ ] Formulário de criação exige: nome da liga, esporte, gênero, mínimo e máximo de atletas
- [ ] Campos opcionais: descrição, foto/banner da liga
- [ ] Configurações de formato: número de grupos, sobe e desce (toggle), atletas por grupo
- [ ] Configurações de prazo: prazo por rodada em dias, data de início e encerramento da temporada
- [ ] Configuração de inscrição: automática ou com aprovação manual
- [ ] W.O. automático ativo por padrão; organizador pode desativar
- [ ] Ao salvar, liga recebe código de convite único (ex: `LGRA-ABCD`)
- [ ] Liga criada aparece no dashboard do organizador com status "Aguardando atletas"
- [ ] Campo "Participar como atleta" (toggle, padrão: ativado) permite ao organizador escolher se deseja competir na própria liga
- [ ] Se o toggle estiver ativado, o organizador é inscrito automaticamente como atleta ao criar a liga
- [ ] Se o toggle estiver desativado, o organizador gerencia a liga sem figurar na tabela de classificação
- [ ] Organizador pode alterar essa opção a qualquer momento antes do início da liga; após o início, a inscrição como atleta não pode ser desfeita (apenas inativada via Admin)

#### Cidade da liga — busca via API

> API recomendada: **Google Places Autocomplete** (principal) ou **OpenCage Geocoding API** (alternativa gratuita para volumes baixos).

- [ ] Campo "Cidade" é obrigatório no formulário de criação da liga
- [ ] Campo exibe input de busca com autocomplete: ao digitar 3 ou mais caracteres, a API retorna sugestões de cidades
- [ ] Sugestões exibem nome da cidade, estado e país — ex: "Torres, Rio Grande do Sul, Brasil"
- [ ] Somente cidades são aceitas; endereços parciais e pontos de interesse são filtrados da resposta da API
- [ ] Ao selecionar uma sugestão, os campos internos `city`, `state`, `country` e `lat/lng` são preenchidos e persistidos no banco
- [ ] Campo não aceita texto livre sem seleção de sugestão; ao tentar salvar sem seleção exibe "Selecione uma cidade válida na lista"
- [ ] Chamadas à API de geocodificação são feitas via API Route do Next.js (servidor), nunca diretamente do browser, para proteger a chave
- [ ] Chave da API armazenada em variável de ambiente (`GEOCODING_API_KEY`), nunca exposta no bundle do cliente
- [ ] Se a API estiver indisponível, campo exibe "Busca de cidades temporariamente indisponível" e permite entrada de texto livre como fallback
- [ ] Cidade selecionada aparece no card da liga na listagem pública e na página da liga
- [ ] Jogador pode filtrar ligas por cidade ao buscar ligas para se inscrever (US-P-01)
- [ ] Admin Master pode filtrar ligas por cidade no backoffice (US-A-03)

---

### US-O-02 — Gerenciar inscrições

**Como** organizador,
**quero** aprovar ou recusar solicitações de inscrição,
**para** controlar quem participa da minha liga.

#### Critérios de aceite

- [ ] Dashboard exibe lista de inscrições pendentes com: nome, gênero e data da solicitação
- [ ] Botões "Aprovar" e "Recusar" disponíveis por inscrição
- [ ] Ao aprovar, jogador recebe notificação e é adicionado à lista de atletas da liga
- [ ] Ao recusar, jogador recebe notificação de recusa (sem justificativa obrigatória na v1)
- [ ] Organizador pode remover atleta já aprovado antes da liga iniciar
- [ ] Liga com inscrição automática não exibe fila de aprovação
- [ ] Número atual de atletas é exibido em tempo real; botão "Iniciar liga" fica disponível quando mínimo for atingido

---

### US-O-03 — Iniciar a liga e gerar rodadas

**Como** organizador,
**quero** iniciar a liga e gerar todas as rodadas automaticamente,
**para** que os atletas saibam com quem jogarão em cada rodada.

#### Critérios de aceite

- [ ] Botão "Iniciar liga" disponível quando número de atletas ≥ mínimo configurado
- [ ] Ao iniciar, sistema gera todas as rodadas via algoritmo round-robin em duplas rotativas
- [ ] Cada atleta tem exatamente 3 jogos por rodada
- [ ] Nenhuma dupla se repete; todo atleta joga com e contra todos ao longo da temporada
- [ ] Para número de atletas que não permita combinações perfeitas, o sistema repete duplas o mínimo possível
- [ ] Organizador visualiza prévia das rodadas antes de confirmar
- [ ] Após confirmação, atletas recebem notificação via app e WhatsApp com início da Rodada 1
- [ ] Liga muda de status para "Em andamento"; novas inscrições são bloqueadas

---

### US-O-04 — Monitorar andamento da liga

**Como** organizador,
**quero** acompanhar o status de cada atleta e rodada em tempo real,
**para** identificar pendências e agir quando necessário.

#### Critérios de aceite

- [ ] Painel exibe, por rodada: número de jogos concluídos, pendentes e com W.O.
- [ ] Lista de atletas mostra, por atleta: jogos concluídos na rodada atual e saldo total
- [ ] Atletas com prazo em risco (≤ 48h) são destacados com alerta visual
- [ ] Organizador pode enviar lembrete manual a um atleta específico (dispara WhatsApp)
- [ ] Painel de alertas lista: disputas pendentes de arbitragem e prazos expirados sem resultado

---

### US-O-05 — Arbitrar disputa de resultado

**Como** organizador,
**quero** resolver disputas de resultado que ficaram empatadas na votação,
**para** que o ranking possa ser atualizado corretamente.

#### Critérios de aceite

- [ ] Organizador recebe notificação quando votação resulta em empate 2×2
- [ ] Tela de arbitragem exibe: placar informado, nomes dos 4 jogadores e como cada um votou
- [ ] Organizador pode: validar o placar informado, inserir placar corrigido ou solicitar replay do jogo
- [ ] Decisão do organizador é final e não pode ser revertida pelos jogadores
- [ ] Após decisão, todos os 4 jogadores recebem notificação com o resultado final
- [ ] Caso organizador não arbitra em 72h, sistema escala alerta para o Admin Master

---

### US-O-06 — Encerrar temporada e aplicar sobe e desce

**Como** organizador,
**quero** encerrar a temporada e processar o sobe e desce entre grupos,
**para** iniciar a próxima temporada com os grupos atualizados.

#### Critérios de aceite

- [ ] Botão "Encerrar temporada" disponível somente após todos os jogos da última rodada terem resultado (ou W.O.)
- [ ] Sistema exibe prévia do resultado final: campeão, classificação completa e quem sobe/desce (se configurado)
- [ ] Organizador confirma encerramento; ranking é congelado e marcado como "Temporada encerrada"
- [ ] Se sobe e desce ativo: últimos N atletas do Grupo A descem para Grupo B; primeiros N do Grupo B sobem
- [ ] N (número de atletas que sobem/descem) é configurável pelo organizador antes do encerramento
- [ ] Todos os atletas recebem notificação com resultado final e sua posição para a próxima temporada
- [ ] Organizador pode iniciar nova temporada com os grupos atualizados; rodadas são regeradas

---

### US-O-07 — Editar configurações da liga

**Como** organizador,
**quero** editar configurações da liga antes de iniciá-la,
**para** corrigir erros ou adaptar as regras.

#### Critérios de aceite

- [ ] Todas as configurações definidas em US-O-01 são editáveis enquanto a liga não foi iniciada
- [ ] Após iniciar a liga, apenas prazo por rodada e configurações de notificação podem ser alterados
- [ ] Alteração de prazo por rodada aplica-se somente às próximas rodadas; rodada em andamento mantém prazo original
- [ ] Sistema exibe aviso antes de salvar alterações que impactem atletas já inscritos

---

## 7. Admin Master (SaaS)

---

### US-A-01 — Acessar o backoffice

**Como** Admin Master,
**quero** acessar um painel administrativo separado,
**para** gerenciar a plataforma como um todo.

#### Critérios de aceite

- [ ] Painel acessível em rota `/admin` protegida por papel `ADMIN`
- [ ] Login na rota `/admin/login` com e-mail e senha (sem Google OAuth)
- [ ] Tentativa de acesso de usuário com papel `PLAYER` ou `ORGANIZER` retorna 403
- [ ] Painel exibe métricas globais: total de usuários, ligas ativas, jogos registrados no mês
- [ ] Todas as ações do admin são registradas em log de auditoria com timestamp e IP

---

### US-A-02 — Gerenciar usuários

**Como** Admin Master,
**quero** visualizar e gerenciar todos os usuários cadastrados,
**para** resolver problemas e garantir a saúde da plataforma.

#### Critérios de aceite

- [ ] Lista de usuários com filtros: papel, data de cadastro, status (ativo/suspenso)
- [ ] Admin pode visualizar perfil completo de qualquer usuário
- [ ] Admin pode suspender um usuário; usuário suspenso não consegue fazer login (mensagem: "Conta suspensa, entre em contato com o suporte")
- [ ] Admin pode reativar usuário suspenso
- [ ] Admin pode forçar reset de senha de qualquer usuário (envia e-mail de redefinição)
- [ ] Admin não pode excluir usuários com dados históricos; apenas suspender

---

### US-A-03 — Gerenciar ligas

**Como** Admin Master,
**quero** visualizar e intervir em qualquer liga da plataforma,
**para** resolver situações que o organizador não conseguiu resolver.

#### Critérios de aceite

- [ ] Lista de todas as ligas com filtros: esporte, status, data de criação, organizador
- [ ] Admin pode visualizar todos os detalhes de qualquer liga, incluindo resultados e disputas
- [ ] Admin pode encerrar uma liga manualmente em qualquer estado (com confirmação obrigatória)
- [ ] Admin pode trocar o organizador de uma liga (ex: organizador saiu do grupo)
- [ ] Admin pode resolver disputas não arbitradas pelo organizador após 72h
- [ ] Todas as intervenções do admin em ligas são registradas em log visível ao organizador da liga

---

### US-A-04 — Monitorar saúde da plataforma

**Como** Admin Master,
**quero** acompanhar métricas e alertas da plataforma,
**para** garantir que tudo está funcionando corretamente.

#### Critérios de aceite

- [ ] Dashboard exibe: usuários ativos nos últimos 7/30 dias, ligas criadas por período, jogos registrados por período
- [ ] Alertas automáticos para: disputas sem arbitragem há mais de 72h, ligas com W.O. em mais de 30% dos jogos
- [ ] Relatório exportável em CSV: usuários, ligas, resultados (por período)
- [ ] Admin recebe e-mail diário com resumo de alertas ativos (configurável)

---

### US-A-05 — Gerenciar planos e limites (SaaS)

**Como** Admin Master,
**quero** controlar os planos e limites de uso da plataforma,
**para** monetizar o produto e controlar o crescimento.

#### Critérios de aceite

- [ ] Sistema suporta ao menos dois planos: Gratuito e Pro (configuráveis via painel)
- [ ] Plano Gratuito: máximo de 1 liga ativa, até 12 atletas por liga
- [ ] Plano Pro: ligas ilimitadas, até 64 atletas por liga, notificações WhatsApp incluídas
- [ ] Organizador que atingiu limite do plano vê mensagem "Limite do plano atingido" com CTA para upgrade
- [ ] Admin pode alterar manualmente o plano de qualquer organizador
- [ ] Admin pode conceder acesso Pro temporário (ex: período de trial)

---

## 8. Regras de Negócio Transversais

| ID    | Regra                                                                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| RN-01 | Saldo de um jogador em um jogo = games ganhos pela dupla − games perdidos pela dupla                                                             |
| RN-02 | W.O. é aplicado automaticamente ao expirar o prazo da rodada sem resultado registrado; placar: 0–6 (−6 pts para ausente, +6 pts para adversário) |
| RN-03 | Desempate no ranking: 1º critério = resultado do confronto direto; 2º critério = definido pelo organizador                                       |
| RN-04 | Resultado só é computado no ranking após confirmação (3 confirmações ou decisão de votação/arbitragem)                                           |
| RN-05 | Votação de disputa: maioria (3×1 ou 4×0) encerra; empate (2×2) escala ao organizador                                                             |
| RN-06 | Voto não dado em 48h conta como confirmação automática do placar informado                                                                       |
| RN-07 | Organização não arbitrada em 72h escala alerta ao Admin Master                                                                                   |
| RN-08 | Um jogador pode ser organizador de múltiplas ligas simultaneamente                                                                               |
| RN-09 | Um organizador pode competir como atleta em sua própria liga                                                                                     |
| RN-10 | Liga só pode ser iniciada se número de atletas ≥ mínimo configurado                                                                              |
| RN-11 | Novas inscrições são bloqueadas após o início da liga                                                                                            |
| RN-12 | Rodadas são geradas uma única vez ao iniciar a liga; não podem ser regeneradas após início                                                       |

---

_Documento gerado com base nas sessões de alinhamento de produto do Matchpoint — Abril 2025._
