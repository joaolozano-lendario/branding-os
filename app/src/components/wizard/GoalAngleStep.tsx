/**
 * Goal & Angle Step
 * Branding OS - Academia Lendaria
 * E4: BRAND-024 - Step 3 of Generation Wizard
 */

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Icon } from '@/components/ui/icon'
import { useTranslation } from '@/store/i18nStore'
import type { GenerationGoal } from '@/types/agent'

interface GoalAngleStepProps {
  goal: GenerationGoal
  onChange: (goal: Partial<GenerationGoal>) => void
  errors: string[]
}

type GoalType = GenerationGoal['type']
type AngleType = GenerationGoal['angle']

interface GoalOption {
  type: GoalType
  icon: string
}

interface AngleOption {
  type: AngleType
  icon: string
}

const GOAL_TYPES: GoalOption[] = [
  { type: 'awareness', icon: 'eye' },
  { type: 'consideration', icon: 'comment-alt' },
  { type: 'conversion', icon: 'shopping-cart' },
  { type: 'retention', icon: 'heart' },
]

const ANGLE_TYPES: AngleOption[] = [
  { type: 'benefit-focused', icon: 'star' },
  { type: 'problem-solution', icon: 'puzzle-pieces' },
  { type: 'social-proof', icon: 'users' },
  { type: 'urgency', icon: 'clock' },
]

export function GoalAngleStep({ goal, onChange, errors }: GoalAngleStepProps) {
  const { t } = useTranslation()

  const getGoalLabel = (type: GoalType): string => {
    switch (type) {
      case 'awareness':
        return t.wizard.steps.goal.awareness
      case 'consideration':
        return t.wizard.steps.goal.consideration
      case 'conversion':
        return t.wizard.steps.goal.conversion
      case 'retention':
        return t.wizard.steps.goal.retention
      default:
        return type
    }
  }

  const getAngleLabel = (type: AngleType): string => {
    switch (type) {
      case 'benefit-focused':
        return t.wizard.steps.goal.benefitFocused
      case 'problem-solution':
        return t.wizard.steps.goal.problemSolution
      case 'social-proof':
        return t.wizard.steps.goal.socialProof
      case 'urgency':
        return t.wizard.steps.goal.urgency
      default:
        return type
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with split layout */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <h2 className="font-sans text-[40px] font-semibold leading-tight text-black">
          {t.wizard.steps.goal.title}
        </h2>
        <p className="text-base font-medium text-[#888888] md:max-w-[278px]">
          {t.wizard.steps.goal.subtitle}
        </p>
      </div>

      {/* Goal Selection - 4 columns */}
      <div>
        <Label className="block text-lg font-semibold text-black mb-3">
          {t.wizard.steps.goal.goalLabel}:
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {GOAL_TYPES.map(({ type, icon }) => {
            const isSelected = goal.type === type
            const hasSelection = !!goal.type
            const isInactive = hasSelection && !isSelected

            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ type })}
                style={isSelected ? {
                  animation: 'colorShift 8s ease-in-out infinite alternate',
                  backgroundColor: '#5856D6'
                } : undefined}
                className={cn(
                  'flex flex-col items-start p-6 rounded-lg transition-all duration-[800ms] text-left border',
                  'min-h-[200px]',
                  isSelected && 'border-transparent',
                  isInactive && 'bg-[#f8f8f8] border-transparent',
                  !isSelected && !isInactive && 'border-[#E8E8E8] hover:border-[#5856D6]/50'
                )}
              >
                {/* Icon container 50x50 */}
                <div
                  className={cn(
                    'flex h-[50px] w-[50px] items-center justify-center rounded-full transition-all duration-[800ms]',
                    isSelected ? 'bg-white/16' : isInactive ? 'bg-[#e8e8e8]' : 'bg-[#5856D6]'
                  )}
                >
                  <Icon name={icon} className={cn(
                    'w-[18px] h-[18px] inline-flex items-center justify-center transition-all duration-[800ms]',
                    isInactive ? 'text-[#c8c8c8]' : 'text-white'
                  )} />
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Label */}
                <span className={cn(
                  'text-base font-semibold transition-all duration-[800ms]',
                  isSelected ? 'text-white' : isInactive ? 'text-[#c8c8c8]' : 'text-black'
                )}>
                  {getGoalLabel(type)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Angle Selection - 4 columns */}
      <div>
        <Label className="block text-lg font-semibold text-black mb-3">
          {t.wizard.steps.goal.angleLabel}:
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {ANGLE_TYPES.map(({ type, icon }) => {
            const isSelected = goal.angle === type
            const hasSelection = !!goal.angle
            const isInactive = hasSelection && !isSelected

            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ angle: type })}
                style={isSelected ? {
                  animation: 'colorShift 8s ease-in-out infinite alternate',
                  backgroundColor: '#5856D6'
                } : undefined}
                className={cn(
                  'flex flex-col items-start p-6 rounded-lg transition-all duration-[800ms] text-left border',
                  'min-h-[200px]',
                  isSelected && 'border-transparent',
                  isInactive && 'bg-[#f8f8f8] border-transparent',
                  !isSelected && !isInactive && 'border-[#E8E8E8] hover:border-[#5856D6]/50'
                )}
              >
                {/* Icon container 50x50 */}
                <div
                  className={cn(
                    'flex h-[50px] w-[50px] items-center justify-center rounded-full transition-all duration-[800ms]',
                    isSelected ? 'bg-white/16' : isInactive ? 'bg-[#e8e8e8]' : 'bg-[#5856D6]'
                  )}
                >
                  <Icon name={icon} className={cn(
                    'w-[18px] h-[18px] inline-flex items-center justify-center transition-all duration-[800ms]',
                    isInactive ? 'text-[#c8c8c8]' : 'text-white'
                  )} />
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Label */}
                <span className={cn(
                  'text-base font-semibold transition-all duration-[800ms]',
                  isSelected ? 'text-white' : isInactive ? 'text-[#c8c8c8]' : 'text-black'
                )}>
                  {getAngleLabel(type)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Additional Instructions */}
      <div className="space-y-2">
        <Label htmlFor="instructions" className="text-xs font-semibold text-black">
          {t.wizard.steps.goal.instructions}:
        </Label>
        <textarea
          id="instructions"
          value={goal.instructions || ''}
          onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder="ex.: Instruções específicas para a IA..."
          rows={3}
          className="w-full px-6 py-4 rounded-lg border border-[#E8E8E8] bg-[#f8f8f8] resize-none transition-all duration-[800ms] text-base font-medium placeholder:text-[#888888] focus:outline-none focus:!border-[#5856D6] hover:!border-[#5856D6]"
        />
      </div>

      {errors.length > 0 && (
        <div className="text-center text-sm text-destructive">
          {errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}
    </div>
  )
}
