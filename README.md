# 🧠 MindEase

Aplicativo de produtividade com foco em acessibilidade cognitiva, desenvolvido para pessoas com TDAH, TEA, dislexia e outras necessidades específicas.

## 📋 Sobre o Projeto

MindEase é uma plataforma de organização e produtividade que prioriza a acessibilidade cognitiva, oferecendo interfaces personalizáveis, timers de foco (Pomodoro), e gerenciamento de tarefas adaptado às necessidades individuais.

## 🏗️ Arquitetura

### Micro-Frontends (MFEs)

- **🏠 Shell** - Aplicação principal e roteamento
- **⚙️ Panel** - Painel de configurações cognitivas
- **👤 Profile** - Perfil do usuário e preferências
- **📋 Tasks** - Organizador de tarefas com Kanban
- **📊 Dashboard** - Dashboard com timer Pomodoro

### Tecnologias

- **Framework**: Angular 18+ com Standalone Components
- **Monorepo**: Nx Workspace
- **Styling**: CSS Variables + Tailwind-like classes
- **Icons**: Material Icons Rounded
- **Persistência**: LocalStorage
- **Arquitetura**: Clean Architecture (Domain/Data/Presentation)

## 🚀 Instalação e Execução

### Pré-requisitos

- **Node.js** 22+ 
- **npm** ou **yarn**
- **Git**

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd mindease
```

### 2. Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 3. Execute o Projeto

```bash
npx nx serve shell
```

**O comando acima automaticamente:**
- Inicia o Shell na porta `4200`
- Inicia todos os MFEs nas suas respectivas portas
- Configura o roteamento entre os micro-frontends

### 4. Acesse a Aplicação

🌐 **URL**: http://localhost:4200

## 📱 Funcionalidades

### 🎛️ Painel Cognitivo
- **Contraste**: Normal, Alto, Muito Alto
- **Espaçamento**: Normal, Amplo, Extra Amplo
- **Fonte**: Normal (16px), Grande (18px), Extra Grande (20px)
- **Complexidade**: Simples, Médio, Completo
- **Modo Foco**: Reduz distrações visuais
- **Alertas Cognitivos**: Avisos de tempo e pausas
- **Animações**: Normal, Reduzidas, Nenhuma

### 👤 Perfil do Usuário
- **Informações básicas**: Nome e email
- **Configurações de acessibilidade**: Persistentes no localStorage
- **Perfil de navegação**: Mouse, teclado ou ambos
- **Necessidades específicas**: TDAH, TEA, Dislexia, Ansiedade, etc.
- **Rotina de estudo**: Horários e durações personalizadas

### 📋 Sistema de Tarefas
- **Kanban Board**: A Fazer, Em Progresso, Concluído
- **Criação de tarefas**: Formulário completo com validação
- **Subtarefas**: Checklist inteligente
- **Prioridades**: Baixa, Média, Alta (com cores)
- **Tags**: Sistema de etiquetas personalizáveis
- **Tempo estimado**: Integração com Pomodoro

### ⏱️ Timer Pomodoro
- **Ciclos de foco**: 25 minutos (configurável)
- **Pausas**: 5 minutos (configurável)
- **Controles**: Start, Pause, Reset
- **Progresso visual**: Barra de progresso circular
- **Contador de ciclos**: Acompanhamento de produtividade
- **Notificações**: Alertas de transição suave

### 🔔 Sistema de Notificações
- **Alertas de transição**: Avisos suaves entre atividades
- **Notificações Pomodoro**: Fim de foco e pausas
- **Auto-dismiss**: Remoção automática com duração configurável
- **Tipos visuais**: Info, Success, Warning, Transition

## 🎨 Personalização

### Temas e Cores

O projeto utiliza CSS Variables para personalização:

```css
:root {
  --primary: #6366f1;
  --secondary: #f1f5f9;
  --accent: #10b981;
  --surface-color: #ffffff;
  --text-primary: #111827;
  /* ... mais variáveis */
}
```

### Classes de Acessibilidade

- `.high-contrast` - Contraste alto
- `.very-high-contrast` - Contraste muito alto
- `.wide-spacing` - Espaçamento amplo
- `.extra-wide-spacing` - Espaçamento extra amplo
- `.large-text` - Texto grande
- `.extra-large-text` - Texto extra grande
- `.focus-mode` - Modo de foco ativo
- `.reduced-motion` - Animações reduzidas
- `.no-animations` - Sem animações

## 🧪 Comandos Úteis

### Desenvolvimento

```bash
# Servir apenas o shell
npx nx serve shell

# Servir MFE específico
npx nx serve panel
npx nx serve profile
npx nx serve tasks
npx nx serve dashboard

# Build de produção
npx nx build shell

# Visualizar dependências
npx nx graph
```

### Testes

```bash
# Executar testes
npx nx test shell
npx nx test panel

# Executar todos os testes
npx nx run-many --target=test
```

### Linting

```bash
# Lint específico
npx nx lint shell

# Lint todos os projetos
npx nx run-many --target=lint
```

## 📁 Estrutura do Projeto

```
mindease/
├── apps/
│   ├── shell/                 # Aplicação principal
│   │   ├── src/app/
│   │   │   ├── domain/        # Regras de negócio
│   │   │   ├── data/          # Repositórios e dados
│   │   │   ├── presentation/  # Componentes UI
│   │   │   └── services/      # Serviços compartilhados
│   │   └── src/
│   │       ├── index.html     # HTML principal
│   │       └── theme.css      # Variáveis CSS globais
│   ├── panel/                 # MFE - Painel Cognitivo
│   ├── profile/               # MFE - Perfil do Usuário
│   ├── tasks/                 # MFE - Sistema de Tarefas
│   └── dashboard/             # MFE - Dashboard + Pomodoro
├── libs/                      # Bibliotecas compartilhadas
├── nx.json                    # Configuração do Nx
├── package.json              # Dependências
└── README.md                 # Este arquivo
```

## 👥 Equipe

Desenvolvido por Giovanna G. Lorente

---

**MindEase** - Produtividade acessível para todos 🧠✨
