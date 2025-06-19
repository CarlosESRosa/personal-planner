# 🧠 Prompt – Desenvolvedor Frontend Senior

*(Task Planner · React + TypeScript · Vite · Context API · Tailwind CSS + Material UI · Axios · Zod + React-Hook-Form · SweetAlert2)*

> Missão: construir uma SPA de gerenciamento de tarefas com UX abundante em feedback visual e código limpo, preparada para evoluir sem refactor traumático.
> 

---

## 1 • Roteiro de alto nível

| Etapa | Entregável | Por quê |
| --- | --- | --- |
| **Arquitetura base** | Context API (Auth / Tasks), `api.ts`, tema MUI, configuração Tailwind | Fundação sólida → muda pouco no futuro |
| **Autenticação** | Login - Registro - Logout + interceptores + SweetAlert “Sessão expirada” | Toda tela privada depende disso |
| **Kanban MVP** | Board PENDING / IN PROGRESS / DONE → drag-and-drop otimista | Valor de negócio imediato |
| **Detalhe & CRUD** | Drawer para editar, excluir, mudar status + página `/tasks/new` | Fluxos centrais completos |
| **UX Polimento** | Loaders globais, toasts de sucesso, SweetAlerts de erro/crítico | Confiança do usuário |
| **Perfil & 404** | Edição de conta + página de rota inválida | Fechamento de escopo |

---

## 2 • Stacks e justificativas

| Camada | Tecnologia | Por que foi escolhida |
| --- | --- | --- |
| **Framework + Bundler** | React 18 + Vite | HMR instantâneo; ecosistema maduro; React é padrão de mercado. |
| **Tipagem** | TypeScript | Contratos claros, refactor seguro, alinhar com backend TS + Zod. |
| **UI** | Material UI **(componentes)** + Tailwind CSS **(utilitários)** | MUI → acessibilidade, componentes ricos; Tailwind → zero CSS manual, rapidez de layout. |
| **Estado global** | Context API + `useReducer` | Supre Auth & Tasks sem o overhead de Redux. |
| **HTTP** | Axios | Interceptors elegantes (Authorization / 401 handler). |
| **Drag & Drop** | dnd-kit | Acessível, moderno, leve para Kanban. |
| **Form + Validação** | React-Hook-Form + Zod | Performance no re-render; schemas compartilháveis com API. |
| **Feedback Visual** | SweetAlert2 (modais) + MUI Snackbar (toasts) | Alerta crítico vs. confirmação leve; UX coeso. |

---

## 3 • Fluxo de autenticação

1. **Login / Register** → `POST /users/*`
    
    → `{ token, user }`
    
2. Salvar `access_token` & `user` em `localStorage`.
3. **Axios request interceptor** injeta header `Authorization: Bearer <token>` nas rotas protegidas.
4. **Axios response interceptor**
    
    ```
    if (err.response?.status === 401) {
      Swal.fire('Sessão expirada', 'Faça login novamente', 'warning')
        .then(() => logout());
    }
    
    ```
    

---

## 4 • Estrutura de diretórios

```
src/
├ main.tsx
├ App.tsx                  # ThemeProvider · SnackbarProvider · AuthProvider
│
├ router/
│ ├ index.tsx              # createBrowserRouter()
│ └ ProtectedRoute.tsx     # redireciona /login se falta token
│
├ context/
│ ├ AuthContext.tsx        # token · user · login() · logout()
│ └ TaskContext.tsx        # board · dispatch()
│
├ services/
│ ├ api.ts                 # axios + interceptors
│ ├ authService.ts         # /login /register /me
│ └ taskService.ts         # CRUD /tasks
│
├ pages/
│ ├ Login/
│ ├ Register/
│ ├ Tasks/                 # Kanban board
│ │   └ components/        # Board, Column, Card, Drawer
│ ├ NewTask/
│ ├ Profile/
│ └ NotFound/
│
├ components/              # UI genérico
│ ├ Header.tsx
│ ├ Spinner.tsx
│ ├ FormTextField.tsx
│ └ IconButtonConfirm.tsx  # Abstrai SweetAlert de delete
│
└ hooks/
  └ useAuth.ts

```

