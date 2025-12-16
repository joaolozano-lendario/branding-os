/**
 * Generate Wizard V2 Page
 * Branding OS - Academia Lendaria
 * E6: Full Generation Wizard with Pipeline V2 Integration (6-Agent Synergy)
 */

import * as React from 'react'
import { Icon } from '@/components/ui/icon'
import { useToast } from '@/components/ui/toast'
import { useTranslation } from '@/store/i18nStore'
import { useWizardStore, WIZARD_STEPS, type WizardStep } from '@/store/wizardStore'
import { usePipelineV2Store } from '@/store/pipelineV2Store'
import { useAgentStore } from '@/store/agentStore'
import {
  PipelineOrchestratorV2,
  adaptToPipelineInput,
  type PipelineV2Callbacks,
  type PipelineAgentId,
} from '@/services/agents-v2'
import type { AgentIdV2 } from '@/types/agent'
import {
  WizardStepIndicator,
  AssetTypeStep,
  ProductContextStep,
  GoalAngleStep,
  ContentInputStep,
  GenerationStepV2,
  PreviewExportStepV2,
} from '@/components/wizard'

// Add button pulse animations
const buttonAnimations = `
  @keyframes borderPulse {
    0% {
      box-shadow: inset 0px 0px 0px 5px rgba(88, 86, 214, 0.1), 0px 0px 0px 0px rgba(88, 86, 214, 0.8);
    }
    100% {
      box-shadow: inset 0px 0px 0px 3px rgba(88, 86, 214, 0.1), 0px 0px 0px 10px rgba(88, 86, 214, 0);
    }
  }
  
  @keyframes hoverShine {
    0% {
      background-image: linear-gradient(135deg, rgba(88, 86, 214, 0.8) 0%, rgba(88, 86, 214, 0) 50%, rgba(88, 86, 214, 0) 100%);
    }
    50% {
      background-image: linear-gradient(135deg, rgba(88, 86, 214, 0) 0%, rgba(88, 86, 214, 0.8) 50%, rgba(88, 86, 214, 0) 100%);
    }
    100% {
      background-image: linear-gradient(135deg, rgba(88, 86, 214, 0) 0%, rgba(88, 86, 214, 0) 50%, rgba(88, 86, 214, 0.8) 100%);
    }
  }
`

// Inject animations
if (typeof document !== 'undefined') {
  const styleElement = document.getElementById('button-pulse-animations')
  if (!styleElement) {
    const style = document.createElement('style')
    style.id = 'button-pulse-animations'
    style.textContent = buttonAnimations
    document.head.appendChild(style)
  }
}


// Map PipelineAgentId to AgentIdV2 for the store
function mapAgentId(pipelineAgentId: PipelineAgentId): AgentIdV2 {
  switch (pipelineAgentId) {
    case 'brand-strategist':
      return 'brand-strategist'
    case 'story-architect':
      return 'story-architect'
    case 'copywriter':
      return 'copywriter-v2'
    case 'visual-compositor':
      return 'visual-compositor'
    case 'image-generator':
      return 'visual-compositor' // Map to visual-compositor for now if image-generator is not in AgentIdV2
    case 'quality-validator':
      return 'quality-validator'
    case 'render-engine':
      return 'render-engine'
  }
}

