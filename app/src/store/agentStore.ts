/**
 * Agent Store
 * Branding OS - Academia Lendaria
 * E2: Multi-Agent Engine State Management
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AgentId,
  AgentStatus,
  AgentInput,
  PipelineState,
  AnalyzerOutput,
  StrategistOutput,
  CopywriterOutput,
  VisualDirectorOutput,
  ComposerOutput,
  QualityGateOutput,
  GenerationHistoryItem,
  GeminiAPIConfig,
} from '@/types/agent'
import { DEFAULT_GEMINI_CONFIG } from '@/types/agent'

// ============================================
// STORE STATE
// ============================================

interface AgentStoreState {
  // API Configuration (GEMINI - Google AI)
  apiConfig: GeminiAPIConfig | null
  isApiConfigured: boolean

  // Current Pipeline
  pipeline: PipelineState
  currentInput: AgentInput | null

  // Agent Status
  agentStatuses: Record<AgentId, AgentStatus>

  // Generation History
  history: GenerationHistoryItem[]

  // Settings
  qualityThreshold: number
  blockingMode: boolean

  // Actions
  setApiKey: (apiKey: string) => void
  clearApiKey: () => void
  setQualitySettings: (threshold: number, blocking: boolean) => void

  // Pipeline Actions
  startPipeline: (input: AgentInput) => void
  updateAgentStatus: (agentId: AgentId, status: AgentStatus) => void
  setAgentOutput: (agentId: AgentId, output: unknown) => void
  setCurrentAgent: (agentId: AgentId | null) => void
  setPipelineProgress: (progress: number) => void
  completePipeline: () => void
  failPipeline: (error: string) => void
  resetPipeline: () => void

  // History Actions
  addToHistory: (item: GenerationHistoryItem) => void
  clearHistory: () => void
  removeFromHistory: (id: string) => void
}

// ============================================
// INITIAL STATES
// ============================================

const initialPipelineState: PipelineState = {
  id: '',
  status: 'idle',
  currentAgent: null,
  progress: 0,
  startedAt: null,
  completedAt: null,
  error: null,
  analyzerOutput: null,
  strategistOutput: null,
  copywriterOutput: null,
  visualDirectorOutput: null,
  composerOutput: null,
  qualityGateOutput: null,
}

const initialAgentStatuses: Record<AgentId, AgentStatus> = {
  analyzer: 'idle',
  strategist: 'idle',
  copywriter: 'idle',
  'visual-director': 'idle',
  composer: 'idle',
  'quality-gate': 'idle',
}

// ============================================
// STORE
// ============================================

export const useAgentStore = create<AgentStoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      apiConfig: null,
      isApiConfigured: false,
      pipeline: initialPipelineState,
      currentInput: null,
      agentStatuses: { ...initialAgentStatuses },
      history: [],
      qualityThreshold: 70,
      blockingMode: true,

      // API Configuration (GEMINI)
      setApiKey: (apiKey: string) => {
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

      setQualitySettings: (threshold: number, blocking: boolean) => {
        set({
          qualityThreshold: threshold,
          blockingMode: blocking,
        })
      },

      // Pipeline Actions
      startPipeline: (input: AgentInput) => {
        const id = crypto.randomUUID()
        set({
          currentInput: input,
          pipeline: {
            ...initialPipelineState,
            id,
            status: 'running',
            startedAt: new Date(),
          },
          agentStatuses: { ...initialAgentStatuses },
        })
      },

      updateAgentStatus: (agentId: AgentId, status: AgentStatus) => {
        set((state) => ({
          agentStatuses: {
            ...state.agentStatuses,
            [agentId]: status,
          },
        }))
      },

      setAgentOutput: (agentId: AgentId, output: unknown) => {
        set((state) => {
          const updates: Partial<PipelineState> = {}

          switch (agentId) {
            case 'analyzer':
              updates.analyzerOutput = output as AnalyzerOutput
              break
            case 'strategist':
              updates.strategistOutput = output as StrategistOutput
              break
            case 'copywriter':
              updates.copywriterOutput = output as CopywriterOutput
              break
            case 'visual-director':
              updates.visualDirectorOutput = output as VisualDirectorOutput
              break
            case 'composer':
              updates.composerOutput = output as ComposerOutput
              break
            case 'quality-gate':
              updates.qualityGateOutput = output as QualityGateOutput
              break
          }

          return {
            pipeline: {
              ...state.pipeline,
              ...updates,
            },
          }
        })
      },

      setCurrentAgent: (agentId: AgentId | null) => {
        set((state) => ({
          pipeline: {
            ...state.pipeline,
            currentAgent: agentId,
          },
        }))
      },

      setPipelineProgress: (progress: number) => {
        set((state) => ({
          pipeline: {
            ...state.pipeline,
            progress: Math.min(100, Math.max(0, progress)),
          },
        }))
      },

      completePipeline: () => {
        const state = get()
        const historyItem: GenerationHistoryItem = {
          id: state.pipeline.id,
          createdAt: new Date(),
          input: state.currentInput!,
          pipeline: {
            ...state.pipeline,
            status: 'complete',
            completedAt: new Date(),
            progress: 100,
          },
          finalAsset: state.pipeline.composerOutput,
          qualityReport: state.pipeline.qualityGateOutput,
        }

        set((state) => ({
          pipeline: {
            ...state.pipeline,
            status: 'complete',
            completedAt: new Date(),
            progress: 100,
            currentAgent: null,
          },
          history: [historyItem, ...state.history].slice(0, 50), // Keep last 50
        }))
      },

      failPipeline: (error: string) => {
        set((state) => ({
          pipeline: {
            ...state.pipeline,
            status: 'error',
            error,
            currentAgent: null,
          },
        }))
      },

      resetPipeline: () => {
        set({
          pipeline: initialPipelineState,
          currentInput: null,
          agentStatuses: { ...initialAgentStatuses },
        })
      },

      // History Actions
      addToHistory: (item: GenerationHistoryItem) => {
        set((state) => ({
          history: [item, ...state.history].slice(0, 50),
        }))
      },

      clearHistory: () => {
        set({ history: [] })
      },

      removeFromHistory: (id: string) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        }))
      },
    }),
    {
      name: 'branding-os-agents',
      partialize: (state) => ({
        // Don't persist API key for security
        qualityThreshold: state.qualityThreshold,
        blockingMode: state.blockingMode,
        history: state.history,
      }),
    }
  )
)

// ============================================
// SELECTORS
// ============================================

export const selectPipeline = (state: AgentStoreState) => state.pipeline
export const selectAgentStatuses = (state: AgentStoreState) => state.agentStatuses
export const selectIsApiConfigured = (state: AgentStoreState) => state.isApiConfigured
export const selectHistory = (state: AgentStoreState) => state.history
export const selectCurrentInput = (state: AgentStoreState) => state.currentInput

// ============================================
// HOOKS
// ============================================

export function useAgentStatus(agentId: AgentId) {
  return useAgentStore((state) => state.agentStatuses[agentId])
}

export function usePipelineProgress() {
  return useAgentStore((state) => ({
    progress: state.pipeline.progress,
    status: state.pipeline.status,
    currentAgent: state.pipeline.currentAgent,
  }))
}
