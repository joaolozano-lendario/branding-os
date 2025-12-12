/**
 * Pipeline Orchestrator v2.0
 * Branding OS - Academia Lendaria
 *
 * Orquestra a execução de todos os 6 agentes em sequência.
 * Cada agente recebe o output dos anteriores, criando SINERGIA total.
 */

import type { GeminiAPIConfig } from '@/types/agent'
import type {
  PipelineInput,
  PipelineResult,
  StrategyBlueprint,
  StoryStructure,
  CopyOutput,
  VisualSpecification,
  QualityReport,
  RenderOutput,
} from '@/types/pipeline'
import { BrandStrategistAgent } from './brand-strategist'
import { StoryArchitectAgent } from './story-architect'
import { CopywriterAgentV2 } from './copywriter'
import { VisualCompositorAgent } from './visual-compositor'
import { QualityValidatorAgent } from './quality-validator'
import { renderEngine, RenderEngine } from './render-engine'

// ============================================
// PIPELINE CALLBACKS
// ============================================

export type PipelineAgentId =
  | 'brand-strategist'
  | 'story-architect'
  | 'copywriter'
  | 'visual-compositor'
  | 'quality-validator'
  | 'render-engine'

export interface PipelineV2Callbacks {
  onAgentStart: (agentId: PipelineAgentId) => void
  onAgentComplete: (agentId: PipelineAgentId, output: unknown, duration: number) => void
  onAgentError: (agentId: PipelineAgentId, error: Error) => void
  onProgress: (progress: number, message: string) => void
}

// ============================================
// PIPELINE ORCHESTRATOR
// ============================================

export class PipelineOrchestratorV2 {
  private callbacks: PipelineV2Callbacks
  private aborted: boolean = false

  // Agent instances
  private brandStrategist: BrandStrategistAgent
  private storyArchitect: StoryArchitectAgent
  private copywriter: CopywriterAgentV2
  private visualCompositor: VisualCompositorAgent
  private qualityValidator: QualityValidatorAgent
  private renderer: RenderEngine

  constructor(config: GeminiAPIConfig, callbacks: PipelineV2Callbacks) {
    this.callbacks = callbacks

    // Initialize agents
    this.brandStrategist = new BrandStrategistAgent(config)
    this.storyArchitect = new StoryArchitectAgent(config)
    this.copywriter = new CopywriterAgentV2(config)
    this.visualCompositor = new VisualCompositorAgent(config)
    this.qualityValidator = new QualityValidatorAgent(config)
    this.renderer = renderEngine
  }

  abort(): void {
    this.aborted = true
  }

