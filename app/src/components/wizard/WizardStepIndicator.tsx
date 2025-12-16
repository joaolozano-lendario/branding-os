/**
 * Wizard Step Indicator
 * Branding OS - Academia Lendaria
 * Pixel-perfect from Figma specs
 */

import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { WIZARD_STEPS, type WizardStep } from '@/store/wizardStore'

interface WizardStepIndicatorProps {
  currentStep: WizardStep
  completedSteps: Set<WizardStep>
  onStepClick?: (step: WizardStep) => void
}

const STEP_CONFIG: Record<WizardStep, { icon: string; label: string }> = {
  assetType: { icon: 'apps-add', label: 'Ativo' },
  context: { icon: 'list', label: 'Contexto' },
  goal: { icon: 'bullseye', label: 'Objetivo' },
  content: { icon: 'poll-h', label: 'Conteúdo' },
  generation: { icon: 'bars-progress', label: 'Gerar' },
  preview: { icon: 'download', label: 'Exportar' },
}

export function WizardStepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
}: WizardStepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-stretch gap-4 justify-center">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = completedSteps.has(step)
          const isCurrent = step === currentStep
          const isPast = WIZARD_STEPS.indexOf(currentStep) > index
          const currentIndex = WIZARD_STEPS.indexOf(currentStep)
          const isNext = index === currentIndex + 1
          const isClickable = isCompleted || isPast || isCurrent || isNext
          const config = STEP_CONFIG[step]

          return (
            <li key={step} className="shrink-0">
              <button
                onClick={() => isClickable && onStepClick?.(step)}
                disabled={!isClickable}
                className={cn(
                  'w-32 h-32 flex flex-col items-center justify-center rounded-lg transition-all duration-300 group relative',
                  // Base background
                  'bg-secondary',
                  // Active state
                  isCurrent && 'bg-primary/15 border border-primary/20',
                  // Hover state
                  isClickable && !isCurrent && 'hover:bg-primary/5 hover:border-primary/20',
                  // Completed state (if not current) could have specific style if needed
                  !isClickable && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex flex-col items-center gap-4">
                  {/* Icon Container */}
                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300',
                      isCurrent ? 'bg-primary/10 text-primary' : 'bg-transparent text-[#888888] group-hover:text-primary'
                    )}
                  >
                    {isCompleted && !isCurrent ? (
                      <Icon name="check" className="w-5 h-5" />
                    ) : (
                      <Icon name={config.icon} className="w-6 h-6" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      'text-xs font-semibold transition-colors duration-300',
                      isCurrent ? 'text-primary' : 'text-[#888888] group-hover:text-primary'
                    )}
                  >
                    {config.label}
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
