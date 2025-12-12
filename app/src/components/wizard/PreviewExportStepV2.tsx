/**
 * Preview & Export Step V2
 * Branding OS - Academia Lendaria
 *
 * IDENTICAL to Figma: Interface-06-Gerar / Interface-06-Gerar-2
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { usePipelineV2Store } from '@/store/pipelineV2Store'
import { CarouselSlide } from '@/components/carousel/CarouselSlide'
import { ImageInsertButton } from './ImageInsertButton'
import type { PipelineResult, SlideCopy } from '@/types/pipeline'

interface PreviewExportStepV2Props {
  pipelineResult: PipelineResult | null
  onNext?: () => void
  onBack?: () => void
}

export function PreviewExportStepV2({
  pipelineResult,
  onNext,
  onBack,
}: PreviewExportStepV2Props) {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0)
  const [activeTab, setActiveTab] = React.useState<'description' | 'bullets'>('description')

  // Store actions for editing
  const updateSlideHeadline = usePipelineV2Store((s) => s.updateSlideHeadline)
  const updateSlideBody = usePipelineV2Store((s) => s.updateSlideBody)
  const updateSlideBullets = usePipelineV2Store((s) => s.updateSlideBullets)

  // Get slides data
  const copySlides = pipelineResult?.copy?.slides || []
  const slideImages = pipelineResult?.slideImages || {}
  const totalSlides = copySlides.length

  // Current slide data
  const currentSlide: SlideCopy | undefined = copySlides[currentSlideIndex]
  const currentImage = slideImages[currentSlideIndex]

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
        <h2 className="text-[24px] font-semibold leading-[1.3] text-black">
          Revise o conteúdo<br />e insira as imagens
        </h2>
        <p className="mt-2 text-[14px] text-[#888888]">
          Você pode editar, inserir e mudar o que preferir.
        </p>
      </div>

      {/* Main Content - Two Columns */}
      <div className="flex gap-8">
        {/* LEFT COLUMN - Editor */}
        <div className="w-[385px] space-y-4 shrink-0">
          {/* Tabs - Figma: Frame 85 */}
          <div
            className="inline-flex h-[36px] p-1 rounded-full gap-1"
            style={{ backgroundColor: '#F8F8F8' }}
          >
            <button
              onClick={convertToDescription}
              className={cn(
                'h-[28px] px-4 rounded-full text-[12px] font-semibold transition-all',
                activeTab === 'description'
                  ? 'bg-[#5856D6] text-white'
                  : 'bg-[#EEEEEE] text-[#888888]'
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
                  : 'bg-[#EEEEEE] text-[#888888]'
              )}
            >
              Bullet Point
            </button>
          </div>

          {/* Title Field - Figma: Frame 82 */}
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-black">
              Título
            </label>
            <input
              type="text"
              value={currentSlide?.headline || ''}
              onChange={(e) => updateSlideHeadline(currentSlideIndex, e.target.value)}
              placeholder="Digite o título do slide"
              className="w-full h-[62px] px-4 rounded-[16px] border border-[#E8E8E8] bg-white text-[14px] text-black placeholder:text-[#888888] focus:outline-none focus:border-[#5856D6]"
            />
          </div>

          {/* Content - Description Mode */}
          {activeTab === 'description' && (
            <div className="space-y-2">
              <textarea
                value={currentSlide?.body || ''}
                onChange={(e) => updateSlideBody(currentSlideIndex, e.target.value)}
                placeholder="Digite a descrição do slide"
                className="w-full h-[144px] px-4 py-4 rounded-[16px] border border-[#E8E8E8] bg-white text-[14px] text-black placeholder:text-[#888888] resize-none focus:outline-none focus:border-[#5856D6]"
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
                    className="flex-1 h-[48px] px-4 rounded-[16px] border border-[#E8E8E8] bg-white text-[14px] text-black placeholder:text-[#888888] focus:outline-none focus:border-[#5856D6]"
                  />
                  <button
                    onClick={() => {
                      const newBullets = (currentSlide?.bullets || []).filter((_, i) => i !== index)
                      updateSlideBullets(currentSlideIndex, newBullets)
                    }}
                    className="w-8 h-8 flex items-center justify-center text-[#888888] hover:text-red-500 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
                  <path d="M6 1V11M1 6H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* Insert Image - Figma: Frame 169 */}
          <div className="pt-4">
            <ImageInsertButton
              slideIndex={currentSlideIndex}
              slideTitle={currentSlide?.headline || `Slide ${currentSlideIndex + 1}`}
              currentImage={currentImage}
            />
          </div>
        </div>

        {/* RIGHT COLUMN - Preview (Figma: Frame 167) */}
        <div
          className="flex-1 rounded-[8px] p-8 flex items-center justify-center"
          style={{ backgroundColor: '#F8F8F8', minHeight: '460px' }}
        >
          {/* Preview Container - Figma: Frame 168 */}
          <div
            className="rounded-[8px] overflow-hidden"
            style={{
              width: '256px',
              height: '320px',
              backgroundColor: '#000000'
            }}
          >
            <div
              style={{
                transform: 'scale(0.237)',
                transformOrigin: 'top left',
                width: '1080px',
                height: '1350px',
              }}
            >
              <CarouselSlide
                pageNumber={currentSlideIndex + 1}
                totalPages={totalSlides}
                title={currentSlide?.headline || `Slide ${currentSlideIndex + 1}`}
                content={
                  activeTab === 'bullets' && currentSlide?.bullets?.length
                    ? { type: 'bullets', data: currentSlide.bullets }
                    : currentSlide?.body
                    ? { type: 'text', data: currentSlide.body }
                    : undefined
                }
                imageSrc={currentImage}
                variant={currentSlideIndex === 0 ? 'capa' : 'corpo'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation - Figma: Frame 166 */}
      <div className="flex items-center justify-between">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 h-[41px] pl-[18px] pr-[24px] rounded-full"
          style={{ backgroundColor: '#F8F8F8' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7L9 3" stroke="#C8C8C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[14px] font-semibold" style={{ color: '#C8C8C8' }}>
            Voltar
          </span>
        </button>

        {/* Slide Pagination - Figma: Frame 159 */}
        <div className="flex items-center gap-4">
          {copySlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="transition-all hover:scale-110"
            >
              {index === currentSlideIndex ? (
                <span className="text-[12px] font-semibold" style={{ color: '#5856D6' }}>
                  {index + 1}
                </span>
              ) : (
                <span
                  className="block w-[4px] h-[4px] rounded-full"
                  style={{ backgroundColor: '#D8D8D8' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="flex items-center gap-1 h-[41px] pl-[24px] pr-[18px] rounded-full"
          style={{ backgroundColor: '#5856D6' }}
        >
          <span className="text-[14px] font-semibold text-white">
            Próximo
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L9 7L5 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default PreviewExportStepV2
