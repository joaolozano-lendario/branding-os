/**
 * Quality Validator Agent v2.0
 * Branding OS - Academia Lendaria
 *
 * O QUINTO agente do pipeline.
 * Faz validação TÉCNICA (não narrativa) do output visual.
 *
 * PERGUNTA-CHAVE: "Esse output está 100% on-brand?"
 */

import type { GeminiAPIConfig } from '@/types/agent'
import type {
  PipelineInput,
  VisualSpecification,
  CopyOutput,
  QualityReport,
  QualityCheck,
} from '@/types/pipeline'
import { BaseAgent } from '../agents/base'

interface QualityValidatorInput {
  pipelineInput: PipelineInput
  copy: CopyOutput
  visual: VisualSpecification
}

// ============================================
// HELPER FUNCTIONS FOR TECHNICAL VALIDATION
// ============================================

/**
 * Calculate relative luminance for a color
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Check if a value is a multiple of 8
 */
function isMultipleOf8(value: number): boolean {
  return value % 8 === 0
}

/**
 * Normalize hex color for comparison
 */
function normalizeHex(hex: string): string {
  return hex.toUpperCase().replace('#', '')
}

// ============================================
// QUALITY VALIDATOR AGENT
// ============================================

export class QualityValidatorAgent extends BaseAgent<QualityValidatorInput, QualityReport> {
  constructor(config: GeminiAPIConfig) {
    super(config, 'quality-gate')
  }

  /**
   * Run technical validation checks (no AI needed for these)
   */
  private runTechnicalChecks(input: QualityValidatorInput): QualityCheck[] {
    const checks: QualityCheck[] = []
    const { pipelineInput, visual } = input
    const brandColors = pipelineInput.brandConfig.visualIdentity.colors
    const brandFonts = pipelineInput.brandConfig.visualIdentity.typography

    // Collect all allowed colors
    const allowedColors = new Set([
      normalizeHex(brandColors.primary.hex),
      normalizeHex(brandColors.secondary.hex),
      normalizeHex(brandColors.accent.hex),
      brandColors.background ? normalizeHex(brandColors.background.hex) : 'FFFFFF',
      brandColors.text ? normalizeHex(brandColors.text.hex) : '1A1A1A',
      // Common neutrals that are always allowed
      '000000', 'FFFFFF', '1A1A1A', 'F7F7F7', 'FAFAFA'
    ])

    // Collect allowed fonts
    const allowedFonts = new Set([
      brandFonts.heading.family.toLowerCase(),
      brandFonts.body.family.toLowerCase()
    ])

    // Check each slide
    visual.slides.forEach((slide, slideIndex) => {
      // Check 1: Background color is allowed
      if (slide.background.type === 'solid') {
        const bgColor = normalizeHex(slide.background.value)
        const isAllowed = allowedColors.has(bgColor)
        checks.push({
          rule: `slide-${slideIndex + 1}-background-color`,
          category: 'color',
          passed: isAllowed,
          details: isAllowed
            ? `Background color ${slide.background.value} is in brand palette`
            : `Background color ${slide.background.value} is NOT in brand palette`,
          severity: isAllowed ? 'info' : 'error'
        })
      }

      // Check each element
      slide.elements.forEach((element, elementIndex) => {
        // Check 2: Text colors are allowed
        if (element.type === 'text' && element.style.color) {
          const textColor = normalizeHex(element.style.color)
          const isAllowed = allowedColors.has(textColor)
          checks.push({
            rule: `slide-${slideIndex + 1}-element-${elementIndex + 1}-color`,
            category: 'color',
            passed: isAllowed,
            details: isAllowed
              ? `${element.role} color ${element.style.color} is in brand palette`
              : `${element.role} color ${element.style.color} is NOT in brand palette`,
            severity: isAllowed ? 'info' : 'error'
          })
        }

        // Check 3: Fonts are allowed
        if (element.type === 'text' && element.style.fontFamily) {
          const font = element.style.fontFamily.toLowerCase()
          const isAllowed = allowedFonts.has(font)
          checks.push({
            rule: `slide-${slideIndex + 1}-element-${elementIndex + 1}-font`,
            category: 'typography',
            passed: isAllowed,
            details: isAllowed
              ? `Font ${element.style.fontFamily} is in brand typography`
              : `Font ${element.style.fontFamily} is NOT in brand typography`,
            severity: isAllowed ? 'info' : 'error'
          })
        }

        // Check 4: Contrast ratio (text on background)
        if (element.type === 'text' && element.style.color && slide.background.type === 'solid') {
          const contrast = getContrastRatio(element.style.color, slide.background.value)
          const passes = contrast >= 4.5 // WCAG AA
          checks.push({
            rule: `slide-${slideIndex + 1}-element-${elementIndex + 1}-contrast`,
            category: 'contrast',
            passed: passes,
            details: passes
              ? `${element.role} contrast ratio ${contrast.toFixed(2)}:1 meets WCAG AA (≥4.5:1)`
              : `${element.role} contrast ratio ${contrast.toFixed(2)}:1 FAILS WCAG AA (needs ≥4.5:1)`,
            severity: passes ? 'info' : 'warning'
          })
        }

        // Check 5: Spacing is 8px grid
        if (element.position) {
          const spacingChecks = [
            { name: 'x', value: element.position.x },
            { name: 'y', value: element.position.y },
            { name: 'width', value: element.position.width },
          ]

          spacingChecks.forEach(({ name, value }) => {
            if (typeof value === 'number') {
              const isGrid = isMultipleOf8(value)
              // Only flag as warning, not error (8px grid is a guideline)
              if (!isGrid) {
                checks.push({
                  rule: `slide-${slideIndex + 1}-element-${elementIndex + 1}-spacing-${name}`,
                  category: 'spacing',
                  passed: true, // Don't fail, just warn
                  details: `${element.role} ${name}=${value}px is not a multiple of 8px (guideline)`,
                  severity: 'warning'
                })
              }
            }
          })
        }
      })
    })

    return checks
  }

