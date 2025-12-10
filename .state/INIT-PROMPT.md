# PROMPT DE INICIALIZACAO - Branding OS

> **COPIE O PROMPT ABAIXO** para iniciar a proxima sessao Claude Code.

---

## PROMPT PARA PROXIMA SESSAO

```
/AIOS:agents:aios-orchestrator

Projeto: Branding OS (AIOS Native)

LEIA PRIMEIRO (nesta ordem):
1. D:/genesis-meta-system/branding-os/.state/STATE.md
2. D:/genesis-meta-system/branding-os/.state/AIOS-STATE-OF-THE-ART.md
3. D:/genesis-meta-system/branding-os/.state/sessions/2025-12-09-e0-project-bootstrap.md

Design System (consultar sempre):
D:/design-system-academia-lendaria (1)/academia-lendaria-skill/

Proximo trabalho: E1 - Brand Configuration
- Story: BRAND-001 (Configure Visual Identity)
- Workflow: @sm criar story -> @dev implementar -> @qa review

Continue do ponto indicado em STATE.md usando workflow AIOS.
Siga AIOS-STATE-OF-THE-ART.md para ciclo completo SM -> Dev -> QA.
Checkpoints obrigatorios. Design System inviolavel.
```

---

## STATUS ATUAL

| Campo | Valor |
|-------|-------|
| **Versao** | 0.1.0 |
| **Ultimo Epico** | E0 - Project Bootstrap (COMPLETED) |
| **Proximo Epico** | E1 - Brand Configuration |
| **Proxima Story** | BRAND-001 (Configure Visual Identity) |
| **Stack** | Vite 7 + React 19 + TypeScript 5.9 + Tailwind 4 |

---

## WORKFLOW E1 - Brand Configuration

```
STORY CYCLE (repetir para cada story):

1. @sm: Criar story file
   - Template: .state/STORY-TEMPLATE.md
   - Input: docs/stories/MVP-EPICS-STORIES.md
   - Output: docs/stories/STORY-E1-XXX.md

2. @dev: Implementar
   - Seguir Design System Academia Lendaria
   - Marcar checkboxes [x]
   - Executar story-dod-checklist
   - Status: In Progress -> Review

3. @qa: Review
   - Verificar acceptance criteria
   - Design System compliance
   - QA Gate: PASS/FAIL

4. Se FAIL: @dev corrigir -> @qa
   Se PASS: Proxima story
```

### Stories E1

| # | Story ID | Nome | SP |
|---|----------|------|-----|
| 1 | BRAND-001 | Configure Visual Identity | 5 |
| 2 | BRAND-002 | Configure Brand Voice | 5 |
| 3 | BRAND-003 | Configure Brand Examples | 8 |
| 4 | BRAND-004 | Brand Configuration Dashboard | 3 |

---

## DESIGN SYSTEM - REGRAS INVIOLAVEIS

```yaml
cor_primaria: "#C9B298 (max 8% area)"
tipografia: "Inter (UI) + Source Serif 4 (corpo)"
espacamento: "8px grid"
icones: "APENAS Flaticon UIcons"
emojis: "PROIBIDOS"
dark_mode: "OBRIGATORIO"
border_radius: "8px (rounded-lg)"
```

---

## COMANDOS AIOS

```bash
# Orchestrator
/AIOS:agents:aios-orchestrator

# Criar story
*agent sm -> *create

# Implementar
*agent dev -> (codigo) -> *checklist story-dod

# Review
*agent qa -> *task review-story

# Navegacao
*agent [nome]   # Trocar agente
*exit           # Voltar orchestrator
*help           # Ver comandos
*status         # Estado atual
```

---

## ARQUIVOS CHAVE

| Arquivo | Proposito |
|---------|-----------|
| `.state/STATE.md` | Fonte de verdade |
| `.state/AIOS-STATE-OF-THE-ART.md` | Workflow completo |
| `.state/STORY-TEMPLATE.md` | Template stories |
| `docs/stories/MVP-EPICS-STORIES.md` | Backlog |
| `app/src/` | Codigo fonte |

---

*Atualizado: 2025-12-09 | E0 COMPLETED | Next: E1*
