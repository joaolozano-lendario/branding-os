/**
 * Preview & Export Step V2
 * Branding OS - Academia Lendaria
 *
 * IDENTICAL to Figma: Interface-06-Gerar / Interface-06-Gerar-2
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { usePipelineV2Store, type CropSettings } from '@/store/pipelineV2Store'
import { ImageInsertButton } from './ImageInsertButton'
import { ImageCropControl } from './ImageCropControl'
import { ExportSlidesModal } from './ExportSlidesModal'
import type { PipelineResult, SlideCopy, VisualElement, SlideVisualSpec } from '@/types/pipeline'
import { renderEngine } from '@/services/agents-v2/render-engine'

/**
 * Helper function to extract slide image from multiple sources
 * Priority: 1. User-inserted images, 2. Pipeline-generated images
 */
function getSlideImage(
  slideIndex: number,
  userImages: Record<number, string>,
  visualSlides: SlideVisualSpec[] | undefined
): string | undefined {
  // Priority 1: User-inserted image
  if (userImages[slideIndex]) {
    return userImages[slideIndex]
  }

  // Priority 2: Pipeline-generated image (from visual.slides)
  const visualSlide = visualSlides?.[slideIndex]
  if (visualSlide) {
    // Check background
    if (visualSlide.background?.type === 'image' && visualSlide.background.value) {
      const val = visualSlide.background.value
      if (val.startsWith('http') || val.startsWith('data:')) {
        return val
      }
    }
    // Check elements
    const imageElement = visualSlide.elements?.find(
      e => (e.role === 'background' || e.role === 'image') &&
           e.content &&
           (e.content.startsWith('http') || e.content.startsWith('data:'))
    )
    if (imageElement?.content) {
      return imageElement.content
    }
  }

  return undefined
}

