/**
 * Gemini API Service
 * Branding OS - Academia Lendaria
 * E2: Multi-Agent Engine
 *
 * IMPORTANTE: Este projeto usa GEMINI (Google AI) para todas as operações de IA
 * - Texto: models/gemini-3-pro-preview
 * - Imagens: models/gemini-3-pro-image-preview
 */

import type { GeminiAPIConfig } from '@/types/agent'

// ============================================
// API TYPES
// ============================================

interface GeminiContent {
  role: 'user' | 'model'
  parts: Array<{
    text?: string
    inlineData?: {
      mimeType: string
      data: string
    }
  }>
}

interface GeminiRequest {
  contents: GeminiContent[]
  systemInstruction?: {
    parts: Array<{ text: string }>
  }
  generationConfig?: {
    temperature?: number
    maxOutputTokens?: number
    topP?: number
    topK?: number
  }
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text?: string
        inlineData?: {
          mimeType: string
          data: string
        }
      }>
      role: string
    }
    finishReason: string
  }>
  usageMetadata?: {
    promptTokenCount: number
    candidatesTokenCount: number
    totalTokenCount: number
  }
}

// ============================================
// MODELS CONFIGURATION
// ============================================

export const GEMINI_MODELS = {
  text: 'models/gemini-3-pro-preview',
  image: 'models/gemini-3-pro-image-preview',
} as const

// ============================================
// API CLIENT
// ============================================

export class GeminiAPIClient {
  private config: GeminiAPIConfig
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta'

  constructor(config: GeminiAPIConfig) {
    this.config = config
  }

  private getEndpoint(model: string): string {
    return `${this.baseUrl}/${model}:generateContent?key=${this.config.apiKey}`
  }

  async complete(
    systemPrompt: string,
    userPrompt: string,
    options?: {
      temperature?: number
      maxTokens?: number
      model?: keyof typeof GEMINI_MODELS
    }
  ): Promise<string> {
    const model = GEMINI_MODELS[options?.model ?? 'text']

    const request: GeminiRequest = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: options?.temperature ?? this.config.temperature,
        maxOutputTokens: options?.maxTokens ?? this.config.maxOutputTokens,
        topP: 0.95,
        topK: 40,
      },
    }

    const response = await fetch(this.getEndpoint(model), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'API request failed')
    }

    const data: GeminiResponse = await response.json()

    if (data.candidates && data.candidates.length > 0) {
      const content = data.candidates[0].content
      if (content.parts && content.parts.length > 0 && content.parts[0].text) {
        return content.parts[0].text
      }
    }

    throw new Error('No content in response')
  }

  async completeJSON<T>(
    systemPrompt: string,
    userPrompt: string,
    options?: {
      temperature?: number
      maxTokens?: number
    }
  ): Promise<T> {
    const enhancedSystemPrompt = `${systemPrompt}

IMPORTANT: Your response MUST be valid JSON only. Do not include any explanatory text, markdown code blocks, or anything before or after the JSON. The response should start with { and end with }.`

    const response = await this.complete(enhancedSystemPrompt, userPrompt, options)

    // Extract JSON from response (in case there's extra text or markdown)
    let jsonString = response.trim()

    // Remove markdown code blocks if present
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7)
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.slice(3)
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.slice(0, -3)
    }
    jsonString = jsonString.trim()

    // Find JSON object
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }

    try {
      return JSON.parse(jsonMatch[0]) as T
    } catch (e) {
      throw new Error(`Failed to parse JSON response: ${e}`)
    }
  }

  async generateImage(
    prompt: string,
    options?: {
      aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3'
      style?: string
    }
  ): Promise<string> {
    const model = GEMINI_MODELS.image

    const enhancedPrompt = options?.style
      ? `${prompt}. Style: ${options.style}`
      : prompt

    const request: GeminiRequest = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `Generate an image: ${enhancedPrompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192,
      },
    }

    const response = await fetch(this.getEndpoint(model), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Image generation failed')
    }

    const data: GeminiResponse = await response.json()

    if (data.candidates && data.candidates.length > 0) {
      const content = data.candidates[0].content
      if (content.parts && content.parts.length > 0) {
        const imagePart = content.parts.find(p => p.inlineData)
        if (imagePart?.inlineData) {
          return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`
        }
      }
    }

    throw new Error('No image in response')
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.complete(
        'You are a helpful assistant.',
        'Say "connected" if you can hear me.',
        { maxTokens: 10 }
      )
      return true
    } catch {
      return false
    }
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

let clientInstance: GeminiAPIClient | null = null

export function getGeminiClient(config: GeminiAPIConfig): GeminiAPIClient {
  if (!clientInstance || clientInstance['config'].apiKey !== config.apiKey) {
    clientInstance = new GeminiAPIClient(config)
  }
  return clientInstance
}

export function clearGeminiClient(): void {
  clientInstance = null
}
