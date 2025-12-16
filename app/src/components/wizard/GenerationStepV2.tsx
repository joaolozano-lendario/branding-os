/**
 * Generation Step V2
 * Branding OS - Academia Lendaria
 * E6: Pipeline V2 Integration Step with 6-Agent Synergy
 */

import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { useTranslation } from '@/store/i18nStore'
import {
  AGENT_METADATA_V2,
  AGENT_ORDER_V2,
  type AgentIdV2,
  type AgentStatus,
} from '@/types/agent'

interface GenerationStepV2Props {
  progress: number
  progressMessage: string
  currentAgent: AgentIdV2 | null
  agentStatuses: Record<AgentIdV2, AgentStatus>
  error: string | null
}

// Map agentId to translation key
const AGENT_TRANSLATION_KEY: Record<AgentIdV2, 'brandStrategist' | 'storyArchitect' | 'copywriter' | 'visualCompositor' | 'qualityValidator' | 'renderEngine'> = {
  'brand-strategist': 'brandStrategist',
  'story-architect': 'storyArchitect',
  'copywriter-v2': 'copywriter',
  'visual-compositor': 'visualCompositor',
  'quality-validator': 'qualityValidator',
  'render-engine': 'renderEngine',
}

export function GenerationStepV2({
  progress,
  progressMessage,
  currentAgent,
  agentStatuses,
  error,
}: GenerationStepV2Props) {
  const { t } = useTranslation()

  // Translate pipeline progress messages dynamically
  const translateProgressMessage = (message: string): string => {
    if (!message) return ''

    // Match patterns and translate
    if (message.includes('Analyzing brief')) {
      return t.pipeline.analyzingBrief
    }
    if (message.startsWith('Strategy:')) {
      const match = message.match(/Strategy: (.+) with (.+) angle/)
      if (match) {
        return t.pipeline.strategySelected
          .replace('{template}', match[1])
          .replace('{angle}', match[2])
      }
      return message
    }
    if (message.includes('Building narrative')) {
      return t.pipeline.buildingNarrative
    }
    if (message.startsWith('Structure:')) {
      const match = message.match(/Structure: (\d+) slides/)
      if (match) {
        return t.pipeline.structurePlanned.replace('{count}', match[1])
      }
      return message
    }
    if (message.includes('Writing copy')) {
      return t.pipeline.writingCopy
    }
    if (message.startsWith('Copy:')) {
      const match = message.match(/Copy: (\d+) slides/)
      if (match) {
        return t.pipeline.copyWritten.replace('{count}', match[1])
      }
      return message
    }
    if (message.includes('Creating visual')) {
      return t.pipeline.creatingVisual
    }
    if (message.startsWith('Visual:')) {
      const match = message.match(/Visual: (\d+) slides/)
      if (match) {
        return t.pipeline.visualDesigned.replace('{count}', match[1])
      }
      return message
    }
    if (message.includes('Generating AI images')) {
      return t.pipeline.generatingImages
    }
    if (message.includes('Images:')) {
      return t.pipeline.imagesGenerated
    }
    if (message.includes('Validating brand')) {
      return t.pipeline.validatingQuality
    }
    if (message.startsWith('Quality:')) {
      const match = message.match(/Quality: (\d+)\/100/)
      if (match) {
        return t.pipeline.qualityScore.replace('{score}', match[1])
      }
      return message
    }
    if (message.includes('Rendering final')) {
      return t.pipeline.renderingAssets
    }
    if (message.includes('Generation complete')) {
      return t.pipeline.generationComplete
    }

    return message
  }

  const getAgentName = (agentId: AgentIdV2): string => {
    const key = AGENT_TRANSLATION_KEY[agentId]
    return t.agents.v2[key]?.name || AGENT_METADATA_V2[agentId].name
  }

  const getAgentDescription = (agentId: AgentIdV2): string => {
    const key = AGENT_TRANSLATION_KEY[agentId]
    return t.agents.v2[key]?.description || AGENT_METADATA_V2[agentId].description
  }

  const getAgentStatusText = (status: AgentStatus): string => {
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
          {translateProgressMessage(progressMessage) || t.wizard.steps.content.estimatedTime}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto space-y-2">
        <Progress value={progress} showLabel />
        <p className="text-sm text-center text-muted-foreground">
          {t.agents.pipeline.progress}: {progress}%
        </p>
      </div>

      {/* V2 Agent Pipeline Visualization - 6 Agents */}
      <div className="max-w-2xl mx-auto space-y-3">
        {AGENT_ORDER_V2.map((agentId) => {
          const meta = AGENT_METADATA_V2[agentId]
          const status = agentStatuses[agentId]
          const isActive = currentAgent === agentId

          return (
            <div
              key={agentId}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border transition-all',
                isActive && 'border-primary bg-primary/5',
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
                <h4 className="font-semibold">{getAgentName(agentId)}</h4>
                <p className="text-sm text-muted-foreground truncate">
                  {getAgentDescription(agentId)}
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
