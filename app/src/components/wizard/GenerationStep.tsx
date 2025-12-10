/**
 * Generation Step
 * Branding OS - Academia Lendaria
 * E4: BRAND-026 - Pipeline Integration Step
 */

import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { useTranslation } from '@/store/i18nStore'
import { AGENT_METADATA, type AgentId, type AgentStatus } from '@/types/agent'

interface GenerationStepProps {
  progress: number
  currentAgent: AgentId | null
  agentStatuses: Record<AgentId, AgentStatus>
  error: string | null
}

const AGENT_ORDER: AgentId[] = [
  'analyzer',
  'strategist',
  'copywriter',
  'visual-director',
  'composer',
  'quality-gate',
]

export function GenerationStep({
  progress,
  currentAgent,
  agentStatuses,
  error,
}: GenerationStepProps) {
  const { t } = useTranslation()

  const getAgentStatusText = (status: AgentStatus): string => {
    // Note: agentId reserved for future i18n status messages
    switch (status) {
      case 'idle':
        return t.agents.pipeline.idle
      case 'running':
        return t.agents.pipeline.running
      case 'complete':
        return t.agents.pipeline.complete
      case 'error':
        return t.agents.pipeline.error
      default:
        return status
    }
  }

  const getAgentStatusIcon = (status: AgentStatus): string => {
    switch (status) {
      case 'idle':
        return 'hourglass-start'
      case 'running':
        return 'spinner'
      case 'complete':
        return 'check'
      case 'error':
        return 'cross'
      default:
        return 'circle'
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-sans text-2xl font-bold tracking-tight">
          {t.wizard.steps.content.generating}
        </h2>
        <p className="mt-2 font-serif text-muted-foreground">
          {t.wizard.steps.content.estimatedTime}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto space-y-2">
        <Progress value={progress} showLabel />
        <p className="text-sm text-center text-muted-foreground">
          {t.agents.pipeline.progress}: {progress}%
        </p>
      </div>

      {/* Agent Pipeline Visualization */}
      <div className="max-w-2xl mx-auto space-y-3">
        {AGENT_ORDER.map((agentId) => {
          const meta = AGENT_METADATA[agentId]
          const status = agentStatuses[agentId]
          const isActive = currentAgent === agentId

          return (
            <div
              key={agentId}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border transition-all',
                isActive && 'border-primary bg-primary/5 shadow-md',
                status === 'complete' && 'border-green-500/50 bg-green-500/5',
                status === 'error' && 'border-destructive/50 bg-destructive/5',
                status === 'idle' && 'border-border opacity-50'
              )}
            >
              {/* Agent Icon */}
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  isActive && 'animate-pulse'
                )}
                style={{
                  backgroundColor: `${meta.color}20`,
                  color: meta.color,
                }}
              >
                <Icon name={meta.icon} size="size-5" />
              </div>

              {/* Agent Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold">{meta.name}</h4>
                <p className="text-sm text-muted-foreground truncate">
                  {meta.description}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    'text-sm font-medium',
                    status === 'running' && 'text-primary',
                    status === 'complete' && 'text-green-600 dark:text-green-400',
                    status === 'error' && 'text-destructive'
                  )}
                >
                  {getAgentStatusText(status)}
                </span>
                <Icon
                  name={getAgentStatusIcon(status)}
                  size="size-4"
                  className={cn(status === 'running' && 'animate-spin')}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-destructive/10 border border-destructive/50">
          <div className="flex items-start gap-3">
            <Icon name="triangle-warning" size="size-5" className="text-destructive shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-destructive">{t.agents.pipeline.failed}</h4>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
