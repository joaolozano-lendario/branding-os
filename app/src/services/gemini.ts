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
  text: 'models/gemini-2.5-pro',
  image: 'models/gemini-3-pro-image-preview',
} as const

// ============================================
// API CLIENT
// ============================================

export class GeminiAPIClient {
  private config: GeminiAPIConfig
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta'

  constructor(config: GeminiAPIConfig) {
    // Validate API key format
    if (!config.apiKey || config.apiKey.startsWith('models/')) {
      console.error('[GeminiAPI] Invalid API key detected:', config.apiKey?.slice(0, 20))
      throw new Error('Invalid API key. Please check your Settings.')
    }
    this.config = config
    console.log('[GeminiAPI] Client initialized with key:', config.apiKey.slice(0, 10) + '...')
  }

  private getEndpoint(model: string): string {
    return `${this.baseUrl}/${model}:generateContent?key=${this.config.apiKey}`
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
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
    const maxRetries = 3
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (attempt > 0) {
        // Exponential backoff: 2s, 4s, 8s
        const waitTime = Math.pow(2, attempt) * 1000
        console.log(`[GeminiAPI] Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}...`)
        await this.delay(waitTime)
      }

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

      try {
        const response = await fetch(this.getEndpoint(model), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        })

        if (response.status === 429) {
          // Rate limited - will retry
          lastError = new Error('Rate limited (429). Retrying...')
          continue
        }

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
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        if (attempt === maxRetries - 1) {
          throw lastError
        }
      }
    }

    throw lastError || new Error('Max retries exceeded')
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

CRITICAL JSON RULES:
1. Response MUST be valid JSON only - no markdown, no explanations
2. Start with { and end with }
3. Use double quotes for all strings
4. No trailing commas
5. Escape special characters in strings: \\n \\t \\" \\\\
6. Keep response concise to avoid truncation`

    const response = await this.complete(enhancedSystemPrompt, userPrompt, {
      ...options,
      maxTokens: options?.maxTokens || 8192, // Ensure large enough for complex JSON
    })

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

    let extracted = jsonMatch[0]

    // Try to repair common JSON issues
    try {
      return JSON.parse(extracted) as T
    } catch (firstError) {
      console.warn('[GeminiAPI] First parse failed, attempting repair...', firstError)

      // Attempt repairs
      let repaired = extracted

      // Fix trailing commas before } or ]
      repaired = repaired.replace(/,(\s*[}\]])/g, '$1')

      // Remove incomplete last element (truncated JSON)
      // Find last complete object/array and remove anything after
      repaired = repaired.replace(/,\s*"[^"]*"?\s*:?\s*[^,}\]]*$/g, '')
      repaired = repaired.replace(/,\s*{\s*"[^}]*$/g, '')
      repaired = repaired.replace(/,\s*\[\s*[^\]]*$/g, '')

      // Fix unescaped newlines in strings
      repaired = repaired.replace(/([^\\])\\n/g, '$1\\\\n')

      // Try to close unclosed structures
      const openBraces = (repaired.match(/{/g) || []).length
      const closeBraces = (repaired.match(/}/g) || []).length
      const openBrackets = (repaired.match(/\[/g) || []).length
      const closeBrackets = (repaired.match(/]/g) || []).length

      // Add missing closing brackets/braces
      for (let i = 0; i < openBrackets - closeBrackets; i++) {
        repaired += ']'
      }
      for (let i = 0; i < openBraces - closeBraces; i++) {
        repaired += '}'
      }

      try {
        const result = JSON.parse(repaired) as T
        console.log('[GeminiAPI] JSON repair successful')
        return result
      } catch (secondError) {
        // Last resort: try to extract a minimal valid structure
        console.error('[GeminiAPI] JSON repair failed:', secondError)
        console.error('[GeminiAPI] Raw response (first 500 chars):', extracted.slice(0, 500))
        throw new Error(`Failed to parse JSON response: ${firstError}`)
      }
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