  async execute(input: PipelineInput): Promise<PipelineResult> {
    const startTime = Date.now()
    const agentDurations: Record<string, number> = {}

    this.aborted = false

    // Initialize result structure
    let strategy: StrategyBlueprint | null = null
    let story: StoryStructure | null = null
    let copy: CopyOutput | null = null
    let visual: VisualSpecification | null = null
    let quality: QualityReport | null = null
    let render: RenderOutput | null = null

    try {
      // ============================================
      // AGENT 1: BRAND STRATEGIST (0-15%)
      // ============================================
      if (this.aborted) throw new Error('Pipeline aborted')

      this.callbacks.onAgentStart('brand-strategist')
      this.callbacks.onProgress(5, 'Analyzing brief and selecting strategy...')

      const strategistStart = Date.now()
      strategy = await this.brandStrategist.execute({ pipelineInput: input })
      agentDurations['brand-strategist'] = Date.now() - strategistStart

      this.callbacks.onAgentComplete('brand-strategist', strategy, agentDurations['brand-strategist'])
      this.callbacks.onProgress(15, `Strategy: ${strategy.templateName} with ${strategy.narrativeAngle} angle`)

      // ============================================
      // AGENT 2: STORY ARCHITECT (15-30%)
      // ============================================
      if (this.aborted) throw new Error('Pipeline aborted')

      this.callbacks.onAgentStart('story-architect')
      this.callbacks.onProgress(18, 'Building narrative structure...')

      const storyStart = Date.now()
      story = await this.storyArchitect.execute({
        pipelineInput: input,
        strategy
      })
      agentDurations['story-architect'] = Date.now() - storyStart

      this.callbacks.onAgentComplete('story-architect', story, agentDurations['story-architect'])
      this.callbacks.onProgress(30, `Structure: ${story.totalSlides} slides planned`)

      // ============================================
      // AGENT 3: COPYWRITER (30-50%)
      // ============================================
      if (this.aborted) throw new Error('Pipeline aborted')

      this.callbacks.onAgentStart('copywriter')
      this.callbacks.onProgress(35, 'Writing copy for each slide...')

      const copyStart = Date.now()
      copy = await this.copywriter.execute({
        pipelineInput: input,
        strategy,
        story
      })
      agentDurations['copywriter'] = Date.now() - copyStart

      this.callbacks.onAgentComplete('copywriter', copy, agentDurations['copywriter'])
      this.callbacks.onProgress(50, `Copy: ${copy.slides.length} slides written`)

      // ============================================
      // AGENT 4: VISUAL COMPOSITOR (50-70%)
      // ============================================
      if (this.aborted) throw new Error('Pipeline aborted')

      this.callbacks.onAgentStart('visual-compositor')
      this.callbacks.onProgress(55, 'Creating visual specifications...')

      const visualStart = Date.now()
      visual = await this.visualCompositor.execute({
        pipelineInput: input,
        strategy,
        story,
        copy
      })
      agentDurations['visual-compositor'] = Date.now() - visualStart

      this.callbacks.onAgentComplete('visual-compositor', visual, agentDurations['visual-compositor'])
      this.callbacks.onProgress(70, `Visual: ${visual.slides.length} slides designed`)

      // ============================================
      // AGENT 5: QUALITY VALIDATOR (70-85%)
      // ============================================
      if (this.aborted) throw new Error('Pipeline aborted')

      this.callbacks.onAgentStart('quality-validator')
      this.callbacks.onProgress(75, 'Validating brand compliance...')

      const qualityStart = Date.now()
      quality = await this.qualityValidator.execute({
        pipelineInput: input,
        copy,
        visual
      })
      agentDurations['quality-validator'] = Date.now() - qualityStart

      this.callbacks.onAgentComplete('quality-validator', quality, agentDurations['quality-validator'])
      this.callbacks.onProgress(85, `Quality: ${quality.score}/100 (${quality.passed ? 'PASSED' : 'NEEDS REVIEW'})`)

      // ============================================
      // AGENT 6: RENDER ENGINE (85-100%)
      // ============================================
      if (this.aborted) throw new Error('Pipeline aborted')

      this.callbacks.onAgentStart('render-engine')
      this.callbacks.onProgress(90, 'Rendering final assets...')

      const renderStart = Date.now()
      render = this.renderer.render(visual)
      agentDurations['render-engine'] = Date.now() - renderStart

      this.callbacks.onAgentComplete('render-engine', render, agentDurations['render-engine'])
      this.callbacks.onProgress(100, 'Generation complete!')

      // ============================================
      // BUILD FINAL RESULT
      // ============================================
      const totalDuration = Date.now() - startTime

      return {
        success: quality.passed,
        metadata: {
          pipelineId: crypto.randomUUID(),
          version: '2.0.0',
          generatedAt: new Date(),
          duration: totalDuration,
          agentDurations
        },
        strategy,
        story,
        copy,
        visual,
        quality,
        render,
        summary: {
          template: strategy.templateName,
          slideCount: copy.slides.length,
          qualityScore: quality.score,
          mainCTA: copy.microcopy.ctaButton
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // Determine which agent failed
      if (!strategy) {
        this.callbacks.onAgentError('brand-strategist', error as Error)
      } else if (!story) {
        this.callbacks.onAgentError('story-architect', error as Error)
      } else if (!copy) {
        this.callbacks.onAgentError('copywriter', error as Error)
      } else if (!visual) {
        this.callbacks.onAgentError('visual-compositor', error as Error)
      } else if (!quality) {
        this.callbacks.onAgentError('quality-validator', error as Error)
      } else {
        this.callbacks.onAgentError('render-engine', error as Error)
      }

      // Return partial result with error
      return {
        success: false,
        error: errorMessage,
        metadata: {
          pipelineId: crypto.randomUUID(),
          version: '2.0.0',
          generatedAt: new Date(),
          duration: Date.now() - startTime,
          agentDurations
        },
        strategy: strategy!,
        story: story!,
        copy: copy!,
        visual: visual!,
        quality: quality!,
        render: render!,
        summary: {
          template: strategy?.templateName || 'unknown',
          slideCount: copy?.slides.length || 0,
          qualityScore: quality?.score || 0,
          mainCTA: copy?.microcopy.ctaButton || ''
        }
      }
    }
  }
}

// ============================================
// CONVENIENCE FUNCTION
// ============================================

export async function runPipelineV2(
  config: GeminiAPIConfig,
  input: PipelineInput,
  callbacks: PipelineV2Callbacks
): Promise<PipelineResult> {
  const orchestrator = new PipelineOrchestratorV2(config, callbacks)
  return orchestrator.execute(input)
}
