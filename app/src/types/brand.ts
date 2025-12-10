/**
 * Brand Configuration Types
 * Branding OS - Academia Lendária
 */

// ============================================
// VISUAL IDENTITY TYPES (BRAND-001)
// ============================================

export interface BrandLogo {
  id: string
  file: File | null
  url: string | null
  fileName: string | null
  fileType: 'png' | 'svg' | null
  uploadedAt: Date | null
}

export interface BrandColor {
  id: string
  name: string
  hex: string
  role: 'primary' | 'secondary' | 'accent' | 'neutral' | 'custom'
  contrastRatio?: number
  wcagCompliant?: boolean
}

export interface BrandColorPalette {
  primary: BrandColor
  secondary: BrandColor
  accent: BrandColor
  neutrals: BrandColor[]
  custom: BrandColor[]
}

export interface BrandFont {
  id: string
  family: string
  role: 'heading' | 'body' | 'accent' | 'mono'
  weights: number[]
  source: 'google' | 'custom' | 'system'
  url?: string
}

export interface BrandTypography {
  heading: BrandFont
  body: BrandFont
  accent: BrandFont | null
}

export interface VisualIdentity {
  logo: BrandLogo
  colors: BrandColorPalette
  typography: BrandTypography
  updatedAt: Date | null
}

// ============================================
// BRAND VOICE TYPES (BRAND-002)
// ============================================

export type VoiceAttribute =
  | 'professional'
  | 'playful'
  | 'authoritative'
  | 'friendly'
  | 'sophisticated'
  | 'casual'
  | 'inspiring'
  | 'educational'
  | 'bold'
  | 'empathetic'

export interface ToneGuideline {
  id: string
  text: string
  order: number
}

export interface CopyExample {
  id: string
  text: string
  context: string
  isGood: boolean
  notes?: string
}

export interface BrandVoice {
  attributes: VoiceAttribute[]
  toneGuidelines: ToneGuideline[]
  copyExamples: CopyExample[]
  updatedAt: Date | null
}

// ============================================
// BRAND EXAMPLES TYPES (BRAND-003)
// ============================================

export type ExampleType = 'carousel' | 'ad' | 'slide' | 'post' | 'other'

export interface BrandExampleTag {
  id: string
  type: ExampleType
  label: string
  color: string
}

export interface BrandExample {
  id: string
  file: File | null
  url: string | null
  fileName: string
  fileType: string
  type: ExampleType
  tags: string[]
  annotation: string
  whatMakesItOnBrand: string
  uploadedAt: Date
}

export interface BrandExamplesLibrary {
  examples: BrandExample[]
  tags: BrandExampleTag[]
  updatedAt: Date | null
}

// ============================================
// BRAND CONFIGURATION (COMBINED)
// ============================================

export interface BrandConfiguration {
  id: string
  name: string
  visualIdentity: VisualIdentity
  voice: BrandVoice
  examples: BrandExamplesLibrary
  createdAt: Date
  updatedAt: Date
  completeness: BrandCompleteness
}

export interface BrandCompleteness {
  visualIdentity: number // 0-100
  voice: number // 0-100
  examples: number // 0-100
  overall: number // 0-100
}

// ============================================
// UI STATE TYPES
// ============================================

export type ConfigSection = 'visual' | 'voice' | 'examples' | 'dashboard'

export interface BrandConfigState {
  // Data
  config: BrandConfiguration | null

  // UI State
  activeSection: ConfigSection
  isLoading: boolean
  isSaving: boolean
  hasUnsavedChanges: boolean
  errors: Record<string, string>

  // Actions
  setActiveSection: (section: ConfigSection) => void
  setConfig: (config: BrandConfiguration) => void
  updateVisualIdentity: (updates: Partial<VisualIdentity>) => void
  updateVoice: (updates: Partial<BrandVoice>) => void
  updateExamples: (updates: Partial<BrandExamplesLibrary>) => void
  saveConfig: () => Promise<void>
  resetConfig: () => void
  calculateCompleteness: () => BrandCompleteness
}

// ============================================
// FORM VALIDATION TYPES
// ============================================

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface ColorValidation extends ValidationResult {
  contrastRatio?: number
  wcagLevel?: 'AAA' | 'AA' | 'A' | 'FAIL'
}

// ============================================
// EXPORT TYPES
// ============================================

export interface BrandExportYAML {
  version: string
  exportedAt: string
  brand: {
    name: string
    visualIdentity: {
      logoUrl: string | null
      colors: Record<string, string>
      fonts: Record<string, string>
    }
    voice: {
      attributes: string[]
      toneGuidelines: string[]
    }
    examplesCount: number
  }
}

// ============================================
// HELPER FUNCTIONS (Type Guards)
// ============================================

export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

export function isVoiceAttribute(value: string): value is VoiceAttribute {
  const validAttributes: VoiceAttribute[] = [
    'professional', 'playful', 'authoritative', 'friendly',
    'sophisticated', 'casual', 'inspiring', 'educational',
    'bold', 'empathetic'
  ]
  return validAttributes.includes(value as VoiceAttribute)
}

export function isExampleType(value: string): value is ExampleType {
  return ['carousel', 'ad', 'slide', 'post', 'other'].includes(value)
}
