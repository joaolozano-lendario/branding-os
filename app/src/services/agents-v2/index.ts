/**
 * Agents v2.0 Index
 * Branding OS - Academia Lendaria
 *
 * Nova arquitetura de agentes com sinergia total.
 */

// Agents
export { BrandStrategistAgent } from './brand-strategist'
export { StoryArchitectAgent } from './story-architect'
export { CopywriterAgentV2 } from './copywriter'
export { VisualCompositorAgent } from './visual-compositor'
export { QualityValidatorAgent } from './quality-validator'
export { RenderEngine, renderEngine } from './render-engine'

// Pipeline
export {
  PipelineOrchestratorV2,
  runPipelineV2,
  type PipelineAgentId,
  type PipelineV2Callbacks,
} from './pipeline-v2'

// Input Adapter
export {
  adaptToPipelineInput,
  validatePipelineInput,
} from './input-adapter'
