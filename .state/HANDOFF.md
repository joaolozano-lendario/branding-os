# BRANDING OS - Session Handoff

> **COLE O PROMPT ABAIXO** no início da próxima sessão Claude Code.
> Última atualização: 2025-12-11

---

## PROMPT DE CONTINUAÇÃO

```
## TAREFA: Continuar UI/UX Polish do Branding OS

Leia primeiro:
1. D:/genesis-meta-system/branding-os/.state/HANDOFF.md
2. D:/genesis-meta-system/branding-os/.state/STATE.md

### Contexto
O Branding OS está com o wizard V2 (/app/generate-v2) implementado pixel-perfect do Figma.
Agora preciso que você aplique o MESMO design system em todas as outras páginas do app.

### Design System (FIGMA SPECS EXATAS)

#### Cores
| Elemento | Hex | Uso |
|----------|-----|-----|
| Primary | #5856D6 | Botões ativos, ícones, step atual |
| Background | #FFFFFF | Fundo principal |
| Card inactive | #F8F8F8 | Cards não selecionados, stepper inativo |
| Text inactive | #888888 | Texto secundário, placeholders |
| Text disabled | #C8C8C8 | Texto desabilitado |
| Border | #E8E8E8 | Bordas de inputs, cards |
| Selected card text | #312D65 | Texto dentro de card selecionado |

#### Typography (Inter only)
| Elemento | Weight | Size |
|----------|--------|------|
| Title principal | SemiBold 600 | 32px |
| Subtitle | Medium 500 | 16px |
| Card title | SemiBold 600 | 16px |
| Card description | Medium 500 | 12px |
| Label | SemiBold 600 | 12px |
| Input placeholder | Medium 500 | 16px |
| Button | SemiBold 600 | 14px |
| Stepper label | SemiBold 600 | 12px |

#### Componentes
| Componente | Specs |
|------------|-------|
| Stepper cards | 128x128px, gap 6px, radius 8px |
| Asset cards | 194x280px, gap 8px, radius 8px |
| Icon container | 42x42px, radius full |
| Icon size | 18x18px |
| Input height | 62px, radius 8px |
| Button pill | radius full, height 41px |

### Figma Access (para extrair mais specs se necessário)
- Token: figd_GLhqcYCuiaMTGL0UFv-sKoy5rbfvPCepoqVB6Cbr
- File: b9KEYc9qrAJfkJA4wNfcrd
- Dev Mode: https://www.figma.com/design/b9KEYc9qrAJfkJA4wNfcrd/CreatorOs?node-id=12-320&m=dev

### Tarefas Pendentes
1. Criar Home/Dashboard page conforme PRD (seção 5.2):
   - Recent Assets: Últimos 10 criados
   - Quick Actions: New Asset, Brand Config
   - Performance: Top assets
2. Atualizar BrandDashboard.tsx com design system Figma
3. Atualizar Landing.tsx
4. Atualizar Login.tsx e Register.tsx
5. Atualizar AssetLibrary.tsx
6. Atualizar Settings.tsx
7. Atualizar AppLayout.tsx (sidebar)

### Regras INVIOLÁVEIS
- NUNCA emojis na UI
- NUNCA outras icon libraries (só Flaticon UIcons via componente Icon)
- SEMPRE manter lógica funcional existente
- SEMPRE usar cores exatas: text-[#5856D6], bg-[#F8F8F8], etc.
- SEMPRE rodar typecheck após mudanças

### Comandos
cd D:/genesis-meta-system/branding-os/app
npm run dev          # localhost:5173
npm run typecheck    # Verificar tipos

### Rotas do App
- /app/generate-v2 → Wizard V2 (JÁ ATUALIZADO - referência)
- /app/dashboard → BrandDashboard
- /app/library → AssetLibrary
- /app/settings → Settings
```

---

## ESTADO ATUAL (2025-12-11)

### O QUE FOI FEITO NESTA SESSÃO

#### 1. Integração Figma API
- Conectou via API com token de acesso
- Extraiu specs exatas de cores, tipografia, espaçamentos
- Mapeou Node IDs: 12-320 (Tela 1), 12-420 (Tela 2)

#### 2. Arquivos ATUALIZADOS (pixel-perfect)
```
app/src/components/wizard/
├── WizardStepIndicator.tsx  ✅
├── AssetTypeStep.tsx        ✅
├── ProductContextStep.tsx   ✅
├── GoalAngleStep.tsx        ✅ (parcial)

app/src/pages/
└── GenerateWizardV2.tsx     ✅ (navegação pixel-perfect)
```

#### 3. TypeCheck: PASSING

### ARQUIVOS QUE FALTAM ATUALIZAR
| Página | Arquivo | Status |
|--------|---------|--------|
| BrandDashboard | pages/BrandDashboard.tsx | Pendente |
| Landing | pages/Landing.tsx | Pendente |
| Login | pages/Login.tsx | Pendente |
| Register | pages/Register.tsx | Pendente |
| AssetLibrary | pages/AssetLibrary.tsx | Pendente |
| Settings | pages/Settings.tsx | Pendente |
| AppLayout | layouts/AppLayout.tsx | Pendente |

---

## COMO EXTRAIR MAIS SPECS DO FIGMA

```bash
# Listar todos os frames Interface-*
curl -s -H "X-Figma-Token: figd_GLhqcYCuiaMTGL0UFv-sKoy5rbfvPCepoqVB6Cbr" \
  "https://api.figma.com/v1/files/b9KEYc9qrAJfkJA4wNfcrd" | \
  python3 -c "
import json, sys
data = json.load(sys.stdin)
def find(node):
    if 'Interface' in node.get('name', ''):
        print(f\"{node.get('id')}: {node.get('name')}\")
    for c in node.get('children', []): find(c)
find(data.get('document', {}))
"

# Extrair specs de um frame específico
curl -s -H "X-Figma-Token: figd_GLhqcYCuiaMTGL0UFv-sKoy5rbfvPCepoqVB6Cbr" \
  "https://api.figma.com/v1/files/b9KEYc9qrAJfkJA4wNfcrd/nodes?ids=NODE_ID_AQUI"
```

### Node IDs conhecidos:
- 12-320: Interface-01-Select (Asset Type)
- 12-420: Interface-02 (Context Form)
- 28-735: Interface-06-Gerar
- 28-877: Interface-06-Gerar-2

---

## REFERÊNCIA: Padrão Visual do GenerateWizardV2

Este arquivo já está pixel-perfect e serve como referência:

```tsx
// Cores
bg-white                    // Background principal
bg-[#5856D6]               // Primary/ativo
bg-[#F8F8F8]               // Card inativo
text-[#888888]             // Texto secundário
text-[#C8C8C8]             // Texto desabilitado
border-[#E8E8E8]           // Bordas

// Botões Pill
h-[41px] px-[18px] rounded-full  // Dimensões
bg-[#5856D6] text-white          // Primary
bg-[#F8F8F8] border-[#E8E8E8]    // Secondary

// Typography
text-[32px] font-semibold        // Título
text-base font-medium            // Subtítulo (16px)
text-xs font-semibold            // Labels (12px)
text-sm font-semibold            // Buttons (14px)

// Inputs
h-[62px] rounded-lg border-[#E8E8E8]
```

---

## QUICK START

```bash
cd D:/genesis-meta-system/branding-os/app
npm run dev       # localhost:5173
npm run typecheck # Verificar tipos
```

---

*Last Updated: 2025-12-11 - UI/UX Polish Session*
