# BRANDING OS - AIOS Native Workflow

> Este projeto é desenvolvido usando **100% das capacidades do AIOS-FULLSTACK**.
> Todos os épicos, stories e tasks são executados através de agentes especializados.

---

## Arquitetura AIOS

```
                    ┌─────────────────────┐
                    │  @aios-orchestrator │
                    │   (Master Control)  │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           v                   v                   v
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ @architect  │     │    @dev     │     │    @qa      │
    │  (Design)   │     │   (Code)    │     │  (Testing)  │
    └─────────────┘     └─────────────┘     └─────────────┘
           │                   │                   │
           v                   v                   v
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │    @pm      │     │    @po      │     │    @sm      │
    │ (Planning)  │     │ (Product)   │     │  (Process)  │
    └─────────────┘     └─────────────┘     └─────────────┘
```

---

## Agentes e Responsabilidades

### @aios-orchestrator (Master)
**Ativação**: `/AIOS:agents:aios-orchestrator` ou comando direto
**Responsabilidades**:
- Coordenar workflow entre agentes
- Decidir qual agente ativar para cada tarefa
- Manter visão holística do projeto
- Gerenciar transições entre épicos
- Atualizar STATE.md e CHANGELOG.md

### @architect
**Ativação**: `*agent architect`
**Responsabilidades**:
- Design de arquitetura de componentes
- Estrutura de pastas e módulos
- Decisões técnicas de alto nível
- Patterns e convenções
- Code review arquitetural

### @dev
**Ativação**: `*agent dev`
**Responsabilidades**:
- Implementação de código
- Componentes React/TypeScript
- Integração com APIs
- Refatoração
- Bug fixes

### @qa
**Ativação**: `*agent qa`
**Responsabilidades**:
- Testes unitários e de integração
- Validação de acceptance criteria
- Verificação de Design System compliance
- Performance testing
- Relatórios de qualidade

### @pm
**Ativação**: `*agent pm`
**Responsabilidades**:
- Planejamento de sprints
- Breakdown de épicos em stories
- Priorização de backlog
- Gestão de riscos
- Status reports

### @po
**Ativação**: `*agent po`
**Responsabilidades**:
- Definição de requisitos
- Acceptance criteria
- User stories
- Validação de entregas
- Decisões de produto

### @sm
**Ativação**: `*agent sm`
**Responsabilidades**:
- Facilitação de processos
- Remoção de impedimentos
- Métricas de velocity
- Retrospectivas
- Melhoria contínua

---

## Workflow de Épico (AIOS Native)

```
┌────────────────────────────────────────────────────────────────┐
│                     INÍCIO DE ÉPICO                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. @orchestrator                                              │
│     └── Ler STATE.md, identificar próximo épico                │
│                                                                │
│  2. @pm + @po                                                  │
│     └── Revisar stories do épico                               │
│     └── Confirmar acceptance criteria                          │
│                                                                │
│  3. @architect                                                 │
│     └── Definir arquitetura/estrutura necessária               │
│     └── Identificar componentes e dependências                 │
│                                                                │
│  4. @dev (loop por story)                                      │
│     └── Implementar story                                      │
│     └── Commit atômico                                         │
│                                                                │
│  5. @qa (por story)                                            │
│     └── Validar acceptance criteria                            │
│     └── Verificar Design System compliance                     │
│                                                                │
│  6. @orchestrator                                              │
│     └── Checkpoint: atualizar STATE.md                         │
│     └── Se épico completo: documentar em epics/                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Comandos AIOS Essenciais

### Navegação
```
*help              → Ver todos os comandos
*status            → Estado atual do projeto
*agent [nome]      → Transformar em agente específico
*exit              → Voltar ao orchestrator
```

### Workflow
```
*workflow [nome]   → Iniciar workflow específico
*plan              → Criar plano detalhado
*plan-status       → Ver progresso do plano
*task [nome]       → Executar tarefa específica
```

### Documentação
```
*checklist [nome]  → Executar checklist
*doc-out           → Gerar documento completo
```

---

## Fluxo de Sessão AIOS

### Início de Sessão
```markdown
1. Ativar @orchestrator
   → /AIOS:agents:aios-orchestrator

2. Carregar contexto
   → *status (ou ler STATE.md)

3. Identificar trabalho
   → Qual épico? Qual story?

