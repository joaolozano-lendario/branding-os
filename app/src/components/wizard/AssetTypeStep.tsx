/**
 * Asset Type Selection Step
 * Branding OS - Academia Lendaria
 * E4: BRAND-022 - Step 1 of Generation Wizard
 */

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { useTranslation } from '@/store/i18nStore'
import type { AssetType } from '@/types/agent'

interface AssetTypeStepProps {
  selectedType: AssetType | null
  onSelect: (type: AssetType) => void
  errors: string[]
}

interface AssetTypeOption {
  type: AssetType
  icon: string
  color: string
}

const ASSET_TYPES: AssetTypeOption[] = [
  { type: 'carousel', icon: 'layers', color: '#5856D6' },
  { type: 'slide', icon: 'presentation', color: '#007AFF' },
  { type: 'ad', icon: 'megaphone', color: '#FF2D55' },
  { type: 'post', icon: 'picture', color: '#34C759' },
]

export function AssetTypeStep({ selectedType, onSelect, errors }: AssetTypeStepProps) {
  const { t } = useTranslation()

  const getTypeLabel = (type: AssetType): string => {
    switch (type) {
      case 'carousel':
        return t.wizard.steps.assetType.carousel
      case 'slide':
        return t.wizard.steps.assetType.slide
      case 'ad':
        return t.wizard.steps.assetType.ad
      case 'post':
        return t.wizard.steps.assetType.post
      default:
        return type
    }
  }

  const getTypeDescription = (type: AssetType): string => {
    switch (type) {
      case 'carousel':
        return t.wizard.steps.assetType.carouselDesc
      case 'slide':
        return t.wizard.steps.assetType.slideDesc
      case 'ad':
        return t.wizard.steps.assetType.adDesc
      case 'post':
        return t.wizard.steps.assetType.postDesc
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-sans text-2xl font-bold tracking-tight">
          {t.wizard.steps.assetType.title}
        </h2>
        <p className="mt-2 font-serif text-muted-foreground">
          {t.wizard.steps.assetType.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ASSET_TYPES.map(({ type, icon, color }) => (
          <Card
            key={type}
            className={cn(
              'cursor-pointer transition-all hover:shadow-lg hover:border-primary/50',
              selectedType === type && 'ring-2 ring-primary border-primary'
            )}
            onClick={() => onSelect(type)}
          >
            <CardContent className="flex items-start gap-4 p-6">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${color}20`, color }}
              >
                <Icon name={icon} size="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans font-semibold text-lg">
                  {getTypeLabel(type)}
                </h3>
                <p className="mt-1 font-serif text-sm text-muted-foreground">
                  {getTypeDescription(type)}
                </p>
              </div>
              {selectedType === type && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon name="check" size="size-4" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
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