  get systemPrompt(): string {
    return `You are the QUALITY VALIDATOR for Branding OS.

## YOUR ROLE
You are the FIFTH agent in a 6-agent pipeline. The Visual Compositor has created visual specifications.

Your job is to VALIDATE that the output meets brand standards:
1. Voice/Tone alignment with brand attributes
2. Copy quality and readability
3. Overall brand consistency

Note: Technical checks (colors, fonts, spacing, contrast) are done programmatically.
Your focus is on the SUBJECTIVE/QUALITATIVE aspects.

## OUTPUT FORMAT
You MUST respond with a valid JSON object matching this EXACT structure:
{
  "voiceChecks": [
    {
      "rule": "tone-alignment",
      "passed": true,
      "details": "Copy maintains empowering tone throughout without being pushy",
      "severity": "info"
    },
    {
      "rule": "brand-vocabulary",
      "passed": true,
      "details": "Uses approved phrases and avoids banned terms",
      "severity": "info"
    }
  ],
  "copyQualityChecks": [
    {
      "rule": "clarity",
      "passed": true,
      "details": "All headlines are clear and understandable at first read",
      "severity": "info"
    },
    {
      "rule": "cta-effectiveness",
      "passed": true,
      "details": "CTA is action-oriented and specific",
      "severity": "info"
    }
  ],
  "overallAssessment": {
    "brandConsistency": 95,
    "copyQuality": 92,
    "visualHarmony": 90,
    "recommendations": [
      "Consider shortening the headline on slide 3",
      "The urgency message could be more specific"
    ]
  }
}

## VALIDATION CRITERIA

### Voice/Tone
- Does the copy match brand attributes (empowering, educational, etc.)?
- Is the tone consistent across all slides?
- Are there any off-brand phrases or clichés?
- Does it avoid banned patterns?

### Copy Quality
- Are headlines punchy and benefit-focused?
- Is body copy scannable and clear?
- Are CTAs specific and action-oriented?
- Is there a logical flow between slides?

### Brand Consistency
- Does the overall feel match the brand?
- Would this be recognized as an Academia Lendária asset?
- Does it maintain professionalism while being accessible?

## SCORING GUIDELINES
- 90-100: Excellent, ready for production
- 80-89: Good, minor improvements possible
- 70-79: Acceptable, some issues to address
- 60-69: Needs work, several issues
- Below 60: Significant problems, consider regeneration`
  }

