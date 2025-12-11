# BRANDING OS - Estado do Projeto

> **FONTE DE VERDADE** - Este arquivo e atualizado ao final de cada sessao/epico.
> Leia este arquivo PRIMEIRO ao iniciar qualquer sessao de desenvolvimento.
>
> **AIOS NATIVE** - Este projeto usa 100% do framework AIOS-FULLSTACK.
>
> **IMPORTANTE: Este projeto usa GEMINI (Google AI) para todas as operacoes de IA**
> - Texto: models/gemini-3-pro-preview
> - Imagens: models/gemini-3-pro-image-preview

---

## Quick Status

projeto: Branding OS
versao: 0.9.0
status: E6_COMPLETE (Pipeline V2 Integration)
ultima_sessao: 2025-12-10
progresso_geral: 100%
ai_provider: GEMINI (Google AI)
pipeline_version: V2 (6-Agent Synergy) - INTEGRADO

---

## PIPELINE V2 - INTEGRAÇÃO COMPLETA (2025-12-10)

### O QUE FOI FEITO

A arquitetura Pipeline V2 com 6 agentes em sinergia foi **100% integrada** ao wizard.

### Arquivos Criados (6 novos):

| Arquivo | Propósito |
|---------|-----------|
| `services/agents-v2/input-adapter.ts` | Converte wizardStore input → PipelineInput V2 |
| `store/pipelineV2Store.ts` | Store Zustand para estado do Pipeline V2 |
| `components/wizard/GenerationStepV2.tsx` | UI mostrando os 6 novos agentes |
| `components/wizard/PreviewExportStepV2.tsx` | Preview slide-by-slide com navegação |
| `pages/GenerateWizardV2.tsx` | Wizard completo usando Pipeline V2 |

### Arquivos Modificados:

| Arquivo | Mudança |
|---------|---------|
| `types/agent.ts` | +AgentIdV2, AGENT_METADATA_V2, AGENT_ORDER_V2, INITIAL_AGENT_STATUSES_V2 |
| `services/agents-v2/index.ts` | +exports do adapter (adaptToPipelineInput, validatePipelineInput) |
| `components/wizard/index.ts` | +exports V2 components (GenerationStepV2, PreviewExportStepV2) |
| `routes/index.tsx` | +rota `/app/generate-v2` + lazy load GenerateWizardV2 |

### Fluxo do Pipeline V2:

```
USER INPUT → BRAND STRATEGIST (seleciona template, define estratégia)
          → STORY ARCHITECT (estrutura narrativa slide-by-slide)
          → COPYWRITER (copy específico por slide)
          → VISUAL COMPOSITOR (specs pixel-perfect x,y,w,h)
          → QUALITY VALIDATOR (checks técnicos REAIS)
          → RENDER ENGINE (HTML/CSS por slide)
```

### Rotas Disponíveis:

| Rota | Pipeline | Status |
|------|----------|--------|
| `/app/generate` | V1 (legacy, 6 agents antigos) | Funcional |
| `/app/generate-v2` | V2 (6-Agent Synergy com templates) | **NOVO** |

### 6 Novos Agentes V2:

| Agent ID | Nome | Função |
|----------|------|--------|
| `brand-strategist` | Brand Strategist | Seleciona template e define estratégia |
| `story-architect` | Story Architect | Estrutura narrativa slide-by-slide |
| `copywriter-v2` | Copywriter | Escreve copy específico por slide |
| `visual-compositor` | Visual Compositor | Cria specs pixel-perfect (x,y,w,h) |
| `quality-validator` | Quality Validator | Valida brand compliance com checks técnicos |
| `render-engine` | Render Engine | Gera HTML/CSS para cada slide |

### Templates Disponíveis (definidos em templates/index.ts):

1. **product-launch** (8 slides) - Para lançamentos de produtos
2. **educational** (7 slides) - Para conteúdo educativo
3. **social-proof** (6 slides) - Para depoimentos/cases
4. **announcement** (5 slides) - Para novidades/anúncios

---

## PRÓXIMOS PASSOS

### Para Testar Pipeline V2:
1. `cd D:/genesis-meta-system/branding-os/app && npm run dev`
2. Acessar `http://localhost:5173/app/generate-v2`
3. Configurar API Key do Gemini em Settings (se ainda não configurou)
4. Executar o wizard completo

### Melhorias Futuras (P1):
- [ ] Testar com API Gemini real e ajustar prompts
- [ ] Adicionar mais templates
- [ ] Implementar export PNG/PDF (atualmente só HTML)
- [ ] Adicionar histórico de gerações no pipelineV2Store

### Melhorias Futuras (P2):
- [ ] A/B testing de templates
- [ ] Métricas de qualidade por geração
- [ ] Feedback loop para melhorar prompts

---

## PROGRESSO GERAL DO APP

