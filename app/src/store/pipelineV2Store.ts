/**
 * Pipeline V2 Store
 * Branding OS - Academia Lendaria
 * E6: Pipeline V2 Integration - State Management for 6-Agent Synergy Pipeline
 */

import { create } from 'zustand'
import type {
  AgentStatus,
  AgentIdV2,
  GeminiAPIConfig,
} from '@/types/agent'
import {
  INITIAL_AGENT_STATUSES_V2,
  DEFAULT_GEMINI_CONFIG,
} from '@/types/agent'
import type { PipelineResult, PipelineInput } from '@/types/pipeline'

// ============================================
// STORE STATE
// ============================================

// Image Crop Settings
export interface CropSettings {
  positionX: number // -50 to 50 (percentage offset for crop)
  positionY: number // -50 to 50 (percentage offset for crop)
  zoom: number // 1.0 to 2.0
  containerOffsetY: number // -200 to 200 (pixels to move container up/down)
  aspectRatio: '16:9' | '4:3' | '1:1' | '3:4' // Width proportion
}

interface PipelineV2State {
  // API Configuration (GEMINI - Google AI)
  apiConfig: GeminiAPIConfig | null
  isApiConfigured: boolean

  // Pipeline State
  id: string
  status: 'idle' | 'running' | 'complete' | 'error'
  currentAgent: AgentIdV2 | null
  progress: number
  progressMessage: string
  startedAt: Date | null
  completedAt: Date | null
  error: string | null

  // Agent Statuses
  agentStatuses: Record<AgentIdV2, AgentStatus>
  agentDurations: Record<AgentIdV2, number>

  // Pipeline Input/Output
  currentInput: PipelineInput | null
  result: PipelineResult | null

  // Branding Settings
  signature: string

  // Image Crop Settings per slide
  cropSettings: Record<number, CropSettings>

  // Actions
  setApiKey: (apiKey: string) => void
  clearApiKey: () => void

  // Pipeline Actions
  startPipeline: (input: PipelineInput) => void
  updateAgentStatus: (agentId: AgentIdV2, status: AgentStatus) => void
  setAgentDuration: (agentId: AgentIdV2, duration: number) => void
  setCurrentAgent: (agentId: AgentIdV2 | null) => void
  setProgress: (progress: number, message: string) => void
  completePipeline: (result: PipelineResult) => void
  failPipeline: (error: string) => void
  resetPipeline: () => void

  // Slide Editing Actions
  updateSlideHeadline: (slideIndex: number, headline: string) => void
  updateSlideBody: (slideIndex: number, body: string) => void
  updateSlideBullets: (slideIndex: number, bullets: string[]) => void
  updateSlideImage: (slideIndex: number, imageSrc: string) => void

  // Branding Actions
  setSignature: (signature: string) => void

  // Image Crop Actions
  updateCropSettings: (slideIndex: number, settings: Partial<CropSettings>) => void
  getCropSettings: (slideIndex: number) => CropSettings

  // Sync Actions
  syncGeneratedImages: () => void
}

// ============================================
// STORE
// ============================================

