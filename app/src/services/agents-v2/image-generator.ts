/**
 * Image Generator Agent v2.0
 * Branding OS - Academia Lendaria
 *
 * O QUINTO agente do pipeline (agora antes do Quality Validator).
 * Gera imagens reais usando Gemini 3 Pro based no prompt visual.
 */

import type { GeminiAPIConfig } from '@/types/agent'
import type {
    PipelineInput,
    VisualSpecification,
    SlideVisualSpec,
} from '@/types/pipeline'
import { BaseAgent } from '../agents/base'

interface ImageGeneratorInput {
    pipelineInput: PipelineInput
    visual: VisualSpecification
}

export class ImageGeneratorAgent extends BaseAgent<ImageGeneratorInput, VisualSpecification> {
    constructor(config: GeminiAPIConfig) {
        super(config, 'visual-director') // Reusing visual-director role or creating new one? Using base config.
    }

    // This agent doesn't use a standard system/user prompt flow for text generation.
    // Instead, it iterates over slides and calls the image generation endpoint.

    get systemPrompt(): string {
        return ''
    }

    buildUserPrompt(_input: ImageGeneratorInput): string {
        return ''
    }

    async execute(input: ImageGeneratorInput): Promise<VisualSpecification> {
        const { visual } = input
        // Use the client initialized in BaseAgent
        const client = this.client
        const newVisual = JSON.parse(JSON.stringify(visual)) as VisualSpecification

        const slides = newVisual.slides
        const totalSlides = slides.length

        // OPTIMIZATION: Only generate images for COVER (first) and LAST slide
        // Middle slides can have images inserted manually by user
        // This reduces time from ~4-10min to ~2min
        const coverSlide = slides[0]
        const lastSlide = slides[totalSlides - 1]
        const slidesToProcess = totalSlides > 1 ? [coverSlide, lastSlide] : [coverSlide]

        console.log(`[ImageGenerator] Processing ${slidesToProcess.length} priority slides (cover + last) out of ${totalSlides} total`)

        // Process sequentially to avoid API rate limits
        for (const slide of slidesToProcess) {
            console.log(`[ImageGenerator] Generating image for slide ${slide.index} (${slide.layoutId})`)
            await this.processSlide(slide, client)
        }

        console.log(`[ImageGenerator] Priority slides completed. Middle slides can have images added manually.`)
        return newVisual
    }

    private async processSlide(slide: SlideVisualSpec, client: any) {
        console.log(`[ImageGenerator] Processing Slide ${slide.index}. Layout: ${slide.layoutId}`)

        // 1. Check for background image
        // Log what we found
        if (slide.background) {
            console.log(`[ImageGenerator] Slide ${slide.index} has background:`, slide.background)
        }

        if (slide.background && slide.background.type === 'image' && slide.background.value && !slide.background.value.startsWith('http') && !slide.background.value.startsWith('data:')) {
            try {
                console.log(`[ImageGenerator] Generating background for slide ${slide.index}. Prompt: "${slide.background.value}"`)
                const prompt = slide.background.value
                // Add style modifiers for consistency
                const imageUrl = await client.generateImage(prompt, {
                    aspectRatio: '4:5', // Portrait for background
                    style: 'cinematic, professional, high quality, 8k, minimalistic'
                })
                console.log(`[ImageGenerator] Background generated successfully for slide ${slide.index}`)
                slide.background.value = imageUrl
            } catch (error) {
                console.error(`[ImageGenerator] Failed to generate background for slide ${slide.index}:`, error)
                // Fallback to a solid color or keep text (RenderEngine will handle it?) 
                // Better to set a fallback solid color if image fails to avoid broken UI
                slide.background = { type: 'solid', value: '#1A1A1A' }
            }
        }

        // 2. Check for image elements
        if (slide.elements) {
            console.log(`[ImageGenerator] Slide ${slide.index} elements:`, slide.elements.map(e => ({ role: e.role, type: e.type, contentShort: e.content?.substring(0, 20) })))

            for (const element of slide.elements) {
                // Check if element needs image generation
                const needsGeneration = (element.type === 'image' || element.role === 'image' || element.role === 'background') &&
                    element.content &&
                    !element.content.startsWith('http') &&
                    !element.content.startsWith('data:')

                if (needsGeneration) {
                    try {
                        console.log(`[ImageGenerator] Generating element image for slide ${slide.index} (${element.role}). Prompt: "${element.content}"`)
                        const prompt = element.content
                        const imageUrl = await client.generateImage(prompt, {
                            aspectRatio: '16:9', // Usually elements are landscape-ish or square. Defaulting to 16:9 for body images
                            style: 'photorealistic, professional, clean studio lighting'
                        })
                        console.log(`[ImageGenerator] Element image generated successfully for slide ${slide.index} (${element.role})`)
                        // Update the content with the generated URL
                        element.content = imageUrl

                    } catch (error) {
                        console.error(`[ImageGenerator] Failed to generate image element for slide ${slide.index}:`, error)
                        // Fallback?
                        element.content = 'https://placehold.co/800x600/333/FFF?text=Image+Gen+Failed'
                    }
                }
            }
        }
    }

    parseOutput(_response: string): VisualSpecification {
        throw new Error('Method not implemented.')
    }
}
