/**
 * Export Slides Modal
 * Branding OS - Academia Lendaria
 *
 * Exports carousel slides as PNG or JPEG in a ZIP file
 */

import * as React from 'react'
import { toPng, toJpeg } from 'html-to-image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { cn } from '@/lib/utils'
import { renderEngine } from '@/services/agents-v2/render-engine'
import type { SlideCopy, VisualElement } from '@/types/pipeline'
import type { CropSettings } from '@/store/pipelineV2Store'

interface ExportSlidesModalProps {
  isOpen: boolean
  onClose: () => void
  slides: SlideCopy[]
  slideImages: Record<number, string>
  signature: string
  cropSettings: Record<number, CropSettings>
}

type ExportFormat = 'png' | 'jpeg'
type ExportQuality = 'high' | 'medium' | 'low'

const QUALITY_SETTINGS: Record<ExportQuality, { scale: number; jpegQuality: number; label: string }> = {
  high: { scale: 2, jpegQuality: 0.95, label: 'Alta (2x - Recomendado)' },
  medium: { scale: 1.5, jpegQuality: 0.85, label: 'Média (1.5x)' },
  low: { scale: 1, jpegQuality: 0.75, label: 'Baixa (1x)' },
}

// Generate crop CSS for a specific slide
function generateCropCSS(slideIndex: number, settings: CropSettings | undefined, hasImage: boolean): string {
  if (!hasImage || !settings) return ''

  const defaultSettings: CropSettings = {
    positionX: 0,
    positionY: 0,
    zoom: 1.0,
    containerOffsetY: 0,
    aspectRatio: '16:9'
  }

  const cropSettings = { ...defaultSettings, ...settings }

  const posX = 50 + cropSettings.positionX
  const posY = 50 + cropSettings.positionY
  const offsetY = cropSettings.containerOffsetY || 0

  const aspectHeights: Record<string, number> = {
    '16:9': 520,
    '4:3': 693,
    '1:1': 924,
    '3:4': 1232,
  }
  const containerHeight = aspectHeights[cropSettings.aspectRatio] || 520

  return `
    .body-image,
    .last-image {
      object-position: ${posX}% ${posY}% !important;
      transform: scale(${cropSettings.zoom}) !important;
      transform-origin: ${posX}% ${posY}% !important;
    }
    .body-image-container,
    .last-image-container {
      top: ${519 + offsetY}px !important;
      height: ${containerHeight}px !important;
    }
    .slide-${slideIndex + 1}::before {
      object-position: ${posX}% ${posY}% !important;
      transform: scale(${cropSettings.zoom}) !important;
      transform-origin: ${posX}% ${posY}% !important;
    }
  `
}

