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

// Figma specs: Icon 18x18, specific icons per step
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
      {/* Figma: gap 6px between cards */}
      <ol className="flex items-stretch gap-1.5">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = completedSteps.has(step)
          const isCurrent = step === currentStep
          const isPast = WIZARD_STEPS.indexOf(currentStep) > index
          const currentIndex = WIZARD_STEPS.indexOf(currentStep)
          const isNext = index === currentIndex + 1
          const isClickable = isCompleted || isPast || isCurrent || isNext
          const config = STEP_CONFIG[step]

          return (
            <li key={step} className="flex-1">
              <button
                onClick={() => isClickable && onStepClick?.(step)}
                disabled={!isClickable}
                style={isCurrent ? { borderColor: '#5856D6' } : undefined}
                className={cn(
                  // Figma: 128x128, but we use flex-1 for responsive
                  // radius: 8px, centered content
                  'w-full h-32 flex flex-col items-center justify-center rounded-lg transition-all duration-[800ms] group',
                  // Figma: Active step = bg #5856D6 with 16% opacity + border 1px solid
                  isCurrent && 'bg-[#5856D6]/[0.16] border-[1px] border-solid',
                  // Figma: Inactive = bg #F8F8F8
                  !isCurrent && 'bg-[#F8F8F8]',
                  // Completed (not current) shows checkmark
                  isClickable && 'cursor-pointer hover:bg-[#5856D6]/10',
                  !isClickable && 'cursor-default'
                )}
              >
                {/* Figma: gap 8px between icon and label */}
                <div className="flex flex-col items-center gap-2">
                  {/* Icon: 18x18 */}
                  <div
                    className={cn(
                      'flex items-center justify-center transition-all duration-[800ms]',
                      // Figma: Active icon = #5856D6, Inactive = #888888
                      isCurrent || isCompleted ? 'text-[#5856D6]' : 'text-[#888888]',
                      // Hover effect
                      isClickable && !isCurrent && 'group-hover:text-[#5856D6]'
                    )}
                  >
                    {isCompleted && !isCurrent ? (
                      <Icon name="badge-check" className="text-lg" />
                    ) : (
                      <Icon name={config.icon} className="text-lg" />
                    )}
                  </div>

                  {/* Label: Inter SemiBold 12px */}
                  <span
                    className={cn(
                      'text-xs font-semibold text-center transition-all duration-[800ms]',
                      // Figma: Active = #5856D6, Inactive = #888888
                      isCurrent || isCompleted ? 'text-[#5856D6]' : 'text-[#888888]',
                      // Hover effect
                      isClickable && !isCurrent && 'group-hover:text-[#5856D6]'
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
