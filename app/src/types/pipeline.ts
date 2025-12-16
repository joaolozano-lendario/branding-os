/**
 * Pipeline Types v2.0
 * Branding OS - Academia Lendaria
 *
 * Tipos rigorosos que garantem sinergia entre todos os agentes.
 * Cada tipo representa EXATAMENTE o que flui de um agente para outro.
 */

// ============================================
// SLIDE TYPES & LAYOUTS
// ============================================

export type SlideType =
  | 'cover'           // Slide de abertura (hook)
  | 'problem'         // Apresenta a dor
  | 'agitation'       // Amplifica a dor
  | 'solution'        // Apresenta solução
  | 'benefits'        // Lista benefícios
  | 'features'        // Detalha funcionalidades
  | 'social-proof'    // Depoimento/prova
  | 'stats'           // Estatísticas
  | 'comparison'      // Antes/depois
  | 'offer'           // Apresenta oferta
  | 'urgency'         // Cria escassez
  | 'cta'             // Call to action final
  | 'transition'      // Slide de transição

export type SlideLayout =
  | 'centered-headline'      // Headline centralizado
  | 'headline-subheadline'   // Headline + subheadline
  | 'stat-highlight'         // Número grande + contexto
  | 'bullet-points'          // Lista com bullets
  | 'icon-grid'              // Grid de ícones com texto
  | 'testimonial'            // Quote + attribution
  | 'split-image-text'       // Imagem de um lado, texto do outro
  | 'offer-box'              // Box com oferta
  | 'cta-focused'            // CTA como elemento principal
  | 'comparison-columns'     // Duas colunas comparativas

// ============================================
// EMOTIONAL ARC
// ============================================

export type EmotionalBeat =
  | 'curiosity'    // Desperta interesse
  | 'pain'         // Toca na dor
  | 'frustration'  // Amplifica frustração
  | 'hope'         // Mostra possibilidade
  | 'excitement'   // Gera entusiasmo
  | 'trust'        // Constrói confiança
  | 'urgency'      // Cria senso de urgência
  | 'relief'       // Oferece solução
  | 'empowerment'  // Empodera a decisão

// ============================================
// NARRATIVE ANGLES
// ============================================

export type NarrativeAngle =
  | 'transformation-story'   // Foca na transformação do cliente
  | 'problem-solution'       // Apresenta problema, resolve
  | 'social-proof-led'       // Lidera com provas sociais
  | 'education-first'        // Educa antes de vender
  | 'urgency-scarcity'       // Foca em escassez/urgência
  | 'value-stack'            // Empilha valor antes da oferta
  | 'comparison'             // Compara com alternativas
  | 'behind-scenes'          // Mostra bastidores

// ============================================
// TEMPLATE DEFINITION
// ============================================

export interface SlideElementConstraint {
  maxChars?: number
  minChars?: number
  style?: string  // Guideline de estilo para o copywriter
  count?: number  // Para elementos múltiplos (bullets)
}

export interface TemplateSlide {
  index: number
  type: SlideType
  purpose: string               // Descrição clara do propósito
  layout: SlideLayout
  emotionalBeat: EmotionalBeat
  requiredElements: string[]    // ['headline', 'body', etc]
  optionalElements?: string[]
  copyConstraints: Record<string, SlideElementConstraint>
  visualNotes?: string          // Notas para o Visual Compositor
}

export interface CarouselTemplate {
  id: string
  name: string
  description: string
  slideCount: number
  recommendedFor: Array<'awareness' | 'consideration' | 'conversion'>
  bestFor: string[]             // ["product launches", "course promos"]
  slides: TemplateSlide[]
}

// ============================================
// AGENT 1: BRAND STRATEGIST OUTPUT
// ============================================

export interface StrategyBlueprint {
  // Decisões estratégicas
  templateId: string
  templateName: string
  slideCount: number
  narrativeAngle: NarrativeAngle

  // Arco emocional planejado
  emotionalArc: EmotionalBeat[]

  // Constraints para os outros agentes
  constraints: {
    tone: string              // "empowering-but-not-pushy"
    visualEnergy: 'calm' | 'moderate' | 'dynamic' | 'intense'
    ctaStyle: string          // "urgency-with-value"
    avoidPatterns: string[]   // Coisas a evitar
  }

  // Reasoning (para debug/transparency)
  reasoning: {
    whyThisTemplate: string
    whyThisAngle: string
    keyInsights: string[]
  }
}

// ============================================
// AGENT 2: STORY ARCHITECT OUTPUT
// ============================================

export interface StorySlide {
  index: number
  type: SlideType
  layout: SlideLayout
  purpose: string              // O que esse slide precisa fazer
  emotionalBeat: EmotionalBeat
  contentBrief: string         // Direcionamento para o copywriter
  visualDirection: string      // Sugestão visual
  transitionTo?: string        // Como conecta com o próximo slide
}

export interface StoryStructure {
  // Metadados
  totalSlides: number
  overallNarrative: string     // Uma frase sobre a história toda

  // Slides
  slides: StorySlide[]

  // Notas para o copywriter
  copywriterNotes: {
    keyMessage: string
    toneReminders: string[]
    phrasesToUse: string[]
    phrasesToAvoid: string[]
  }
}

// ============================================
// AGENT 3: COPYWRITER OUTPUT
// ============================================

export interface SlideCopy {
  index: number

