/**
 * Asset Type Selection Step
 * Branding OS - Academia Lendaria
 * Pixel-perfect from Figma specs
 */


import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'
import type { AssetType } from '@/types/agent'

// Add keyframe animation for color shift
const styleSheet = `
  @keyframes colorShift {
    0% {
      background-color: #5856D6;
    }
    100% {
      background-color: #423E93;
    }
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.getElementById('asset-type-animations')
  if (!styleElement) {
    const style = document.createElement('style')
    style.id = 'asset-type-animations'
    style.textContent = styleSheet
    document.head.appendChild(style)
  }
}

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
  description: React.ReactNode
}> = [
    {
      type: 'carousel',
      icon: 'images',
      label: 'Carrossel',
      description: <>Conteúdo multi-slide<br />para redes sociais</>,
    },
    {
      type: 'ad',
      icon: 'megaphone',
      label: 'Ads',
      description: <>Criativos para<br />campanhas pagas</>,
    },
    {
      type: 'post',
      icon: 'picture',
      label: 'Posts',
      description: <>Imagens únicas para<br />redes sociais</>,
    },
    {
      type: 'slide',
      icon: 'presentation',
      label: 'Slide',
      description: <>Apresentação para<br />Aulas, Pitchs e Decks</>,
    },
  ]

export function AssetTypeStep({ selectedType, onSelect, errors }: AssetTypeStepProps) {
  return (
    <div className="space-y-8">
      {/* Figma: Title left, subtitle right, gap 288px */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        {/* Figma: Inter SemiBold 40px, black */}
        <h2 className="font-sans text-[40px] font-semibold leading-tight text-black">
          O que deseja
          <br />
          criar Lendário?
        </h2>
        {/* Figma: Inter Medium 16px, #888888 */}
        <p className="text-base font-medium text-[#888888] md:max-w-[278px]">
          Clique em uma das opções abaixo
          <br className="hidden md:block" />e comece a criar agora mesmo.
        </p>
      </div>

      {/* Figma: Cards 194x280, gap 8px, radius 8px */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {ASSET_TYPES.map(({ type, icon, label, description }) => {
          const isSelected = selectedType === type
          const isInactive = selectedType !== null && !isSelected
          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              style={isSelected ? {
                animation: 'colorShift 8s ease-in-out infinite alternate',
                backgroundColor: '#5856D6'
              } : undefined}
              className={cn(
                // Figma: 194x280, radius 8px
                'flex flex-col items-start p-6 rounded-lg transition-all text-left border',
                'min-h-[280px]',
                // Selected = transparent border to maintain size
                isSelected && 'border-transparent',
                // Inactive = gray background
                isInactive && 'bg-[#f8f8f8] border-transparent',
                // Figma: Unselected = border #E8E8E8
                !isSelected && !isInactive && 'border-[#E8E8E8] hover:border-[#5856D6]/50'
              )}
            >
              {/* Figma: Icon container 50x50, radius 200 (circle) */}
              <div
                className={cn(
                  'flex h-[50px] w-[50px] items-center justify-center rounded-full',
                  isSelected ? 'bg-white/16' : isInactive ? 'bg-[#e8e8e8]' : 'bg-[#5856D6]'
                )}
              >
                {/* Figma: Icon 18x18 */}
                <Icon name={icon} className={cn(
                  'w-[18px] h-[18px] inline-flex items-center justify-center',
                  isInactive ? 'text-[#c8c8c8]' : 'text-white'
                )} />
              </div>

              {/* Spacer to push text to bottom */}
              <div className="flex-1" />

              {/* Figma: gap 12px between title and description */}
              <div className="space-y-3">
                {/* Figma: Inter SemiBold 24px */}
                <h3
                  className={cn(
                    'font-semibold text-2xl',
                    // Selected text = white, Inactive = #c8c8c8, Unselected = black
                    isSelected ? 'text-white' : isInactive ? 'text-[#c8c8c8]' : 'text-black'
                  )}
                >
                  {label}
                </h3>
                {/* Figma: Inter Medium 14px */}
                <p
                  className={cn(
                    'text-sm font-medium leading-[1.4]',
                    // Selected = white, Inactive = #c8c8c8, Unselected = #888888
                    isSelected ? 'text-white' : isInactive ? 'text-[#c8c8c8]' : 'text-[#888888]'
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
