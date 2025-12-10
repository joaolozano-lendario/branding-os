# BRANDING OS - Procedimentos de Desenvolvimento

> Procedimentos padronizados para garantir consistência e transferibilidade entre sessões.

---

## Procedimento 1: Início de Sessão

### Pré-requisitos
- Acesso ao repositório
- Claude Code ativo

### Passos

```markdown
## INÍCIO DE SESSÃO - Checklist

### 1. Contexto (2 min)
[ ] Ler .state/STATE.md
[ ] Verificar último épico/story
[ ] Identificar próximo trabalho

### 2. Documentação (3 min)
[ ] Se novo épico: Ler épico completo em docs/stories/MVP-EPICS-STORIES.md
[ ] Verificar dependências do épico
[ ] Consultar arquitetura se necessário

### 3. Design System (1 min)
[ ] Confirmar regras aplicáveis ao épico
[ ] Identificar componentes necessários

### 4. Estado do Código (2 min)
[ ] git status
[ ] Verificar se há trabalho incompleto
[ ] Rodar build para verificar estado

### 5. Declarar Início
Atualizar STATE.md com:
- Data da sessão
- Épico atual
- Story atual
- Status: IN_PROGRESS
```

### Comando de Início

```bash
# No início de cada sessão, executar:
cd D:/genesis-meta-system/branding-os
cat .state/STATE.md
git status
npm run build 2>/dev/null || echo "Projeto ainda não inicializado"
```

---

## Procedimento 2: Desenvolvimento de Épico

### Estrutura de um Épico

```
ÉPICO
├── Story 1
│   ├── Task 1.1
│   ├── Task 1.2
│   └── Acceptance Criteria
├── Story 2
│   └── ...
└── Definition of Done
```

### Fluxo de Trabalho

```
┌─────────────────┐
│  Ler Story      │
└────────┬────────┘
         v
┌─────────────────┐
│  Implementar    │
│  Task por Task  │
└────────┬────────┘
         v
┌─────────────────┐
│  Validar AC     │ (Acceptance Criteria)
└────────┬────────┘
         v
┌─────────────────┐
│  Commit Story   │
└────────┬────────┘
         v
┌─────────────────┐
│  Próxima Story  │
│  ou Checkpoint  │
└─────────────────┘
```

### Regras Durante Desenvolvimento

1. **Uma story por vez** - Não pule entre stories
2. **Commits atômicos** - Um commit por story completada
3. **Testar antes de commitar** - Build + lint obrigatórios
4. **Consultar Design System** - Antes de criar qualquer componente
5. **Não criar débito técnico** - Se não der tempo, documentar e parar

### Padrão de Commit

```
feat(epic-id): descrição da story

- Task 1 completada
- Task 2 completada

Story: STORY-ID
Epic: EPIC-ID
```

---

## Procedimento 3: Checkpoint de Épico

> Executar ao completar um épico OU ao final de sessão com épico incompleto.

### Checklist de Checkpoint

```markdown
## CHECKPOINT - Épico [ID]

### 1. Estado do Código
[ ] Build passa sem erros
[ ] Lint passa sem erros
[ ] Testes passam (se existirem)

### 2. Documentação
[ ] STATE.md atualizado
[ ] CHANGELOG.md atualizado
[ ] Session log criado

### 3. Git
[ ] Todas as mudanças commitadas
[ ] Mensagens de commit padronizadas
[ ] Branch correta

### 4. Handoff
[ ] Próximo épico identificado
[ ] Bloqueios documentados
[ ] Débitos técnicos listados
```

### Template de Atualização STATE.md

```markdown
## Sessão Atual

| Campo | Valor |
|-------|-------|
| **Data** | YYYY-MM-DD |
| **Épico** | EPIC-ID - Nome |
| **Story** | Última completada ou em progresso |
| **Status** | COMPLETED / IN_PROGRESS |
| **Agente AIOS** | @dev / @orchestrator |

## Notas da Última Sessão

> Resumo do que foi feito, decisões tomadas, bloqueios encontrados.
```

---

## Procedimento 4: Fim de Sessão

### Passos Obrigatórios

