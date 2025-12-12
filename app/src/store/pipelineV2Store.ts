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
}

// ============================================
// STORE
// ============================================

export const usePipelineV2Store = create<PipelineV2State>()((set) => ({
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