export function GenerateWizardV2() {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const orchestratorRef = React.useRef<PipelineOrchestratorV2 | null>(null)

  // Wizard State
  const {
    currentStep,
    completedSteps,
    assetType,
    productContext,
    goal,
    content,
    setStep,
    nextStep,
    previousStep,
    goToStep,
    setAssetType,
    setProductContext,
    setGoal,
    setContent,
    validateCurrentStep,
    getStepErrors,
    buildAgentInput,
    reset,
  } = useWizardStore()

  // Pipeline V2 State
  const {
    apiConfig,
    isApiConfigured,
    status: pipelineStatus,
    progress,
    progressMessage,
    currentAgent,
    agentStatuses,
    error,
    result,
    startPipeline,
    updateAgentStatus,
    setAgentDuration,
    setCurrentAgent,
    setProgress,
    completePipeline,
    failPipeline,
    resetPipeline,
    syncGeneratedImages,
  } = usePipelineV2Store()

  // Fallback to old store for API config if V2 not configured
  const oldAgentStore = useAgentStore()
  const effectiveApiConfig = apiConfig || oldAgentStore.apiConfig
  const effectiveIsApiConfigured = isApiConfigured || oldAgentStore.isApiConfigured

  const handleNext = React.useCallback(async () => {
    if (!validateCurrentStep()) return

    if (currentStep === 'content') {
      // Build agent input from wizard
      const agentInput = buildAgentInput()
      if (!agentInput) return

      // Check API configuration
      if (!effectiveApiConfig || !effectiveIsApiConfigured) {
        addToast('warning', t.errors.apiKey)
        return
      }

      // Convert to V2 PipelineInput format
      const pipelineInput = adaptToPipelineInput(agentInput)

      // Start pipeline
      startPipeline(pipelineInput)
      setStep('generation')

      // Set up V2 callbacks
      const callbacks: PipelineV2Callbacks = {
        onAgentStart: (agentId) => {
          const mappedId = mapAgentId(agentId)
          setCurrentAgent(mappedId)
          updateAgentStatus(mappedId, 'running')
        },
        onAgentComplete: (agentId, _output, duration) => {
          const mappedId = mapAgentId(agentId)
          updateAgentStatus(mappedId, 'complete')
          setAgentDuration(mappedId, duration)
        },
        onAgentError: (agentId, err) => {
          const mappedId = mapAgentId(agentId)
          updateAgentStatus(mappedId, 'error')
          failPipeline(err.message)
        },
        onProgress: (prog, message) => {
          setProgress(prog, message)
        },
      }

      // Create V2 orchestrator
      orchestratorRef.current = new PipelineOrchestratorV2(effectiveApiConfig, callbacks)

      try {
        const pipelineResult = await orchestratorRef.current.execute(pipelineInput)

        if (pipelineResult.success || pipelineResult.render) {
          completePipeline(pipelineResult)
          // Sync generated images from visual.slides to slideImages for preview
          syncGeneratedImages()

          if (pipelineResult.success) {
            addToast('success', t.common.success)
          } else {
            addToast('warning', 'Gerado com avisos de qualidade. Verifique os detalhes.')
          }

          setStep('preview')
        } else {
          addToast('error', pipelineResult.error || t.errors.generationFailed)
          failPipeline(pipelineResult.error || 'Pipeline failed')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t.errors.generationFailed
        addToast('error', errorMessage)
        failPipeline(errorMessage)
      }
    } else {
      nextStep()
    }
  }, [
    currentStep,
    validateCurrentStep,
    buildAgentInput,
    effectiveApiConfig,
    effectiveIsApiConfigured,
    startPipeline,
    setStep,
    setCurrentAgent,
    updateAgentStatus,
    setAgentDuration,
    failPipeline,
    setProgress,
    completePipeline,
    syncGeneratedImages,
    nextStep,
    addToast,
    t,
  ])

  const handleBack = React.useCallback(() => {
    if (currentStep === 'generation') {
      orchestratorRef.current?.abort()
      resetPipeline()
    }
    previousStep()
  }, [currentStep, previousStep, resetPipeline])

  const handleStepClick = React.useCallback(
    (step: WizardStep) => {
      if (currentStep === 'generation' || currentStep === 'preview') return
      goToStep(step)
    },
    [currentStep, goToStep]
  )

  // Reserved for future features
  void result
  void reset // Will be used for "Create New" feature
  void resetPipeline // Will be used for "Create New" feature

  const renderStepContent = () => {
    switch (currentStep) {
      case 'assetType':
        return (
          <AssetTypeStep
            selectedType={assetType}
            onSelect={setAssetType}
            errors={getStepErrors('assetType')}
          />
        )
      case 'context':
        return (
          <ProductContextStep
            context={productContext}
            onChange={setProductContext}
            errors={getStepErrors('context')}
          />
        )
      case 'goal':
        return <GoalAngleStep goal={goal} onChange={setGoal} errors={getStepErrors('goal')} />
      case 'content':
        return (
          <ContentInputStep
            content={content}
            onChange={setContent}
            errors={getStepErrors('content')}
          />
        )
      case 'generation':
        return (
          <GenerationStepV2
            progress={progress}
            progressMessage={progressMessage}
            currentAgent={currentAgent}
            agentStatuses={agentStatuses}
            error={error}
          />
        )
      case 'preview':
        return (
          <PreviewExportStepV2
            pipelineResult={result}
            onBack={handleBack}
          />
        )
      default:
        return null
    }
  }

  const isFirstStep = currentStep === WIZARD_STEPS[0]
  const isLastStep = currentStep === 'preview'
  const isGenerating = currentStep === 'generation' && pipelineStatus === 'running'
  const hasError = pipelineStatus === 'error'
  const currentStepIndex = WIZARD_STEPS.indexOf(currentStep)

  return (
    // Figma: bg #FFFFFF
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-[1190px] space-y-8">
        {/* Figma: Step Indicator */}
        <WizardStepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        {/* Content Area - no card wrapper in Figma */}
        <div className="py-4 pb-32">{renderStepContent()}</div>

        {/* Figma: Navigation - Voltar left, dots center, Próximo right */}
        {!isLastStep && (
          <div className="sticky bottom-0 z-10 -mx-6 md:-mx-10 bg-gradient-to-t from-background via-background to-transparent pt-12 pb-6">
            <div className="px-6 md:px-10">
              <div className="flex items-center justify-between max-w-[1190px] mx-auto">
                {/* Figma: Voltar button - 105x41, bg #F8F8F8, border #E8E8E8, radius 200px */}
                <button
                  onClick={handleBack}
                  disabled={isFirstStep || isGenerating}
                  className="flex items-center justify-center gap-2 w-[105px] h-[41px] rounded-full bg-secondary border border-border disabled:opacity-50 hover:bg-muted transition-colors"
                >
                  <Icon name="angle-small-left" className="w-[14px] h-[14px] shrink-0 text-[#C8C8C8]" />
                  {/* Figma: Inter SemiBold 14px, #C8C8C8 */}
                  <span className="text-sm font-semibold leading-none text-[#C8C8C8]">Voltar</span>
                </button>

                {/* Figma: Pagination dots - gap 16px, current = number 12px, others = 4px circles */}
                <div className="flex items-center gap-4">
                  {WIZARD_STEPS.map((step, index) => (
                    <div key={step} className="flex items-center justify-center">
                      {index === currentStepIndex ? (
                        <span className="text-xs font-semibold text-[#5856D6]">{index + 1}</span>
                      ) : (
                        <div className="w-1 h-1 rounded-full bg-[#E8E8E8]" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Figma: Próximo button - 122x41, bg #5856D6, radius 200px */}
                <div className="flex items-center gap-3">
                  {hasError && (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 h-[41px] px-[18px] rounded-full bg-secondary border border-border"
                    >
                      <Icon name="refresh" className="w-[14px] h-[14px] shrink-0 text-muted-foreground" />
                      <span className="text-sm font-semibold leading-none text-muted-foreground">Tentar novamente</span>
                    </button>
                  )}

                  {!isGenerating && !hasError && currentStep !== 'generation' && (
                    <button
                      onClick={handleNext}
                      style={assetType ? {
                        animation: 'borderPulse 1500ms infinite ease-out'
                      } : undefined}
                      className="flex items-center justify-center gap-2 w-[122px] h-[41px] rounded-full bg-[#5856D6] hover:bg-[#4a48b8] transition-colors"
                    >
                      {/* Figma: Inter SemiBold 14px, white */}
                      <span className="text-sm font-semibold leading-none text-white">
                        {currentStep === 'content' ? 'Gerar' : 'Próximo'}
                      </span>
                      <Icon name="angle-small-right" className="w-[14px] h-[14px] shrink-0 text-white" />
                    </button>
                  )}

                  {isGenerating && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 h-[41px] px-[18px] rounded-full bg-red-500"
                    >
                      <Icon name="cross" className="w-[14px] h-[14px] text-white" />
                      <span className="text-sm font-semibold text-white">Cancelar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  )
}