```markdown
## FIM DE SESSÃO - Checklist

### 1. Código (5 min)
[ ] Salvar todos os arquivos
[ ] npm run build (verificar se passa)
[ ] npm run lint (verificar se passa)
[ ] git add + commit se houver mudanças

### 2. Documentação (10 min)
[ ] Atualizar .state/STATE.md
    - Progresso do épico
    - Status das stories
    - Notas da sessão
    - Próximos passos
[ ] Atualizar .state/CHANGELOG.md
    - Adicionar entrada da sessão
[ ] Criar session log em .state/sessions/

### 3. Session Log (5 min)
Criar arquivo: .state/sessions/YYYY-MM-DD-[descrição].md
Com:
- Resumo do trabalho
- Arquivos modificados
- Decisões tomadas
- Próximos passos
- Bloqueios (se houver)

### 4. Commit Final
git add .state/
git commit -m "docs: session checkpoint YYYY-MM-DD"
```

---

## Procedimento 5: Transferência de Contexto

> Para quando uma nova sessão Claude precisa continuar o trabalho.

### Prompt de Inicialização

```markdown
# Continuação do Projeto Branding OS

## Contexto Obrigatório
Leia os seguintes arquivos na ordem:

1. D:/genesis-meta-system/branding-os/.state/STATE.md
2. D:/genesis-meta-system/branding-os/.state/CHANGELOG.md (última entrada)
3. D:/genesis-meta-system/branding-os/.state/sessions/ (último arquivo)

## Design System
Consulte durante desenvolvimento:
D:/design-system-academia-lendária (1)/academia-lendaria-skill/

## Tarefa
Continue o desenvolvimento a partir do ponto indicado em STATE.md.
Siga os procedimentos em .state/PROCEDURES.md.
```

### Informações Mínimas para Transferência

1. **Onde parou** - Épico + Story + Task
2. **Estado do código** - Compila? Testes passam?
3. **Bloqueios** - Algo impedindo progresso?
4. **Decisões pendentes** - Algo que precisa de input?
5. **Próximo passo concreto** - Exatamente o que fazer

---

## Procedimento 6: Consulta ao Design System

### Quando Consultar

- Antes de criar qualquer componente novo
- Ao definir cores, tipografia, espaçamento
- Ao implementar layouts de página
- Quando tiver dúvida sobre padrão visual

### Hierarquia de Consulta

```
1. SKILL.md (quick reference)
   ↓ Se precisar de mais detalhes
2. references/design-tokens.md (tokens específicos)
   ↓ Se precisar de componentes
3. references/components.md (implementação)
   ↓ Se precisar de layouts
4. references/patterns.md (composições)
   ↓ Se precisar de princípios
5. references/excellence.md (filosofia)
```

### Checklist de Validação Visual

```markdown
[ ] Cor primária (#C9B298) <= 8% da área
[ ] Tipografia: Inter (UI) + Source Serif 4 (corpo)
[ ] Espaçamento em múltiplos de 8px
[ ] Ícones são Flaticon UIcons
[ ] Zero emojis
[ ] Dark mode implementado
[ ] Border radius consistente
[ ] Animações com propósito
```

---

## Procedimento 7: Resolução de Bloqueios

### Tipos de Bloqueio

| Tipo | Ação |
|------|------|
| **Técnico** | Documentar, tentar alternativa, ou pedir ajuda |
| **Decisão** | Documentar opções, escolher uma, anotar para revisão |
| **Dependência** | Pular para outro épico se possível |
| **Contexto** | Reler documentação relevante |

### Documentar Bloqueio

```markdown
## BLOQUEIO - YYYY-MM-DD

**Tipo**: Técnico / Decisão / Dependência / Contexto

**Descrição**: O que está bloqueando

**Tentativas**: O que já foi tentado

**Opções**:
1. Opção A - prós/contras
2. Opção B - prós/contras

**Decisão Temporária**: O que fazer agora

**Ação Futura**: O que resolver depois
```

---

## Quick Reference

### Comandos Frequentes

```bash
# Início de sessão
cat .state/STATE.md

# Durante desenvolvimento
npm run dev
npm run build
npm run lint

# Fim de sessão
git status
git add .
git commit -m "feat(epic): description"
```

### Arquivos Importantes

```
.state/STATE.md      # O que está acontecendo AGORA
.state/CHANGELOG.md  # O que JÁ aconteceu
.state/sessions/     # Detalhes de cada sessão
.state/PROCEDURES.md # COMO fazer as coisas
```

---

*Versão: 1.0.0 | Última atualização: 2024-12-09*
