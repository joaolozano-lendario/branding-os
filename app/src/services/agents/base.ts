/**
 * Base Agent Class
 * Branding OS - Academia Lendaria
 * E2: Multi-Agent Engine
 *
 * IMPORTANTE: Este projeto usa GEMINI (Google AI) para todas as operações de IA
 * - Texto: models/gemini-3-pro-preview
 * - Imagens: models/gemini-3-pro-image-preview
 */

import type { AgentId, GeminiAPIConfig } from '@/types/agent'
import { GeminiAPIClient, getGeminiClient } from '@/services/gemini'

export abstract class BaseAgent<TInput, TOutput> {
  protected client: GeminiAPIClient
  protected agentId: AgentId

  constructor(config: GeminiAPIConfig, agentId: AgentId) {
    this.client = getGeminiClient(config)
    this.agentId = agentId
  }

  abstract get systemPrompt(): string
  abstract buildUserPrompt(input: TInput): string
  abstract parseOutput(response: string): TOutput

  async execute(input: TInput): Promise<TOutput> {
    const userPrompt = this.buildUserPrompt(input)

    try {
      const response = await this.client.completeJSON<TOutput>(
        this.systemPrompt,
        userPrompt,
        {
          temperature: 0.7,
          maxTokens: 16384, // Increased to avoid truncation
        }
      )

      return response
    } catch (error) {
      console.error(`[${this.agentId}] Execution failed:`, error)
      throw error
    }
  }
}
