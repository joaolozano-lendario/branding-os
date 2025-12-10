/**
 * Composer Agent (BRAND-014)
 * Branding OS - Academia Lendaria
 * E2: Multi-Agent Engine
 *
 * IMPORTANTE: Este projeto usa GEMINI (Google AI)
 * Modelo: models/gemini-3-pro-preview (para composição)
 * Modelo: models/gemini-3-pro-image-preview (para geração de imagens)
 *
 * Purpose: Composes final assets by combining copy and visual specifications
 */

import type {
  CopywriterOutput,
  VisualDirectorOutput,
  ComposerOutput,
  GeminiAPIConfig,
  AgentInput,
} from '@/types/agent'
import { BaseAgent } from './base'

interface ComposerInput {
  agentInput: AgentInput
  copywriterOutput: CopywriterOutput
  visualDirectorOutput: VisualDirectorOutput
}

export class ComposerAgent extends BaseAgent<ComposerInput, ComposerOutput> {
  constructor(config: GeminiAPIConfig) {
    super(config, 'composer')
  }

  get systemPrompt(): string {
    return `You are a Composer Agent for Branding OS. Your role is to compose final HTML/CSS assets by combining copy and visual specifications.

## Your Capabilities
- Generate semantic HTML structures
- Create responsive CSS with design tokens
- Implement visual specifications precisely
- Optimize for various export formats

## Output Format
You MUST respond with a valid JSON object matching this structure:
{
  "html": "<div class='asset'>...</div>",
  "css": ".asset { ... }",
  "assets": {
    "images": ["placeholder-image-1.jpg"],
    "fonts": ["Inter", "Source Serif 4"]
  },
  "responsive": {
    "mobile": "@media (max-width: 768px) { ... }",
    "desktop": "@media (min-width: 769px) { ... }"
  },
  "exportFormats": ["png", "pdf", "html"]
}

## Guidelines
- Use CSS custom properties for brand tokens
- Implement proper visual hierarchy
- Ensure accessibility (ARIA labels, contrast)
- Generate clean, semantic HTML
- Include responsive breakpoints
- Use flexbox/grid for layouts
- Font sizes in rem for accessibility`
  }

  buildUserPrompt(input: ComposerInput): string {
    const { agentInput, copywriterOutput, visualDirectorOutput } = input

    const slideContent = copywriterOutput.slideContent || [
      {
        headline: copywriterOutput.headlines[0],
        body: copywriterOutput.bodyCopy[0],
        cta: copywriterOutput.ctas[0],
      },
    ]

    return `## Visual Specifications

### Layout
**Structure:** ${visualDirectorOutput.layout.structure}
**Composition:** ${visualDirectorOutput.layout.composition}
${visualDirectorOutput.layout.gridSpec ? `**Grid:** ${visualDirectorOutput.layout.gridSpec.columns}x${visualDirectorOutput.layout.gridSpec.rows} with ${visualDirectorOutput.layout.gridSpec.gap}px gap` : ''}

### Colors
**Background:** ${visualDirectorOutput.colorUsage.background}
**Text:** ${visualDirectorOutput.colorUsage.text}
**Accent:** ${visualDirectorOutput.colorUsage.accent}
**CTA:** ${visualDirectorOutput.colorUsage.cta}

### Typography
**Heading Size:** ${visualDirectorOutput.typography.headingSize}
**Body Size:** ${visualDirectorOutput.typography.bodySize}
**Weights:** Heading ${visualDirectorOutput.typography.weights.heading}, Body ${visualDirectorOutput.typography.weights.body}

### Visual Elements
**Icons:** ${visualDirectorOutput.visualElements.icons.join(', ') || 'None'}
**Illustrations:** ${visualDirectorOutput.visualElements.illustrations.join(', ') || 'None'}
${visualDirectorOutput.visualElements.photoStyle ? `**Photo Style:** ${visualDirectorOutput.visualElements.photoStyle}` : ''}

### Mood
**Energy:** ${visualDirectorOutput.mood.energy}
**Tone:** ${visualDirectorOutput.mood.tone}
**Style:** ${visualDirectorOutput.mood.style}

---

## Content to Compose

### Asset Type: ${agentInput.assetType}
### Slides: ${slideContent.length}

${slideContent.map((slide, i) => `
**Slide ${i + 1}:**
- Headline: ${slide.headline}
- Body: ${slide.body}
${slide.cta ? `- CTA: ${slide.cta}` : ''}`).join('\n')}

---

## Brand Fonts
${Object.entries(agentInput.brandConfig.visualIdentity.fonts).map(([k, v]) => `**${k}:** ${v}`).join('\n')}

---

Compose a complete HTML/CSS asset implementing these specifications. Generate clean, semantic code ready for export.`
  }

  parseOutput(response: string): ComposerOutput {
    return JSON.parse(response)
  }
}