// Helper component for live rendering
function LiveSlidePreview({
  index,
  total,
  slide,
  image,
  activeTab,
  signature,
  cropSettings
}: {
  index: number
  total: number
  slide?: SlideCopy
  image?: string
  activeTab: 'description' | 'bullets'
  signature: string
  cropSettings: CropSettings
}) {
  const previewData = React.useMemo(() => {
    if (!slide) return null

    // Determine Layout
    let layoutId = 'branding-os-body-v1'
    if (index === 0) layoutId = 'branding-os-cover-v1'
    if (index === total - 1) layoutId = 'branding-os-last-v1'

    // Construct Elements
    const elements: VisualElement[] = []

    // Headline
    if (slide.headline) {
      elements.push({
        role: 'headline',
        type: 'text',
        content: slide.headline,
        style: {},
        position: { x: 0, y: 0, width: 0, height: 0 }
      } as VisualElement)
    }

    // Body content - based on active tab
    let bodyContent = ''
    if (activeTab === 'bullets' && slide.bullets?.length) {
      // Show bullets when bullet tab is active
      bodyContent = slide.bullets.map(b => `• ${b}`).join('\n')
    } else {
      // Show description when description tab is active
      bodyContent = slide.body || ''
      // Fallback to bullets if no body
      if (!bodyContent && slide.bullets?.length) {
        bodyContent = slide.bullets.map(b => `• ${b}`).join('\n')
      }
    }

    // Subheadline (for Cover) or CTA (for Last) mapped from body if needed
    // Logic: If Cover, body -> subheadline. If Last, body -> cta
    if (layoutId === 'branding-os-cover-v1') {
      if (bodyContent) {
        elements.push({
          role: 'subheadline',
          type: 'text',
          content: bodyContent,
          style: {},
          position: { x: 0, y: 0, width: 0, height: 0 }
        } as VisualElement)
      }
    } else if (layoutId === 'branding-os-last-v1') {
      if (bodyContent) {
        elements.push({
          role: 'body',
          type: 'text',
          content: bodyContent,
          style: {},
          position: { x: 0, y: 0, width: 0, height: 0 }
        } as VisualElement)
      }
    } else {
      // Body
      if (bodyContent) {
        elements.push({
          role: 'body',
          type: 'text',
          content: bodyContent,
          style: {},
          position: { x: 0, y: 0, width: 0, height: 0 }
        } as VisualElement)
      }
    }

    // Images for different layouts
    if (image) {
      if (layoutId === 'branding-os-cover-v1') {
        // Cover: image as background
        elements.push({
          role: 'background',
          type: 'image',
          content: image,
          style: {},
          position: { x: 0, y: 0, width: 0, height: 0 }
        } as VisualElement)
      } else if (layoutId === 'branding-os-body-v1') {
        // Body: image as element
        elements.push({
          role: 'image',
          type: 'image',
          content: image,
          style: {},
          position: { x: 0, y: 0, width: 0, height: 0 }
        } as VisualElement)
      } else if (layoutId === 'branding-os-last-v1') {
        // Last: image at bottom (Figma has image at y=687)
        elements.push({
          role: 'image',
          type: 'image',
          content: image,
          style: {},
          position: { x: 0, y: 0, width: 0, height: 0 }
        } as VisualElement)
      }
    }

    // Render using engine with signature
    const result = renderEngine.render({
      slides: [{
        index: index + 1,
        layoutId,
        canvas: { width: 1080, height: 1350 },
        background: { type: 'solid', value: '#1A1A1A' },
        elements
      }],
      tokens: { colors: {}, fonts: {}, spacing: {} },
      signature
    })

    return result.slides[0]
  }, [index, total, slide, image, activeTab, signature])

  // Generate crop CSS for images
  const cropCSS = React.useMemo(() => {
    if (!image) return ''

    // Calculate object-position based on positionX/Y (-50 to 50 -> 0% to 100%)
    const posX = 50 + cropSettings.positionX // -50 to 50 -> 0% to 100%
    const posY = 50 + cropSettings.positionY
    const offsetY = cropSettings.containerOffsetY || 0

    // Calculate height based on aspect ratio (width is fixed at 924px for body)
    const aspectHeights: Record<string, number> = {
      '16:9': 520,  // 924 / 16 * 9 = 520
      '4:3': 693,   // 924 / 4 * 3 = 693
      '1:1': 924,   // 924 / 1 * 1 = 924
      '3:4': 1232,  // 924 / 3 * 4 = 1232
    }
    const aspectRatio = cropSettings.aspectRatio || '16:9'
    const containerHeight = aspectHeights[aspectRatio] || 520

    return `
      /* Crop adjustments for slide ${index + 1} */
      .body-image,
      .last-image {
        object-position: ${posX}% ${posY}% !important;
        transform: scale(${cropSettings.zoom}) !important;
        transform-origin: ${posX}% ${posY}% !important;
      }

      /* Container position and size adjustments */
      .body-image-container,
      .last-image-container {
        top: ${519 + offsetY}px !important;
        height: ${containerHeight}px !important;
      }

      /* Cover background adjustments */
      .slide-${index + 1}::before {
        object-position: ${posX}% ${posY}% !important;
        transform: scale(${cropSettings.zoom}) !important;
        transform-origin: ${posX}% ${posY}% !important;
      }
    `
  }, [index, image, cropSettings])

  if (!previewData) return null

  return (
    <div className="relative w-full h-full bg-background">
      <style>{previewData.css}</style>
      <style>{cropCSS}</style>
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: previewData.html }}
      />
    </div>
  )
}

interface PreviewExportStepV2Props {
  pipelineResult: PipelineResult | null
  onBack?: () => void
}

