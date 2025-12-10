# Template: Documentação de Épico Completado

> Copie este template para documentar cada épico ao finalizá-lo.
> Salvar como: `.state/epics/E[X]-[nome-do-epico].md`

---

# Épico E[X]: [Nome do Épico]

## Metadata

| Campo | Valor |
|-------|-------|
| **ID** | E[X] |
| **Nome** | [Nome do Épico] |
| **Sprint** | [1/2/3] |
| **Início** | YYYY-MM-DD |
| **Conclusão** | YYYY-MM-DD |
| **Sessões** | [número] |
| **Status** | COMPLETED |

---

## Objetivo

> Descrição em 2-3 frases do que este épico entregou.

---

## Stories Completadas

### Story [X.1]: [Nome]
- **Status**: COMPLETED
- **Arquivos**:
  - `src/...`
  - `src/...`
- **Notas**: [Observações relevantes]

### Story [X.2]: [Nome]
- **Status**: COMPLETED
- **Arquivos**:
  - `src/...`
- **Notas**: [Observações relevantes]

---

## Decisões Técnicas

### Decisão 1: [Título]
- **Contexto**: Por que a decisão foi necessária
- **Opções Consideradas**:
  1. Opção A
  2. Opção B
- **Decisão**: Opção escolhida
- **Justificativa**: Por que esta opção

### Decisão 2: [Título]
- ...

---

## Arquivos Criados/Modificados

```
src/
├── components/
│   ├── [novo-componente].tsx (CREATED)
│   └── [componente-modificado].tsx (MODIFIED)
├── hooks/
│   └── [novo-hook].ts (CREATED)
├── stores/
│   └── [store].ts (MODIFIED)
└── pages/
    └── [page].tsx (CREATED)
```

---

## Testes

| Tipo | Quantidade | Status |
|------|------------|--------|
| Unit Tests | [X] | PASS |
| Integration | [X] | PASS |
| E2E | [X] | PASS |

### Test Coverage
- **Statements**: XX%
- **Branches**: XX%
- **Functions**: XX%
- **Lines**: XX%

---

## Design System Compliance

- [x] Cor primária <= 8%
- [x] Tipografia correta (Inter + Source Serif 4)
- [x] Espaçamento em múltiplos de 8px
- [x] Ícones Flaticon UIcons
- [x] Zero emojis
- [x] Dark mode
- [x] Border radius consistente

---

## Débitos Técnicos

| ID | Descrição | Prioridade | Épico Sugerido |
|----|-----------|------------|----------------|
| TD-001 | [Descrição] | HIGH/MED/LOW | E[X] |

---

## Métricas

| Métrica | Valor |
|---------|-------|
| **Linhas de código** | [X] |
| **Componentes criados** | [X] |
| **Commits** | [X] |
| **Build time** | [X]ms |
| **Bundle size** | [X]KB |

---

## Screenshots / Evidências

> Adicionar screenshots ou links para demonstrar o trabalho completado.

### [Feature 1]
![Descrição](./screenshots/...)

### [Feature 2]
![Descrição](./screenshots/...)

---

## Aprendizados

### O que funcionou bem
1. [Item]
2. [Item]

### O que poderia melhorar
1. [Item]
2. [Item]

### Notas para próximos épicos
1. [Item]
2. [Item]

---

## Dependências para Próximo Épico

- [x] [Dependência 1] - Completada neste épico
- [ ] [Dependência 2] - Pendente em E[Y]

---

## Commits do Épico

```
[hash] feat(e[x]): story [x.1] - [descrição]
[hash] feat(e[x]): story [x.2] - [descrição]
[hash] test(e[x]): add tests for [feature]
[hash] docs(e[x]): update documentation
```

---

*Documentado por: [Agente AIOS]*
*Data: YYYY-MM-DD*
