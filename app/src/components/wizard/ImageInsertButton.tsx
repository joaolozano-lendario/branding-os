/**
 * ImageInsertButton Component
 * Branding OS - Academia Lendaria
 *
 * Figma: Frame 169 - Inserir Imagem button
 */

import * as React from 'react'
import { useSlideImage } from '@/hooks/useSlideImage'

interface ImageInsertButtonProps {
  slideIndex: number
  slideTitle: string
  currentImage?: string
}

export function ImageInsertButton({
  slideIndex,
  slideTitle,
  currentImage,
}: ImageInsertButtonProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [showOptions, setShowOptions] = React.useState(false)

  const {
    isGenerating,
    error,
    generateImage,
    uploadImage,
    removeImage,
    clearError,
  } = useSlideImage({
    slideIndex,
    slideTitle,
  })

  const handleGenerate = async () => {
    setShowOptions(false)
    await generateImage()
  }

  const handleUploadClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file)
      setShowOptions(false)
    }
    e.target.value = ''
  }

  return (
    <div className="space-y-3">
      {/* Image Preview */}
      {currentImage && (
        <div className="relative rounded-[8px] overflow-hidden border border-[#E8E8E8]">
          <img
            src={currentImage}
            alt="Imagem do slide"
            className="w-full h-[120px] object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/60 hover:bg-black/80 rounded-full transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Main Button - Figma: Frame 169, icon + text, #888888 */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isGenerating}
        className="flex items-center gap-2 text-[#888888] hover:text-[#5856D6] transition-colors disabled:opacity-50"
      >
        {isGenerating ? (
          <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.4 31.4" strokeDashoffset="10"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 15V16C3 18.2091 4.79086 20 7 20H17C19.2091 20 21 18.2091 21 16V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
        <span className="text-[12px] font-semibold">
          {isGenerating ? 'Gerando...' : currentImage ? 'Trocar Imagem' : 'Inserir Imagem'}
        </span>
      </button>

      {/* Options Dropdown */}
      {showOptions && !isGenerating && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={handleGenerate}
            className="flex-1 h-[36px] rounded-full text-[12px] font-semibold text-white transition-colors"
            style={{ backgroundColor: '#5856D6' }}
          >
            Gerar com IA
          </button>
          <button
            onClick={handleUploadClick}
            className="flex-1 h-[36px] rounded-full text-[12px] font-semibold text-[#888888] border border-[#E8E8E8] hover:border-[#5856D6] hover:text-[#5856D6] transition-colors"
          >
            Upload
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-[8px] bg-red-50 text-red-600 text-[12px]">
          <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 4V7.5M7 10V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="flex-1">
            <p>{error}</p>
            <button onClick={clearError} className="underline hover:no-underline mt-1">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageInsertButton
