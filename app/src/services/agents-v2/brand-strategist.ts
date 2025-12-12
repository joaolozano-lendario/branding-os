/**
 * Brand Strategist Agent v2.0
 * Branding OS - Academia Lendaria
 *
 * O PRIMEIRO agente do pipeline.
 * Toma decisões estratégicas de ALTO NÍVEL que guiam todos os outros agentes.
 *
 * PERGUNTA-CHAVE: "Qual é a melhor forma de contar essa história para esse público?"
 */

import type { GeminiAPIConfig } from '@/types/agent'
import type {
  PipelineInput,
  StrategyBlueprint,
} from '@/types/pipeline'
import { TEMPLATES, TEMPLATE_LIST } from '@/templates'
import { BaseAgent } from '../agents/base'

interface BrandStrategistInput {
  pipelineInput: PipelineInput
}

export class BrandStrategistAgent extends BaseAgent<BrandStrategistInput, StrategyBlueprint> {
  constructor(config: GeminiAPIConfig) {
    super(config, 'analyzer') // Usando 'analyzer' por compatibilidade com o pipeline atual
  }

  get systemPrompt(): string {
    return `You are the BRAND STRATEGIST for Branding OS.

## YOUR ROLE
You are the FIRST agent in a 6-agent pipeline. Your job is to make HIGH-LEVEL STRATEGIC DECISIONS that will guide all other agents.

You do NOT write copy. You do NOT design visuals. You DECIDE:
1. Which template to use
2. What narrative angle to take
3. How many slides
4. What emotional arc to create
5. What constraints to give other agents

## AVAILABLE TEMPLATES
${TEMPLATE_LIST.map(t => `
### ${t.name} (ID: ${t.id})
- Description: ${t.description}
- Slides: ${t.slideCount}
- Best for: ${t.bestFor.join(', ')}
- Recommended objectives: ${t.recommendedFor.join(', ')}
`).join('\n')}

## NARRATIVE ANGLES
- transformation-story: Focus on the customer's transformation journey
- problem-solution: Present problem clearly, then solve it
- social-proof-led: Lead with testimonials and results
- education-first: Teach something valuable before selling
- urgency-scarcity: Create urgency through limited time/quantity
- value-stack: Stack value before revealing the offer
- comparison: Compare with alternatives
- behind-scenes: Show the process/team behind the product

## EMOTIONAL BEATS (for the arc)
- curiosity: Opens a loop in the reader's mind
- pain: Touches on a real problem they feel
- frustration: Amplifies the pain
- hope: Shows there's a way out
- excitement: Generates enthusiasm
- trust: Builds credibility
- urgency: Creates need to act now
- relief: Offers the solution
- empowerment: Empowers the decision

## OUTPUT FORMAT
You MUST respond with a valid JSON object matching this EXACT structure:
{
  "templateId": "product-launch",
  "templateName": "Product Launch",
  "slideCount": 8,
  "narrativeAngle": "transformation-story",
  "emotionalArc": ["curiosity", "pain", "frustration", "hope", "excitement", "trust", "urgency", "empowerment"],
  "constraints": {
    "tone": "empowering-but-not-pushy",
    "visualEnergy": "dynamic",
    "ctaStyle": "urgency-with-value",
    "avoidPatterns": ["cliches like 'game-changer'", "pushy sales language"]
  },
  "reasoning": {
    "whyThisTemplate": "Product launch template fits because this is a course launch focused on conversion",
    "whyThisAngle": "Transformation angle because the product promises a clear before/after",
    "keyInsights": ["Target audience is time-poor", "They've tried other solutions", "Trust is key"]
  }
}

## DECISION GUIDELINES

### Template Selection
- CONVERSION goal + product/course = product-launch
- AWARENESS goal + tips/content = educational
- CONSIDERATION goal + testimonials available = social-proof
- NEWS/UPDATE = announcement

### Slide Count
- Use the template's default slideCount
- Only adjust if user explicitly requested different

### Emotional Arc
- Must have same number of beats as slideCount
- Start with curiosity (hook)
- End with empowerment (CTA)
- Middle depends on narrative angle

### Tone Constraints
- Match brand voice attributes
- Be specific: "empowering-but-not-pushy" not just "empowering"

### Visual Energy
- calm: Minimalist, lots of whitespace, subtle
- moderate: Balanced, professional
- dynamic: Bold, energetic, movement
- intense: High contrast, urgent, impactful

## IMPORTANT RULES
1. ALWAYS select from available templates - never invent new ones
2. ALWAYS justify your decisions in the reasoning section
3. ALWAYS match emotionalArc length to slideCount
4. NEVER be generic - be specific to THIS brief
5. Consider the brand voice attributes when setting tone constraints`
  }

