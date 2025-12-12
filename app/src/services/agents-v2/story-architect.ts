/**
 * Story Architect Agent v2.0
 * Branding OS - Academia Lendaria
 *
 * O SEGUNDO agente do pipeline.
 * Constrói a estrutura narrativa slide-by-slide baseado na estratégia.
 *
 * PERGUNTA-CHAVE: "Qual é o propósito de cada slide e como eles se conectam?"
 */

import type { GeminiAPIConfig } from '@/types/agent'
import type {
  PipelineInput,
  StrategyBlueprint,
  StoryStructure,
} from '@/types/pipeline'
import { getTemplateById } from '@/templates'
import { BaseAgent } from '../agents/base'

interface StoryArchitectInput {
  pipelineInput: PipelineInput
  strategy: StrategyBlueprint
}

export class StoryArchitectAgent extends BaseAgent<StoryArchitectInput, StoryStructure> {
  constructor(config: GeminiAPIConfig) {
    super(config, 'strategist') // Compatibilidade com pipeline atual
  }

  get systemPrompt(): string {
    return `You are the STORY ARCHITECT for Branding OS.

## YOUR ROLE
You are the SECOND agent in a 6-agent pipeline. The Brand Strategist has already decided:
- Which template to use
- The narrative angle
- The emotional arc

Your job is to BUILD THE NARRATIVE STRUCTURE slide-by-slide:
1. Define the PURPOSE of each slide
2. Write a CONTENT BRIEF for the copywriter
3. Suggest VISUAL DIRECTION for the designer
4. Ensure LOGICAL PROGRESSION between slides

You do NOT write the final copy. You CREATE THE BLUEPRINT that the Copywriter will follow.

## OUTPUT FORMAT
You MUST respond with a valid JSON object matching this EXACT structure:
{
  "totalSlides": 8,
  "overallNarrative": "A journey from productivity frustration to the Segundo Cérebro solution",
  "slides": [
    {
      "index": 1,
      "type": "cover",
      "layout": "centered-headline",
      "purpose": "Hook the reader with a provocative question about lost time",
      "emotionalBeat": "curiosity",
      "contentBrief": "Ask a question that makes professionals stop scrolling. Something about wasted hours or lost information.",
      "visualDirection": "Dark background, bold white headline, no distractions",
      "transitionTo": "The next slide will reveal the shocking statistic"
    },
    {
      "index": 2,
      "type": "problem",
      "layout": "stat-highlight",
      "purpose": "Present the pain with a concrete, impactful number",
      "emotionalBeat": "pain",
      "contentBrief": "Show a statistic about time wasted searching for information. Make it personal and relatable.",
      "visualDirection": "Large number as focal point, supporting text below",
      "transitionTo": "Expand on the consequences of this problem"
    }
  ],
  "copywriterNotes": {
    "keyMessage": "You're losing hours every day to information chaos, but there's a system that can fix it",
    "toneReminders": ["Empowering but not condescending", "Use 'você' not 'você mesmo'", "Be direct"],
    "phrasesToUse": ["Segundo Cérebro", "sistema", "clareza", "produtividade"],
    "phrasesToAvoid": ["game-changer", "revolucionário", "nunca mais"]
  }
}

## SLIDE TYPE DEFINITIONS
- cover: Opening hook, capture attention
- problem: Present the main pain point
- agitation: Amplify the problem's consequences
- solution: Reveal the answer
- benefits: Show what they get
- features: Detail specific capabilities
- social-proof: Testimonial or result
- stats: Data and numbers
- comparison: Before/after or us vs them
- offer: Present the offer
- urgency: Create scarcity
- cta: Final call to action
- transition: Bridge between sections

## LAYOUT OPTIONS
- centered-headline: Big headline in the center
- headline-subheadline: Headline + supporting text
- stat-highlight: Big number + context
- bullet-points: List with bullets
- icon-grid: 2-3 items with icons
- testimonial: Quote + attribution
- split-image-text: Image on one side, text on other
- offer-box: Highlighted offer box
- cta-focused: CTA as main element
- comparison-columns: Two columns side by side

## GUIDELINES FOR CONTENT BRIEFS
- Be SPECIFIC, not vague
- Include WHAT to say, not HOW to say it
- Reference the product/context directly
- Consider character limits (headlines ~60 chars, body ~150 chars)

## GUIDELINES FOR VISUAL DIRECTION
- Be DESCRIPTIVE, not prescriptive
- Focus on MOOD and EMPHASIS
- Don't specify colors (that's the Visual Compositor's job)
- Don't specify exact positions

## GUIDELINES FOR TRANSITIONS
- Each slide should FLOW to the next
- Create a clear narrative thread
- The reader should feel PULLED forward

## IMPORTANT RULES
1. EXACTLY match the slide count from the strategy
2. EXACTLY match the emotional beats from the strategy
3. Use the template's defined slide types
4. Every slide needs a clear PURPOSE
5. Content briefs must be actionable for the copywriter`
  }

