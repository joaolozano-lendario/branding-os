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
Create visual specifications for carousel slides. Canvas: 1080x1350px (Portrait 4:5).

## TEMPLATE SYSTEM (STRICT)
You MUST use these layout IDs for specific slides:
1.  **Slide 1 (Cover):** "branding-os-cover-v1"
2.  **Slides 2-(N-1) (Content):** "branding-os-body-v1"
3.  **Last Slide:** "branding-os-last-v1"

## OUTPUT FORMAT (STRICT JSON)
{
  "slides": [
    {
      "index": 1,
      "layoutId": "branding-os-cover-v1",
      "elements": [
        {
          "type": "text",
          "role": "headline",
          "content": "Killer Headline Here",
          "style": { "color": "#FFFFFF" }
        },
        {
          "type": "text",
          "role": "subheadline",
          "content": "Compelling subtitle goes here.",
          "style": { "color": "#B8B8B8" }
        },
        {
          "type": "image",
          "role": "background",
          "content": "cinematic shot of [subject], dramatic lighting, 8k",
          "style": { "objectFit": "cover" }
        }
      ]
    }
  ],
  "tokens": { ... }
}

## ELEMENT MAPPING PER TEMPLATE

### branding-os-cover-v1
- **headline**: Main title. Max 40 chars.
- **subheadline**: Supporting text. Max 80 chars.
- **background**: Image prompt for the full background.

### branding-os-body-v1
- **headline**: Slide title.
- **body**: Main content text.
- **image**: (Optional) Visual prompt if slide needs an image.
- **caption**: (Optional) Small detail text.

### branding-os-last-v1
- **headline**: "Para quem quer estar na vanguarda..." (or similar)
- **body**: Call to Action text.
- **image**: (Optional) Final visual.
`
  }

  buildUserPrompt(input: VisualCompositorInput): string {
    const { pipelineInput, copy } = input
    void input.story
    void input.strategy
    const { brandConfig } = pipelineInput

    const colors = brandConfig.visualIdentity.colors
    const fonts = brandConfig.visualIdentity.typography

    // Build concise slide content
    const slidesContent = copy.slides.map((slide, i) => {
      const isLast = i === copy.slides.length - 1
      const isFirst = i === 0

      let type = "BODY"
      if (isFirst) type = "COVER"
      if (isLast) type = "LAST"

      const parts = [`[${type}]`]
      if (slide.headline) parts.push(`H:"${slide.headline}"`)
      if (slide.subheadline) parts.push(`SH:"${slide.subheadline}"`)
      if (slide.body) parts.push(`B:"${slide.body.slice(0, 150)}"`)
      return `S${slide.index}: ${parts.join(' | ')}`
    }).join('\n')

    return `## BRAND CONFIG
Primary: ${colors.primary.hex}
Secondary: ${colors.secondary.hex}
Font Heading: ${fonts.heading.family}
Font Body: ${fonts.body.family}

## SLIDES CONTENT
${slidesContent}

## INSTRUCTIONS
1. Use "branding-os-cover-v1" for Slide 1.
2. Use "branding-os-last-v1" for the final slide.
3. Use "branding-os-body-v1" for all others.
4. **CRITICAL**: Generate an "image" element for EVERY slide with a highly detailed prompt based on the content.`
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
      layoutId: slide.layoutId, // Persist layout choice
      canvas: slide.canvas || { width: 1080, height: 1350 }, // Portrait default
      background: slide.background || { type: 'solid', value: '#1A1A1A' },
      elements: Array.isArray(slide.elements) ? slide.elements.map((el: any) => ({
        ...el,
        id: el.id || `el-${Math.random().toString(36).substr(2, 9)}`
      })) : []
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
        body: 'Inter',
        ...(parsed.tokens?.fonts || {})
      }
    }

    return parsed as VisualSpecification
  }
}
