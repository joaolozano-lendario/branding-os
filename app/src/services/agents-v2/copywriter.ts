/**
 * Copywriter Agent v2.0
 * Branding OS - Academia Lendaria
 *
 * O TERCEIRO agente do pipeline.
 * Escreve o copy ESPECÍFICO para cada slide seguindo a estrutura definida.
 *
 * PERGUNTA-CHAVE: "Quais são as palavras EXATAS que vão em cada slide?"
 */

import type { GeminiAPIConfig } from '@/types/agent'
import type {
  PipelineInput,
  StrategyBlueprint,
  StoryStructure,
  CopyOutput,
  SlideCopy,
} from '@/types/pipeline'
import { getTemplateById } from '@/templates'
import { BaseAgent } from '../agents/base'

interface CopywriterInput {
  pipelineInput: PipelineInput
  strategy: StrategyBlueprint
  story: StoryStructure
}

export class CopywriterAgentV2 extends BaseAgent<CopywriterInput, CopyOutput> {
  constructor(config: GeminiAPIConfig) {
    super(config, 'copywriter')
  }

  get systemPrompt(): string {
    return `You are the COPYWRITER for Branding OS.

## YOUR ROLE
You are the THIRD agent in a 6-agent pipeline. The Story Architect has defined:
- The purpose of each slide
- Content briefs for what to say
- Character constraints

Your job is to write the EXACT COPY for each slide element:
- Headlines
- Subheadlines
- Body text
- Bullets
- CTAs
- Captions

You do NOT decide structure (already defined).
You do NOT design visuals.
You WRITE the words that will appear on each slide.

## OUTPUT FORMAT
You MUST respond with a valid JSON object matching this EXACT structure:
{
  "slides": [
    {
      "index": 1,
      "headline": "Você sabia que perde 2h por dia?",
      "subheadline": null,
      "body": null,
      "bullets": null,
      "quote": null,
      "attribution": null,
      "stat": null,
      "statContext": null,
      "cta": null,
      "caption": "Arrasta pra descobrir →",
      "charCounts": {
        "headline": 32,
        "caption": 21
      }
    },
    {
      "index": 2,
      "headline": "730 horas",
      "subheadline": null,
      "body": "É o tempo que você perde por ano procurando informações perdidas em anotações, emails e apps diferentes.",
      "bullets": null,
      "quote": null,
      "attribution": null,
      "stat": "730h",
      "statContext": "perdidas por ano",
      "cta": null,
      "caption": null,
      "charCounts": {
        "headline": 9,
        "body": 89,
        "stat": 4,
        "statContext": 16
      }
    }
  ],
  "alternatives": {
    "headlines": [
      "E se você pudesse recuperar 2h do seu dia?",
      "O segredo das pessoas mais produtivas"
    ],
    "ctas": [
      "Quero começar agora",
      "Garantir minha vaga"
    ]
  },
  "microcopy": {
    "ctaButton": "Começar Agora",
    "swipeHint": "Arrasta →",
    "profileCaption": "Salva esse post pra não perder 🔖"
  }
}

## WRITING GUIDELINES

### Headlines (max 60 chars typically)
- PUNCH first word
- Use active voice
- Create curiosity or state benefit
- Avoid clichés ("game-changer", "revolucionário")

### Body Copy (max 150 chars typically)
- One idea per sentence
- Short sentences
- Concrete, not abstract
- Use "você" to speak directly

### Bullets (max 50-60 chars each)
- Start with action verb or benefit
- Parallel structure
- Specific, not vague
- 3 bullets is ideal

### CTAs (max 25 chars)
- Start with verb
- Create urgency without being pushy
- Be specific ("Garantir Vaga" > "Clique Aqui")

### Stats
- Round numbers when possible (730 > 732)
- Add unit (730h, R$5.000, 10.000 alunos)
- Context explains the impact

## TONE MATCHING
You will receive the brand voice attributes and must match them EXACTLY.

For "empowering": Use confident, action-oriented language
For "educational": Explain clearly, don't assume knowledge
For "bold": Make strong claims (backed by proof)
For "friendly": Use conversational tone, contractions
For "professional": Avoid slang, be precise

## LANGUAGE
Write in Brazilian Portuguese (PT-BR) unless otherwise specified.
- Use "você" not "tu"
- Use "pra" in casual contexts, "para" in formal
- Avoid anglicisms when Portuguese alternatives exist

## IMPORTANT RULES
1. RESPECT character limits - count every character
2. Follow the content brief EXACTLY
3. Write for the specified emotional beat
4. Include ALL required elements for each slide
5. Leave null for optional elements not needed
6. Always count characters and include in charCounts`
  }