  buildUserPrompt(input: StoryArchitectInput): string {
    const { pipelineInput, strategy } = input
    const { context, content, brandConfig } = pipelineInput

    const template = getTemplateById(strategy.templateId)
    if (!template) {
      throw new Error(`Template not found: ${strategy.templateId}`)
    }

    return `## STRATEGIC DECISIONS (from Brand Strategist)

**Template:** ${strategy.templateName} (${strategy.templateId})
**Slide Count:** ${strategy.slideCount}
**Narrative Angle:** ${strategy.narrativeAngle}
**Emotional Arc:** ${strategy.emotionalArc.join(' → ')}

**Constraints from Strategist:**
- Tone: ${strategy.constraints.tone}
- Visual Energy: ${strategy.constraints.visualEnergy}
- CTA Style: ${strategy.constraints.ctaStyle}
- Avoid: ${strategy.constraints.avoidPatterns.join(', ')}

**Strategist's Reasoning:**
- Why this template: ${strategy.reasoning.whyThisTemplate}
- Why this angle: ${strategy.reasoning.whyThisAngle}
- Key insights: ${strategy.reasoning.keyInsights.join('; ')}

---

## TEMPLATE STRUCTURE (your blueprint)

${template.slides.map((slide, i) => `
### Slide ${slide.index}: ${slide.type.toUpperCase()}
- **Purpose:** ${slide.purpose}
- **Layout:** ${slide.layout}
- **Required elements:** ${slide.requiredElements.join(', ')}
- **Emotional beat:** ${strategy.emotionalArc[i] || slide.emotionalBeat}
- **Copy constraints:**
${Object.entries(slide.copyConstraints).map(([key, c]) =>
  `  - ${key}: max ${c.maxChars || 'N/A'} chars, style: ${c.style || 'N/A'}`
).join('\n')}
${slide.visualNotes ? `- **Visual notes:** ${slide.visualNotes}` : ''}
`).join('\n')}

---

## CONTENT TO TRANSFORM

**Product:** ${context.productName}
**Description:** ${context.productDescription}
**Target Audience:** ${context.targetAudience}
**Key Benefits:** ${context.keyBenefits.join(', ')}

**Main Message:**
${content.mainMessage}

${content.supportingPoints?.length ? `**Supporting Points:**
${content.supportingPoints.map(p => `- ${p}`).join('\n')}` : ''}

${content.mustInclude?.length ? `**MUST include:** ${content.mustInclude.join(', ')}` : ''}
${content.mustAvoid?.length ? `**MUST avoid:** ${content.mustAvoid.join(', ')}` : ''}

---

## BRAND VOICE

**Attributes:** ${brandConfig.voice.attributes.join(', ')}

**Tone Guidelines:**
${brandConfig.voice.toneGuidelines.map(g => `- ${g}`).join('\n')}

---

Now, build the story structure.

For EACH slide, define:
1. The specific PURPOSE for this carousel
2. A detailed CONTENT BRIEF for the copywriter
3. VISUAL DIRECTION suggestions
4. How it TRANSITIONS to the next slide

Think about the FLOW of the narrative. The reader should be PULLED through each slide.

Remember:
- Match the emotional arc: ${strategy.emotionalArc.join(' → ')}
- Use the template's slide types and layouts
- Be SPECIFIC in content briefs - reference the actual product/benefits`
  }

  parseOutput(response: string): StoryStructure {
    const parsed = JSON.parse(response)

    // Validate structure
    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      throw new Error('Missing slides array in story structure')
    }

    if (!parsed.copywriterNotes) {
      throw new Error('Missing copywriterNotes in story structure')
    }

    return parsed as StoryStructure
  }
}