  // Elementos de texto
  headline?: string
  subheadline?: string
  body?: string
  bullets?: string[]
  quote?: string
  attribution?: string
  stat?: string
  statContext?: string
  cta?: string
  caption?: string

  // Metadata
  charCounts: {
    headline?: number
    body?: number
    [key: string]: number | undefined
  }
}

export interface CopyOutput {
  slides: SlideCopy[]

  // Alternativas geradas (para variations)
  alternatives?: {
    headlines: string[]
    ctas: string[]
  }

  // Microcopy adicional
  microcopy: {
    ctaButton: string
    swipeHint: string
    profileCaption: string
  }
}

// ============================================
// AGENT 4: VISUAL COMPOSITOR OUTPUT
// ============================================

export interface ElementStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: number
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  lineHeight?: number
  letterSpacing?: string
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
}

export interface ElementPosition {
  x: number
  y: number
  width: number
  height: number | 'auto'
}

export interface VisualElement {
  type: 'text' | 'icon' | 'image' | 'shape' | 'divider'
  role: string                  // 'headline', 'body', 'cta', etc
  content: string
  style: ElementStyle
  position: ElementPosition
}

export interface SlideBackground {
  type: 'solid' | 'gradient' | 'image'
  value: string                 // HEX, gradient CSS, or image URL
  opacity?: number
}

export interface SlideVisualSpec {
  index: number
  layoutId?: string             // ID do template (opcional)
  canvas: {
    width: number               // 1080
    height: number              // 1080
  }
  background: SlideBackground
  elements: VisualElement[]
}

export interface VisualSpecification {
  slides: SlideVisualSpec[]

  // Design tokens usados
  tokens: {
    colors: Record<string, string>
    fonts: Record<string, string>
    spacing: Record<string, number>
  }
}

// ============================================
// AGENT 5: QUALITY VALIDATOR OUTPUT
// ============================================

export interface QualityCheck {
  rule: string
  category: 'color' | 'typography' | 'spacing' | 'contrast' | 'voice' | 'structure' | 'content'
  passed: boolean
  details: string
  severity: 'info' | 'warning' | 'error' | 'critical'
}

export interface QualityReport {
  passed: boolean
  score: number                 // 0-100

  checks: QualityCheck[]

  summary: {
    totalChecks: number
    passedChecks: number
    warnings: number
    errors: number
    criticalIssues: number
  }

  // Se não passou, o que precisa corrigir
  requiredFixes?: Array<{
    slideIndex: number
    element: string
    issue: string
    suggestion: string
  }>
}

// ============================================
// AGENT 6: RENDER ENGINE OUTPUT
// ============================================

export interface RenderedSlide {
  index: number
  html: string
  css: string
  preview?: string              // Base64 image preview
}

export interface RenderOutput {
  slides: RenderedSlide[]

  // CSS consolidado
  globalCSS: string

  // Fonts a carregar
  fontsToLoad: string[]

  // Export options
  exportReady: {
    html: boolean
    png: boolean
    pdf: boolean
  }
}

// ============================================
// PIPELINE FINAL OUTPUT
// ============================================

export interface PipelineResult {
  success: boolean
  error?: string

  // Metadados
  metadata: {
    pipelineId: string
    version: string
    generatedAt: Date
    duration: number            // ms total
    agentDurations: Record<string, number>
  }

  // Outputs de cada agente
  strategy: StrategyBlueprint
  story: StoryStructure
  copy: CopyOutput
  visual: VisualSpecification
  quality: QualityReport
  render: RenderOutput

  // Resumo para UI
  summary: {
    template: string
    slideCount: number
    qualityScore: number
    mainCTA: string
  }

  // Imagens inseridas pelo usuário (por slide index)
  slideImages?: Record<number, string>
}

// ============================================
// PIPELINE INPUT (refinado)
// ============================================

export interface PipelineInput {
  assetType: 'carousel' | 'single-post' | 'story'

  context: {
    productName: string
    productDescription: string
    targetAudience: string
    keyBenefits: string[]
    uniqueSellingPoint?: string
  }

  goal: {
    objective: 'awareness' | 'consideration' | 'conversion'
    angle: 'transformation' | 'social-proof' | 'urgency' | 'education'
    specificGoal?: string       // "Drive enrollments for Black Friday"
  }

  content: {
    mainMessage: string
    supportingPoints?: string[]
    additionalNotes?: string
    mustInclude?: string[]      // Frases obrigatórias
    mustAvoid?: string[]        // Coisas a evitar
  }

  preferences?: {
    slideCount?: number         // Override do template
    templateId?: string         // Forçar template específico
    tone?: string               // Override de tom
  }

  // Brand config (do store)
  brandConfig: BrandConfigForPipeline
}

export interface BrandConfigForPipeline {
  visualIdentity: {
    logo: { url: string | null }
    colors: {
      primary: { hex: string; name: string }
      secondary: { hex: string; name: string }
      accent: { hex: string; name: string }
      background: { hex: string; name: string }
      text: { hex: string; name: string }
    }
    typography: {
      heading: { family: string; weights: number[] }
      body: { family: string; weights: number[] }
    }
  }
  voice: {
    attributes: string[]
    toneGuidelines: string[]
    copyExamples: Array<{
      text: string
      isGood: boolean
      context: string
    }>
  }
  examples: Array<{
    type: string
    annotation: string
    whatMakesItOnBrand: string
  }>
}
