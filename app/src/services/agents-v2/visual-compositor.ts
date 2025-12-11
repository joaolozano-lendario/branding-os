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
  VisualElement,
} from '@/types/pipeline'
import { getTemplateById } from '@/templates'
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
You are the FOURTH agent in a 6-agent pipeline. The Copywriter has written all the copy.

Your job is to define EXACT VISUAL SPECIFICATIONS for each slide:
- Element positions (x, y, width, height in pixels)
- Typography (font family, size, weight, color)
- Backgrounds (colors, gradients)
- Spacing and alignment

You do NOT write copy (already done).
You do NOT validate quality (next agent does that).
You CREATE pixel-perfect specifications that can be rendered.

## CANVAS SPECIFICATIONS
- Width: 1080px
- Height: 1080px (Instagram carousel format)
- Safe margins: 80px from edges
- Grid: 8px increments for all spacing

## OUTPUT FORMAT
You MUST respond with a valid JSON object matching this EXACT structure:
{
  "slides": [
    {
      "index": 1,
      "canvas": { "width": 1080, "height": 1080 },
      "background": {
        "type": "solid",
        "value": "#1A1A1A",
        "opacity": 1
      },
      "elements": [
        {
          "type": "text",
          "role": "headline",
          "content": "Você sabia que perde 2h por dia?",
          "style": {
            "fontFamily": "Inter",
            "fontSize": "48px",
            "fontWeight": 700,
            "color": "#FFFFFF",
            "textAlign": "center",
            "lineHeight": 1.2
          },
          "position": {
            "x": 80,
            "y": 440,
            "width": 920,
            "height": "auto"
          }
        },
        {
          "type": "text",
          "role": "caption",
          "content": "Arrasta pra descobrir →",
          "style": {
            "fontFamily": "Source Serif 4",
            "fontSize": "18px",
            "fontWeight": 400,
            "color": "#C9B298",
            "textAlign": "center",
            "lineHeight": 1.4
          },
          "position": {
            "x": 80,
            "y": 920,
            "width": 920,
            "height": "auto"
          }
        }
      ]
    }
  ],
  "tokens": {
    "colors": {
      "background": "#1A1A1A",
      "text-primary": "#FFFFFF",
      "text-secondary": "#C9B298",
      "accent": "#C9B298"
    },
    "fonts": {
      "heading": "Inter",
      "body": "Source Serif 4"
    },
    "spacing": {
      "margin": 80,
      "gap-large": 48,
      "gap-medium": 24,
      "gap-small": 16
    }
  }
}

## LAYOUT PATTERNS

### centered-headline
- Headline centered vertically and horizontally
- Caption at bottom (y: 920)
- Large font (40-56px)

### headline-subheadline
- Headline at upper-third (y: 320)
- Subheadline below (y: 420)
- Body below subheadline if present (y: 520)

### stat-highlight
- Stat number LARGE and centered (72-96px)
- Context text below, smaller
- Supporting body below context

### bullet-points
- Headline at top (y: 200)
- 3 bullet items vertically stacked
- Each bullet: icon + text row
- Gap between bullets: 32px

### icon-grid
- Headline at top (y: 160)
- 3 items in column or 2x2 grid
- Each item: icon above, text below
- Gap: 48px between items

### testimonial
- Quote marks visual element
- Quote text centered (y: 300-500)
- Attribution at bottom (y: 800)
- Italic body font for quote

### offer-box
- Centered box (border or background)
- Headline inside box (y: 300)
- Price/details (y: 450)
- Urgency text (y: 600)

### cta-focused
- Headline at upper-third (y: 280)
- CTA button centered (y: 520)
- Caption below CTA (y: 720)

## TYPOGRAPHY HIERARCHY

### Headlines
- Font: Brand heading font
- Size: 40-56px (depending on length)
- Weight: 700 (bold)
- Color: High contrast (white on dark, dark on light)

### Subheadlines
- Font: Brand heading font
- Size: 24-32px
- Weight: 500-600
- Color: Primary or secondary

### Body Text
- Font: Brand body font
- Size: 18-22px
- Weight: 400
- Color: Secondary text color
- Line height: 1.4-1.6

### Stats/Numbers
- Font: Brand heading font
- Size: 72-96px
- Weight: 700
- Color: Accent or primary

### CTAs
- Font: Brand heading font
- Size: 20-24px
- Weight: 600
- Color: High contrast
- Background: Accent color (if button)

### Captions
- Font: Brand body font
- Size: 16-18px
- Weight: 400
- Color: Accent or muted

## COLOR RULES
1. ONLY use colors from the brand palette provided
2. Maintain WCAG AA contrast (4.5:1 minimum for text)
3. Dark backgrounds: use light text
4. Light backgrounds: use dark text
5. Accent color: use sparingly (<10% of area)

## SPACING RULES
1. ALL values must be multiples of 8px
2. Safe margin from edges: 80px
3. Gap between major sections: 48px
4. Gap between related elements: 24px
5. Tight gap (within groups): 16px