---

## 5 • Organização do Kanban

| Coluna | Representa | Cor |
| --- | --- | --- |
| **Pending** | `status = PENDING` | `bg-primary-50` |
| **In Progress** | `status = IN_PROGRESS` | `bg-accent-50` |
| **Done** | `status = DONE` | `bg-success-50` |
- **dnd-kit** `<SortableContext>`: autoposiciona card.
- `onDragEnd` → dispatch local **antes** do PATCH (optimistic).
- Falha → rollback e `Swal.fire('Erro', 'Não foi possível mover', 'error')`.

---

## 6 • Paleta de cores

> Referência visual: site Rei do Pitaco (tons amarelo-ouro + cinza-escuro + branco predominante).
> 

| Token | Hex | Uso sugerido |
| --- | --- | --- |
| `primary` | **#FFBA08** | Botões principais, header, highlight |
| `primary-dark` | #E0A200 | Hover / ativa |
| `accent` | **#161616** | Texto forte, ícones primários |
| `accent-light` | #323232 | Sub-títulos, bordas leves |
| `bg` | **#F5F5F5** | Background geral |
| `surface` | **#FFFFFF** | Cards / modais |
| `success` | **#2AA84F** | Status **DONE**, toasts OK |
| `warning` | **#F79009** | SweetAlert confirmações |
| `error` | **#E53935** | Toast/SweetAlert erro |

### Configuração Tailwind (`tailwind.config.ts`)

```
export default {
  content: ['index.html', 'src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:       '#FFBA08',
        'primary-dark':'#E0A200',
        accent:        '#161616',
        'accent-light':'#323232',
        bg:            '#F5F5F5',
        surface:       '#FFFFFF',
        success:       '#2AA84F',
        warning:       '#F79009',
        error:         '#E53935',
      },
    },
  },
  plugins: [],
};

```

> Material UI Theme mapeia palette.primary.main = #FFBA08, palette.text.primary = #161616, etc., garantindo consistência visual entre Tailwind & MUI.
> 

---

## 7 • Padrões de código & boas práticas

| Tema | Regra |
| --- | --- |
| **CSS** | Somente Tailwind (`className`) ou `sx` do MUI – sem `.css` local. |
| **Components** | Funções puras; side-effects apenas em *pages* ou *hooks*. |
| **Services** | Toda chamada HTTP centralizada; jamais no componente. |
| **Erros** | Sempre capturados → SweetAlert visível ao usuário; console log só em dev. |
| **Optimistic UI** | Altera state antes do servidor **e** faz rollback na falha. |
| **Naming** | `PascalCase` para componentes; `camelCase` p/ hooks e utilitários. |
| **ESLint** | `import/order`, `no-console warn`, `react/jsx-key`, `tailwindcss/no-custom-classname`. |
| **Prettier** | Plugin Tailwind → ordena classes automaticamente. |

---

## 8 • Experiência do usuário

| Evento | Feedback |
| --- | --- |
| **Login falhou** | SweetAlert *error* com mensagem da API |
| **Sessão expirada** | SweetAlert *warning* + Logout automático |
| **Criar / editar / mover tarefa** | Snackbar verde “Salvo com sucesso” |
| **Excluir tarefa** | SweetAlert *warning* “Tem certeza?” + Snackbar verde |
| **Erro de rede** | SweetAlert *error* “Não foi possível conectar” |

Loader global (Backdrop + Spinner) é controlado no `TaskContext` & `AuthContext` para evitar múltiplos spinners.

---

## 9 • Checklist final de aceitação

- [ ]  Paleta corresponde ao guia Rei do Pitaco em todas páginas.
- [ ]  Interceptor trata 401 → SweetAlert + logout.
- [ ]  Kanban suporta drag-and-drop com fallback visual.
- [ ]  Formulários validam via Zod; mensagens inline.
- [ ]  SweetAlerts/Toasts em **todos** fluxos de sucesso, aviso, erro.
- [ ]  Código sem `any` solto; lint e prettier sem warnings.
- [ ]  Build `vite build` gera bundle ≤ 250 kB gz (sem contar MUI core).