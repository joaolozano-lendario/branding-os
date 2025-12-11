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
      {/* Header with split layout */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight">
            {t.wizard.steps.goal.title}
          </h2>
        </div>
        <p className="font-serif text-muted-foreground md:text-right md:max-w-xs">
          {t.wizard.steps.goal.subtitle}
        </p>
      </div>

      {/* Goal Selection - 4 columns */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          {t.wizard.steps.goal.title.split(' ')[0]}:
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GOAL_TYPES.map(({ type, icon }) => {
            const isSelected = goal.type === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ type })}
                className={cn(
                  'flex flex-col items-start p-5 rounded-xl border transition-all text-left',
                  'min-h-[140px]',
                  isSelected
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border hover:border-primary/20 hover:bg-muted/30'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl mb-3',
                    isSelected
                      ? 'bg-primary/20 text-primary'
                      : 'bg-primary/10 text-primary'
                  )}
                >
                  <Icon name={icon} size="size-5" />
                </div>
                <span className="text-sm font-medium">
                  {getGoalLabel(type)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Angle Selection - 4 columns */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          {t.wizard.steps.goal.angle}:
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ANGLE_TYPES.map(({ type, icon }) => {
            const isSelected = goal.angle === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ angle: type })}
                className={cn(
                  'flex flex-col items-start p-5 rounded-xl border transition-all text-left',
                  'min-h-[140px]',
                  isSelected
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border hover:border-primary/20 hover:bg-muted/30'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl mb-3',
                    isSelected
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Icon name={icon} size="size-5" />
                </div>
                <span className="text-sm font-medium">
                  {getAngleLabel(type)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Additional Instructions */}
      <div className="space-y-2 max-w-2xl">
        <Label htmlFor="instructions" className="text-sm font-medium">
          {t.wizard.steps.goal.instructions}:
        </Label>
        <Textarea
          id="instructions"
          value={goal.instructions || ''}
          onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder="Any specific instructions for the AI..."
          rows={3}
          className="resize-none bg-background border-border"
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