export function ExportSlidesModal({
  isOpen,
  onClose,
  slides,
  slideImages,
  signature,
  cropSettings,
}: ExportSlidesModalProps) {
  const [format, setFormat] = React.useState<ExportFormat>('png')
  const [quality, setQuality] = React.useState<ExportQuality>('high')
  const [isExporting, setIsExporting] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const totalSlides = slides.length

  const handleExport = async () => {
    if (!containerRef.current || totalSlides === 0) return

    setIsExporting(true)
    setProgress(0)
    setCurrentSlide(0)

    const zip = new JSZip()
    const qualitySettings = QUALITY_SETTINGS[quality]
    const folder = zip.folder('carousel-slides')

    if (!folder) {
      setIsExporting(false)
      return
    }

    try {
      for (let i = 0; i < totalSlides; i++) {
        setCurrentSlide(i + 1)
        setProgress(Math.round(((i) / totalSlides) * 100))

        const slide = slides[i]
        const image = slideImages[i]

        // Determine layout
        let layoutId = 'branding-os-body-v1'
        if (i === 0) layoutId = 'branding-os-cover-v1'
        if (i === totalSlides - 1) layoutId = 'branding-os-last-v1'

        // Build elements
        const elements: VisualElement[] = []

        if (slide.headline) {
          elements.push({
            role: 'headline',
            type: 'text',
            content: slide.headline,
            style: {},
            position: { x: 0, y: 0, width: 0, height: 0 }
          })
        }

        const bodyContent = slide.body || (slide.bullets?.length ? slide.bullets.map(b => `• ${b}`).join('\n') : '')

        if (layoutId === 'branding-os-cover-v1' && bodyContent) {
          elements.push({
            role: 'subheadline',
            type: 'text',
            content: bodyContent,
            style: {},
            position: { x: 0, y: 0, width: 0, height: 0 }
          })
        } else if (layoutId === 'branding-os-last-v1' && bodyContent) {
          elements.push({
            role: 'body',
            type: 'text',
            content: bodyContent,
            style: {},
            position: { x: 0, y: 0, width: 0, height: 0 }
          })
        } else if (bodyContent) {
          elements.push({
            role: 'body',
            type: 'text',
            content: bodyContent,
            style: {},
            position: { x: 0, y: 0, width: 0, height: 0 }
          })
        }

        if (image) {
          if (layoutId === 'branding-os-cover-v1') {
            elements.push({
              role: 'background',
              type: 'image',
              content: image,
              style: {},
              position: { x: 0, y: 0, width: 0, height: 0 }
            })
          } else {
            elements.push({
              role: 'image',
              type: 'image',
              content: image,
              style: {},
              position: { x: 0, y: 0, width: 0, height: 0 }
            })
          }
        }

        // Render slide
        const result = renderEngine.render({
          slides: [{
            index: i + 1,
            layoutId,
            canvas: { width: 1080, height: 1350 },
            background: { type: 'solid', value: '#1A1A1A' },
            elements
          }],
          tokens: { colors: {}, fonts: {}, spacing: {} },
          signature
        })

        const slideData = result.slides[0]

        // Create temporary container for rendering
        const tempContainer = document.createElement('div')
        tempContainer.style.position = 'absolute'
        tempContainer.style.left = '-9999px'
        tempContainer.style.top = '-9999px'
        tempContainer.style.width = '1080px'
        tempContainer.style.height = '1350px'
        tempContainer.style.overflow = 'hidden'

        // Get crop settings for THIS specific slide
        const slideCropSettings = cropSettings[i]
        const slideCropCSS = generateCropCSS(i, slideCropSettings, !!image)

        tempContainer.innerHTML = `<style>${slideData.css}${slideCropCSS}</style>${slideData.html}`
        document.body.appendChild(tempContainer)

        // Wait for images to load
        const images = tempContainer.querySelectorAll('img')
        await Promise.all(Array.from(images).map(img => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve
          })
        }))

        // Small delay for rendering
        await new Promise(resolve => setTimeout(resolve, 100))

        // Generate image
        const slideElement = tempContainer.querySelector('.slide-1, .slide-2, .slide-3, .slide-4, .slide-5, .slide-6, .slide-7, .slide-8') as HTMLElement || tempContainer

        let dataUrl: string
        if (format === 'png') {
          dataUrl = await toPng(slideElement, {
            width: 1080,
            height: 1350,
            pixelRatio: qualitySettings.scale,
            backgroundColor: '#000000',
          })
        } else {
          dataUrl = await toJpeg(slideElement, {
            width: 1080,
            height: 1350,
            pixelRatio: qualitySettings.scale,
            quality: qualitySettings.jpegQuality,
            backgroundColor: '#000000',
          })
        }

        // Remove temp container
        document.body.removeChild(tempContainer)

        // Convert base64 to blob
        const base64Data = dataUrl.split(',')[1]
        const binaryData = atob(base64Data)
        const arrayBuffer = new Uint8Array(binaryData.length)
        for (let j = 0; j < binaryData.length; j++) {
          arrayBuffer[j] = binaryData.charCodeAt(j)
        }

        // Add to ZIP
        const fileName = `slide-${String(i + 1).padStart(2, '0')}.${format}`
        folder.file(fileName, arrayBuffer, { binary: true })

        setProgress(Math.round(((i + 1) / totalSlides) * 100))
      }

      // Generate ZIP and download
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const timestamp = new Date().toISOString().slice(0, 10)
      saveAs(zipBlob, `carousel-${timestamp}.zip`)

      setIsExporting(false)
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
      alert('Erro ao exportar. Tente novamente.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isExporting ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-[24px] p-8 w-[480px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-semibold text-foreground">
            Exportar Carrossel
          </h2>
          {!isExporting && (
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="#888888" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {!isExporting ? (
          <>
            {/* Format Selection */}
            <div className="mb-6">
              <label className="text-[12px] font-semibold text-foreground mb-2 block">
                Formato
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFormat('png')}
                  className={cn(
                    'flex-1 h-[48px] rounded-[12px] border-2 font-semibold text-[14px] transition-all',
                    format === 'png'
                      ? 'border-[#5856D6] bg-[#5856D6]/5 text-[#5856D6]'
                      : 'border-[#E8E8E8] text-[#888888] hover:border-[#D8D8D8]'
                  )}
                >
                  PNG
                  <span className="block text-[10px] font-normal opacity-70">Transparência, maior qualidade</span>
                </button>
                <button
                  onClick={() => setFormat('jpeg')}
                  className={cn(
                    'flex-1 h-[48px] rounded-[12px] border-2 font-semibold text-[14px] transition-all',
                    format === 'jpeg'
                      ? 'border-[#5856D6] bg-[#5856D6]/5 text-[#5856D6]'
                      : 'border-[#E8E8E8] text-[#888888] hover:border-[#D8D8D8]'
                  )}
                >
                  JPEG
                  <span className="block text-[10px] font-normal opacity-70">Menor tamanho</span>
                </button>
              </div>
            </div>

            {/* Quality Selection */}
            <div className="mb-6">
              <label className="text-[12px] font-semibold text-foreground mb-2 block">
                Qualidade
              </label>
              <div className="space-y-2">
                {(Object.keys(QUALITY_SETTINGS) as ExportQuality[]).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={cn(
                      'w-full h-[44px] px-4 rounded-[12px] border-2 text-left font-medium text-[14px] transition-all flex items-center justify-between',
                      quality === q
                        ? 'border-[#5856D6] bg-[#5856D6]/5 text-[#5856D6]'
                        : 'border-[#E8E8E8] text-[#888888] hover:border-[#D8D8D8]'
                    )}
                  >
                    <span>{QUALITY_SETTINGS[q].label}</span>
                    {quality === q && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L6.5 11.5L13 5" stroke="#5856D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="mb-6 p-4 bg-secondary rounded-[12px]">
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
                  <circle cx="10" cy="10" r="9" stroke="#5856D6" strokeWidth="2" />
                  <path d="M10 9V14M10 6V7" stroke="#5856D6" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div className="text-[12px] text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Detalhes da exportação</p>
                  <p>• {totalSlides} slides serão exportados</p>
                  <p>• Tamanho: 1080 x 1350px (Instagram)</p>
                  <p>• Formato: {format.toUpperCase()}</p>
                  <p>• Arquivo: carousel-[data].zip</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-[48px] rounded-full border border-border text-[14px] font-semibold text-muted-foreground hover:bg-secondary transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleExport}
                className="flex-1 h-[48px] rounded-full bg-[#5856D6] text-[14px] font-semibold text-white hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2V10M8 10L5 7M8 10L11 7M3 14H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Exportar ZIP
              </button>
            </div>
          </>
        ) : (
          /* Exporting State */
          <div className="py-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#5856D6]/10 flex items-center justify-center">
                <svg className="animate-spin" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="#E8E8E8" strokeWidth="4" />
                  <path d="M16 2C8.268 2 2 8.268 2 16" stroke="#5856D6" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[16px] font-semibold text-foreground mb-1">
                Exportando slide {currentSlide} de {totalSlides}
              </p>
              <p className="text-[14px] text-[#888888]">
                Aguarde enquanto geramos as imagens...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-[#E8E8E8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5856D6] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-[12px] text-[#888888] mt-2">
              {progress}% concluído
            </p>
          </div>
        )}
      </div>

      {/* Hidden render container */}
      <div ref={containerRef} className="hidden" />
    </div>
  )
}
