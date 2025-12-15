/**
 * Visual Compositor Agent v2.0
 * Branding OS - Academia Lendaria
 *
 * O QUARTO agente do pipeline.
 * Define especificações visuais EXATAS para cada slide.
 *
 * PERGUNTA-CHAVE: "Onde EXATAMENTE cada elemento fica e como ele aparece?"
 */

import type { GeminiAPIConfig } from '@/types/agent'
import type {
  PipelineInput,
  StrategyBlueprint,
  StoryStructure,
  CopyOutput,
  VisualSpecification,
  SlideVisualSpec,
} from '@/types/pipeline'
import { BaseAgent } from '../agents/base'

interface VisualCompositorInput {
  pipelineInput: PipelineInput
  strategy: StrategyBlueprint
  story: StoryStructure
  copy: CopyOutput
}

export class VisualCompositorAgent extends BaseAgent<VisualCompositorInput, VisualSpecification> {
  constructor(config: GeminiAPIConfig) {
    super(config, 'visual-director')
  }

  get systemPrompt(): string {
    return `You are the VISUAL COMPOSITOR for Branding OS.

## YOUR ROLE
Create visual specifications for carousel slides. Canvas: 1080x1080px. Margins: 80px.

## OUTPUT FORMAT (STRICT JSON)
{
  "slides": [
    {
      "index": 1,
      "background": { "type": "solid", "value": "#1A1A1A" },
      "elements": [
        {
          "type": "text",
          "role": "headline",
          "content": "Your headline here",
          "style": { "fontFamily": "Inter", "fontSize": "48px", "fontWeight": 700, "color": "#FFFFFF", "textAlign": "center" },
          "position": { "x": 80, "y": 440, "width": 920 }
        }
      ]
    }
  ],
  "tokens": {
    "colors": { "background": "#1A1A1A", "text": "#FFFFFF", "accent": "#C9B298" },
    "fonts": { "heading": "Inter", "body": "Source Serif 4" }
  }
}

## ELEMENT ROLES & POSITIONS
- headline: y=320-480, fontSize=40-56px, fontWeight=700
- subheadline: y=400-520, fontSize=24-32px, fontWeight=500
- body: y=480-600, fontSize=18-22px, fontWeight=400
- stat: y=350-450, fontSize=72-96px, fontWeight=700 (for numbers)
- caption: y=900-950, fontSize=16-18px, fontWeight=400
- cta: y=700-800, fontSize=20-24px, fontWeight=600

## RULES
1. Use ONLY provided brand colors (exact HEX)
2. Use ONLY provided brand fonts
3. All positions in multiples of 8px
4. Keep margins of 80px from edges
5. Full-width text: x=80, width=920
6. Centered: x=(1080-width)/2
7. MAX 2-3 elements per slide - KEEP IT MINIMAL
8. CRITICAL: Keep response SHORT. Only essential elements.`
  }

  buildUserPrompt(input: VisualCompositorInput): string {
    const { pipelineInput, strategy, copy } = input
    void input.story // Used in extended version
    const { brandConfig } = pipelineInput

    const colors = brandConfig.visualIdentity.colors
    const fonts = brandConfig.visualIdentity.typography

    // Build concise slide content
    const slidesContent = copy.slides.map(slide => {
      const parts = []
      if (slide.headline) parts.push(`H:"${slide.headline}"`)
      if (slide.subheadline) parts.push(`SH:"${slide.subheadline}"`)
      if (slide.body) parts.push(`B:"${slide.body.slice(0, 100)}"`)
      if (slide.stat) parts.push(`STAT:"${slide.stat}"`)
      if (slide.cta) parts.push(`CTA:"${slide.cta}"`)
      if (slide.caption) parts.push(`CAP:"${slide.caption}"`)
      return `S${slide.index}: ${parts.join(' | ')}`
    }).join('\n')

    return `## BRAND COLORS (use exact HEX)
Primary: ${colors.primary.hex}
Secondary: ${colors.secondary.hex}
Accent: ${colors.accent.hex}
Background: ${colors.background?.hex || '#1A1A1A'}
Text: ${colors.text?.hex || '#FFFFFF'}

## BRAND FONTS
Heading: ${fonts.heading.family}
Body: ${fonts.body.family}

## VISUAL ENERGY: ${strategy.constraints.visualEnergy}

## SLIDES TO DESIGN (${copy.slides.length} total)
${slidesContent}

## TASK
Create visual spec JSON for each slide. Keep it simple:
- 2-4 elements per slide max
- Use brand colors exactly
- Positions in 8px multiples
- 80px margins from edges`
  }

  parseOutput(response: string): VisualSpecification {
    const parsed = JSON.parse(response)

    // Ensure slides array exists
    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      parsed.slides = []
    }

    // Fill in defaults for each slide
    parsed.slides = parsed.slides.map((slide: Partial<SlideVisualSpec>, index: number) => ({
      index: slide.index || index + 1,
      canvas: slide.canvas || { width: 1080, height: 1080 },
      background: slide.background || { type: 'solid', value: '#1A1A1A' },
      elements: Array.isArray(slide.elements) ? slide.elements : []
    }))

    // Ensure tokens exist with defaults
    parsed.tokens = {
      colors: {
        background: '#1A1A1A',
        text: '#FFFFFF',
        accent: '#C9B298',
        ...(parsed.tokens?.colors || {})
      },
      fonts: {
        heading: 'Inter',
        body: 'Source Serif 4',
        ...(parsed.tokens?.fonts || {})
      },
      spacing: {
        margin: 80,
        'gap-large': 48,
        'gap-medium': 24,
        'gap-small': 16,
        ...(parsed.tokens?.spacing || {})
      }
    }

    return parsed as VisualSpecification
  }
}
