# Protocolo de Encerramento de Épico

> **EXECUTAR AO FINAL DE CADA ÉPICO** - Este protocolo garante transferência completa entre sessões.
> **Regra**: 1 Épico = 1 Sessão. Ao completar um épico, executar este protocolo.

---

## Checklist de Encerramento

### 1. Validação do Épico

```markdown
[ ] Todas as stories do épico completadas
[ ] Todos os acceptance criteria validados
[ ] @qa executou review final
[ ] Build passa
[ ] Lint passa
[ ] TypeCheck passa
```

### 2. Atualização de Estado

```markdown
[ ] STATE.md atualizado com:
    - Quick Status (proximo_epico, proximo_story)
    - Progresso por Épico (status COMPLETED)
    - Notas da Última Sessão
    - Próximos Passos Imediatos

[ ] CHANGELOG.md atualizado com mudanças do épico

[ ] Session log criado em .state/sessions/
    - Formato: YYYY-MM-DD-eX-nome-do-epico.md
```

### 3. Documentação de Épico

```markdown
[ ] Criar .state/epics/EX-nome-do-epico.md com:
    - Resumo do épico
    - Stories completadas
    - Arquivos criados/modificados
    - Decisões tomadas
    - Lições aprendidas
```

### 4. Preparação para Próxima Sessão

```markdown
[ ] INIT-PROMPT.md atualizado com:
    - Próximo épico
    - Próxima story
    - Arquivos para ler
    - Workflow esperado

[ ] Verificar que todos os arquivos estão salvos
[ ] Verificar que o app funciona (npm run dev)
```

---

## Template de Session Log

```markdown
# Session Log: YYYY-MM-DD - EX Nome do Épico

## Resumo
{Descrição breve do que foi feito}

## Épico/Story
- **Épico**: EX - Nome
- **Stories Completadas**: X/Y
- **Status**: COMPLETED

## Trabalho Realizado
### 1. {Categoria}
- {Item realizado}
- {Item realizado}

## Arquivos Criados/Modificados
| Arquivo | Ação | Descrição |
|---------|------|-----------|
| | | |

## Decisões Tomadas
- {Decisão}: {Rationale}

## Validações
| Check | Resultado |
|-------|-----------|
| Build | PASS/FAIL |
| Lint | PASS/FAIL |
| TypeCheck | PASS/FAIL |
| QA Review | PASS/FAIL |

## Próximos Passos
1. {Próximo épico}
2. {Primeira story}

---
*Sessão: @orchestrator + @dev + @qa*
*Data: YYYY-MM-DD*
```

---

## Template de Epic Documentation

```markdown
# EX - Nome do Épico

## Status: COMPLETED
**Data Início**: YYYY-MM-DD
**Data Fim**: YYYY-MM-DD
**Session**: {session log file}

## Stories Completadas

| Story | Nome | SP | Status |
|-------|------|-----|--------|
| | | | DONE |

## Entregas

| Item | Descrição |
|------|-----------|
| | |

## Arquivos Criados

```
path/to/files/
├── file1.tsx
└── file2.ts
```

## Decisões Arquiteturais
- {Decisão}: {Justificativa}

## Lições Aprendidas
- {Lição}

## Débito Técnico (se houver)
- {Item}: {Descrição}

---
*Épico completado em: YYYY-MM-DD*
```

---

## Fluxo de Encerramento

```
ÉPICO COMPLETADO
       │
       ▼
┌──────────────────┐
│ 1. Validar       │
│    - Stories OK  │
│    - QA Review   │
│    - Build/Lint  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 2. Atualizar     │
│    - STATE.md    │
│    - CHANGELOG   │
│    - Session Log │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. Documentar    │
│    - Epic file   │
│    - Decisões    │
│    - Lições      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 4. Preparar      │
│    - INIT-PROMPT │
│    - Próximo     │
│      épico       │
└────────┬─────────┘
         │
         ▼
   SESSÃO ENCERRADA
   (Pronto para próxima)
```

---

## Comando Rápido

Ao final de cada épico, peça ao Claude:

```
Épico EX completado. Execute o protocolo de encerramento:
1. Atualize STATE.md
2. Crie session log
3. Documente o épico em .state/epics/
4. Atualize INIT-PROMPT.md para próxima sessão
5. Me dê o prompt de continuação
```

---

## Regras

1. **1 Épico = 1 Sessão** - Não iniciar novo épico na mesma sessão
2. **Sempre executar protocolo** - Mesmo se épico for simples
3. **INIT-PROMPT sempre atualizado** - Próxima sessão deve ter contexto completo
4. **STATE.md é fonte de verdade** - Sempre atualizar primeiro

---

*Protocolo v1.0 | Branding OS | 2025-12-09*
