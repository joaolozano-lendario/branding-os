/**
 * Agent Pipeline Orchestrator
 * Branding OS - Academia Lendaria
 * E2: Multi-Agent Engine
 *
 * IMPORTANTE: Este projeto usa GEMINI (Google AI) para todas as operações de IA
 * - Texto: models/gemini-3-pro-preview
 * - Imagens: models/gemini-3-pro-image-preview
 *
 * Orchestrates the execution of all agents in sequence
 */

import type {
  AgentInput,
  GeminiAPIConfig,
  AnalyzerOutput,
  StrategistOutput,
  CopywriterOutput,
  VisualDirectorOutput,
  ComposerOutput,
  QualityGateOutput,
  AgentId,
} from '@/types/agent'
import {
  AnalyzerAgent,
  StrategistAgent,
  CopywriterAgent,
  VisualDirectorAgent,
  ComposerAgent,
  QualityGateAgent,
} from './agents'

// ============================================
// PIPELINE CALLBACKS
// ============================================

export interface PipelineCallbacks {
  onAgentStart: (agentId: AgentId) => void
  onAgentComplete: (agentId: AgentId, output: unknown) => void
  onAgentError: (agentId: AgentId, error: Error) => void
  onProgress: (progress: number) => void
}

// ============================================
// PIPELINE RESULTS
// ============================================

export interface PipelineResult {
  success: boolean
  error?: string
  outputs: {
    analyzer: AnalyzerOutput | null
    strategist: StrategistOutput | null
    copywriter: CopywriterOutput | null
    visualDirector: VisualDirectorOutput | null
    composer: ComposerOutput | null
    qualityGate: QualityGateOutput | null
  }
}

// ============================================
// PIPELINE ORCHESTRATOR
// ============================================

export class PipelineOrchestrator {
  private config: GeminiAPIConfig
  private callbacks: PipelineCallbacks
  private qualityThreshold: number
  private aborted: boolean = false

  constructor(
    config: GeminiAPIConfig,
    callbacks: PipelineCallbacks,
    qualityThreshold: number = 70
  ) {
    this.config = config
    this.callbacks = callbacks
    this.qualityThreshold = qualityThreshold
  }

  abort(): void {
    this.aborted = true
  }

  async execute(input: AgentInput): Promise<PipelineResult> {
    const result: PipelineResult = {
      success: false,
      outputs: {
        analyzer: null,
        strategist: null,
        copywriter: null,
        visualDirector: null,
        composer: null,
        qualityGate: null,
      },
    }

    this.aborted = false

    try {
      // Step 1: Analyzer (0-15%)
      if (this.aborted) throw new Error('Pipeline aborted')
      this.callbacks.onAgentStart('analyzer')
      this.callbacks.onProgress(5)

      const analyzerAgent = new AnalyzerAgent(this.config)
      const analyzerOutput = await analyzerAgent.execute(input)
      result.outputs.analyzer = analyzerOutput

      this.callbacks.onAgentComplete('analyzer', analyzerOutput)
      this.callbacks.onProgress(15)

      // Step 2: Strategist (15-30%)
      if (this.aborted) throw new Error('Pipeline aborted')
      this.callbacks.onAgentStart('strategist')

      const strategistAgent = new StrategistAgent(this.config)
      const strategistOutput = await strategistAgent.execute({
        agentInput: input,
        analyzerOutput,
      })
      result.outputs.strategist = strategistOutput

      this.callbacks.onAgentComplete('strategist', strategistOutput)
      this.callbacks.onProgress(30)

      // Step 3: Copywriter (30-50%)
      if (this.aborted) throw new Error('Pipeline aborted')
      this.callbacks.onAgentStart('copywriter')

      const copywriterAgent = new CopywriterAgent(this.config)
      const copywriterOutput = await copywriterAgent.execute({
        agentInput: input,
        analyzerOutput,
        strategistOutput,
      })
      result.outputs.copywriter = copywriterOutput

      this.callbacks.onAgentComplete('copywriter', copywriterOutput)
      this.callbacks.onProgress(50)

      // Step 4: Visual Director (50-65%)
      if (this.aborted) throw new Error('Pipeline aborted')
      this.callbacks.onAgentStart('visual-director')

      const visualDirectorAgent = new VisualDirectorAgent(this.config)
      const visualDirectorOutput = await visualDirectorAgent.execute({
        agentInput: input,
        analyzerOutput,
        strategistOutput,
        copywriterOutput,
      })
      result.outputs.visualDirector = visualDirectorOutput

      this.callbacks.onAgentComplete('visual-director', visualDirectorOutput)
      this.callbacks.onProgress(65)

      // Step 5: Composer (65-85%)
      if (this.aborted) throw new Error('Pipeline aborted')
      this.callbacks.onAgentStart('composer')

      const composerAgent = new ComposerAgent(this.config)
      const composerOutput = await composerAgent.execute({
        agentInput: input,
        copywriterOutput,
        visualDirectorOutput,
      })
      result.outputs.composer = composerOutput

      this.callbacks.onAgentComplete('composer', composerOutput)
      this.callbacks.onProgress(85)

      // Step 6: Quality Gate (85-100%)
      if (this.aborted) throw new Error('Pipeline aborted')
      this.callbacks.onAgentStart('quality-gate')

      const qualityGateAgent = new QualityGateAgent(this.config)
      const qualityGateOutput = await qualityGateAgent.execute({
        agentInput: input,
        copywriterOutput,
        visualDirectorOutput,
        composerOutput,
        qualityThreshold: this.qualityThreshold,
      })
      result.outputs.qualityGate = qualityGateOutput

      this.callbacks.onAgentComplete('quality-gate', qualityGateOutput)
      this.callbacks.onProgress(100)

      result.success = qualityGateOutput.passed

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      result.error = errorMessage

      // Determine which agent failed
      if (!result.outputs.analyzer) {
        this.callbacks.onAgentError('analyzer', error as Error)
      } else if (!result.outputs.strategist) {
        this.callbacks.onAgentError('strategist', error as Error)
      } else if (!result.outputs.copywriter) {
        this.callbacks.onAgentError('copywriter', error as Error)
      } else if (!result.outputs.visualDirector) {
        this.callbacks.onAgentError('visual-director', error as Error)
      } else if (!result.outputs.composer) {
        this.callbacks.onAgentError('composer', error as Error)
      } else {
        this.callbacks.onAgentError('quality-gate', error as Error)
      }

      return result
    }
  }
}

// ============================================
// CONVENIENCE FUNCTION
// ============================================

export async function runPipeline(
  config: GeminiAPIConfig,
  input: AgentInput,
  callbacks: PipelineCallbacks,
  qualityThreshold?: number
): Promise<PipelineResult> {
  const orchestrator = new PipelineOrchestrator(config, callbacks, qualityThreshold)
  return orchestrator.execute(input)
}