4. Ativar agente apropriado
   → *agent [dev|architect|qa|pm|po|sm]

5. Executar trabalho
   → Implementar, testar, documentar

6. Retornar ao orchestrator
   → *exit

7. Checkpoint
   → Atualizar STATE.md, CHANGELOG.md
```

### Transição Entre Stories
```markdown
@orchestrator
    │
    ├── Story 1 iniciada
    │   └── *agent dev
    │       └── Implementar
    │       └── *exit
    │   └── *agent qa
    │       └── Validar
    │       └── *exit
    │   └── Commit + Update STATE
    │
    ├── Story 2 iniciada
    │   └── (mesmo fluxo)
    │
    └── Épico completo
        └── Documentar em epics/
        └── Atualizar CHANGELOG
```

---

## Mapeamento Épico → Agentes

### E0 - Project Bootstrap
| Story | Agente Principal | Agentes Suporte |
|-------|------------------|-----------------|
| Setup Vite | @dev | @architect |
| Design System Base | @dev | @architect, @qa |

### E1 - Brand Configuration
| Story | Agente Principal | Agentes Suporte |
|-------|------------------|-----------------|
| Brand Form | @dev | @architect |
| Color System | @dev | @qa |
| Typography | @dev | @qa |
| Logo Upload | @dev | @qa |

### E2 - Generation Wizard
| Story | Agente Principal | Agentes Suporte |
|-------|------------------|-----------------|
| Wizard Shell | @architect, @dev | - |
| Step Components | @dev | @qa |
| State Management | @dev | @architect |
| Navigation | @dev | @qa |
| Preview | @dev | @qa |

### E3 - Agent Pipeline
| Story | Agente Principal | Agentes Suporte |
|-------|------------------|-----------------|
| Base Agent | @architect, @dev | - |
| Orchestrator | @architect, @dev | - |
| Strategist | @dev | @qa |
| Copywriter | @dev | @qa |
| Visual Designer | @dev | @qa |
| QA Agent | @dev | @qa |

### E4 - Asset Library
| Story | Agente Principal | Agentes Suporte |
|-------|------------------|-----------------|
| Grid View | @dev | @qa |
| Filters | @dev | @qa |
| Search | @dev | @qa |
| Actions | @dev | @qa |

### E5 - Export & Integration
| Story | Agente Principal | Agentes Suporte |
|-------|------------------|-----------------|
| PNG Export | @dev | @qa |
| Batch Export | @dev | @qa |
| API Integration | @architect, @dev | @qa |

### E6 - Polish & QA
| Story | Agente Principal | Agentes Suporte |
|-------|------------------|-----------------|
| UI Polish | @dev | @qa |
| Final Testing | @qa | @dev |

---

## Design System Enforcement

Todos os agentes devem verificar:

```yaml
design_system_rules:
  cor_primaria: "#C9B298 (max 8%)"
  tipografia: "Inter (UI) + Source Serif 4 (corpo)"
  espacamento: "Múltiplos de 8px"
  icones: "APENAS Flaticon UIcons"
  emojis: "PROIBIDOS"
  dark_mode: "OBRIGATÓRIO"
  border_radius: "8px padrão (rounded-lg)"

consultar_sempre:
  - "D:/design-system-academia-lendária (1)/academia-lendaria-skill/SKILL.md"
  - "D:/design-system-academia-lendária (1)/academia-lendaria-skill/references/"
```

---

## Checkpoints Obrigatórios

### Por Story
```markdown
[ ] Código implementado
[ ] Build passa
[ ] Lint passa
[ ] Design System compliance verificado
[ ] Commit atômico feito
[ ] STATE.md atualizado (progresso da story)
```

### Por Épico
```markdown
[ ] Todas as stories completadas
[ ] Todos os acceptance criteria validados
[ ] @qa executou validação final
[ ] CHANGELOG.md atualizado
[ ] Session log criado
[ ] .state/epics/E[X]-[nome].md criado
[ ] STATE.md marcado como COMPLETED
```

---

## Quick Reference

```
Ativar AIOS:     /AIOS:agents:aios-orchestrator
Ver ajuda:       *help
Trocar agente:   *agent [nome]
Ver status:      *status
Voltar:          *exit
```

---

*AIOS-FULLSTACK Native Workflow v1.0*
*Projeto: Branding OS*
*Última atualização: 2024-12-09*