## POSITION CALCULATION
- x: horizontal position (0 = left edge)
- y: vertical position (0 = top edge)
- width: element width
- height: "auto" for text (calculated), fixed for shapes/images

For centered elements:
- x = (1080 - width) / 2
- For full-width text: x = 80, width = 920

## IMPORTANT RULES
1. ONLY use fonts from brandConfig.typography
2. ONLY use colors from brandConfig.colors
3. ALL spacing in multiples of 8px
4. Safe margins of 80px from edges
5. Ensure readable contrast
6. Match visual energy from strategy (calm/moderate/dynamic/intense)`
  }

  buildUserPrompt(input: VisualCompositorInput): string {
    const { pipelineInput, strategy, story, copy } = input
    const { brandConfig } = pipelineInput

    const colors = brandConfig.visualIdentity.colors
    const fonts = brandConfig.visualIdentity.typography

    return `## BRAND VISUAL IDENTITY (USE ONLY THESE)

### Colors (HEX values - use EXACTLY these)
- Primary: ${colors.primary.hex} (${colors.primary.name})
- Secondary: ${colors.secondary.hex} (${colors.secondary.name})
- Accent: ${colors.accent.hex} (${colors.accent.name})
- Background: ${colors.background?.hex || '#1A1A1A'} (${colors.background?.name || 'Background'})
- Text: ${colors.text?.hex || '#FFFFFF'} (${colors.text?.name || 'Text'})

### Fonts (use ONLY these families)
- Heading: ${fonts.heading.family} (weights: ${fonts.heading.weights.join(', ')})
- Body: ${fonts.body.family} (weights: ${fonts.body.weights.join(', ')})

### Logo
${brandConfig.visualIdentity.logo.url ? 'Logo available at: ' + brandConfig.visualIdentity.logo.url : 'No logo uploaded'}

---

## STRATEGIC CONTEXT

**Visual Energy:** ${strategy.constraints.visualEnergy}
- calm: Lots of whitespace, subtle colors, minimal elements
- moderate: Balanced, professional look
- dynamic: Bold colors, strong contrast, energetic
- intense: High impact, urgent feel, maximum contrast

**Narrative Angle:** ${strategy.narrativeAngle}

---

## COPY TO VISUALIZE (from Copywriter)

${copy.slides.map(slide => {
  const storySlide = story.slides.find(s => s.index === slide.index)

  return `
### SLIDE ${slide.index}
**Type:** ${storySlide?.type || 'content'}
**Layout:** ${storySlide?.layout || 'headline-subheadline'}
**Visual Direction:** ${storySlide?.visualDirection || 'Standard'}

**Content:**
${slide.headline ? `- Headline: "${slide.headline}" (${slide.charCounts.headline || slide.headline.length} chars)` : ''}
${slide.subheadline ? `- Subheadline: "${slide.subheadline}"` : ''}
${slide.body ? `- Body: "${slide.body}"` : ''}
${slide.stat ? `- Stat: "${slide.stat}" + Context: "${slide.statContext}"` : ''}
${slide.bullets ? `- Bullets: ${slide.bullets.map(b => `"${b}"`).join(', ')}` : ''}
${slide.quote ? `- Quote: "${slide.quote}" - ${slide.attribution}` : ''}
${slide.cta ? `- CTA: "${slide.cta}"` : ''}
${slide.caption ? `- Caption: "${slide.caption}"` : ''}
`
}).join('\n---\n')}

---

## MICROCOPY

- CTA Button Text: "${copy.microcopy.ctaButton}"
- Swipe Hint: "${copy.microcopy.swipeHint}"

---

Now create the visual specification for each slide.

REMEMBER:
1. Use ONLY the brand colors (exact HEX values)
2. Use ONLY the brand fonts
3. ALL spacing in multiples of 8px
4. Keep 80px safe margins from edges
5. Match the visual energy: ${strategy.constraints.visualEnergy}
6. Use the layout pattern for each slide type
7. Calculate positions precisely

For each slide, specify:
- Background (color or gradient)
- Every text element with exact position and styling
- Design tokens used across all slides`
  }

  parseOutput(response: string): VisualSpecification {
    const parsed = JSON.parse(response)

    // Validate structure
    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      throw new Error('Missing slides array in visual specification')
    }

    // Validate each slide has required properties
    parsed.slides.forEach((slide: SlideVisualSpec, index: number) => {
      if (!slide.canvas) {
        slide.canvas = { width: 1080, height: 1080 }
      }
      if (!slide.background) {
        slide.background = { type: 'solid', value: '#1A1A1A' }
      }
      if (!slide.elements || !Array.isArray(slide.elements)) {
        throw new Error(`Slide ${index + 1} missing elements array`)
      }
    })

    // Ensure tokens exist
    if (!parsed.tokens) {
      parsed.tokens = {
        colors: {},
        fonts: {},
        spacing: { margin: 80, 'gap-large': 48, 'gap-medium': 24, 'gap-small': 16 }
      }
    }

    return parsed as VisualSpecification
  }
}
