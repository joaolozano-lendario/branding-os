/**
 * Copywriter Agent (BRAND-012)
 * Branding OS - Academia Lendaria
 * E2: Multi-Agent Engine
 *
 * IMPORTANTE: Este projeto usa GEMINI (Google AI)
 * Modelo: models/gemini-3-pro-preview
 *
 * Purpose: Generates brand-aligned copy based on strategy
 */

import type { StrategistOutput, CopywriterOutput, GeminiAPIConfig, AgentInput, AnalyzerOutput } from '@/types/agent'
import { BaseAgent } from './base'

interface CopywriterInput {
  agentInput: AgentInput
  analyzerOutput: AnalyzerOutput
  strategistOutput: StrategistOutput
}

export class CopywriterAgent extends BaseAgent<CopywriterInput, CopywriterOutput> {
  constructor(config: GeminiAPIConfig) {
    super(config, 'copywriter')
  }

  get systemPrompt(): string {
    return `You are a Brand Copywriter Agent for Branding OS. Your role is to generate compelling, brand-aligned copy for various asset types.

## Your Capabilities
- Write headlines that capture attention
- Craft body copy that engages and persuades
- Create CTAs that drive action
- Develop microcopy (captions, labels) that enhances UX
- Adapt tone to match brand voice attributes

## Output Format
You MUST respond with a valid JSON object matching this structure:
{
  "headlines": ["Headline option 1", "Headline option 2", "Headline option 3"],
  "bodyCopy": ["Body paragraph 1", "Body paragraph 2"],
  "ctas": ["CTA option 1", "CTA option 2"],
  "microcopy": {
    "captions": ["Caption 1", "Caption 2"],
    "labels": ["Label 1", "Label 2"]
  },
  "slideContent": [
    {
      "headline": "Slide 1 headline",
      "body": "Slide 1 body text",
      "cta": "Optional CTA for final slide"
    }
  ]
}

## Guidelines
- Headlines: Max 10 words, punchy and benefit-focused
- Body copy: Conversational, scannable, value-driven
- CTAs: Action-oriented, specific, urgent but not pushy
- Match the brand voice attributes exactly
- Use active voice and power words
- Avoid jargon unless it resonates with the audience`
  }

  buildUserPrompt(input: CopywriterInput): string {
    const { agentInput, analyzerOutput, strategistOutput } = input
    const slideCount = analyzerOutput.outputSpecification.slideCount || 1

    return `## Brand Voice
**Attributes:** ${agentInput.brandConfig.voice.attributes.join(', ')}

**Tone Guidelines:**
${agentInput.brandConfig.voice.toneGuidelines.join('\n')}

---

## Strategy

### Core Message
**Primary:** ${strategistOutput.coreMessage.primary}
**Supporting:** ${strategistOutput.coreMessage.supporting.join(' | ')}

### Narrative Arc
**Hook:** ${strategistOutput.narrativeArc.hook}
**Body Points:** ${strategistOutput.narrativeArc.body.join(' → ')}
**CTA:** ${strategistOutput.narrativeArc.cta}

### Audience
**Who:** ${strategistOutput.audiencePositioning.who}
**Why:** ${strategistOutput.audiencePositioning.why}
**What:** ${strategistOutput.audiencePositioning.what}

---

## Asset Requirements
**Type:** ${agentInput.assetType}
**Number of Slides:** ${slideCount}
**Goal:** ${agentInput.goal.type} with ${agentInput.goal.angle} angle

---

## Context
**Product:** ${agentInput.context.name}
**Description:** ${agentInput.context.description}
**Key Features:** ${agentInput.context.keyFeatures.join(', ')}

---

Generate copy for this ${agentInput.assetType} with ${slideCount} slides. Include multiple options for headlines and CTAs.`
  }

  parseOutput(response: string): CopywriterOutput {
    return JSON.parse(response)
  }
}
