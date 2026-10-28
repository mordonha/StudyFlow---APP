# ANTIGRAVITY.md — Memória de Sessões, Prompts & Contexto do Projeto

> **Arquivo de persistência de contexto e histórico de prompts para o assistente Google Antigravity (e outros agentes de IA).**  
> *Equivalente ao `CLAUDE.md` do Claude Code. Ao iniciar uma nova sessão no Antigravity, este arquivo fornece o histórico completo, decisões tomadas, estado atual e guia de continuidade.*

---

## 📌 Contexto Geral do Projeto

* **Nome do Projeto:** `StudyFlow` (com expansão para o subsistema *Invert*)
* **Contexto Educacional:** Projeto prático desenvolvido na **Imersão em Engenharia de Software com IA: Dev na Era da IA** (Google & Alura).
* **Repositório GitHub:** [`https://github.com/mordonha/StudyFlow---APP.git`](https://github.com/mordonha/StudyFlow---APP.git)
* **Branch Principal de Produção:** `main` (Versão inicial homologada do StudyFlow)
* **Branch Ativa de Desenvolvimento:** `StudyFlow-Invert-App` (Versão evoluída com Invert - Técnica Feynman)
* **Autor Git Configurado:** `Paulo Marcos Ordonha <marcos.ordonha@gmail.com>`
* **Projeto Google Cloud Platform (GCP):** `agentic-ai-eng-soft-alura`
* **URL de Produção Serverless:** `https://studyflow-3881.ai.studio/` (Google Cloud Run `*.run.app`)

---

## 📜 Histórico Cronológico de Prompts & Evolução

Abaixo está o registro fiel de todos os prompts utilizados desde a concepção do projeto, que permite ao Antigravity entender a rastreabilidade das decisões de engenharia de software:

---

### 🔹 Prompt 1: Ideação Inicial com IA (Exploração Conceitual)
* **Ambiente:** Google AI Studio (Playground)
* **Objetivo:** Explorar em linguagem natural oportunidades e problemas reais de estudantes.
* **Prompt na Íntegra:**
```text
Dê uma ideia de aplicativo para ajudar pessoas a estudar.
```
* **Resultado:** Concepção da ideia do **StudyFlow**, um gerenciador visual e sem atrito para apoiar estudantes iniciantes a organizarem objetivos e combaterem a procrastinação.

---

### 🔹 Prompt 2: Definição de Requisitos com Persona de Produto
* **Ambiente:** Google AI Studio (*New App*)
* **Objetivo:** Estruturar a visão de produto e separar os requisitos de negócio antes de qualquer codificação.
* **Prompt na Íntegra:**
```text
Você é uma pessoa especialista em produtos digitais educacionais.

Queremos criar o StudyFlow, uma aplicação simples para ajudar estudantes iniciantes a organizar objetivos de estudo.

A primeira versão deve permitir que a pessoa:
● cadastre um objetivo de estudo;
● visualize os objetivos cadastrados;
● edite um objetivo;
● exclua um objetivo;
● mantenha seus dados após atualizar a página.

Para cada objetivo, considere:
● título;
● descrição;
● prazo;
● status.

Organize a resposta em:
1. problema que o aplicativo resolve;
2. público principal;
3. requisitos funcionais;
4. critérios que podemos utilizar para testar a primeira versão.

Não escreva código ainda.
```
* **Resultado:** Definição do escopo formal do MVP (CRUD + retenção de dados) e dos critérios de aceitação para validação de software.

---

### 🔹 Prompt 3: Construção da Aplicação Web (Geração Guiada)
* **Ambiente:** Google AI Studio (*New App*)
* **Objetivo:** Geração estruturada do código em TypeScript com componentização modular e persistência client-side.
* **Prompt na Íntegra:**
```text
Crie uma aplicação web chamada StudyFlow para organizar objetivos de estudo.

Público:
Estudantes iniciantes que precisam organizar o que desejam aprender.

A aplicação deve permitir:
● cadastrar um objetivo com título, descrição, prazo e status;
● listar os objetivos cadastrados;
● editar um objetivo;
● excluir um objetivo somente após uma confirmação;
● exibir a quantidade de objetivos cadastrados;
● salvar os dados no localStorage para que permaneçam após a atualização da página.

Requisitos de interface:
● visual simples, acolhedor e organizado;
● formulário fácil de entender;
● cartões para apresentar os objetivos;
● mensagens quando não houver objetivos;
● interface responsiva;
● textos em português do Brasil.

Requisitos técnicos:
● usar TypeScript;
● separar a interface em componentes;
● separar os tipos de dados;
● criar um serviço para o armazenamento;
● não utilizar backend nesta primeira versão.

Antes de finalizar, confira se todos os requisitos foram implementados.
```
* **Resultado:** Criação da base de código inicial (`src/components/`, `src/services/storageService.ts`, `src/types/objective.ts`).

---

### 🔹 Prompt 4: Documentação da Arquitetura em 4 Fases & Diagramas Visuais
* **Ambiente:** Assistente Antigravity / IDE
* **Objetivo:** Criar o `README.md` detalhado explicando a arquitetura em 4 tópicos (Especificação, Planejamento, Implementação, Validação) com uma imagem vetorial SVG para cada um.
* **Insumo de Runtime Fornecido:**
```text
[ Google Cloud Run (Serviço Serverless no GCP) ]
   │  1. Entrega o código (HTML + React/JS + Tailwind CSS)
   ▼
[ Navegador do Usuário (Seu Computador / Celular) ]
   │  2. O React roda localmente na máquina do estudante
   │  3. StorageService lê e grava via window.localStorage
   ▼
[ Disco Local do Seu Navegador (localStorage) ]
```
* **Resultado:** Criação do `README.md` completo e dos arquivos `docs/architecture/01-especificacao.svg`, `02-planejamento.svg`, `03-implementacao.svg`, `04-validacao.svg`.

---

### 🔹 Prompt 5: Detalhamento do Google Cloud Run & Isolamento no localStorage
* **Ambiente:** Assistente Antigravity / IDE
* **Objetivo:** Adicionar sub-seção técnica no README explicando como a aplicação é servida no GCP, deploy via Cloud Run e onde ficam os dados cadastrados.
* **Pontos Chave Documentados:**
  - **Papel do Cloud Run:** O Cloud Run executa um contêiner Linux virtualizado com Node.js/Vite; os arquivos residem no contêiner e são entregues via HTTP (não em bucket estático do Cloud Storage).
  - **Isolamento de Dados:** Os dados **NÃO** vão para o GCP; ficam 100% salvos no `window.localStorage` do navegador do estudante. Por isso sobrevivem ao F5 mas não aparecem em outro dispositivo ou aba anônima.
  - **Apresentação Alura:** Destaque no início do README sobre a finalidade educacional na Imersão com o Google.
  - **Project ID:** `agentic-ai-eng-soft-alura` e URL `https://studyflow-3881.ai.studio/`.

---

### 🔹 Prompt 6: Governança Git & Atualização de Autor
* **Ambiente:** Terminal Git
* **Ação Realizada:** Atualização do e-mail de autor no Git (`~/.gitconfig` e repo local) para `marcos.ordonha@gmail.com` e regravação (*git rebase*) dos commits históricos anteriores para remover o e-mail corporativo desativado.

---

### 🔹 Prompt 7: A Grande Inovação — Invert ("Aprenda Ensinando" / Técnica Feynman)
* **Ambiente:** Assistente Antigravity / IDE (Branch `StudyFlow-Invert-App`)
* **Conceito Fundamentado em Neurociência:**
  - O usuário é o professor; a IA é o aluno curioso.
  - Combate a "ilusão de competência" (estudo passivo) forçando recuperação ativa da memória.
* **Features Implementadas:**
  1. **3 Personas de Alunos:** Arthur (10 anos, sem jargões), Beatriz (Colega cética, pede causas/provas), Carlos (Pré-vestibular, pegadinhas de banca).
  2. **Sala de Aula Interativa (`TeachingSessionModal`):** Chat com suporte a ditar explicações por microfone (`SpeechRecognition`).
  3. **Modo Caminhada (Hands-Free):** Síntese de voz pt-BR (`SpeechSynthesis`) que lê as respostas e dúvidas do aluno em voz alta.
  4. **Raio-X do Conhecimento (`KnowledgeReportModal`):** Nota de didática (0-100), conceitos dominados, pontos cegos, erros conceituais e flashcards automáticos de revisão.
  5. **Gamificação ("Evolua seu Aluno" - `StudentEvolutionView`):** Níveis (Leigo, Aprendiz, Estudante, Mestre), barra de XP e diplomas acadêmicos.
  6. **Integração Total:** Botão 💡 *"Ensinar (Feynman)"* em cada `<GoalCard>` e abas no `<Header>`.
  7. **Cenário de Próximos Passos:** Roteiro documentado para merge na `main` e deploy via `gcloud CLI` no Cloud Run (sem executar o deploy prematuramente).

---

## 🗂️ Mapa de Arquitetura e Estrutura de Arquivos

```bash
studyflow-imersao-dev-ai-google-engsoft/
├── ANTIGRAVITY.md                  # Este arquivo de memória e histórico de sessões
├── README.md                       # Documentação técnica e arquitetural completa
├── docs/
│   └── architecture/               # Diagramas vetoriais SVG das 4 fases
│       ├── 01-especificacao.svg
│       ├── 02-planejamento.svg
│       ├── 03-implementacao.svg
│       └── 04-validacao.svg
├── src/
│   ├── components/
│   │   ├── invert/                 # Módulos do Laboratório Feynman (Invert)
│   │   │   ├── KnowledgeReportModal.tsx # Raio-X & Flashcards de recuperação
│   │   │   ├── PersonaSelector.tsx      # Seletor das 3 personas de aluno IA
│   │   │   ├── StudentEvolutionView.tsx # Gamificação, XP e diplomas
│   │   │   └── TeachingSessionModal.tsx # Sala de aula (chat, mic e áudio)
│   │   ├── ConfirmModal.tsx        # Confirmação de exclusão com ESC
│   │   ├── EmptyState.tsx          # Estados vazios e onboarding
│   │   ├── GoalCard.tsx            # Card de meta com prazo + atalho Invert
│   │   ├── GoalFormModal.tsx       # Formulário controlado de metas
│   │   ├── GoalStats.tsx           # Painel de métricas e barra de progresso %
│   │   └── Header.tsx              # Barra superior com abas de navegação
│   ├── services/
│   │   ├── invertService.ts        # Motor de IA Feynman, gamificação e áudio
│   │   └── storageService.ts       # Repositório de objetivos no localStorage
│   ├── types/
│   │   ├── invert.ts               # Contratos de tipos do Invert
│   │   └── objective.ts            # Contratos de tipos das metas
│   ├── App.tsx                     # Orquestrador mestre de estado
│   ├── index.css                   # Tailwind CSS v4
│   └── main.tsx                    # Montagem React 19
├── metadata.json                   # Metadados do Google AI Studio
├── package.json                    # Dependências e scripts
└── tsconfig.json                   # Configurações TypeScript
```

---

## 💾 Chaves de Armazenamento no Navegador (`window.localStorage`)

A aplicação opera sob o modelo *Client-Side First*, preservando total privacidade do aluno:
1. `studyflow_objectives_v1`: Array serializado de `StudyObjective` (título, descrição, prazo, status).
2. `studyflow_invert_progress_v2`: Estado de gamificação do aluno virtual (nível, título, XP atual, diplomas e sessões).
3. `studyflow_invert_reports_v1`: Histórico dos últimos 20 relatórios de *Raio-X do Conhecimento* gerados.

---

## 🚦 Guia para Retomar o Trabalho em Novas Sessões

Sempre que uma nova sessão do **Antigravity** for iniciada:

1. **Identificar a Branch Ativa:**
   - Para continuar trabalhando nas features do **Invert**, certifique-se de estar na branch:
     ```bash
     git checkout StudyFlow-Invert-App
     ```
   - Para verificar o projeto original estável:
     ```bash
     git checkout main
     ```

2. **Como Rodar o Projeto:**
   ```bash
   npm run dev      # Inicia o servidor local em http://localhost:3000
   npm run build    # Gera o bundle de produção em dist/
   npm run lint     # Validação estática de tipos TypeScript (tsc --noEmit)
   ```

3. **Como Executar o Merge Futuro (Quando Solicitado):**
   ```bash
   git checkout main
   git pull origin main
   git merge StudyFlow-Invert-App -m "merge: incorpora features do Invert na main"
   git push origin main
   ```

4. **Como Executar o Deploy Futuro no GCP (Quando Solicitado):**
   ```bash
   gcloud config set project agentic-ai-eng-soft-alura
   gcloud run deploy studyflow --source . --region us-central1 --platform managed --allow-unauthenticated --port 3000
   ```

---

<div align="center">
  <sub>Documento mantido para continuidade e alinhamento do assistente Antigravity. StudyFlow © 2026.</sub>
</div>
