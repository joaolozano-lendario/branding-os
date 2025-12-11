/**
 * Product Context Step
 * Branding OS - Academia Lendaria
 * Pixel-perfect from Figma specs
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import type { ProductContext } from '@/types/agent'

interface ProductContextStepProps {
  context: ProductContext
  onChange: (context: Partial<ProductContext>) => void
  errors: string[]
}

export function ProductContextStep({ context, onChange, errors }: ProductContextStepProps) {
  const [newFeature, setNewFeature] = React.useState('')

  const handleAddFeature = () => {
    if (newFeature.trim() && !context.keyFeatures.includes(newFeature.trim())) {
      onChange({
        keyFeatures: [...context.keyFeatures, newFeature.trim()],
      })
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (feature: string) => {
    onChange({
      keyFeatures: context.keyFeatures.filter((f) => f !== feature),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddFeature()
    }
  }

  return (
    <div className="space-y-8">
      {/* Figma: Title left, subtitle right */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Figma: Inter SemiBold 32px, black */}
        <h2 className="font-sans text-[32px] font-semibold leading-tight text-black">
          Contextualize
          <br />
          sobre a sua criação
        </h2>
        {/* Figma: Inter Medium 16px, #888888 */}
        <p className="text-base font-medium text-[#888888] md:text-right md:max-w-[278px]">
          Conte pra mim qual o contexto do seu produto ou serviço.
        </p>
      </div>

      {/* Figma: gap 24px between fields, max-width 800px */}
      <div className="space-y-6 max-w-[800px]">
        {/* Product Name - Figma: gap 8px label-input, input height 62px */}
        <div className="space-y-2">
          {/* Figma: Inter SemiBold 12px, black */}
          <label className="text-xs font-semibold text-black">
            Nome do Produto / Serviço:
          </label>
          {/* Figma: height 62px, border #E8E8E8, radius 8px */}
          <input
            type="text"
            value={context.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="ex: CreatorOs"
            className={cn(
              'w-full h-[62px] px-4 rounded-lg border border-border bg-background',
              'text-base font-medium placeholder:text-[#888888]',
              'focus:outline-none focus:border-[#5856D6]'
            )}
          />
        </div>

        {/* Description - Figma: height 128px */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-black">
            Breve descrição:
          </label>
          <textarea
            value={context.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Lorem ipsum dolor sit amet"
            className={cn(
              'w-full h-[128px] px-4 py-4 rounded-lg border border-border bg-background resize-none',
              'text-base font-medium placeholder:text-[#888888]',
              'focus:outline-none focus:border-[#5856D6]'
            )}
          />
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-black">
            Público Alvo:
          </label>
          <input
            type="text"
            value={context.targetAudience || ''}
            onChange={(e) => onChange({ targetAudience: e.target.value })}
            placeholder="ex: Empresários"
            className={cn(
              'w-full h-[62px] px-4 rounded-lg border border-border bg-background',
              'text-base font-medium placeholder:text-[#888888]',
              'focus:outline-none focus:border-[#5856D6]'
            )}
          />
        </div>

        {/* Key Features */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-black">
            Caracteristicas e Benefícios Chave
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ex: Empresários"
              className={cn(
                'flex-1 h-[62px] px-4 rounded-lg border border-border bg-background',
                'text-base font-medium placeholder:text-[#888888]',
                'focus:outline-none focus:border-[#5856D6]'
              )}
            />
            <button
              type="button"
              onClick={handleAddFeature}
              disabled={!newFeature.trim()}
              className={cn(
                'h-[62px] w-[62px] rounded-lg border border-border bg-background shrink-0',
                'flex items-center justify-center',
                'hover:border-[#5856D6] disabled:opacity-50'
              )}
            >
              <Icon name="plus" className="w-5 h-5 text-[#888888]" />
            </button>
          </div>

          {context.keyFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {context.keyFeatures.map((feature) => (
                <Badge
                  key={feature}
                  variant="secondary"
                  className="pl-3 pr-1.5 py-1.5 gap-1.5 text-sm bg-[#F8F8F8] text-black border-0"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature)}
                    className="rounded-full p-0.5 hover:bg-[#E8E8E8] transition-colors"
                    aria-label={`Remove ${feature}`}
                  >
                    <Icon name="cross-small" className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
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
