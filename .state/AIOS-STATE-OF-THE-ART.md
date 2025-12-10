# AIOS State-of-the-Art Development Workflow

> **DEFINITIVE GUIDE** - Workflow completo usando 100% das capacidades do AIOS-FULLSTACK.
> Baseado em: `.aios-core/workflows/greenfield-fullstack.yaml`

---

## 1. Modelo de Agentes Especializados

### 1.1 Hierarquia de Agentes

```
                    @aios-orchestrator
                    (Master Control)
                           |
    +----------+-----------+-----------+----------+
    |          |           |           |          |
 @analyst   @pm      @ux-expert   @architect   @po
 (Mary)    (John)    (Sally)     (Winston)   (Sarah)
 Research  PRD       UI/UX       System      Validate
    |          |           |           |          |
    +----------+-----------+-----------+----------+
                           |
              +------------+------------+
              |            |            |
            @sm         @dev          @qa
           (Bob)      (James)       (Quinn)
           Story     Implement      Test
```

### 1.2 Responsabilidades dos Agentes

| Agente | Persona | Comando | Responsabilidade |
|--------|---------|---------|------------------|
| @orchestrator | AIOS Master | `/AIOS:agents:aios-orchestrator` | Coordena workflow, decide agente |
| @analyst | Mary | `*agent analyst` | Research, brainstorming, discovery |
| @pm | John | `*agent pm` | PRD, requirements, planning |
| @ux-expert | Sally | `*agent ux-expert` | UI/UX specs, frontend prompts |
| @architect | Winston | `*agent architect` | System architecture, tech decisions |
| @po | Sarah | `*agent po` | Validation, artifact cohesion |
| @sm | Bob | `*agent sm` | Story creation, sprint mgmt |
| @dev | James | `*agent dev` | Code implementation |
| @qa | Quinn | `*agent qa` | Testing, code review, QA gate |

---

## 2. Workflow Greenfield Full-Stack

### 2.1 FASE 1: PLANNING (High Context)

**Ambiente**: Chat com contexto amplo
**Objetivo**: Documentacao completa antes de codigo

| Step | Agente | Artefato | Task/Template |
|------|--------|----------|---------------|
| 1 | @analyst | project-brief.md | create-doc + project-brief-tmpl |
| 2 | @pm | prd.md | create-doc + prd-tmpl |
| 3 | @ux-expert | front-end-spec.md | create-doc + front-end-spec-tmpl |
| 4 | @architect | architecture.md | create-doc + fullstack-architecture-tmpl |
| 5 | @po | Validation | po-master-checklist |
| 6 | @po | Sharded Docs | shard-doc task |

### 2.2 FASE 2: DEVELOPMENT (Focused Context)

**Ambiente**: IDE com documentos sharded
**Objetivo**: Implementacao story-by-story

```
STORY CYCLE:

  @sm ──────> @dev ──────> @dev ──────> @qa
  Create      Implement    DoD Check    Review
  Story                                   |
    ^                                     |
    |         ┌───── FAIL ────────────────┤
    |         v                           |
    |       @dev                          |
    |       Fix Issues                    |
    |         |                           |
    └─────────┴──────── PASS ─────────────┘
                     Next Story
```

---

## 3. Tasks por Agente

### 3.1 @analyst Tasks
- `advanced-elicitation` - Brainstorming (20+ metodos)
- `facilitate-brainstorming-session` - Sessao guiada
- `create-deep-research-prompt` - Prompt de pesquisa

### 3.2 @pm Tasks
- `create-doc` + `prd-tmpl` - Criar PRD
- `create-next-story` - Extrair story do PRD
- `review-story` - Revisar story draft

### 3.3 @architect Tasks
- `create-doc` + `fullstack-architecture-tmpl` - Arquitetura
- `analyze-impact` - Analise de impacto

### 3.4 @dev Tasks
- Implementar stories
- `apply-qa-fixes` - Correcoes QA
- `improve-code-quality` - Refatoracao
- `generate-tests` - Gerar testes

### 3.5 @qa Tasks
- `qa-gate` - Decisao PASS/FAIL/CONCERNS/WAIVED
- `review-story` - Review completo
- `nfr-assess` - Requisitos nao-funcionais
- `test-design` - Design de testes

### 3.6 @po Tasks
- `po-master-checklist` - Validacao completa
- `shard-doc` - Dividir documentos

---

## 4. Checklists Obrigatorios

### 4.1 Story DoD Checklist
**Quando**: Antes de @dev marcar story como Review

```markdown
1. Requirements Met
   [ ] All functional requirements implemented
   [ ] All acceptance criteria met

2. Coding Standards
   [ ] Adheres to coding-standards.md
   [ ] Follows project structure
   [ ] No linter errors

3. Testing
   [ ] Unit tests implemented
   [ ] Integration tests (if applicable)
   [ ] All tests pass

4. Functionality
   [ ] Manually verified
   [ ] Edge cases handled

5. Story Administration
   [ ] All tasks marked complete
   [ ] Decisions documented

6. Build
   [ ] Project builds successfully
   [ ] Linting passes
```

### 4.2 PO Master Checklist
**Quando**: Antes de iniciar desenvolvimento

Categories:
1. Project Setup & Initialization
2. Infrastructure & Deployment
3. External Dependencies
4. UI/UX Considerations
5. User/Agent Responsibility
6. Feature Sequencing
7. Risk Management
8. MVP Scope Alignment
9. Documentation
10. Post-MVP Considerations

---

## 5. QA Gate Decisions

| Decision | Significado | Acao |
|----------|-------------|------|
| PASS | Qualidade OK | Prosseguir |
| CONCERNS | Issues menores | Documentar, prosseguir |
| FAIL | Issues criticos | @dev corrigir |
| WAIVED | Excecao aprovada | Documentar razao |

---

## 6. Elicitation Methods (9 principais)

1. Expand/Contract for Audience
2. Explain Reasoning (CoT)
3. Critique and Refine
4. Analyze Logical Flow
5. Assess Goal Alignment
6. Identify Risks
7. Challenge from Critical Perspective
8. Tree of Thoughts
9. Hindsight Reflection

---

## 7. Comandos AIOS

```bash
# Ativar orchestrator
/AIOS:agents:aios-orchestrator

# Navegar agentes
*agent [nome]     # Ativar agente
*exit             # Voltar ao orchestrator

# Executar
*task [nome]      # Executar task
*checklist [nome] # Executar checklist
*create           # Criar (SM: story, etc)

# Info
*help             # Ajuda
*status           # Estado atual
```

---

## 8. Regras de Execucao

### 8.1 Regras Inviolaveis
1. Tasks com elicit=true DEVEM usar formato 1-9 options
2. Nao pular etapas para eficiencia
3. Aguardar confirmacao do usuario
4. Respeitar permissoes em story files
5. Cada agente em chat separado (melhor contexto)

### 8.2 Permissoes em Story Files

| Secao | @dev | @qa | @po |
|-------|------|-----|-----|
| Requirements | READ | READ | READ |
| Tasks | WRITE | READ | READ |
| Debug Log | WRITE | READ | READ |
| QA Results | READ | WRITE | READ |

---

## 9. Ciclo Aplicado ao Branding OS

### 9.1 Por Story

```markdown
1. @sm: Criar story file
   - Input: MVP-EPICS-STORIES.md
   - Output: STORY-XXX.md (status: Draft)

2. @dev: Implementar
   - Seguir Design System Academia Lendaria
   - Marcar checkboxes [x]
   - Executar story-dod-checklist
   - Status: Review

3. @qa: Revisar
   - Verificar acceptance criteria
   - Design System compliance
   - QA Gate: PASS/FAIL

4. Se FAIL: @dev corrigir -> @qa

5. Se PASS: Next story
```

### 9.2 Por Epico

```markdown
1. Todas stories completadas
2. @qa validacao final do epico
3. Update STATE.md (status: COMPLETED)
4. Update CHANGELOG.md
5. Criar session log
6. Criar .state/epics/EX-nome.md
```

---

## 10. Design System Checkpoints

Para Branding OS, todos os agentes verificam:

```yaml
pre_development:
  - Story file criado
  - Acceptance criteria claros
  - Design System reference loaded

development:
  - Design tokens usados corretamente
  - No emojis
  - Dark mode implementado
  - Flaticon UIcons only
  - Primary color max 8%

post_development:
  - story-dod-checklist passed
  - Build passa
  - Lint passa
  - TypeCheck passa

qa_review:
  - Funcionalidade verificada
  - Design System compliance
  - Accessibility checked
  - QA gate documented
```

---

## 11. Templates Disponiveis

| Template | Agente | Uso |
|----------|--------|-----|
| prd-tmpl | @pm | Product Requirements |
| project-brief-tmpl | @analyst | Project discovery |
| front-end-spec-tmpl | @ux-expert | UI/UX spec |
| fullstack-architecture-tmpl | @architect | Architecture |
| story-tmpl | @sm | User story |
| qa-gate-tmpl | @qa | QA decision |

---

## 12. Localizacao AIOS Framework

```
D:/mmos/.aios-core/
  agents/        # 10 agent definitions
  tasks/         # 47+ executable tasks
  workflows/     # 6 workflow definitions
  templates/     # 15+ document templates
  checklists/    # 8 quality checklists
  data/          # KB, methods, preferences
```

---

*AIOS State-of-the-Art Workflow v1.0*
*Projeto: Branding OS*
*2025-12-09*