export function PreviewExportStepV2({
  pipelineResult,
  onBack,
}: PreviewExportStepV2Props) {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0)
  const [activeTab, setActiveTab] = React.useState<'description' | 'bullets'>('description')
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false)

  // Store actions for editing
  const updateSlideHeadline = usePipelineV2Store((s) => s.updateSlideHeadline)
  const updateSlideBody = usePipelineV2Store((s) => s.updateSlideBody)
  const updateSlideBullets = usePipelineV2Store((s) => s.updateSlideBullets)
  const signature = usePipelineV2Store((s) => s.signature)
  const setSignature = usePipelineV2Store((s) => s.setSignature)
  const cropSettings = usePipelineV2Store((s) => s.cropSettings[currentSlideIndex]) || {
    positionX: 0,
    positionY: 0,
    zoom: 1.0,
    containerOffsetY: 0,
    aspectRatio: '16:9' as const
  }

  // Get slides data
  const copySlides = pipelineResult?.copy?.slides || []
  const slideImages = pipelineResult?.slideImages || {}
  const visualSlides = pipelineResult?.visual?.slides
  const totalSlides = copySlides.length

  // Current slide data
  const currentSlide: SlideCopy | undefined = copySlides[currentSlideIndex]
  // Use helper to get image from both user-inserted and pipeline-generated sources
  const currentImage = getSlideImage(currentSlideIndex, slideImages, visualSlides)

  // Navigation
  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index)
    }
  }

  // Convert description to bullets
  const convertToBullets = () => {
    if (currentSlide?.body && !currentSlide?.bullets?.length) {
      // Split body into sentences/lines
      const lines = currentSlide.body
        .split(/[.\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
      updateSlideBullets(currentSlideIndex, lines)
    }
    setActiveTab('bullets')
  }

  // Convert bullets to description
  const convertToDescription = () => {
    if (currentSlide?.bullets?.length && !currentSlide?.body) {
      const text = currentSlide.bullets.join('. ')
      updateSlideBody(currentSlideIndex, text)
    }
    setActiveTab('description')
  }

  // Empty state
  if (!pipelineResult?.copy) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-[#888888]">Nenhum conteúdo gerado ainda</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header - Figma: Frame 78 */}
      <div>
        <h2 className="text-[24px] font-semibold leading-[1.3] text-foreground">
          Revise o conteúdo<br />e insira as imagens
        </h2>
        <p className="mt-2 text-[14px] text-[#888888]">
          Você pode editar, inserir e mudar o que preferir.
        </p>
      </div>

      {/* Main Content - Two Columns */}
      <div className="flex gap-6">
        {/* LEFT COLUMN - Editor */}
        <div className="w-[385px] space-y-4 shrink-0">
          {/* Signature Field */}
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-foreground">
              Assinatura
            </label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="@seuhandle"
              className="w-full h-[48px] px-4 rounded-[16px] border border-border bg-card text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#5856D6]"
            />
          </div>

          {/* Title Field - Figma: Frame 82 */}
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-foreground">
              Título
            </label>
            <input
              type="text"
              value={currentSlide?.headline || ''}
              onChange={(e) => updateSlideHeadline(currentSlideIndex, e.target.value)}
              placeholder="Digite o título do slide"
              className="w-full h-[62px] px-4 rounded-[16px] border border-border bg-card text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#5856D6]"
            />
          </div>

          {/* Tabs - Figma: Frame 85 */}
          <div
            className="inline-flex h-[36px] p-1 rounded-full gap-1 bg-secondary"
          >
            <button
              onClick={convertToDescription}
              className={cn(
                'h-[28px] px-4 rounded-full text-[12px] font-semibold transition-all',
                activeTab === 'description'
                  ? 'bg-[#5856D6] text-white'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              Descrição
            </button>
            <button
              onClick={convertToBullets}
              className={cn(
                'h-[28px] px-4 rounded-full text-[12px] font-semibold transition-all',
                activeTab === 'bullets'
                  ? 'bg-[#5856D6] text-white'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              Bullet Point
            </button>
          </div>

          {/* Content - Description Mode */}
          {activeTab === 'description' && (
            <div className="space-y-2">
              <textarea
                value={currentSlide?.body || ''}
                onChange={(e) => updateSlideBody(currentSlideIndex, e.target.value)}
                placeholder="Digite a descrição do slide"
                className="w-full h-[144px] px-4 py-4 rounded-[16px] border border-border bg-card text-[14px] text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-[#5856D6]"
              />
            </div>
          )}

          {/* Content - Bullets Mode - Figma: Frame 83, Frame 170 (campos separados) */}
          {activeTab === 'bullets' && (
            <div className="space-y-3">
              {(currentSlide?.bullets || []).map((bullet, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => {
                      const newBullets = [...(currentSlide?.bullets || [])]
                      newBullets[index] = e.target.value
                      updateSlideBullets(currentSlideIndex, newBullets)
                    }}
                    placeholder={`Bullet ${index + 1}`}
                    className="flex-1 h-[48px] px-4 rounded-[16px] border border-border bg-card text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#5856D6]"
                  />
                  <button
                    onClick={() => {
                      const newBullets = (currentSlide?.bullets || []).filter((_, i) => i !== index)
                      updateSlideBullets(currentSlideIndex, newBullets)
                    }}
                    className="w-8 h-8 flex items-center justify-center text-[#888888] hover:text-red-500 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Add Bullet Button - Figma: Frame 171 */}
              <button
                onClick={() => {
                  const newBullets = [...(currentSlide?.bullets || []), '']
                  updateSlideBullets(currentSlideIndex, newBullets)
                }}
                className="w-[36px] h-[36px] rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: '#5856D6' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1V11M1 6H11" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}

          {/* Insert Image - Figma: Frame 169 */}
          <div className="pt-4 space-y-4">
            <ImageInsertButton
              slideIndex={currentSlideIndex}
              slideTitle={currentSlide?.headline || `Slide ${currentSlideIndex + 1}`}
              currentImage={currentImage}
            />

            {/* Image Crop Controls - only show when there's an image */}
            {currentImage && (
              <ImageCropControl slideIndex={currentSlideIndex} />
            )}
          </div>

          {/* Slide Navigation - Figma: Frame 67, Frame 159, Frame 98 (y:919) */}
          <div className="flex items-center justify-between pt-6">
            {/* Previous Slide Button */}
            <button
              onClick={() => goToSlide(currentSlideIndex - 1)}
              disabled={currentSlideIndex === 0}
              className={cn(
                'flex items-center gap-1 h-[41px] pl-[18px] pr-[24px] rounded-full transition-all bg-secondary',
                currentSlideIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'
              )}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M9 11L5 7L9 3" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[14px] font-semibold leading-none text-[#888888]">
                Voltar
              </span>
            </button>

            {/* Slide Pagination - Figma: Frame 159 */}
            <div className="flex items-center gap-3">
              {copySlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="transition-all hover:scale-110"
                >
                  {index === currentSlideIndex ? (
                    <span className="text-[14px] font-semibold" style={{ color: '#5856D6' }}>
                      {index + 1}
                    </span>
                  ) : (
                    <span
                      className="block w-[4px] h-[4px] rounded-full bg-border"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Next Slide Button */}
            <button
              onClick={() => goToSlide(currentSlideIndex + 1)}
              disabled={currentSlideIndex === totalSlides - 1}
              className={cn(
                'flex items-center gap-1 h-[41px] pl-[24px] pr-[18px] rounded-full transition-all',
                currentSlideIndex === totalSlides - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'
              )}
              style={{ backgroundColor: '#5856D6' }}
            >
              <span className="text-[14px] font-semibold leading-none text-white">
                Próximo
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M5 3L9 7L5 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - Preview (Figma: Frame 167) - LARGER */}
        <div
          className="flex-1 rounded-[16px] flex items-center justify-center bg-secondary"
          style={{ minHeight: '520px' }}
        >
          {/* Preview Container - Larger than Figma for better visibility */}
          <div
            className="rounded-[8px] overflow-hidden shadow-2xl"
            style={{
              width: '324px',
              height: '405px',
              backgroundColor: '#000000'
            }}
          >
            <div
              style={{
                transform: 'scale(0.3)', // 324 / 1080 = 0.3
                transformOrigin: 'top left',
                width: '1080px',
                height: '1350px',
              }}
            >
              <LiveSlidePreview
                index={currentSlideIndex}
                total={totalSlides}
                slide={currentSlide}
                image={currentImage}
                activeTab={activeTab}
                signature={signature}
                cropSettings={cropSettings}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Wizard Step Navigation - Figma: Frame 166 (y:1024) */}
      <div className="flex items-center justify-between pt-4">
        {/* Back to Previous Step */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 h-[41px] pl-[18px] pr-[24px] rounded-full hover:opacity-80 transition-all bg-secondary"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
            <path d="M9 11L5 7L9 3" stroke="#C8C8C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[14px] font-semibold leading-none" style={{ color: '#C8C8C8' }}>
            Voltar
          </span>
        </button>

        {/* Wizard Step Dots */}
        <div className="flex items-center gap-5">
          {[1, 2, 3, 4, 5].map((step) => (
            <span
              key={step}
              className={cn(
                'block rounded-full transition-all',
                step === 5
                  ? 'text-[12px] font-semibold text-[#5856D6]'
                  : 'w-[4px] h-[4px] bg-[#D8D8D8]'
              )}
            >
              {step === 5 ? '5' : ''}
            </span>
          ))}
        </div>

        {/* Export Button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 h-[41px] pl-[24px] pr-[18px] rounded-full hover:opacity-90 transition-all"
          style={{ backgroundColor: '#5856D6' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M8 2V10M8 10L5 7M8 10L11 7M3 14H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[14px] font-semibold leading-none text-white">
            Exportar
          </span>
        </button>
      </div>

      {/* Export Modal */}
      <ExportSlidesModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        slides={copySlides}
        slideImages={slideImages}
        signature={signature}
        cropSettings={usePipelineV2Store.getState().cropSettings}
      />
    </div>
  )
}

export default PreviewExportStepV2
