/**
 * Wizard Step Indicator
 * Branding OS - Academia Lendaria
 * E4: Generation Wizard - Step progress indicator
 */

import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { useTranslation } from '@/store/i18nStore'
import { WIZARD_STEPS, type WizardStep } from '@/store/wizardStore'

interface WizardStepIndicatorProps {
  currentStep: WizardStep
  completedSteps: Set<WizardStep>
  onStepClick?: (step: WizardStep) => void
}

const STEP_ICONS: Record<WizardStep, string> = {
  assetType: 'apps',
  context: 'document',
  goal: 'bullseye',
  content: 'edit',
  generation: 'bolt',
  preview: 'eye',
}

export function WizardStepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
}: WizardStepIndicatorProps) {
  const { t } = useTranslation()

  const getStepLabel = (step: WizardStep): string => {
    switch (step) {
      case 'assetType':
        return t.wizard.steps.assetType.title
      case 'context':
        return t.wizard.steps.context.title
      case 'goal':
        return t.wizard.steps.goal.title
      case 'content':
        return t.wizard.steps.content.title
      case 'generation':
        return t.wizard.steps.content.generating
      case 'preview':
        return t.wizard.steps.preview.title
      default:
        return step
    }
  }

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = completedSteps.has(step)
          const isCurrent = step === currentStep
          const isPast = WIZARD_STEPS.indexOf(currentStep) > index
          const isClickable = isCompleted || isPast

          return (
            <li key={step} className="relative flex-1">
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={cn(
                    'absolute left-0 top-4 -translate-y-1/2 h-0.5 w-full -translate-x-1/2',
                    isCompleted || isPast ? 'bg-primary' : 'bg-border'
                  )}
                  aria-hidden="true"
                />
              )}

              <button
                onClick={() => isClickable && onStepClick?.(step)}
                disabled={!isClickable}
                className={cn(
                  'relative flex flex-col items-center group',
                  isClickable && 'cursor-pointer',
                  !isClickable && 'cursor-default'
                )}
              >
                {/* Step circle */}
                <span
                  className={cn(
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
                    isCurrent && 'border-primary bg-primary text-primary-foreground',
                    isCompleted && !isCurrent && 'border-primary bg-primary text-primary-foreground',
                    !isCurrent && !isCompleted && 'border-border bg-background text-muted-foreground',
                    isClickable && 'group-hover:scale-110'
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <Icon name="check" size="size-4" />
                  ) : (
                    <Icon name={STEP_ICONS[step]} size="size-4" />
                  )}
                </span>

                {/* Step label */}
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center max-w-[80px] leading-tight hidden sm:block',
                    isCurrent && 'text-primary',
                    !isCurrent && 'text-muted-foreground'
                  )}
                >
                  {getStepLabel(step)}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
