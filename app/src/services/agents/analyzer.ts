/**
 * Analyzer Agent (BRAND-010)
 * Branding OS - Academia Lendaria
 * E2: Multi-Agent Engine
 *
 * IMPORTANTE: Este projeto usa GEMINI (Google AI)
 * Modelo: models/gemini-3-pro-preview
 *
 * Purpose: Analyzes input content and brand configuration to create a strategic brief
 */

import type { AgentInput, AnalyzerOutput, GeminiAPIConfig } from '@/types/agent'
import { BaseAgent } from './base'

export class AnalyzerAgent extends BaseAgent<AgentInput, AnalyzerOutput> {
  constructor(config: GeminiAPIConfig) {
    super(config, 'analyzer')
  }

  get systemPrompt(): string {
    return `You are a Brand Analyzer Agent for Branding OS. Your role is to analyze user input and brand configuration to create a strategic brief for content generation.

## Your Capabilities
- Analyze product/service descriptions to extract key messages
- Identify themes and audience insights
- Evaluate brand alignment based on voice attributes and guidelines
- Provide strategic recommendations for content angles and hooks

## Output Format
You MUST respond with a valid JSON object matching this structure:
{
  "contentAnalysis": {
    "keyMessages": ["message1", "message2", "message3"],
    "themes": ["theme1", "theme2"],
    "audienceInsights": ["insight1", "insight2"]
  },
  "brandAlignment": {
    "score": 85,
    "strengths": ["strength1", "strength2"],
    "gaps": ["gap1", "gap2"]
  },
  "strategicRecommendations": {
    "angles": ["angle1", "angle2", "angle3"],
    "hooks": ["hook1", "hook2", "hook3"],
    "positioning": "One sentence positioning statement"
  },
  "outputSpecification": {
    "format": "carousel|slide|ad|post",
    "slideCount": 5,
    "dimensions": { "width": 1080, "height": 1080 }
  }
}

## Guidelines
- Extract 3-5 key messages from the content
- Identify 2-3 main themes
- Provide 2-3 actionable audience insights
- Score brand alignment from 0-100
- Suggest 3 compelling angles and hooks
- Be specific and actionable in recommendations`
  }

  buildUserPrompt(input: AgentInput): string {
    return `## Brand Configuration

### Voice Attributes
${input.brandConfig.voice.attributes.join(', ')}

### Tone Guidelines
${input.brandConfig.voice.toneGuidelines.join('\n')}

### Brand Colors
${Object.entries(input.brandConfig.visualIdentity.colors).map(([k, v]) => `${k}: ${v}`).join('\n')}

### Existing Examples (Reference)
${input.brandConfig.examples.map(e => `- ${e.type}: ${e.annotation}`).join('\n') || 'No examples provided'}

---

## Content Request

### Asset Type
${input.assetType}

### Product/Service Context
**Name:** ${input.context.name}
**Description:** ${input.context.description}
**Target Audience:** ${input.context.targetAudience || 'Not specified'}
**Key Features:** ${input.context.keyFeatures.join(', ')}

### Generation Goal
**Type:** ${input.goal.type}
**Angle:** ${input.goal.angle}
**Additional Instructions:** ${input.goal.instructions || 'None'}

### User Content Input
${input.content.text}

---

Analyze this content and brand configuration to create a comprehensive strategic brief.`
  }

  parseOutput(response: string): AnalyzerOutput {
    return JSON.parse(response)
  }
}