  buildUserPrompt(input: QualityValidatorInput): string {
    const { pipelineInput, copy, visual } = input
    const { brandConfig } = pipelineInput

    return `## BRAND VOICE TO VALIDATE AGAINST

**Attributes:** ${brandConfig.voice.attributes.join(', ')}

**Tone Guidelines:**
${brandConfig.voice.toneGuidelines.map(g => `- ${g}`).join('\n')}

${brandConfig.voice.copyExamples.filter(e => !e.isGood).length > 0 ? `
**Examples of what to AVOID:**
${brandConfig.voice.copyExamples.filter(e => !e.isGood).map(e =>
  `- "${e.text}" (${e.context})`
).join('\n')}
` : ''}

---

## COPY TO VALIDATE

${copy.slides.map(slide => `
### Slide ${slide.index}
${slide.headline ? `**Headline:** "${slide.headline}"` : ''}
${slide.subheadline ? `**Subheadline:** "${slide.subheadline}"` : ''}
${slide.body ? `**Body:** "${slide.body}"` : ''}
${slide.stat ? `**Stat:** "${slide.stat}" - ${slide.statContext}` : ''}
${slide.bullets ? `**Bullets:** ${slide.bullets.map(b => `"${b}"`).join(', ')}` : ''}
${slide.quote ? `**Quote:** "${slide.quote}" - ${slide.attribution}` : ''}
${slide.cta ? `**CTA:** "${slide.cta}"` : ''}
${slide.caption ? `**Caption:** "${slide.caption}"` : ''}
`).join('\n---\n')}

**Microcopy:**
- CTA Button: "${copy.microcopy?.ctaButton || 'Saiba Mais'}"
- Swipe Hint: "${copy.microcopy?.swipeHint || 'Arrasta →'}"

---

## VISUAL SPECIFICATION SUMMARY

${visual.slides.map((slide, i) => `
### Slide ${i + 1}
- Background: ${slide.background.type} - ${slide.background.value}
- Elements: ${slide.elements.length} (${slide.elements.map(e => e.role).join(', ')})
`).join('\n')}

---

Now validate:
1. Voice/Tone alignment with brand attributes
2. Copy quality (clarity, punch, CTA effectiveness)
3. Overall brand consistency

Provide specific, actionable feedback.`
  }

  async execute(input: QualityValidatorInput): Promise<QualityReport> {
    // Run technical checks first (no AI needed)
    const technicalChecks = this.runTechnicalChecks(input)

    // Run AI-based qualitative checks
    const userPrompt = this.buildUserPrompt(input)
    const aiResponse = await this.client.completeJSON<{
      voiceChecks: QualityCheck[]
      copyQualityChecks: QualityCheck[]
      overallAssessment: {
        brandConsistency: number
        copyQuality: number
        visualHarmony: number
        recommendations: string[]
      }
    }>(this.systemPrompt, userPrompt, { temperature: 0.3 })

    // Combine all checks
    const allChecks = [
      ...technicalChecks,
      ...aiResponse.voiceChecks.map(c => ({ ...c, category: 'voice' as const })),
      ...aiResponse.copyQualityChecks.map(c => ({ ...c, category: 'voice' as const }))
    ]

    // Calculate summary
    const passedChecks = allChecks.filter(c => c.passed).length
    const warnings = allChecks.filter(c => c.severity === 'warning').length
    const errors = allChecks.filter(c => c.severity === 'error').length
    const criticalIssues = allChecks.filter(c => c.severity === 'critical').length

    // Calculate overall score
    const technicalScore = technicalChecks.length > 0
      ? (technicalChecks.filter(c => c.passed).length / technicalChecks.length) * 100
      : 100

    const qualitativeScore = (
      aiResponse.overallAssessment.brandConsistency +
      aiResponse.overallAssessment.copyQuality +
      aiResponse.overallAssessment.visualHarmony
    ) / 3

    const overallScore = Math.round((technicalScore * 0.4) + (qualitativeScore * 0.6))

    // Determine if passed (no critical issues, no errors, score >= 70)
    const passed = criticalIssues === 0 && errors === 0 && overallScore >= 70

    return {
      passed,
      score: overallScore,
      checks: allChecks,
      summary: {
        totalChecks: allChecks.length,
        passedChecks,
        warnings,
        errors,
        criticalIssues
      },
      requiredFixes: errors > 0 || criticalIssues > 0
        ? allChecks
            .filter(c => c.severity === 'error' || c.severity === 'critical')
            .map(c => ({
              slideIndex: parseInt(c.rule.match(/slide-(\d+)/)?.[1] || '0'),
              element: c.rule,
              issue: c.details,
              suggestion: 'Review and fix the identified issue'
            }))
        : undefined
    }
  }

  parseOutput(response: string): QualityReport {
    // This is handled in execute() since we combine technical + AI checks
    return JSON.parse(response)
  }
}
