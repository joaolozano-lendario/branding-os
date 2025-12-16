/**
 * Image Crop Control Component
 * Branding OS - Academia Lendaria
 *
 * Controles para ajustar posicionamento, zoom e proporção da imagem no slide
 */

import { usePipelineV2Store, type CropSettings } from '@/store/pipelineV2Store'

interface ImageCropControlProps {
  slideIndex: number
}

const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9 (Paisagem)' },
  { value: '4:3', label: '4:3' },
  { value: '1:1', label: '1:1 (Quadrado)' },
  { value: '3:4', label: '3:4 (Retrato)' },
] as const

export function ImageCropControl({ slideIndex }: ImageCropControlProps) {
  const updateCropSettings = usePipelineV2Store((s) => s.updateCropSettings)
  const cropSettings = usePipelineV2Store((s) => s.cropSettings[slideIndex]) || {
    positionX: 0,
    positionY: 0,
    zoom: 1.0,
    containerOffsetY: 0,
    aspectRatio: '16:9' as const
  }

  const handleChange = (key: keyof CropSettings, value: number | string) => {
    updateCropSettings(slideIndex, { [key]: value })
  }

  const resetCrop = () => {
    updateCropSettings(slideIndex, {
      positionX: 0,
      positionY: 0,
      zoom: 1.0,
      containerOffsetY: 0,
      aspectRatio: '16:9'
    })
  }

  const sliderClass = `w-full h-2 bg-[#F0F0F0] rounded-full appearance-none cursor-pointer
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-[#5856D6]
    [&::-webkit-slider-thumb]:cursor-pointer
    [&::-webkit-slider-thumb]:transition-transform
    [&::-webkit-slider-thumb]:hover:scale-110`

  return (
    <div className="space-y-4 p-4 rounded-[16px] border border-border bg-card">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-foreground">Ajustar Imagem</span>
        <button
          onClick={resetCrop}
          className="text-[11px] text-[#888888] hover:text-[#5856D6] transition-colors"
        >
          Resetar
        </button>
      </div>

      {/* Aspect Ratio Selector */}
      <div className="space-y-1">
        <label className="text-[11px] text-[#888888]">Proporção</label>
        <div className="flex gap-1">
          {ASPECT_RATIOS.map(({ value }) => (
            <button
              key={value}
              onClick={() => handleChange('aspectRatio', value)}
              className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded-md transition-all ${
                cropSettings.aspectRatio === value
                  ? 'bg-[#5856D6] text-white'
                  : 'bg-[#F0F0F0] text-[#888888] hover:bg-[#E0E0E0]'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Container Position Y - Move image box up/down */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-[11px] text-[#888888]">Posição Vertical</label>
          <span className="text-[11px] font-mono text-[#888888]">
            {cropSettings.containerOffsetY > 0 ? '+' : ''}{cropSettings.containerOffsetY}px
          </span>
        </div>
        <input
          type="range"
          min="-150"
          max="150"
          value={cropSettings.containerOffsetY}
          onChange={(e) => handleChange('containerOffsetY', parseInt(e.target.value))}
          className={sliderClass}
        />
      </div>

      {/* Crop Position X */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-[11px] text-[#888888]">Crop Horizontal</label>
          <span className="text-[11px] font-mono text-[#888888]">
            {cropSettings.positionX > 0 ? '+' : ''}{cropSettings.positionX}%
          </span>
        </div>
        <input
          type="range"
          min="-50"
          max="50"
          value={cropSettings.positionX}
          onChange={(e) => handleChange('positionX', parseInt(e.target.value))}
          className={sliderClass}
        />
      </div>

      {/* Crop Position Y */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-[11px] text-[#888888]">Crop Vertical</label>
          <span className="text-[11px] font-mono text-[#888888]">
            {cropSettings.positionY > 0 ? '+' : ''}{cropSettings.positionY}%
          </span>
        </div>
        <input
          type="range"
          min="-50"
          max="50"
          value={cropSettings.positionY}
          onChange={(e) => handleChange('positionY', parseInt(e.target.value))}
          className={sliderClass}
        />
      </div>

      {/* Zoom Slider */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-[11px] text-[#888888]">Zoom</label>
          <span className="text-[11px] font-mono text-[#888888]">
            {cropSettings.zoom.toFixed(1)}x
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="200"
          value={cropSettings.zoom * 100}
          onChange={(e) => handleChange('zoom', parseInt(e.target.value) / 100)}
          className={sliderClass}
        />
      </div>
    </div>
  )
}

export default ImageCropControl
