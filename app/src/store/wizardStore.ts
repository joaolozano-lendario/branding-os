/**
 * Wizard Store
 * Branding OS - Academia Lendaria
 * E4: Generation Wizard State Management
 */

import { create } from 'zustand'
import type {
  AssetType,
  ProductContext,
  GenerationGoal,
  ContentInput,
  AgentInput,
} from '@/types/agent'
import { useBrandStore } from './brandStore'

// ============================================
// WIZARD STEPS
// ============================================

export type WizardStep = 'assetType' | 'context' | 'goal' | 'content' | 'generation' | 'preview'

export const WIZARD_STEPS: WizardStep[] = [
  'assetType',
  'context',
  'goal',
  'content',
  'generation',
  'preview',
]

// ============================================
// STORE STATE
// ============================================

interface WizardStoreState {
  // Current Step
  currentStep: WizardStep
  completedSteps: Set<WizardStep>

  // Form Data
  assetType: AssetType | null
  productContext: ProductContext
  goal: GenerationGoal
  content: ContentInput

  // Validation
  stepErrors: Record<WizardStep, string[]>

  // Actions
  setStep: (step: WizardStep) => void
  nextStep: () => void
  previousStep: () => void
  goToStep: (step: WizardStep) => void

  // Form Actions
  setAssetType: (type: AssetType) => void
  setProductContext: (context: Partial<ProductContext>) => void
  setGoal: (goal: Partial<GenerationGoal>) => void
  setContent: (content: Partial<ContentInput>) => void

  // Validation
  validateCurrentStep: () => boolean
  getStepErrors: (step: WizardStep) => string[]

  // Build Agent Input
  buildAgentInput: () => AgentInput | null

  // Reset
  reset: () => void
}

// ============================================
// INITIAL STATE
// ============================================

const initialProductContext: ProductContext = {
  name: '',
  description: '',
  targetAudience: '',
  keyFeatures: [],
}

const initialGoal: GenerationGoal = {
  type: 'awareness',
  angle: 'benefit-focused',
  instructions: '',
}

const initialContent: ContentInput = {
  text: '',
  files: [],
}

// ============================================
// STORE
// ============================================

export const useWizardStore = create<WizardStoreState>()((set, get) => ({
  // Initial State
  currentStep: 'assetType',
  completedSteps: new Set(),
  assetType: null,
  productContext: initialProductContext,
  goal: initialGoal,
  content: initialContent,
  stepErrors: {
    assetType: [],
    context: [],
    goal: [],
    content: [],
    generation: [],
    preview: [],
  },

  // Step Navigation
  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep, validateCurrentStep, completedSteps } = get()
    if (!validateCurrentStep()) return

    const currentIndex = WIZARD_STEPS.indexOf(currentStep)
    if (currentIndex < WIZARD_STEPS.length - 1) {
      const newCompleted = new Set(completedSteps)
      newCompleted.add(currentStep)
      set({
        currentStep: WIZARD_STEPS[currentIndex + 1],
        completedSteps: newCompleted,
      })
    }
  },

  previousStep: () => {
    const { currentStep } = get()
    const currentIndex = WIZARD_STEPS.indexOf(currentStep)
    if (currentIndex > 0) {
      set({ currentStep: WIZARD_STEPS[currentIndex - 1] })
    }
  },

  goToStep: (step) => {
    const { completedSteps, currentStep } = get()
    const targetIndex = WIZARD_STEPS.indexOf(step)
    const currentIndex = WIZARD_STEPS.indexOf(currentStep)

    // Can go back to any completed step or one step forward
    if (completedSteps.has(step) || targetIndex <= currentIndex + 1) {
      set({ currentStep: step })
    }
  },

  // Form Actions
  setAssetType: (type) => {
    set({
      assetType: type,
      stepErrors: { ...get().stepErrors, assetType: [] },
    })
  },

  setProductContext: (context) => {
    set((state) => ({
      productContext: { ...state.productContext, ...context },
      stepErrors: { ...state.stepErrors, context: [] },
    }))
  },

  setGoal: (goal) => {
    set((state) => ({
      goal: { ...state.goal, ...goal },
      stepErrors: { ...state.stepErrors, goal: [] },
    }))
  },

  setContent: (content) => {
    set((state) => ({
      content: { ...state.content, ...content },
      stepErrors: { ...state.stepErrors, content: [] },
    }))
  },

  // Validation
  validateCurrentStep: () => {
    const { currentStep, assetType, productContext, content } = get()
    const errors: string[] = []

    switch (currentStep) {
      case 'assetType':
        if (!assetType) {
          errors.push('Please select an asset type')
        }
        break

      case 'context':
        if (!productContext.name.trim()) {
          errors.push('Product name is required')
        }
        if (!productContext.description.trim()) {
          errors.push('Description is required')
        }
        break

      case 'goal':
        // Goal has defaults, always valid
        break

      case 'content':
        if (!content.text.trim()) {
          errors.push('Content is required')
        }
        break
    }

    set((state) => ({
      stepErrors: { ...state.stepErrors, [currentStep]: errors },
    }))

    return errors.length === 0
  },

  getStepErrors: (step) => get().stepErrors[step],

  // Build Agent Input
  buildAgentInput: () => {
    const { assetType, productContext, goal, content } = get()
    if (!assetType) return null

    // Get brand config from brand store
    const brandConfig = useBrandStore.getState().config

    const agentInput: AgentInput = {
      assetType,
      context: productContext,
      goal,
      content,
      brandConfig: {
        visualIdentity: {
          logoUrl: brandConfig.visualIdentity.logo.url,
          colors: {
            primary: brandConfig.visualIdentity.colors.primary.hex,
            secondary: brandConfig.visualIdentity.colors.secondary.hex,
            accent: brandConfig.visualIdentity.colors.accent.hex,
          },
          fonts: {
            heading: brandConfig.visualIdentity.typography.heading.family,
            body: brandConfig.visualIdentity.typography.body.family,
          },
        },
        voice: {
          attributes: brandConfig.voice.attributes,
          toneGuidelines: brandConfig.voice.toneGuidelines.map((g) => g.text),
        },
        examples: brandConfig.examples.examples.map((e) => ({
          type: e.type,
          annotation: e.annotation,
        })),
      },
    }

    return agentInput
  },

  // Reset
  reset: () => {
    set({
      currentStep: 'assetType',
      completedSteps: new Set(),
      assetType: null,
      productContext: initialProductContext,
      goal: initialGoal,
      content: initialContent,
      stepErrors: {
        assetType: [],
        context: [],
        goal: [],
        content: [],
        generation: [],
        preview: [],
      },
    })
  },
}))

// ============================================
// SELECTORS
// ============================================

export const selectCurrentStep = (state: WizardStoreState) => state.currentStep
export const selectCompletedSteps = (state: WizardStoreState) => state.completedSteps
export const selectAssetType = (state: WizardStoreState) => state.assetType
export const selectProductContext = (state: WizardStoreState) => state.productContext
export const selectGoal = (state: WizardStoreState) => state.goal
export const selectContent = (state: WizardStoreState) => state.content

// ============================================
// HOOKS
// ============================================

export function useWizardProgress() {
  return useWizardStore((state) => ({
    currentStep: state.currentStep,
    stepIndex: WIZARD_STEPS.indexOf(state.currentStep),
    totalSteps: WIZARD_STEPS.length,
    completedSteps: state.completedSteps,
    isFirstStep: state.currentStep === WIZARD_STEPS[0],
    isLastStep: state.currentStep === WIZARD_STEPS[WIZARD_STEPS.length - 1],
  }))
}
