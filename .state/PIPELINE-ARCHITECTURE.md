# BRANDING OS - Pipeline Architecture v2.0

> **FONTE DE VERDADE** para a lógica do sistema de geração de assets.
> Este documento define EXATAMENTE como cada engrenagem funciona.

---

## O ÂMAGO DO PROBLEMA

### O que a Erika (Marketing Manager) quer fazer:
1. Abrir o app
2. Dizer: "Preciso de um carousel sobre o lançamento do curso Segundo Cérebro"
3. Em 5 minutos ter um carousel de 10 slides pronto para postar

### O que acontece HOJE (sem Branding OS):
```
Erika escreve brief (30min)
    ↓
Espera designer (1-2 dias)
    ↓
Designer cria draft (90min)
    ↓
Review cycle (3-5 rounds × 45min)
    ↓
Resultado: 3-5 dias, 40% de chance de violar brand guidelines
```

### O que DEVE acontecer (com Branding OS):
```
Erika abre wizard (30s)
    ↓
Preenche contexto básico (2min)
    ↓
IA orquestra 6 agentes (2min)
    ↓
Carousel pronto, 100% on-brand (30s review)
    ↓
Export e publica
```

**Tempo total: <5 minutos. Zero violações de brand.**

---

## A VERDADE FUNDAMENTAL

O Branding OS não é um "gerador de texto com IA".

É um **sistema de produção industrial** que transforma:
- **INPUT:** Brief + Brand DNA configurado
- **OUTPUT:** Asset visual pronto para publicação

A diferença crucial: **O sistema CONHECE a marca profundamente**.

Ele não "tenta adivinhar" o estilo. Ele **aplica regras determinísticas** combinadas com **criatividade controlada**.

---

## OS 3 PILARES DA CONSISTÊNCIA

### Pilar 1: Brand DNA (Configuração)
O que o JP (Brand Strategist) configurou:
- Cores EXATAS (hex codes)
- Fontes EXATAS (families, weights)
- Voz da marca (atributos, tom, exemplos)
- Exemplos de assets que funcionam

### Pilar 2: Templates Estruturados
Layouts pré-definidos que GARANTEM:
- Hierarquia visual correta
- Espaçamento consistente (8px grid)
- Posicionamento de elementos
- Fluxo narrativo de slides

### Pilar 3: Pipeline Determinístico
Cada agente tem um papel ESPECÍFICO:
- Recebe input estruturado
- Processa com criatividade controlada
- Produz output estruturado
- Passa para o próximo agente

---

## ARQUITETURA DO PIPELINE v2.0

### Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INPUT                                │
│  (Asset Type + Context + Goal + Content + Brand Config)         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENT 1: BRAND STRATEGIST                                       │
│  ─────────────────────────────────────────────────────────────  │
│  Decisões estratégicas de alto nível:                           │
│  • Qual template usar? (baseado no goal + asset type)           │
│  • Qual ângulo narrativo? (transformação, prova social, etc)    │
│  • Quantos slides? (baseado no conteúdo)                        │
│  • Quais constraints para os outros agentes?                    │
│                                                                  │
│  OUTPUT: StrategyBlueprint                                       │
│  {                                                               │
│    template: "product-launch",                                   │
│    slideCount: 8,                                                │
│    narrativeAngle: "transformation-story",                       │
│    emotionalArc: ["curiosity", "pain", "hope", "proof", "cta"], │
│    constraints: {                                                │
│      tone: "empowering-but-not-pushy",                          │
│      visualEnergy: "dynamic",                                    │
│      ctaStyle: "urgency-with-value"                             │
│    }                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENT 2: STORY ARCHITECT                                        │
│  ─────────────────────────────────────────────────────────────  │
│  Constrói a estrutura narrativa slide-by-slide:                 │
│  • Define o propósito de CADA slide                             │
│  • Cria o "esqueleto" do conteúdo                               │
│  • Garante progressão lógica                                    │
│                                                                  │
│  INPUT: StrategyBlueprint + UserContent + BrandVoice            │
│                                                                  │
│  OUTPUT: StoryStructure                                          │
│  {                                                               │
│    slides: [                                                     │
│      {                                                           │
│        index: 1,                                                 │
│        type: "cover",                                            │
│        purpose: "Hook - criar curiosidade",                     │
│        emotionalBeat: "curiosity",                              │
│        contentBrief: "Pergunta provocativa sobre produtividade",│
│        visualDirection: "bold-headline-centered"                │
│      },                                                          │
│      {                                                           │
│        index: 2,                                                 │
│        type: "problem",                                          │
│        purpose: "Agitar a dor",                                 │
│        emotionalBeat: "pain",                                   │
│        contentBrief: "Estatística impactante sobre tempo perdido"│
│        visualDirection: "stat-highlight"                        │
│      },                                                          │
│      // ... mais slides                                          │
│    ]                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENT 3: COPYWRITER                                             │
│  ─────────────────────────────────────────────────────────────  │
│  Escreve o copy ESPECÍFICO para cada slide:                     │
│  • Segue a estrutura definida pelo Story Architect              │
│  • Aplica a voz da marca EXATAMENTE                             │
│  • Respeita limites de caracteres por elemento                  │
│                                                                  │
│  INPUT: StoryStructure + BrandVoice + ToneGuidelines            │
│                                                                  │
│  OUTPUT: SlidesCopy                                              │
│  {                                                               │
│    slides: [                                                     │
│      {                                                           │
│        index: 1,                                                 │
│        headline: "Você sabia que perde 2h por dia?",            │
│        subheadline: null,                                        │
│        body: null,                                               │
│        cta: null,                                                │
│        caption: "Swipe para descobrir a solução →"              │
│      },                                                          │
│      {                                                           │
│        index: 2,                                                 │
│        headline: "730 horas por ano",                           │
│        subheadline: "É isso que você perde procurando informação"│
│        body: "Estudos mostram que profissionais gastam...",     │
│        cta: null,                                                │
│        caption: null                                             │
│      },                                                          │
│      // ... mais slides                                          │
│    ]                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENT 4: VISUAL COMPOSITOR                                      │
│  ─────────────────────────────────────────────────────────────  │
│  Define especificações visuais EXATAS para cada slide:          │
│  • Aplica cores do brand (HEX exatos)                           │
│  • Define tipografia (font + size + weight)                     │
│  • Especifica layout (posições, alinhamentos)                   │
│  • Seleciona elementos visuais (ícones, backgrounds)            │
│                                                                  │
│  INPUT: SlidesCopy + VisualIdentity + Template                  │
│                                                                  │
│  OUTPUT: VisualSpecification                                     │
│  {                                                               │
│    slides: [                                                     │
│      {                                                           │
│        index: 1,                                                 │
│        canvas: { width: 1080, height: 1080 },                   │
│        background: {                                             │
│          type: "solid",                                          │
│          color: "#1A1A1A"                                        │
│        },                                                        │
│        elements: [                                               │
│          {                                                       │
│            type: "text",                                         │
│            role: "headline",                                     │
│            content: "Você sabia que perde 2h por dia?",         │
│            style: {                                              │
│              fontFamily: "Inter",                                │
│              fontSize: "48px",                                   │
│              fontWeight: 700,                                    │
│              color: "#FFFFFF",                                   │
│              textAlign: "center",                                │
│              lineHeight: 1.2                                     │
│            },                                                    │
│            position: {                                           │
│              x: 80,                                              │
│              y: 400,                                             │
│              width: 920,                                         │
│              height: "auto"                                      │
│            }                                                     │
│          },                                                      │
│          {                                                       │
│            type: "text",                                         │
│            role: "caption",                                      │
│            content: "Swipe para descobrir a solução →",         │
│            style: {                                              │
│              fontFamily: "Source Serif 4",                       │
│              fontSize: "18px",                                   │
│              fontWeight: 400,                                    │
│              color: "#C9B298",                                   │
│              textAlign: "center"                                 │
│            },                                                    │
│            position: {                                           │
│              x: 80,                                              │
│              y: 950,                                             │
│              width: 920,                                         │
│              height: "auto"                                      │
│            }                                                     │
│          }                                                       │
│        ]                                                         │
│      }                                                           │
│    ]                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENT 5: QUALITY VALIDATOR                                      │
│  ─────────────────────────────────────────────────────────────  │
│  Validação TÉCNICA (não narrativa):                             │
│  • Cores usadas == cores do brand? (match exato de HEX)         │
│  • Fontes corretas? (family + weight permitidos)                │
│  • Espaçamentos em múltiplos de 8px?                            │
│  • Contrast ratio >= 4.5:1? (WCAG AA)                           │
│  • Hierarquia visual correta? (headline > body > caption)       │
│  • Tom alinhado com brand voice?                                │
│                                                                  │
│  INPUT: VisualSpecification + BrandConfig                       │
│                                                                  │
│  OUTPUT: QualityReport                                           │
│  {                                                               │
│    passed: true,                                                 │
│    score: 98,                                                    │
│    checks: [                                                     │
│      { rule: "color-palette", passed: true, details: "All colors match brand" },│
│      { rule: "typography", passed: true, details: "Fonts correct" },│
│      { rule: "spacing-grid", passed: true, details: "8px grid compliant" },│
│      { rule: "contrast", passed: true, details: "All ratios >= 4.5:1" },│
│      { rule: "voice-tone", passed: true, details: "Matches 'empowering' attribute" }│
│    ],                                                            │
│    warnings: [],                                                 │
│    criticalIssues: []                                            │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENT 6: RENDER ENGINE                                          │
│  ─────────────────────────────────────────────────────────────  │
│  Transforma especificações em assets visuais reais:             │
│  • Gera HTML/CSS por slide (renderizável)                       │
│  • Prepara para export (PNG 1080x1080)                          │
│  • Cria pacote de download                                       │
│                                                                  │
│  INPUT: VisualSpecification (validada)                          │
│                                                                  │
│  OUTPUT: RenderOutput                                            │
│  {                                                               │
│    slides: [                                                     │
│      {                                                           │
│        index: 1,                                                 │
│        html: "<div class='slide' style='...'>...</div>",        │
│        preview: "data:image/png;base64,..."                     │
│      }                                                           │
│    ],                                                            │
│    exportFormats: ["png", "html", "pdf"]                        │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## O FLUXO DE DADOS DETALHADO

### Input Inicial (do Wizard)

```typescript
interface PipelineInput {
  // O que o usuário escolheu/preencheu
  assetType: 'carousel' | 'single-post' | 'story'

  context: {
    productName: string        // "Segundo Cérebro"
    productDescription: string // "Curso de produtividade..."
    targetAudience: string     // "Empreendedores digitais"
    keyBenefits: string[]      // ["Economizar tempo", "Organizar ideias"]
  }

  goal: {
    objective: 'awareness' | 'consideration' | 'conversion'
    angle: 'transformation' | 'social-proof' | 'urgency' | 'education'
  }

  content: {
    mainMessage: string        // O que o usuário quer comunicar
    additionalNotes?: string   // Instruções extras
  }

  // Configuração da marca (do brandStore)
  brandConfig: {
    visualIdentity: {
      logo: { url: string | null }
      colors: {
        primary: { hex: string, name: string }
        secondary: { hex: string, name: string }
        accent: { hex: string, name: string }
        background: { hex: string, name: string }
        text: { hex: string, name: string }
      }
      typography: {
        heading: { family: string, weights: number[] }
        body: { family: string, weights: number[] }
      }
    }
    voice: {
      attributes: string[]        // ["empowering", "bold", "educational"]
      toneGuidelines: string[]    // ["Use active voice", "Be direct"]
      copyExamples: Array<{       // Exemplos de copy bom/ruim
        text: string
        isGood: boolean
        context: string
      }>
    }
    examples: Array<{             // Assets de referência
      type: string
      annotation: string
      whatMakesItOnBrand: string
    }>
  }
}
```

### Saída Final (para Preview/Export)

```typescript
interface PipelineOutput {
  success: boolean

  // Metadados da geração
  metadata: {
    generatedAt: Date
    pipelineVersion: string
    totalDuration: number // ms
  }

  // Estratégia usada
  strategy: {
    template: string
    narrativeAngle: string
    slideCount: number
  }

  // Os slides prontos
  slides: Array<{
    index: number
    type: 'cover' | 'content' | 'stat' | 'testimonial' | 'cta'

    // Copy final
    copy: {
      headline?: string
      subheadline?: string
      body?: string
      cta?: string
      caption?: string
    }

    // Visual spec
    visual: {
      background: { type: string, value: string }
      elements: Array<{
        type: string
        content: string
        style: Record<string, string | number>
        position: { x: number, y: number, width: number, height: number | 'auto' }
      }>
    }

    // Renderizado
    render: {
      html: string
      css: string
    }
  }>

  // Relatório de qualidade
  quality: {
    score: number
    passed: boolean
    checks: Array<{ rule: string, passed: boolean, details: string }>
  }
}
```

---

## TEMPLATES: A FUNDAÇÃO

Templates são **estruturas pré-definidas** que garantem consistência.

### Template: Product Launch (8 slides)

```typescript
const productLaunchTemplate = {
  id: 'product-launch',
  name: 'Product Launch',
  description: 'Para lançamentos de produtos/cursos',
  slideCount: 8,
  recommendedFor: ['conversion', 'awareness'],

  slides: [
    {
      index: 1,
      type: 'cover',
      purpose: 'Hook - capturar atenção',
      layout: 'centered-headline',
      requiredElements: ['headline'],
      optionalElements: ['caption'],
      copyConstraints: {
        headline: { maxChars: 60, style: 'question-or-bold-statement' }
      }
    },
    {
      index: 2,
      type: 'problem',
      purpose: 'Agitar a dor do público',
      layout: 'stat-highlight',
      requiredElements: ['headline', 'body'],
      copyConstraints: {
        headline: { maxChars: 30, style: 'impactful-number' },
        body: { maxChars: 120, style: 'explanation' }
      }
    },
    {
      index: 3,
      type: 'problem-expansion',
      purpose: 'Expandir consequências',
      layout: 'bullet-points',
      requiredElements: ['headline', 'bullets'],
      copyConstraints: {
        headline: { maxChars: 40, style: 'consequence-focused' },
        bullets: { count: 3, maxCharsEach: 50 }
      }
    },
    {
      index: 4,
      type: 'solution-intro',
      purpose: 'Apresentar a solução',
      layout: 'centered-with-logo',
      requiredElements: ['headline', 'subheadline'],
      copyConstraints: {
        headline: { maxChars: 40, style: 'solution-reveal' },
        subheadline: { maxChars: 80, style: 'value-proposition' }
      }
    },
    {
      index: 5,
      type: 'benefits',
      purpose: 'Mostrar benefícios',
      layout: 'icon-grid',
      requiredElements: ['headline', 'benefitItems'],
      copyConstraints: {
        headline: { maxChars: 30, style: 'what-you-get' },
        benefitItems: { count: 3, maxCharsEach: 40 }
      }
    },
    {
      index: 6,
      type: 'social-proof',
      purpose: 'Provar que funciona',
      layout: 'testimonial',
      requiredElements: ['quote', 'attribution'],
      copyConstraints: {
        quote: { maxChars: 150, style: 'result-focused' },
        attribution: { maxChars: 30 }
      }
    },
    {
      index: 7,
      type: 'offer',
      purpose: 'Apresentar oferta',
      layout: 'offer-box',
      requiredElements: ['headline', 'priceInfo', 'urgency'],
      copyConstraints: {
        headline: { maxChars: 30, style: 'offer-headline' },
        priceInfo: { maxChars: 40 },
        urgency: { maxChars: 50, style: 'scarcity' }
      }
    },
    {
      index: 8,
      type: 'cta',
      purpose: 'Call to action final',
      layout: 'cta-focused',
      requiredElements: ['headline', 'cta', 'caption'],
      copyConstraints: {
        headline: { maxChars: 40, style: 'action-oriented' },
        cta: { maxChars: 25, style: 'button-text' },
        caption: { maxChars: 60, style: 'instruction' }
      }
    }
  ]
}
```

---

## O QUE CADA AGENTE REALMENTE FAZ

### Agent 1: Brand Strategist
**Pergunta-chave:** "Qual é a melhor forma de contar essa história para esse público?"

**Decisões:**
1. Template selection: Baseado em `goal.objective` + `assetType` + `content.mainMessage`
2. Slide count: Baseado na complexidade do conteúdo
3. Narrative angle: Baseado em `goal.angle` + `voice.attributes`
4. Constraints: Regras específicas para esse brief

**NÃO FAZ:**
- Não escreve copy
- Não define cores
- Não escolhe layouts

---

### Agent 2: Story Architect
**Pergunta-chave:** "Qual é o propósito de cada slide e como eles se conectam?"

**Decisões:**
1. Slide purposes: O que cada slide precisa comunicar
2. Emotional arc: Progressão emocional (curiosity → pain → hope → proof → action)
3. Content brief: Direcionamento para o copywriter
4. Visual direction: Sugestão de estilo visual (não especificação)

**NÃO FAZ:**
- Não escreve o copy final
- Não define pixels/cores
- Não gera HTML

---

### Agent 3: Copywriter
**Pergunta-chave:** "Quais são as palavras EXATAS que vão em cada slide?"

**Decisões:**
1. Headlines: Texto final para cada headline
2. Body copy: Parágrafos/bullets
3. CTAs: Texto dos botões
4. Captions: Micro-copy

**Constraints aplicadas:**
- Limites de caracteres do template
- Tom da marca (voice.attributes)
- Guidelines de tom (voice.toneGuidelines)

**NÃO FAZ:**
- Não decide fontes/cores
- Não posiciona elementos
- Não gera HTML

---

### Agent 4: Visual Compositor
**Pergunta-chave:** "Onde EXATAMENTE cada elemento fica e como ele aparece?"

**Decisões:**
1. Cores: HEX exatos do brandConfig
2. Tipografia: Font family + size + weight
3. Posições: x, y, width, height em pixels
4. Backgrounds: Solid, gradient, image

**Constraints aplicadas:**
- APENAS cores do brandConfig
- APENAS fontes do brandConfig
- Grid de 8px
- Canvas 1080x1080

**NÃO FAZ:**
- Não escreve copy (já está definido)
- Não decide estratégia
- Não gera HTML ainda

---

### Agent 5: Quality Validator
**Pergunta-chave:** "Esse output está 100% on-brand?"

**Validações TÉCNICAS:**
1. Color check: Todas as cores usadas estão na paleta?
2. Font check: Todas as fontes são permitidas?
3. Spacing check: Valores são múltiplos de 8?
4. Contrast check: Ratios >= 4.5:1?
5. Copy check: Tom alinha com attributes?

**Output:**
- Score 0-100
- Lista de checks (passed/failed)
- Issues críticos (se houver)

**NÃO FAZ:**
- Não corrige problemas (apenas reporta)
- Não gera HTML
- Não toma decisões criativas

---

### Agent 6: Render Engine
**Pergunta-chave:** "Como transformo essa especificação em HTML/CSS renderizável?"

**Processo:**
1. Recebe VisualSpecification validada
2. Gera HTML semântico por slide
3. Gera CSS com variáveis de design tokens
4. Prepara para export

**Output:**
- HTML por slide
- CSS consolidado
- Preview images (base64)

---

## GARANTIAS DO SISTEMA

### 1. Zero Alucinação Visual
O Visual Compositor NUNCA inventa cores. Ele SEMPRE usa:
```typescript
const allowedColors = Object.values(brandConfig.visualIdentity.colors)
```

### 2. Zero Surpresa de Fonte
O sistema SEMPRE usa:
```typescript
const allowedFonts = [
  brandConfig.visualIdentity.typography.heading.family,
  brandConfig.visualIdentity.typography.body.family
]
```

### 3. Copy Consistente
O Copywriter recebe:
```typescript
const copyContext = {
  voiceAttributes: brandConfig.voice.attributes,
  toneGuidelines: brandConfig.voice.toneGuidelines,
  goodExamples: brandConfig.voice.copyExamples.filter(e => e.isGood),
  badExamples: brandConfig.voice.copyExamples.filter(e => !e.isGood)
}
```

### 4. Estrutura Previsível
O template GARANTE:
- Número exato de slides
- Tipo de cada slide
- Elementos obrigatórios
- Constraints de copy

---

## PRÓXIMOS PASSOS DE IMPLEMENTAÇÃO

1. [ ] Criar sistema de templates (`/src/templates/`)
2. [ ] Refatorar prompts dos 6 agentes
3. [ ] Implementar tipos TypeScript rigorosos
4. [ ] Criar Quality Validator com checks técnicos reais
5. [ ] Implementar Render Engine com HTML/CSS por slide
6. [ ] Testar end-to-end com API real

---

*Versão: 2.0*
*Última atualização: 2025-12-10*
*Autor: Claude + João*

---

## STATUS DE INTEGRAÇÃO (2025-12-10)

### INTEGRAÇÃO COMPLETA

O Pipeline V2 foi **100% integrado** ao frontend do Branding OS.

### Arquivos de Integração Criados:

| Arquivo | Caminho | Propósito |
|---------|---------|-----------|
| input-adapter.ts | `services/agents-v2/` | Converte AgentInput → PipelineInput |
| pipelineV2Store.ts | `store/` | Zustand store para Pipeline V2 |
| GenerationStepV2.tsx | `components/wizard/` | UI dos 6 agentes |
| PreviewExportStepV2.tsx | `components/wizard/` | Preview slide-by-slide |
| GenerateWizardV2.tsx | `pages/` | Wizard completo V2 |

### Tipos Adicionados em `types/agent.ts`:

```typescript
export type AgentIdV2 =
  | 'brand-strategist'
  | 'story-architect'
  | 'copywriter-v2'
  | 'visual-compositor'
  | 'quality-validator'
  | 'render-engine'

export const AGENT_METADATA_V2: Record<AgentIdV2, AgentMetadataV2>
export const AGENT_ORDER_V2: AgentIdV2[]
export const INITIAL_AGENT_STATUSES_V2: Record<AgentIdV2, AgentStatus>
```

### Rota Adicionada:

```typescript
// routes/index.tsx
{
  path: "generate-v2",
  element: <GenerateWizardV2 />
}
```

### Como Testar:

1. `npm run dev`
2. Acessar `/app/generate-v2`
3. Configurar API Key Gemini em Settings
4. Executar wizard

### Próximos Passos:

1. Testar com API Gemini real
2. Ajustar prompts baseado em output real
3. Implementar export PNG/PDF
4. Adicionar histórico de gerações
