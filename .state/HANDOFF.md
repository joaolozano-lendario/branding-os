# BRANDING OS - Handoff Template

> **Use este template** para iniciar uma nova sessão Claude.
> Cole este conteúdo no início da conversa para transferir contexto.

---

## Prompt de Continuação

```markdown
# Continuar Desenvolvimento: Branding OS

## 1. LEITURA OBRIGATÓRIA (nesta ordem)

Leia completamente estes arquivos antes de fazer qualquer coisa:

1. **Estado Atual**:
   D:/genesis-meta-system/branding-os/.state/STATE.md

2. **Última Sessão**:
   D:/genesis-meta-system/branding-os/.state/sessions/[mais-recente].md

3. **Changelog** (última entrada):
   D:/genesis-meta-system/branding-os/.state/CHANGELOG.md

4. **Procedimentos**:
   D:/genesis-meta-system/branding-os/.state/PROCEDURES.md

## 2. DESIGN SYSTEM (consultar durante desenvolvimento)

D:/design-system-academia-lendária (1)/academia-lendaria-skill/
├── SKILL.md                    # Quick reference
└── references/
    ├── design-tokens.md        # Cores, tipografia
    ├── components.md           # 54 componentes
    ├── patterns.md             # Layouts prontos
    └── excellence.md           # Princípios

## 3. DOCUMENTAÇÃO DO PROJETO

D:/genesis-meta-system/branding-os/docs/
├── prd/BRANDING-OS-PRD.md              # Requisitos
├── architecture/SYSTEM-ARCHITECTURE.md  # Arquitetura
├── stories/MVP-EPICS-STORIES.md        # Backlog
└── testing/TEST-PLAN.md                # Testes

## 4. TAREFA

Continue o desenvolvimento a partir do ponto indicado em STATE.md.
Siga os procedimentos documentados.
Ao finalizar, atualize STATE.md e crie session log.

## 5. REGRAS INVIOLÁVEIS

- Design System Academia Lendária obrigatório
- Cor primária (#C9B298) máx 8% da área
- NUNCA usar emojis na interface
- NUNCA usar Lucide/FontAwesome (apenas Flaticon UIcons)
- Dark mode obrigatório
- Tipografia: Inter (UI) + Source Serif 4 (corpo)
- Espaçamento em múltiplos de 8px
```

---

## Checklist de Handoff

### Antes de Encerrar Sessão

```markdown
[ ] STATE.md atualizado com:
    [ ] Épico atual e status
    [ ] Stories completadas/em progresso
    [ ] Bloqueios (se houver)
    [ ] Notas da sessão
    [ ] Próximos passos claros

[ ] CHANGELOG.md atualizado com:
    [ ] Nova entrada datada
    [ ] Arquivos modificados
    [ ] Decisões tomadas

[ ] Session log criado em:
    .state/sessions/YYYY-MM-DD-[descrição].md

[ ] Código commitado:
    git add . && git commit -m "..."
```

### Para Próxima Sessão

A próxima sessão deve conseguir:

1. **Entender onde parou** - Lendo STATE.md
2. **Saber o que foi feito** - Lendo CHANGELOG.md
3. **Ver detalhes** - Lendo session log
4. **Continuar imediatamente** - Seguindo "Próximos Passos"

---

## Formato do Session Log

```markdown
# Session Log: YYYY-MM-DD

## Resumo
[2-3 frases sobre o que foi feito]

## Épico/Story
- Épico: E[X] - [Nome]
- Story: [ID] - [Nome]
- Status: COMPLETED / IN_PROGRESS / BLOCKED

## Trabalho Realizado
1. [Item]
2. [Item]
3. [Item]

## Arquivos Modificados
- `src/...` - [descrição]
- `src/...` - [descrição]

## Decisões Tomadas
1. [Decisão] - [Justificativa]

## Bloqueios / Issues
- [Se houver]

## Próximos Passos
1. [Ação específica]
2. [Ação específica]
3. [Ação específica]

## Notas para Próxima Sessão
[Qualquer contexto importante]
```

---

## Quick Start Nova Sessão

```bash
# 1. Navegar para o projeto
cd D:/genesis-meta-system/branding-os

# 2. Verificar estado
cat .state/STATE.md

# 3. Ver último log
ls -la .state/sessions/
cat .state/sessions/[ultimo-arquivo]

# 4. Estado do git
git status
git log --oneline -5

# 5. Verificar build
npm run build
```

---

## Mapa Mental do Projeto

```
BRANDING OS
│
├── .state/              ← FONTE DE VERDADE (ler primeiro)
│   ├── STATE.md         ← Estado atual
│   ├── CHANGELOG.md     ← Histórico
│   ├── PROCEDURES.md    ← Como fazer
│   ├── HANDOFF.md       ← Este arquivo
│   ├── EPIC-TEMPLATE.md ← Template para épicos
│   ├── sessions/        ← Logs detalhados
│   └── epics/           ← Épicos completados
│
├── docs/                ← DOCUMENTAÇÃO DO PRODUTO
│   ├── prd/             ← Requisitos
│   ├── architecture/    ← Arquitetura
│   ├── stories/         ← Backlog
│   └── testing/         ← Testes
│
├── src/                 ← CÓDIGO (quando existir)
│   ├── components/
│   ├── pages/
│   ├── stores/
│   ├── hooks/
│   └── lib/
│
└── DESIGN SYSTEM        ← REFERÊNCIA EXTERNA
    D:/design-system-academia-lendária (1)/academia-lendaria-skill/
```

---

## Contacts / Escalation

- **Product Owner**: João
- **Repositório**: D:/genesis-meta-system/branding-os
- **Design System**: D:/design-system-academia-lendária (1)/academia-lendaria-skill/

---

*Template Version: 1.0.0*
*Last Updated: 2024-12-09*
