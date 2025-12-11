/**
 * Asset Type Selection Step
 * Branding OS - Academia Lendaria
 * Pixel-perfect from Figma specs
 */

import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import type { AssetType } from '@/types/agent'

interface AssetTypeStepProps {
  selectedType: AssetType | null
  onSelect: (type: AssetType) => void
  errors: string[]
}

// Figma specs: Cards 194x280, icon 42x42 circle, icon inner 18x18
const ASSET_TYPES: Array<{
  type: AssetType
  icon: string
  label: string
  description: string
}> = [
  {
    type: 'carousel',
    icon: 'images',
    label: 'Carrossel',
    description: 'Conteúdo multi-slide para redes sociais',
  },
  {
    type: 'ad',
    icon: 'megaphone',
    label: 'Ads',
    description: 'Criativos para campanhas pagas',
  },
  {
    type: 'post',
    icon: 'picture',
    label: 'Posts',
    description: 'Imagens únicas para redes sociais',
  },
  {
    type: 'slide',
    icon: 'presentation',
    label: 'Slide',
    description: 'Apresentação para Aulas, Pitchs e Decks',
  },
]

export function AssetTypeStep({ selectedType, onSelect, errors }: AssetTypeStepProps) {
  return (
    <div className="space-y-8">
      {/* Figma: Title left, subtitle right, gap 288px */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Figma: Inter SemiBold 32px, black */}
        <h2 className="font-sans text-[32px] font-semibold leading-tight text-black">
          O que deseja
          <br />
          criar Lendário?
        </h2>
        {/* Figma: Inter Medium 16px, #888888 */}
        <p className="text-base font-medium text-[#888888] md:text-right md:max-w-[278px]">
          Clique em uma das opções abaixo
          <br className="hidden md:block" />e comece a criar agora mesmo.
        </p>
      </div>

      {/* Figma: Cards 194x280, gap 8px, radius 8px */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {ASSET_TYPES.map(({ type, icon, label, description }) => {
          const isSelected = selectedType === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className={cn(
                // Figma: 194x280, radius 8px
                'flex flex-col items-start p-6 rounded-lg transition-all text-left',
                'min-h-[280px]',
                // Figma: Selected = bg #5856D6, border #5856D6
                isSelected && 'bg-[#5856D6] border border-[#5856D6]',
                // Figma: Unselected = border #E8E8E8
                !isSelected && 'border border-[#E8E8E8] hover:border-[#5856D6]/50'
              )}
            >
              {/* Figma: Icon container 42x42, radius 200 (circle), bg #5856D6 */}
              <div
                className={cn(
                  'flex h-[42px] w-[42px] items-center justify-center rounded-full',
                  isSelected ? 'bg-[#5856D6]' : 'bg-[#5856D6]'
                )}
              >
                {/* Figma: Icon 18x18, white */}
                <Icon name={icon} className="w-[18px] h-[18px] text-white" />
              </div>

              {/* Spacer to push text to bottom */}
              <div className="flex-1" />

              {/* Figma: gap 12px between title and description */}
              <div className="space-y-3">
                {/* Figma: Inter SemiBold 16px */}
                <h3
                  className={cn(
                    'font-semibold text-base',
                    // Figma: Selected text = #312D65, Unselected = black
                    isSelected ? 'text-[#312D65]' : 'text-black'
                  )}
                >
                  {label}
                </h3>
                {/* Figma: Inter Medium 12px */}
                <p
                  className={cn(
                    'text-xs font-medium leading-relaxed',
                    // Figma: Selected = #312D65, Unselected = #888888
                    isSelected ? 'text-[#312D65]' : 'text-[#888888]'
                  )}
                >
                  {description}
                </p>
              </div>
            </button>
          )
        })}
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