  buildUserPrompt(input: BrandStrategistInput): string {
    const { pipelineInput } = input
    const { context, goal, content, brandConfig } = pipelineInput

    // Determine some heuristics for template selection
    const hasTestimonials = brandConfig.examples.some(e =>
      e.type === 'testimonial' || e.annotation.toLowerCase().includes('depoimento')
    )
    const isNewProduct = content.mainMessage.toLowerCase().includes('novo') ||
      content.mainMessage.toLowerCase().includes('lançamento') ||
      content.mainMessage.toLowerCase().includes('launch')

    return `## BRIEF ANALYSIS

### Asset Type
${pipelineInput.assetType}

### Product/Service Context
**Name:** ${context.productName}
**Description:** ${context.productDescription}
**Target Audience:** ${context.targetAudience}
**Key Benefits:**
${context.keyBenefits.map(b => `- ${b}`).join('\n')}
${context.uniqueSellingPoint ? `**USP:** ${context.uniqueSellingPoint}` : ''}

### Campaign Goal
**Objective:** ${goal.objective}
**Angle Requested:** ${goal.angle}
${goal.specificGoal ? `**Specific Goal:** ${goal.specificGoal}` : ''}

### Content to Transform
**Main Message:**
${content.mainMessage}

${content.supportingPoints?.length ? `**Supporting Points:**
${content.supportingPoints.map(p => `- ${p}`).join('\n')}` : ''}

${content.additionalNotes ? `**Additional Notes:** ${content.additionalNotes}` : ''}

${content.mustInclude?.length ? `**Must Include:** ${content.mustInclude.join(', ')}` : ''}
${content.mustAvoid?.length ? `**Must Avoid:** ${content.mustAvoid.join(', ')}` : ''}

---

### Brand Voice (CRITICAL - match this)
**Attributes:** ${brandConfig.voice.attributes.join(', ')}

**Tone Guidelines:**
${brandConfig.voice.toneGuidelines.map(g => `- ${g}`).join('\n')}

${brandConfig.voice.copyExamples.length > 0 ? `**Copy Examples (for reference):**
${brandConfig.voice.copyExamples.slice(0, 3).map(e =>
  `- "${e.text}" (${e.isGood ? 'GOOD' : 'BAD'} - ${e.context})`
).join('\n')}` : ''}

---

### Heuristics Detected
- Has testimonials available: ${hasTestimonials}
- Appears to be new product launch: ${isNewProduct}

---

### User Preferences
${pipelineInput.preferences?.templateId ? `- Requested template: ${pipelineInput.preferences.templateId}` : '- No template preference'}
${pipelineInput.preferences?.slideCount ? `- Requested slide count: ${pipelineInput.preferences.slideCount}` : '- Use template default'}
${pipelineInput.preferences?.tone ? `- Tone override: ${pipelineInput.preferences.tone}` : '- Use brand voice'}

---

Based on this brief, provide your strategic decisions as a Brand Strategist.
Think carefully about:
1. What template BEST fits this specific brief and goal?
2. What narrative angle will RESONATE with this audience?
3. What emotional journey should the carousel take the reader through?
4. What constraints will help the other agents stay on-brand?`
  }

  parseOutput(response: string): StrategyBlueprint {
    const parsed = JSON.parse(response)

    // Validate template exists
    if (!TEMPLATES[parsed.templateId]) {
      throw new Error(`Invalid template ID: ${parsed.templateId}`)
    }

    // Validate slide count matches emotional arc
    if (parsed.emotionalArc.length !== parsed.slideCount) {
      // Auto-adjust if needed
      const template = TEMPLATES[parsed.templateId]
      parsed.slideCount = template.slideCount
      // Trim or extend emotional arc to match
      if (parsed.emotionalArc.length > parsed.slideCount) {
        parsed.emotionalArc = parsed.emotionalArc.slice(0, parsed.slideCount)
      } else {
        while (parsed.emotionalArc.length < parsed.slideCount) {
          parsed.emotionalArc.push('empowerment')
        }
      }
    }

    return parsed as StrategyBlueprint
  }
}
