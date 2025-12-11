/**
 * Input Adapter
 * Branding OS - Academia Lendaria
 *
 * Converts wizardStore AgentInput to PipelineInput v2.
 * This adapter bridges the existing wizard flow with the new v2 pipeline.
 */

import type { AgentInput, GenerationGoal } from '@/types/agent'
import type { PipelineInput, BrandConfigForPipeline } from '@/types/pipeline'
import { useBrandStore } from '@/store/brandStore'

// ============================================
// GOAL MAPPING
// ============================================

/**
 * Maps v1 goal angles to v2 angles
 */
function mapGoalAngle(angle: GenerationGoal['angle']): PipelineInput['goal']['angle'] {
  switch (angle) {
    case 'benefit-focused':
      return 'transformation'
    case 'problem-solution':
      return 'education'
    case 'social-proof':
      return 'social-proof'
    case 'urgency':
      return 'urgency'
    default:
      return 'transformation'
  }
}

/**
 * Maps v1 goal type to v2 objective
 */
function mapGoalType(type: GenerationGoal['type']): PipelineInput['goal']['objective'] {
  switch (type) {
    case 'awareness':
      return 'awareness'
    case 'consideration':
      return 'consideration'
    case 'conversion':
    case 'retention':
      return 'conversion'
    default:
      return 'awareness'
  }
}

// ============================================
// ASSET TYPE MAPPING
// ============================================

/**
 * Maps v1 asset types to v2
 */
function mapAssetType(type: AgentInput['assetType']): PipelineInput['assetType'] {
  switch (type) {
    case 'carousel':
      return 'carousel'
    case 'slide':
    case 'ad':
    case 'post':
      return 'single-post'
    default:
      return 'carousel'
  }
}

// ============================================
// BRAND CONFIG ADAPTER
// ============================================

/**
 * Gets full brand config from brandStore and converts to PipelineInput format
 */
function getBrandConfigForPipeline(): BrandConfigForPipeline {
  const brandConfig = useBrandStore.getState().config

  return {
    visualIdentity: {
      logo: {
        url: brandConfig.visualIdentity.logo.url,
      },
      colors: {
        primary: {
          hex: brandConfig.visualIdentity.colors.primary.hex,
          name: brandConfig.visualIdentity.colors.primary.name,
        },
        secondary: {
          hex: brandConfig.visualIdentity.colors.secondary.hex,
          name: brandConfig.visualIdentity.colors.secondary.name,
        },
        accent: {
          hex: brandConfig.visualIdentity.colors.accent.hex,
          name: brandConfig.visualIdentity.colors.accent.name,
        },
        background: {
          hex: '#1A1A1A', // Dark mode default
          name: 'Background',
        },
        text: {
          hex: '#FFFFFF', // White text on dark
          name: 'Text',
        },
      },
      typography: {
        heading: {
          family: brandConfig.visualIdentity.typography.heading.family,
          weights: brandConfig.visualIdentity.typography.heading.weights,
        },
        body: {
          family: brandConfig.visualIdentity.typography.body.family,
          weights: brandConfig.visualIdentity.typography.body.weights,
        },
      },
    },
    voice: {
      attributes: brandConfig.voice.attributes,
      toneGuidelines: brandConfig.voice.toneGuidelines.map((g) => g.text),
      copyExamples: brandConfig.voice.copyExamples.map((e) => ({
        text: e.text,
        isGood: e.isGood,
        context: e.context || '',
      })),
    },
    examples: brandConfig.examples.examples.map((e) => ({
      type: e.type,
      annotation: e.annotation || '',
      whatMakesItOnBrand: e.whatMakesItOnBrand || '',
    })),
  }
}

// ============================================
// MAIN ADAPTER FUNCTION
// ============================================

/**
 * Converts AgentInput (from wizardStore) to PipelineInput (for v2 pipeline)
 */
export function adaptToPipelineInput(agentInput: AgentInput): PipelineInput {
  // Get full brand config from store
  const brandConfig = getBrandConfigForPipeline()

  // Extract key benefits from keyFeatures
  const keyBenefits = agentInput.context.keyFeatures || []

  // Build the v2 PipelineInput
  const pipelineInput: PipelineInput = {
    assetType: mapAssetType(agentInput.assetType),

    context: {
      productName: agentInput.context.name,
      productDescription: agentInput.context.description,
      targetAudience: agentInput.context.targetAudience || 'General audience',
      keyBenefits: keyBenefits.length > 0 ? keyBenefits : [agentInput.context.description],
      uniqueSellingPoint: keyBenefits[0] || undefined,
    },

    goal: {
      objective: mapGoalType(agentInput.goal.type),
      angle: mapGoalAngle(agentInput.goal.angle),
      specificGoal: agentInput.goal.instructions || undefined,
    },

    content: {
      mainMessage: agentInput.content.text,
      supportingPoints: keyBenefits,
      additionalNotes: agentInput.goal.instructions || undefined,
      mustInclude: undefined,
      mustAvoid: undefined,
    },

    preferences: {
      slideCount: undefined, // Let the strategist decide
      templateId: undefined, // Let the strategist decide
      tone: undefined,       // Use brand voice
    },

    brandConfig,
  }

  return pipelineInput
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Validates that the input has minimum required data for pipeline execution
 */
export function validatePipelineInput(input: PipelineInput): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!input.context.productName.trim()) {
    errors.push('Product name is required')
  }

  if (!input.content.mainMessage.trim()) {
    errors.push('Main message is required')
  }

  if (!input.brandConfig.visualIdentity.colors.primary.hex) {
    errors.push('Primary brand color is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
