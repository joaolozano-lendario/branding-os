/**
 * Strategist Agent (BRAND-011)
 * Branding OS - Academia Lendaria
 * E2: Multi-Agent Engine
 *
 * IMPORTANTE: Este projeto usa GEMINI (Google AI)
 * Modelo: models/gemini-3-pro-preview
 *
 * Purpose: Develops positioning and narrative arc based on analyzer output
 */

import type { AnalyzerOutput, StrategistOutput, GeminiAPIConfig, AgentInput } from '@/types/agent'
import { BaseAgent } from './base'

interface StrategistInput {
  agentInput: AgentInput
  analyzerOutput: AnalyzerOutput
}

export class StrategistAgent extends BaseAgent<StrategistInput, StrategistOutput> {
  constructor(config: GeminiAPIConfig) {
    super(config, 'strategist')
  }

  get systemPrompt(): string {
    return `You are a Brand Strategist Agent for Branding OS. Your role is to develop compelling positioning and narrative arcs for brand content.

## Your Capabilities
- Craft core messaging that resonates with target audiences
- Build narrative arcs that engage and convert
- Position products/services strategically
- Define content pillars for consistent messaging

## Output Format
You MUST respond with a valid JSON object matching this structure:
{
  "coreMessage": {
    "primary": "The main message in one powerful sentence",
    "supporting": ["Supporting point 1", "Supporting point 2", "Supporting point 3"]
  },
  "narrativeArc": {
    "hook": "Attention-grabbing opening",
    "body": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"],
    "cta": "Compelling call to action"
  },
  "audiencePositioning": {
    "who": "Specific target audience description",
    "why": "Why they should care",
    "what": "What action they should take"
  },
  "contentPillars": ["Pillar 1", "Pillar 2", "Pillar 3"]
}

## Guidelines
- Primary message should be memorable and shareable
- Narrative arc should follow proven storytelling frameworks
- CTA should be specific and actionable
- Content pillars should be reusable across assets
- Use the brand voice attributes consistently`
  }

  buildUserPrompt(input: StrategistInput): string {
    const { agentInput, analyzerOutput } = input

    return `## Analysis Results

### Key Messages
${analyzerOutput.contentAnalysis.keyMessages.join('\n')}

### Themes
${analyzerOutput.contentAnalysis.themes.join(', ')}

### Audience Insights
${analyzerOutput.contentAnalysis.audienceInsights.join('\n')}

### Brand Alignment Score
${analyzerOutput.brandAlignment.score}/100

### Recommended Angles
${analyzerOutput.strategicRecommendations.angles.join('\n')}

### Recommended Hooks
${analyzerOutput.strategicRecommendations.hooks.join('\n')}

### Positioning Direction
${analyzerOutput.strategicRecommendations.positioning}

---

## Brand Voice
${agentInput.brandConfig.voice.attributes.join(', ')}

## Generation Goal
**Type:** ${agentInput.goal.type}
**Angle:** ${agentInput.goal.angle}

## Asset Type
${agentInput.assetType} (${analyzerOutput.outputSpecification.slideCount || 1} slides)

---

Develop a comprehensive content strategy with core messaging, narrative arc, audience positioning, and content pillars.`
  }

  parseOutput(response: string): StrategistOutput {
    return JSON.parse(response)
  }
}
