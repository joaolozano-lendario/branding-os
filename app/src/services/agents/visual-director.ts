/**
 * Visual Director Agent (BRAND-013)
 * Branding OS - Academia Lendaria
 * E2: Multi-Agent Engine
 *
 * IMPORTANTE: Este projeto usa GEMINI (Google AI)
 * Modelo: models/gemini-3-pro-preview
 *
 * Purpose: Creates visual specifications based on brand identity and copy
 */

import type {
  CopywriterOutput,
  VisualDirectorOutput,
  GeminiAPIConfig,
  AgentInput,
  AnalyzerOutput,
  StrategistOutput,
} from '@/types/agent'
import { BaseAgent } from './base'

interface VisualDirectorInput {
  agentInput: AgentInput
  analyzerOutput: AnalyzerOutput
  strategistOutput: StrategistOutput
  copywriterOutput: CopywriterOutput
}

export class VisualDirectorAgent extends BaseAgent<VisualDirectorInput, VisualDirectorOutput> {
  constructor(config: GeminiAPIConfig) {
    super(config, 'visual-director')
  }

  get systemPrompt(): string {
    return `You are a Visual Director Agent for Branding OS. Your role is to create visual specifications that bring copy to life while maintaining brand consistency.

## Your Capabilities
- Design layout structures for various asset types
- Specify color usage within brand guidelines
- Define typography hierarchies
- Select appropriate visual elements
- Set mood and visual tone

## Output Format
You MUST respond with a valid JSON object matching this structure:
{
  "layout": {
    "structure": "grid|centered|asymmetric|split",
    "composition": "Description of visual composition",
    "gridSpec": { "columns": 2, "rows": 3, "gap": 16 }
  },
  "colorUsage": {
    "background": "#hexcode",
    "text": "#hexcode",
    "accent": "#hexcode",
    "cta": "#hexcode"
  },
  "typography": {
    "headingSize": "48px",
    "bodySize": "18px",
    "weights": { "heading": 700, "body": 400, "cta": 600 }
  },
  "visualElements": {
    "icons": ["icon-name-1", "icon-name-2"],
    "illustrations": ["illustration-style-1"],
    "photoStyle": "professional headshots with warm tones"
  },
  "mood": {
    "energy": "calm|moderate|dynamic|intense",
    "tone": "professional|friendly|playful|sophisticated",
    "style": "One-sentence style description"
  }
}

## Guidelines
- Always use colors from the brand palette
- Maintain visual hierarchy for scannability
- Consider platform-specific requirements
- Balance whitespace for readability
- Ensure accessibility (contrast ratios)`
  }

  buildUserPrompt(input: VisualDirectorInput): string {
    const { agentInput, analyzerOutput, strategistOutput, copywriterOutput } = input

    return `## Brand Visual Identity

### Colors
${Object.entries(agentInput.brandConfig.visualIdentity.colors).map(([k, v]) => `**${k}:** ${v}`).join('\n')}

### Fonts
${Object.entries(agentInput.brandConfig.visualIdentity.fonts).map(([k, v]) => `**${k}:** ${v}`).join('\n')}

### Logo
${agentInput.brandConfig.visualIdentity.logoUrl ? 'Logo available' : 'No logo uploaded'}

---

## Brand Voice (for visual tone)
${agentInput.brandConfig.voice.attributes.join(', ')}

---

## Content Strategy
**Core Message:** ${strategistOutput.coreMessage.primary}
**Mood:** ${analyzerOutput.contentAnalysis.themes.join(', ')}
**Goal:** ${agentInput.goal.type}

---

## Copy to Visualize
**Headlines:** ${copywriterOutput.headlines.slice(0, 2).join(' | ')}
**Slide Count:** ${copywriterOutput.slideContent?.length || 1}

### Slide Content
${copywriterOutput.slideContent?.map((slide, i) => `
**Slide ${i + 1}:**
- Headline: ${slide.headline}
- Body: ${slide.body}
${slide.cta ? `- CTA: ${slide.cta}` : ''}`).join('\n') || 'Single slide/post format'}

---

## Asset Specifications
**Type:** ${agentInput.assetType}
**Dimensions:** ${analyzerOutput.outputSpecification.dimensions?.width || 1080}x${analyzerOutput.outputSpecification.dimensions?.height || 1080}

---

Create visual specifications that bring this content to life while staying on-brand.`
  }

  parseOutput(response: string): VisualDirectorOutput {
    return JSON.parse(response)
  }
}