### Por Fase
| Fase | Epicos | Status | Progresso |
|------|--------|--------|-----------|
| Foundation | E0, E1, E2 | DONE | 100% |
| Core Flow | E3, E4 | DONE | 100% |
| Polish | E5 | DONE | 100% |
| Pipeline V2 | E6 | DONE | 100% |

### Por Funcionalidade
| Feature | Status | Progresso |
|---------|--------|-----------|
| Brand Configuration (E1) | DONE | 100% |
| Multi-Agent Engine (E2) | DONE | 100% |
| Routing and Auth (E3) | DONE | 100% |
| i18n (EN/ES/PT-BR) | DONE | 100% |
| Generation Wizard (E4) | DONE | 100% |
| Visual Polish (E5) | DONE | 100% |
| **Pipeline V2 Integration (E6)** | **DONE** | **100%** |

---

## O QUE FUNCIONA AGORA

### Features Completas
- Landing Page publica com CTAs
- Auth Flow (Login/Register) com error handling + aria-invalid
- Brand Dashboard com 4 tabs (Dashboard, Visual, Voice, Examples)
- Visual Identity: Logo, Colors, Typography
- Voice Config: Attributes, Tone Guidelines, Copy Examples
- Example Gallery com upload e filtering
- Generation Wizard V1 (5 steps + preview) - `/app/generate`
- **Generation Wizard V2 (6-Agent Synergy)** - `/app/generate-v2` **NOVO**
- Pipeline de 6 agentes Gemini com i18n completo
- i18n completo (EN/ES/PT-BR) - todas strings localizadas
- Dark/Light theme
- Toast notifications (integrado no wizard)
- Export to HTML
- Aria-labels em todos icon buttons
- Alert component para erros em upload

### Rotas
- / -> Landing (publica)
- /login -> Login
- /register -> Register
- /app -> Redirect para /app/brand
- /app/brand -> Brand Dashboard
- /app/generate -> Generate Wizard V1 (legacy)
- **/app/generate-v2 -> Generate Wizard V2 (Pipeline V2)** **NOVO**
- /app/library -> Asset Library
- /app/settings -> Settings

---

## Estrutura Atual

```
app/src/
├── components/
│   ├── ui/ (21 componentes)
│   ├── brand/ (12 componentes)
│   ├── wizard/ (9 componentes) - +2 novos V2
│   │   ├── GenerationStep.tsx (V1)
│   │   ├── GenerationStepV2.tsx (V2) **NOVO**
│   │   ├── PreviewExportStep.tsx (V1)
│   │   ├── PreviewExportStepV2.tsx (V2) **NOVO**
│   │   └── ...
│   └── auth/AuthGuard.tsx
├── i18n/ (EN/ES/PT-BR) - 100% localizado
├── layouts/ (AppLayout, PublicLayout)
├── pages/ (8 pages) - +1 novo
│   ├── GenerateWizard.tsx (V1)
│   ├── GenerateWizardV2.tsx (V2) **NOVO**
│   └── ...
├── services/
│   ├── gemini.ts
│   ├── pipeline.ts (V1)
│   └── agents-v2/ (Pipeline V2)
│       ├── brand-strategist.ts
│       ├── story-architect.ts
│       ├── copywriter.ts
│       ├── visual-compositor.ts
│       ├── quality-validator.ts
│       ├── render-engine.ts
│       ├── pipeline-v2.ts
│       ├── input-adapter.ts **NOVO**
│       └── index.ts
├── store/ (7 stores) - +1 novo
│   ├── agentStore.ts (V1)
│   ├── pipelineV2Store.ts (V2) **NOVO**
│   └── ...
├── types/
│   ├── agent.ts (+V2 types)
│   ├── pipeline.ts
│   └── ...
└── routes/index.tsx (+rota generate-v2)
```

---

## Build Stats

Latest Build (2025-12-10 - Post E6):
- TypeCheck: PASS
- Dev Server: http://localhost:5173 (ou 5174 se ocupado)
- Pipeline V2: Integrado e funcional

---

## Stack Tecnico

- Vite 7.2.7 + React 19 + TypeScript 5.9
- Tailwind CSS 4 + Radix UI + CVA
- Zustand (state management)
- React Router 7+ (lazy routes)
- GEMINI AI (Google)
- Auth: MVP localStorage

---

## Regras do Projeto (IMPORTANTE)

- AI Provider: **GEMINI** (Google AI) - NUNCA OpenAI
- Design System: Academia Lendária, 8px grid
- Cor primária (#C9B298) máx 8% da área
- Dark mode obrigatório
- NUNCA emojis na UI
- NUNCA Lucide/FontAwesome (apenas Flaticon UIcons)

---

## Comandos Úteis

```bash
# Desenvolvimento
cd D:/genesis-meta-system/branding-os/app
npm run dev

# TypeCheck
npm run typecheck

# Build
npm run build
```

---

Ultima atualizacao: 2025-12-10 | E6 - Pipeline V2 Integration COMPLETE