  buildUserPrompt(input: CopywriterInput): string {
    const { pipelineInput, strategy, story } = input
    const { context, content, brandConfig } = pipelineInput

    const template = getTemplateById(strategy.templateId)
    if (!template) {
      throw new Error(`Template not found: ${strategy.templateId}`)
    }

    return `## STORY STRUCTURE TO FOLLOW

**Overall Narrative:** ${story.overallNarrative}
**Total Slides:** ${story.totalSlides}

---

## SLIDE-BY-SLIDE BRIEFS

${story.slides.map((slide, i) => {
  const templateSlide = template.slides[i]
  const constraints = templateSlide?.copyConstraints || {}

  return `
### SLIDE ${slide.index}: ${slide.type.toUpperCase()}

**Purpose:** ${slide.purpose}
**Emotional Beat:** ${slide.emotionalBeat}
**Layout:** ${slide.layout}

**Content Brief:**
${slide.contentBrief}

**Required Elements:** ${templateSlide?.requiredElements.join(', ') || 'headline'}
**Optional Elements:** ${templateSlide?.optionalElements?.join(', ') || 'none'}

**Character Constraints:**
${Object.entries(constraints).map(([key, c]) => {
  if (typeof c === 'object' && c !== null) {
    return `- ${key}: max ${c.maxChars || 'N/A'} chars ${c.style ? `(style: ${c.style})` : ''}`
  }
  return ''
}).filter(Boolean).join('\n')}

**Visual Direction (for context):** ${slide.visualDirection}
${slide.transitionTo ? `**Transitions to:** ${slide.transitionTo}` : ''}
`
}).join('\n---\n')}

---

## COPYWRITER NOTES FROM STORY ARCHITECT

**Key Message:** ${story.copywriterNotes.keyMessage}

**Tone Reminders:**
${story.copywriterNotes.toneReminders.map(t => `- ${t}`).join('\n')}

**Phrases to USE:**
${story.copywriterNotes.phrasesToUse.map(p => `- "${p}"`).join('\n')}

**Phrases to AVOID:**
${story.copywriterNotes.phrasesToAvoid.map(p => `- "${p}"`).join('\n')}

---

## BRAND VOICE (MATCH THIS EXACTLY)

**Attributes:** ${brandConfig.voice.attributes.join(', ')}

**Tone Guidelines:**
${brandConfig.voice.toneGuidelines.map(g => `- ${g}`).join('\n')}

${brandConfig.voice.copyExamples.length > 0 ? `
**Good Copy Examples (learn from these):**
${brandConfig.voice.copyExamples.filter(e => e.isGood).slice(0, 3).map(e =>
  `- "${e.text}" (${e.context})`
).join('\n')}

**Bad Copy Examples (avoid this style):**
${brandConfig.voice.copyExamples.filter(e => !e.isGood).slice(0, 2).map(e =>
  `- "${e.text}" (${e.context})`
).join('\n')}
` : ''}

---

## PRODUCT CONTEXT

**Product:** ${context.productName}
**Description:** ${context.productDescription}
**Target Audience:** ${context.targetAudience}
**Key Benefits:**
${context.keyBenefits.map(b => `- ${b}`).join('\n')}

**Original Content to Transform:**
${content.mainMessage}

${content.mustInclude?.length ? `**MUST include these phrases:** ${content.mustInclude.join(', ')}` : ''}
${content.mustAvoid?.length ? `**MUST avoid these phrases:** ${content.mustAvoid.join(', ')}` : ''}

---

## STRATEGIC CONSTRAINTS

**Tone:** ${strategy.constraints.tone}
**CTA Style:** ${strategy.constraints.ctaStyle}
**Avoid Patterns:** ${strategy.constraints.avoidPatterns.join(', ')}

---

Now write the copy for each slide.

REMEMBER:
1. COUNT characters for each element
2. RESPECT the max limits from constraints
3. MATCH the brand voice attributes
4. Follow the content brief for each slide
5. Write in PT-BR
6. Be SPECIFIC to this product, not generic

For alternatives, provide 2 headline options and 2 CTA options.`
  }

  parseOutput(response: string): CopyOutput {
    const parsed = JSON.parse(response)

    // Validate structure
    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      throw new Error('Missing slides array in copy output')
    }

    // Ensure charCounts exist
    parsed.slides = parsed.slides.map((slide: SlideCopy) => ({
      ...slide,
      charCounts: slide.charCounts || {}
    }))

    // Ensure microcopy exists
    if (!parsed.microcopy) {
      parsed.microcopy = {
        ctaButton: 'Começar Agora',
        swipeHint: 'Arrasta →',
        profileCaption: 'Salva esse post 🔖'
      }
    }

    return parsed as CopyOutput
  }
}
