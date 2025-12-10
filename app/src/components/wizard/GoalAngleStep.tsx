/**
 * Goal & Angle Step
 * Branding OS - Academia Lendaria
 * E4: BRAND-024 - Step 3 of Generation Wizard
 */

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  color: string
}

interface AngleOption {
  type: AngleType
  icon: string
}

const GOAL_TYPES: GoalOption[] = [
  { type: 'awareness', icon: 'eye', color: '#5856D6' },
  { type: 'consideration', icon: 'comment-alt', color: '#007AFF' },
  { type: 'conversion', icon: 'shopping-cart', color: '#34C759' },
  { type: 'retention', icon: 'heart', color: '#FF2D55' },
]

const ANGLE_TYPES: AngleOption[] = [
  { type: 'benefit-focused', icon: 'star' },
  { type: 'problem-solution', icon: 'puzzle-piece' },
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
      <div className="text-center">
        <h2 className="font-sans text-2xl font-bold tracking-tight">
          {t.wizard.steps.goal.title}
        </h2>
        <p className="mt-2 font-serif text-muted-foreground">
          {t.wizard.steps.goal.subtitle}
        </p>
      </div>

      {/* Goal Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          {t.wizard.steps.goal.title.split(' ')[0]}
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GOAL_TYPES.map(({ type, icon, color }) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ type })}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                goal.type === type
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
              )}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}20`, color }}
              >
                <Icon name={icon} size="size-5" />
              </div>
              <span className="text-sm font-medium text-center">
                {getGoalLabel(type)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Angle Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          {t.wizard.steps.goal.angle}
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ANGLE_TYPES.map(({ type, icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ angle: type })}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                goal.angle === type
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Icon name={icon} size="size-5" />
              </div>
              <span className="text-sm font-medium text-center">
                {getAngleLabel(type)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Instructions */}
      <div className="space-y-2 max-w-xl mx-auto">
        <Label htmlFor="instructions">
          {t.wizard.steps.goal.instructions}
        </Label>
        <Textarea
          id="instructions"
          value={goal.instructions || ''}
          onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder="Any specific instructions for the AI..."
          rows={3}
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
