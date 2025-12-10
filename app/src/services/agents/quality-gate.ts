/**
 * Quality Gate Agent (BRAND-015)
 * Branding OS - Academia Lendaria
 * E2: Multi-Agent Engine
 *
 * IMPORTANTE: Este projeto usa GEMINI (Google AI)
 * Modelo: models/gemini-3-pro-preview
 *
 * Purpose: Validates brand compliance and quality of generated assets
 */

import type {
  ComposerOutput,
  QualityGateOutput,
  GeminiAPIConfig,
  AgentInput,
  VisualDirectorOutput,
  CopywriterOutput,
} from '@/types/agent'
import { BaseAgent } from './base'

interface QualityGateInput {
  agentInput: AgentInput
  copywriterOutput: CopywriterOutput
  visualDirectorOutput: VisualDirectorOutput
  composerOutput: ComposerOutput
  qualityThreshold: number
}

export class QualityGateAgent extends BaseAgent<QualityGateInput, QualityGateOutput> {
  constructor(config: GeminiAPIConfig) {
    super(config, 'quality-gate')
  }

  get systemPrompt(): string {
    return `You are a Quality Gate Agent for Branding OS. Your role is to validate that generated assets meet brand guidelines and quality standards.

## Your Capabilities
- Evaluate visual brand compliance
- Check voice/tone consistency
- Verify structural integrity
- Assess accessibility compliance
- Identify issues and provide recommendations

## Scoring Criteria

### Visual Compliance (weight: 30%)
- Color palette adherence
- Typography consistency
- Logo usage guidelines
- Whitespace and layout

### Voice Compliance (weight: 30%)
- Tone alignment with brand attributes
- Messaging consistency
- CTA effectiveness
- Language quality

### Structure (weight: 25%)
- Content hierarchy
- Flow and pacing
- Element balance
- Responsive design

### Accessibility (weight: 15%)
- Color contrast
- Text readability
- Alt text presence
- Semantic HTML

## Output Format
You MUST respond with a valid JSON object matching this structure:
{
  "overallScore": 85,
  "passed": true,
  "categories": {
    "visual": {
      "score": 90,
      "weight": 30,
      "passed": true,
      "checks": [
        { "name": "Color Palette", "passed": true, "details": "All colors within brand palette" },
        { "name": "Typography", "passed": true }
      ]
    },
    "voice": {
      "score": 85,
      "weight": 30,
      "passed": true,
      "checks": [...]
    },
    "structure": {
      "score": 80,
      "weight": 25,
      "passed": true,
      "checks": [...]
    },
    "accessibility": {
      "score": 75,
      "weight": 15,
      "passed": true,
      "checks": [...]
    }
  },
  "issues": [
    {
      "severity": "minor",
      "category": "accessibility",
      "message": "Contrast ratio slightly below AAA",
      "suggestion": "Consider darkening the text color"
    }
  ],
  "recommendations": [
    "Consider adding more whitespace between sections",
    "CTA could be more action-oriented"
  ]
}

## Guidelines
- Score each category from 0-100
- Overall score = weighted average
- Passed = overall score >= threshold
- Be specific in issue descriptions
- Provide actionable recommendations
- Prioritize critical issues`
  }

  buildUserPrompt(input: QualityGateInput): string {
    const { agentInput, copywriterOutput, visualDirectorOutput, composerOutput, qualityThreshold } = input

    return `## Quality Threshold
**Minimum Score:** ${qualityThreshold}/100

---

## Brand Guidelines to Check Against

### Voice Attributes
${agentInput.brandConfig.voice.attributes.join(', ')}

### Tone Guidelines
${agentInput.brandConfig.voice.toneGuidelines.join('\n')}

### Color Palette
${Object.entries(agentInput.brandConfig.visualIdentity.colors).map(([k, v]) => `**${k}:** ${v}`).join('\n')}

### Typography
${Object.entries(agentInput.brandConfig.visualIdentity.fonts).map(([k, v]) => `**${k}:** ${v}`).join('\n')}

---

## Generated Copy

### Headlines
${copywriterOutput.headlines.join('\n')}

### Body Copy
${copywriterOutput.bodyCopy.join('\n\n')}

### CTAs
${copywriterOutput.ctas.join(' | ')}

---

## Visual Specifications Applied

### Colors Used
Background: ${visualDirectorOutput.colorUsage.background}
Text: ${visualDirectorOutput.colorUsage.text}
Accent: ${visualDirectorOutput.colorUsage.accent}
CTA: ${visualDirectorOutput.colorUsage.cta}

### Layout
Structure: ${visualDirectorOutput.layout.structure}

### Typography
Heading: ${visualDirectorOutput.typography.headingSize} @ ${visualDirectorOutput.typography.weights.heading}
Body: ${visualDirectorOutput.typography.bodySize} @ ${visualDirectorOutput.typography.weights.body}

---

## Generated HTML/CSS

### HTML
\`\`\`html
${composerOutput.html.substring(0, 2000)}${composerOutput.html.length > 2000 ? '...' : ''}
\`\`\`

### CSS (excerpt)
\`\`\`css
${composerOutput.css.substring(0, 1000)}${composerOutput.css.length > 1000 ? '...' : ''}
\`\`\`

---

Evaluate this asset against the brand guidelines and provide a comprehensive quality report.`
  }

  parseOutput(response: string): QualityGateOutput {
    return JSON.parse(response)
  }
}
