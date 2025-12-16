/**
 * Product Context Step
 * Branding OS - Academia Lendaria
 * Pixel-perfect from Figma specs
 */

import * as React from 'react'
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
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        {/* Figma: Inter SemiBold 40px, black */}
        <h2 className="font-sans text-[40px] font-semibold leading-tight text-foreground">
          Contextualize
          <br />
          sobre a sua criação
        </h2>
        {/* Figma: Inter Medium 16px, #888888 */}
        <p className="text-base font-medium text-[#888888] md:max-w-[278px]">
          Conte pra mim qual o contexto do seu produto ou serviço.
        </p>
      </div>

      {/* Figma: gap 24px between fields */}
      <div className="space-y-6">
        {/* Row 1: Product Name + Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name - Figma: gap 8px label-input, input height 62px */}
          <div className="space-y-2">
            {/* Figma: Inter SemiBold 12px, black */}
            <label className="text-xs font-semibold text-foreground">
              Nome do Produto / Serviço:
            </label>
            {/* Figma: height 62px, border #E8E8E8, radius 8px */}
            <input
              type="text"
              value={context.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="ex: CreatorOs"
              className="w-full h-[62px] px-6 rounded-lg border border-border bg-secondary text-foreground transition-all duration-[800ms] text-base font-medium placeholder:text-muted-foreground focus:outline-none focus:!border-[#5856D6] hover:!border-[#5856D6]"
            />
          </div>

          {/* Description - Same height as name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Breve descrição:
            </label>
            <input
              type="text"
              value={context.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="ex.: criador de cursos lendários"
              className="w-full h-[62px] px-6 rounded-lg border border-border bg-secondary text-foreground transition-all duration-[800ms] text-base font-medium placeholder:text-muted-foreground focus:outline-none focus:!border-[#5856D6] hover:!border-[#5856D6]"
            />
          </div>
        </div>

        {/* Row 2: Target Audience + Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Audience */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Público Alvo:
            </label>
            <input
              type="text"
              value={context.targetAudience || ''}
              onChange={(e) => onChange({ targetAudience: e.target.value })}
              placeholder="ex: Empresários"
              className="w-full h-[62px] px-6 rounded-lg border border-border bg-secondary text-foreground transition-all duration-[800ms] text-base font-medium placeholder:text-muted-foreground focus:outline-none focus:!border-[#5856D6] hover:!border-[#5856D6]"
            />
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Caracteristicas e Benefícios Chave
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ex: Empresários"
                className="flex-1 h-[62px] px-6 rounded-lg border border-border bg-secondary text-foreground transition-all duration-[800ms] text-base font-medium placeholder:text-muted-foreground focus:outline-none focus:!border-[#5856D6] hover:!border-[#5856D6]"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                disabled={!newFeature.trim()}
                className={`h-[62px] w-[62px] rounded-lg border border-border shrink-0 transition-all duration-[800ms] flex items-center justify-center hover:!border-[#5856D6] disabled:opacity-50 ${newFeature.trim() ? 'bg-[#5856D6]' : 'bg-secondary'
                  }`}
              >
                <Icon name="plus" className={`w-5 h-5 ${newFeature.trim() ? 'text-white' : 'text-[#888888]'}`} />
              </button>
            </div>

            {context.keyFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {context.keyFeatures.map((feature) => (
                  <Badge
                    key={feature}
                    variant="secondary"
                    className="pl-3 pr-1.5 py-1.5 gap-1.5 text-sm bg-secondary text-foreground border-0"
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