export const usePipelineV2Store = create<PipelineV2State>()((set, get) => ({
  // Initial State
  apiConfig: null,
  isApiConfigured: false,
  id: '',
  status: 'idle',
  currentAgent: null,
  progress: 0,
  progressMessage: '',
  startedAt: null,
  completedAt: null,
  error: null,
  agentStatuses: { ...INITIAL_AGENT_STATUSES_V2 },
  agentDurations: {
    'brand-strategist': 0,
    'story-architect': 0,
    'copywriter-v2': 0,
    'visual-compositor': 0,
    'quality-validator': 0,
    'render-engine': 0,
  },
  currentInput: null,
  result: null,
  signature: '@oalanicolas',
  cropSettings: {},

  // API Configuration (GEMINI)
  setApiKey: (apiKey: string) => {
    // Clear any cached client
    import('@/services/gemini').then(m => m.clearGeminiClient())

    console.log('[PipelineV2Store] Setting API key:', apiKey.slice(0, 10) + '...')
    set({
      apiConfig: {
        apiKey,
        ...DEFAULT_GEMINI_CONFIG,
      },
      isApiConfigured: true,
    })
  },

  clearApiKey: () => {
    set({
      apiConfig: null,
      isApiConfigured: false,
    })
  },

  // Pipeline Actions
  startPipeline: (input: PipelineInput) => {
    const id = crypto.randomUUID()
    set({
      id,
      status: 'running',
      currentAgent: null,
      progress: 0,
      progressMessage: 'Starting pipeline...',
      startedAt: new Date(),
      completedAt: null,
      error: null,
      agentStatuses: { ...INITIAL_AGENT_STATUSES_V2 },
      agentDurations: {
        'brand-strategist': 0,
        'story-architect': 0,
        'copywriter-v2': 0,
        'visual-compositor': 0,
        'quality-validator': 0,
        'render-engine': 0,
      },
      currentInput: input,
      result: null,
    })
  },

  updateAgentStatus: (agentId: AgentIdV2, status: AgentStatus) => {
    set((state) => ({
      agentStatuses: {
        ...state.agentStatuses,
        [agentId]: status,
      },
    }))
  },

  setAgentDuration: (agentId: AgentIdV2, duration: number) => {
    set((state) => ({
      agentDurations: {
        ...state.agentDurations,
        [agentId]: duration,
      },
    }))
  },

  setCurrentAgent: (agentId: AgentIdV2 | null) => {
    set({ currentAgent: agentId })
  },

  setProgress: (progress: number, message: string) => {
    set({
      progress: Math.min(100, Math.max(0, progress)),
      progressMessage: message,
    })
  },

  completePipeline: (result: PipelineResult) => {
    set({
      status: 'complete',
      progress: 100,
      progressMessage: 'Generation complete!',
      completedAt: new Date(),
      currentAgent: null,
      result,
    })
  },

  failPipeline: (error: string) => {
    set({
      status: 'error',
      error,
      currentAgent: null,
    })
  },

  resetPipeline: () => {
    set({
      id: '',
      status: 'idle',
      currentAgent: null,
      progress: 0,
      progressMessage: '',
      startedAt: null,
      completedAt: null,
      error: null,
      agentStatuses: { ...INITIAL_AGENT_STATUSES_V2 },
      agentDurations: {
        'brand-strategist': 0,
        'story-architect': 0,
        'copywriter-v2': 0,
        'visual-compositor': 0,
        'quality-validator': 0,
        'render-engine': 0,
      },
      currentInput: null,
      result: null,
    })
  },

  // Slide Editing Actions
  updateSlideHeadline: (slideIndex: number, headline: string) => {
    set((state) => {
      if (!state.result?.copy?.slides) return state

      const updatedSlides = [...state.result.copy.slides]
      updatedSlides[slideIndex] = {
        ...updatedSlides[slideIndex],
        headline,
        charCounts: {
          ...updatedSlides[slideIndex].charCounts,
          headline: headline.length,
        },
      }

      return {
        result: {
          ...state.result,
          copy: {
            ...state.result.copy,
            slides: updatedSlides,
          },
        },
      }
    })
  },

  updateSlideBody: (slideIndex: number, body: string) => {
    set((state) => {
      if (!state.result?.copy?.slides) return state

      const updatedSlides = [...state.result.copy.slides]
      updatedSlides[slideIndex] = {
        ...updatedSlides[slideIndex],
        body,
        charCounts: {
          ...updatedSlides[slideIndex].charCounts,
          body: body.length,
        },
      }

      return {
        result: {
          ...state.result,
          copy: {
            ...state.result.copy,
            slides: updatedSlides,
          },
        },
      }
    })
  },

  updateSlideBullets: (slideIndex: number, bullets: string[]) => {
    set((state) => {
      if (!state.result?.copy?.slides) return state

      const updatedSlides = [...state.result.copy.slides]
      updatedSlides[slideIndex] = {
        ...updatedSlides[slideIndex],
        bullets,
      }

      return {
        result: {
          ...state.result,
          copy: {
            ...state.result.copy,
            slides: updatedSlides,
          },
        },
      }
    })
  },

  updateSlideImage: (slideIndex: number, imageSrc: string) => {
    set((state) => {
      if (!state.result) return state

      const slideImages = {
        ...(state.result.slideImages || {}),
        [slideIndex]: imageSrc,
      }

      return {
        result: {
          ...state.result,
          slideImages,
        },
      }
    })
  },

  // Branding Actions
  setSignature: (signature: string) => {
    set({ signature })
  },

  // Image Crop Actions
  updateCropSettings: (slideIndex: number, settings: Partial<CropSettings>) => {
    set((state) => {
      const currentSettings = state.cropSettings[slideIndex] || {
        positionX: 0,
        positionY: 0,
        zoom: 1.0,
        containerOffsetY: 0,
        aspectRatio: '16:9' as const
      }

      return {
        cropSettings: {
          ...state.cropSettings,
          [slideIndex]: {
            ...currentSettings,
            ...settings
          }
        }
      }
    })
  },

  getCropSettings: (slideIndex: number) => {
    const state = get()
    return state.cropSettings[slideIndex] || {
      positionX: 0,
      positionY: 0,
      zoom: 1.0,
      containerOffsetY: 0,
      aspectRatio: '16:9' as const
    }
  },

  // Sync generated images from visual.slides to slideImages
  syncGeneratedImages: () => {
    const result = get().result
    if (!result?.visual?.slides) return

    const existingSlideImages = result.slideImages || {}
    const newSlideImages: Record<number, string> = { ...existingSlideImages }

    result.visual.slides.forEach((slide, index) => {
      // Don't overwrite if user already inserted an image
      if (newSlideImages[index]) return

      // Check background for image
      if (slide.background?.type === 'image' && slide.background.value) {
        const val = slide.background.value
        if (val.startsWith('http') || val.startsWith('data:')) {
          newSlideImages[index] = val
          return
        }
      }

      // Check elements for images
      const imageElement = slide.elements?.find(e =>
        (e.role === 'background' || e.role === 'image') &&
        e.content &&
        (e.content.startsWith('http') || e.content.startsWith('data:'))
      )
      if (imageElement?.content) {
        newSlideImages[index] = imageElement.content
      }
    })

    set({
      result: {
        ...result,
        slideImages: newSlideImages,
      },
    })
  },
}))

// ============================================
// SELECTORS
// ============================================

export const selectPipelineV2Status = (state: PipelineV2State) => state.status
export const selectPipelineV2Progress = (state: PipelineV2State) => ({
  progress: state.progress,
  message: state.progressMessage,
})
export const selectAgentStatusesV2 = (state: PipelineV2State) => state.agentStatuses
export const selectPipelineV2Result = (state: PipelineV2State) => state.result
export const selectIsApiConfiguredV2 = (state: PipelineV2State) => state.isApiConfigured

// ============================================
// HOOKS
// ============================================

export function useAgentStatusV2(agentId: AgentIdV2) {
  return usePipelineV2Store((state) => state.agentStatuses[agentId])
}

export function usePipelineV2Progress() {
  return usePipelineV2Store((state) => ({
    progress: state.progress,
    message: state.progressMessage,
    status: state.status,
    currentAgent: state.currentAgent,
  }))
}
