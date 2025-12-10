/**
 * Product Context Step
 * Branding OS - Academia Lendaria
 * E4: BRAND-023 - Step 2 of Generation Wizard
 */

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useTranslation } from '@/store/i18nStore'
import type { ProductContext } from '@/types/agent'

interface ProductContextStepProps {
  context: ProductContext
  onChange: (context: Partial<ProductContext>) => void
  errors: string[]
}

export function ProductContextStep({ context, onChange, errors }: ProductContextStepProps) {
  const { t } = useTranslation()
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-sans text-2xl font-bold tracking-tight">
          {t.wizard.steps.context.title}
        </h2>
        <p className="mt-2 font-serif text-muted-foreground">
          {t.wizard.steps.context.subtitle}
        </p>
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="productName">
            {t.wizard.steps.context.productName}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="productName"
            value={context.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g., Branding OS"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            {t.wizard.steps.context.description}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="description"
            value={context.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Briefly describe what your product/service does..."
            rows={3}
          />
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <Label htmlFor="targetAudience">
            {t.wizard.steps.context.targetAudience}
          </Label>
          <Input
            id="targetAudience"
            value={context.targetAudience || ''}
            onChange={(e) => onChange({ targetAudience: e.target.value })}
            placeholder="e.g., Marketing teams at mid-size companies"
          />
        </div>

        {/* Key Features */}
        <div className="space-y-2">
          <Label>{t.wizard.steps.context.keyFeatures}</Label>
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a feature or benefit..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddFeature}
              disabled={!newFeature.trim()}
              aria-label="Add feature"
            >
              <Icon name="plus" size="size-4" />
            </Button>
          </div>

          {context.keyFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {context.keyFeatures.map((feature) => (
                <Badge
                  key={feature}
                  variant="secondary"
                  className="pl-3 pr-1 py-1 gap-1"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature)}
                    className="ml-1 rounded-full p-0.5 hover:bg-background/50"
                  >
                    <Icon name="cross-small" size="size-3" />
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
