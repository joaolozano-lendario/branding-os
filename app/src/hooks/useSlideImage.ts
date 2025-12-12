/**
 * useSlideImage Hook
 * Branding OS - Academia Lendaria
 *
 * Hook para gerenciamento de imagens de slides.
 * Suporta geração via Gemini AI e upload manual.
 */

import { useState, useCallback } from 'react'
import { getGeminiClient } from '@/services/gemini'
import { usePipelineV2Store } from '@/store/pipelineV2Store'
import { useAgentStore } from '@/store/agentStore'

interface UseSlideImageOptions {
  slideIndex: number
  slideTitle?: string
}

interface UseSlideImageReturn {
  isGenerating: boolean
  error: string | null
  generateImage: (customPrompt?: string) => Promise<void>
  uploadImage: (file: File) => void
  removeImage: () => void
  clearError: () => void
}

export function useSlideImage({
  slideIndex,
  slideTitle = '',
}: UseSlideImageOptions): UseSlideImageReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get API config from pipelineV2Store with fallback to agentStore
  const pipelineApiConfig = usePipelineV2Store((state) => state.apiConfig)
  const agentApiConfig = useAgentStore((state) => state.apiConfig)
  const apiConfig = pipelineApiConfig || agentApiConfig

  const updateSlideImage = usePipelineV2Store((state) => state.updateSlideImage)

  // Generate image via Gemini AI
  const generateImage = useCallback(
    async (customPrompt?: string) => {
      if (!apiConfig) {
        setError('API key não configurada. Vá em Configurações para adicionar.')
        return
      }

      setIsGenerating(true)
      setError(null)

      try {
        const client = getGeminiClient(apiConfig)

        // Build prompt based on slide context
        const basePrompt = customPrompt || slideTitle
        const enhancedPrompt = `Professional image for Instagram carousel slide about: ${basePrompt}.
          Style: Clean, modern, minimalist design. High contrast.
          Suitable for social media marketing content.
          No text in the image. Abstract or conceptual representation.`

        const imageDataUrl = await client.generateImage(enhancedPrompt, {
          aspectRatio: '4:3',
          style: 'professional, modern, clean, minimalist',
        })

        updateSlideImage(slideIndex, imageDataUrl)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Falha ao gerar imagem'
        setError(message)
        console.error('[useSlideImage] Generation error:', err)
      } finally {
        setIsGenerating(false)
      }
    },
    [apiConfig, slideIndex, slideTitle, updateSlideImage]
  )

  // Upload image manually
  const uploadImage = useCallback(
    (file: File) => {
      const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!validTypes.includes(file.type)) {
        setError('Formato inválido. Use PNG, JPG, WebP ou GIF.')
        return
      }

      if (file.size > maxSize) {
        setError('Arquivo muito grande. Máximo 10MB.')
        return
      }

      setError(null)

      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        updateSlideImage(slideIndex, dataUrl)
      }
      reader.onerror = () => {
        setError('Erro ao ler arquivo.')
      }
      reader.readAsDataURL(file)
    },
    [slideIndex, updateSlideImage]
  )

  // Remove image
  const removeImage = useCallback(() => {
    updateSlideImage(slideIndex, '')
  }, [slideIndex, updateSlideImage])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isGenerating,
    error,
    generateImage,
    uploadImage,
    removeImage,
    clearError,
  }
}
