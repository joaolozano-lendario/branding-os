/**
 * Generate Wizard Page
 * Branding OS - Academia Lendaria
 * E4: Full Generation Wizard with Pipeline Integration
 */

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useToast } from '@/components/ui/toast'
import { useTranslation } from '@/store/i18nStore'
import { useWizardStore, WIZARD_STEPS, type WizardStep } from '@/store/wizardStore'
import { useAgentStore } from '@/store/agentStore'
import { PipelineOrchestrator, type PipelineCallbacks } from '@/services/pipeline'
import {
  WizardStepIndicator,
  AssetTypeStep,
  ProductContextStep,
  GoalAngleStep,
  ContentInputStep,
  GenerationStep,
  PreviewExportStep,
} from '@/components/wizard'

export function GenerateWizard() {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const orchestratorRef = React.useRef<PipelineOrchestrator | null>(null)

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

  const {
    apiConfig,
    isApiConfigured,
    pipeline,
    agentStatuses,
    qualityThreshold,
    startPipeline,
    updateAgentStatus,
    setAgentOutput,
    setCurrentAgent,
    setPipelineProgress,
    completePipeline,
    failPipeline,
    resetPipeline,
  } = useAgentStore()

  const handleNext = React.useCallback(async () => {
    if (!validateCurrentStep()) return

    if (currentStep === 'content') {
      const agentInput = buildAgentInput()
      if (!agentInput) return
      if (!apiConfig || !isApiConfigured) {
        addToast('warning', t.errors.apiKey)
        return
      }

      startPipeline(agentInput)
      setStep('generation')

      const callbacks: PipelineCallbacks = {
        onAgentStart: (agentId) => {
          setCurrentAgent(agentId)
          updateAgentStatus(agentId, 'running')
        },
        onAgentComplete: (agentId, output) => {
          updateAgentStatus(agentId, 'complete')
          setAgentOutput(agentId, output)
        },
        onAgentError: (agentId, error) => {
          updateAgentStatus(agentId, 'error')
          failPipeline(error.message)
        },
        onProgress: (progress) => {
          setPipelineProgress(progress)
        },
      }

      orchestratorRef.current = new PipelineOrchestrator(apiConfig, callbacks, qualityThreshold)

      try {
        const result = await orchestratorRef.current.execute(agentInput)
        if (result.success) {
          completePipeline()
          addToast('success', t.common.success)
          setStep('preview')
        } else {
          addToast('error', result.error || t.errors.generationFailed)
          failPipeline(result.error || 'Pipeline failed')
        }
      } catch (error) {
        addToast('error', error instanceof Error ? error.message : t.errors.generationFailed)
        failPipeline(error instanceof Error ? error.message : 'Unknown error')
      }
    } else {
      nextStep()
    }
  }, [
    currentStep, validateCurrentStep, buildAgentInput, apiConfig, isApiConfigured,
    startPipeline, setStep, setCurrentAgent, updateAgentStatus, setAgentOutput,
    failPipeline, setPipelineProgress, completePipeline, qualityThreshold, nextStep, addToast,
  ])

  const handleBack = React.useCallback(() => {
    if (currentStep === 'generation') {
      orchestratorRef.current?.abort()
      resetPipeline()
    }
    previousStep()
  }, [currentStep, previousStep, resetPipeline])

  const handleStepClick = React.useCallback((step: WizardStep) => {
    if (currentStep === 'generation' || currentStep === 'preview') return
    goToStep(step)
  }, [currentStep, goToStep])

  const handleExport = React.useCallback((format: 'png' | 'pdf' | 'html') => {
    const composerOutput = pipeline.composerOutput
    if (!composerOutput) return
    if (format === 'html') {
      const blob = new Blob([composerOutput.html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'asset.' + format
      a.click()
      URL.revokeObjectURL(url)
      addToast('success', 'Exported successfully')
    }
  }, [pipeline.composerOutput, addToast])

  const handleSaveToLibrary = React.useCallback(() => {
    console.log('Save to library')
  }, [])

  const handleGenerateVariations = React.useCallback(() => {
    console.log('Generate variations')
  }, [])

  const handleCreateNew = React.useCallback(() => {
    reset()
    resetPipeline()
  }, [reset, resetPipeline])

  const renderStepContent = () => {
    switch (currentStep) {
      case 'assetType':
        return <AssetTypeStep selectedType={assetType} onSelect={setAssetType} errors={getStepErrors('assetType')} />
      case 'context':
        return <ProductContextStep context={productContext} onChange={setProductContext} errors={getStepErrors('context')} />
      case 'goal':
        return <GoalAngleStep goal={goal} onChange={setGoal} errors={getStepErrors('goal')} />
      case 'content':
        return <ContentInputStep content={content} onChange={setContent} errors={getStepErrors('content')} />
      case 'generation':
        return <GenerationStep progress={pipeline.progress} currentAgent={pipeline.currentAgent} agentStatuses={agentStatuses} error={pipeline.error} />
      case 'preview':
        return <PreviewExportStep composerOutput={pipeline.composerOutput} qualityOutput={pipeline.qualityGateOutput} onExport={handleExport} onSaveToLibrary={handleSaveToLibrary} onGenerateVariations={handleGenerateVariations} onCreateNew={handleCreateNew} />
      default:
        return null
    }
  }

  const isFirstStep = currentStep === WIZARD_STEPS[0]
  const isLastStep = currentStep === 'preview'
  const isGenerating = currentStep === 'generation' && pipeline.status === 'running'
  const hasError = pipeline.status === 'error'

  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="font-sans text-3xl font-bold tracking-tight">{t.wizard.title}</h1>
        </div>

        <div className="px-4">
          <WizardStepIndicator currentStep={currentStep} completedSteps={completedSteps} onStepClick={handleStepClick} />
        </div>

        <Card>
          <CardContent className="p-8">{renderStepContent()}</CardContent>
        </Card>

        {!isLastStep && (
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleBack} disabled={isFirstStep || isGenerating}>
              <Icon name="arrow-left" size="size-4" className="mr-2" />
              {t.common.back}
            </Button>

            <div className="flex items-center gap-3">
              {hasError && (
                <Button variant="outline" onClick={handleNext}>
                  <Icon name="refresh" size="size-4" className="mr-2" />
                  {t.common.regenerate}
                </Button>
              )}

              {!isGenerating && !hasError && currentStep !== 'generation' && (
                <Button onClick={handleNext}>
                  {currentStep === 'content' ? (
                    <>
                      <Icon name="magic-wand" size="size-4" className="mr-2" />
                      {t.common.generate}
                    </>
                  ) : (
                    <>
                      {t.common.next}
                      <Icon name="arrow-right" size="size-4" className="ml-2" />
                    </>
                  )}
                </Button>
              )}

              {isGenerating && (
                <Button variant="destructive" onClick={handleBack}>
                  <Icon name="cross" size="size-4" className="mr-2" />
                  {t.agents.pipeline.stopGeneration}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
