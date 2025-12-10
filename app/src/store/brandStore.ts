/**
 * Brand Configuration Store
 * Zustand store for managing brand configuration state
 * Branding OS - Academia Lendária
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  BrandConfiguration,
  BrandCompleteness,
  ConfigSection,
  BrandColor,
  BrandExample,
  BrandVoice,
} from '@/types/brand'

// ============================================
// INITIAL STATE
// ============================================

const createEmptyConfig = (): BrandConfiguration => ({
  id: crypto.randomUUID(),
  name: 'New Brand',
  visualIdentity: {
    logo: {
      id: crypto.randomUUID(),
      file: null,
      url: null,
      fileName: null,
      fileType: null,
      uploadedAt: null,
    },
    colors: {
      primary: {
        id: crypto.randomUUID(),
        name: 'Primary',
        hex: '#C9B298',
        role: 'primary',
        wcagCompliant: true,
      },
      secondary: {
        id: crypto.randomUUID(),
        name: 'Secondary',
        hex: '#1A1A1A',
        role: 'secondary',
        wcagCompliant: true,
      },
      accent: {
        id: crypto.randomUUID(),
        name: 'Accent',
        hex: '#007AFF',
        role: 'accent',
        wcagCompliant: true,
      },
      neutrals: [],
      custom: [],
    },
    typography: {
      heading: {
        id: crypto.randomUUID(),
        family: 'Inter',
        role: 'heading',
        weights: [400, 500, 600, 700],
        source: 'google',
      },
      body: {
        id: crypto.randomUUID(),
        family: 'Source Serif 4',
        role: 'body',
        weights: [400, 600],
        source: 'google',
      },
      accent: null,
    },
    updatedAt: null,
  },
  voice: {
    attributes: [],
    toneGuidelines: [],
    copyExamples: [],
    updatedAt: null,
  },
  examples: {
    examples: [],
    tags: [
      { id: '1', type: 'carousel', label: 'Carousel', color: '#5856D6' },
      { id: '2', type: 'ad', label: 'Ad', color: '#FF2D55' },
      { id: '3', type: 'slide', label: 'Slide', color: '#007AFF' },
      { id: '4', type: 'post', label: 'Post', color: '#34C759' },
      { id: '5', type: 'other', label: 'Other', color: '#737373' },
    ],
    updatedAt: null,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  completeness: {
    visualIdentity: 0,
    voice: 0,
    examples: 0,
    overall: 0,
  },
})

// ============================================
// STORE INTERFACE
// ============================================

interface BrandStore {
  // Data
  config: BrandConfiguration

  // UI State
  activeSection: ConfigSection
  isLoading: boolean
  isSaving: boolean
  hasUnsavedChanges: boolean
  errors: Record<string, string>

  // Navigation
  setActiveSection: (section: ConfigSection) => void

  // Config Management
  setConfig: (config: BrandConfiguration) => void
  resetConfig: () => void

  // Visual Identity (BRAND-001)
  updateLogo: (logo: Partial<BrandConfiguration['visualIdentity']['logo']>) => void
  addColor: (color: BrandColor) => void
  updateColor: (id: string, updates: Partial<BrandColor>) => void
  removeColor: (id: string) => void
  updateTypography: (updates: Partial<BrandConfiguration['visualIdentity']['typography']>) => void

  // Voice (BRAND-002)
  toggleVoiceAttribute: (attribute: BrandVoice['attributes'][number]) => void
  addToneGuideline: (text: string) => void
  updateToneGuideline: (id: string, text: string) => void
  removeToneGuideline: (id: string) => void
  addCopyExample: (example: Omit<BrandVoice['copyExamples'][number], 'id'>) => void
  removeCopyExample: (id: string) => void

  // Examples (BRAND-003)
  addExample: (example: Omit<BrandExample, 'id' | 'uploadedAt'>) => void
  updateExample: (id: string, updates: Partial<BrandExample>) => void
  removeExample: (id: string) => void

  // Persistence
  saveConfig: () => Promise<void>
  calculateCompleteness: () => BrandCompleteness

  // Error Handling
  setError: (key: string, message: string) => void
  clearError: (key: string) => void
  clearAllErrors: () => void
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useBrandStore = create<BrandStore>()(
  persist(
    (set, get) => ({
      // Initial State
      config: createEmptyConfig(),
      activeSection: 'dashboard',
      isLoading: false,
      isSaving: false,
      hasUnsavedChanges: false,
      errors: {},

      // Navigation
      setActiveSection: (section) => set({ activeSection: section }),

      // Config Management
      setConfig: (config) => set({ config, hasUnsavedChanges: false }),

      resetConfig: () => set({
        config: createEmptyConfig(),
        hasUnsavedChanges: false,
        errors: {},
      }),

      // Visual Identity (BRAND-001)
      updateLogo: (logo) => set((state) => ({
        config: {
          ...state.config,
          visualIdentity: {
            ...state.config.visualIdentity,
            logo: { ...state.config.visualIdentity.logo, ...logo },
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      })),

      addColor: (color) => set((state) => ({
        config: {
          ...state.config,
          visualIdentity: {
            ...state.config.visualIdentity,
            colors: {
              ...state.config.visualIdentity.colors,
              custom: [...state.config.visualIdentity.colors.custom, color],
            },
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      })),

      updateColor: (id, updates) => set((state) => {
        const colors = state.config.visualIdentity.colors

        // Check if it's a primary/secondary/accent color
        if (colors.primary.id === id) {
          return {
            config: {
              ...state.config,
              visualIdentity: {
                ...state.config.visualIdentity,
                colors: {
                  ...colors,
                  primary: { ...colors.primary, ...updates },
                },
                updatedAt: new Date(),
              },
              updatedAt: new Date(),
            },
            hasUnsavedChanges: true,
          }
        }

        if (colors.secondary.id === id) {
          return {
            config: {
              ...state.config,
              visualIdentity: {
                ...state.config.visualIdentity,
                colors: {
                  ...colors,
                  secondary: { ...colors.secondary, ...updates },
                },
                updatedAt: new Date(),
              },
              updatedAt: new Date(),
            },
            hasUnsavedChanges: true,
          }
        }

        if (colors.accent.id === id) {
          return {
            config: {
              ...state.config,
              visualIdentity: {
                ...state.config.visualIdentity,
                colors: {
                  ...colors,
                  accent: { ...colors.accent, ...updates },
                },
                updatedAt: new Date(),
              },
              updatedAt: new Date(),
            },
            hasUnsavedChanges: true,
          }
        }

        // Otherwise it's a custom color
        return {
          config: {
            ...state.config,
            visualIdentity: {
              ...state.config.visualIdentity,
              colors: {
                ...colors,
                custom: colors.custom.map((c) =>
                  c.id === id ? { ...c, ...updates } : c
                ),
              },
              updatedAt: new Date(),
            },
            updatedAt: new Date(),
          },
          hasUnsavedChanges: true,
        }
      }),

      removeColor: (id) => set((state) => ({
        config: {
          ...state.config,
          visualIdentity: {
            ...state.config.visualIdentity,
            colors: {
              ...state.config.visualIdentity.colors,
              custom: state.config.visualIdentity.colors.custom.filter(
                (c) => c.id !== id
              ),
            },
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      })),

      updateTypography: (updates) => set((state) => ({
        config: {
          ...state.config,
          visualIdentity: {
            ...state.config.visualIdentity,
            typography: { ...state.config.visualIdentity.typography, ...updates },
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      })),

      // Voice (BRAND-002)
      toggleVoiceAttribute: (attribute) => set((state) => {
        const current = state.config.voice.attributes
        const newAttributes = current.includes(attribute)
          ? current.filter((a) => a !== attribute)
          : [...current, attribute]

        return {
          config: {
            ...state.config,
            voice: {
              ...state.config.voice,
              attributes: newAttributes,
              updatedAt: new Date(),
            },
            updatedAt: new Date(),
          },
          hasUnsavedChanges: true,
        }
      }),

      addToneGuideline: (text) => set((state) => ({
        config: {
          ...state.config,
          voice: {
            ...state.config.voice,
            toneGuidelines: [
              ...state.config.voice.toneGuidelines,
              {
                id: crypto.randomUUID(),
                text,
                order: state.config.voice.toneGuidelines.length,
              },
            ],
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      })),

      updateToneGuideline: (id, text) => set((state) => ({
        config: {
          ...state.config,
          voice: {
            ...state.config.voice,
            toneGuidelines: state.config.voice.toneGuidelines.map((g) =>
              g.id === id ? { ...g, text } : g
            ),
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      })),

      removeToneGuideline: (id) => set((state) => ({
        config: {
          ...state.config,
          voice: {
            ...state.config.voice,
            toneGuidelines: state.config.voice.toneGuidelines.filter(
              (g) => g.id !== id
            ),
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      })),

      addCopyExample: (example) => set((state) => ({
        config: {
          ...state.config,
          voice: {
            ...state.config.voice,
            copyExamples: [
              ...state.config.voice.copyExamples,
              { ...example, id: crypto.randomUUID() },
            ],
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      })),

      removeCopyExample: (id) => set((state) => ({
        config: {
          ...state.config,
          voice: {
            ...state.config.voice,
            copyExamples: state.config.voice.copyExamples.filter(
              (e) => e.id !== id
            ),
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      })),

      // Examples (BRAND-003)
      addExample: (example) => set((state) => ({
        config: {
          ...state.config,
          examples: {
            ...state.config.examples,
            examples: [
              ...state.config.examples.examples,
              {
                ...example,
                id: crypto.randomUUID(),
                uploadedAt: new Date(),
              },
            ],
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      })),

      updateExample: (id, updates) => set((state) => ({
        config: {
          ...state.config,
          examples: {
            ...state.config.examples,
            examples: state.config.examples.examples.map((e) =>
              e.id === id ? { ...e, ...updates } : e
            ),
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      })),

      removeExample: (id) => set((state) => ({
        config: {
          ...state.config,
          examples: {
            ...state.config.examples,
            examples: state.config.examples.examples.filter((e) => e.id !== id),
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        hasUnsavedChanges: true,
      })),

      // Persistence
      saveConfig: async () => {
        set({ isSaving: true })
        try {
          // Calculate completeness before saving
          const completeness = get().calculateCompleteness()
          set((state) => ({
            config: {
              ...state.config,
              completeness,
              updatedAt: new Date(),
            },
            hasUnsavedChanges: false,
            isSaving: false,
          }))
        } catch (error) {
          set({
            isSaving: false,
            errors: { save: 'Failed to save configuration' },
          })
          throw error
        }
      },

      calculateCompleteness: () => {
        const { config } = get()

        // Visual Identity: logo + 3 colors + 2 fonts = 6 items
        let visualScore = 0
        if (config.visualIdentity.logo.url) visualScore += 20
        if (config.visualIdentity.colors.primary.hex) visualScore += 15
        if (config.visualIdentity.colors.secondary.hex) visualScore += 15
        if (config.visualIdentity.colors.accent.hex) visualScore += 15
        if (config.visualIdentity.typography.heading.family) visualScore += 17.5
        if (config.visualIdentity.typography.body.family) visualScore += 17.5

        // Voice: 3+ attributes + 3+ guidelines + 3+ examples
        let voiceScore = 0
        const attrCount = config.voice.attributes.length
        const guideCount = config.voice.toneGuidelines.length
        const exampleCount = config.voice.copyExamples.length

        voiceScore += Math.min(attrCount / 3, 1) * 33.33
        voiceScore += Math.min(guideCount / 3, 1) * 33.33
        voiceScore += Math.min(exampleCount / 3, 1) * 33.33

        // Examples: at least 3 examples
        const brandExampleCount = config.examples.examples.length
        const examplesScore = Math.min(brandExampleCount / 3, 1) * 100

        // Overall: weighted average
        const overall = (visualScore * 0.4) + (voiceScore * 0.3) + (examplesScore * 0.3)

        return {
          visualIdentity: Math.round(visualScore),
          voice: Math.round(voiceScore),
          examples: Math.round(examplesScore),
          overall: Math.round(overall),
        }
      },

      // Error Handling
      setError: (key, message) => set((state) => ({
        errors: { ...state.errors, [key]: message },
      })),

      clearError: (key) => set((state) => {
        const { [key]: _removed, ...rest } = state.errors
        void _removed // Silence unused variable lint
        return { errors: rest }
      }),

      clearAllErrors: () => set({ errors: {} }),
    }),
    {
      name: 'branding-os-config',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        config: state.config,
        activeSection: state.activeSection,
      }),
    }
  )
)

// ============================================
// SELECTORS (for optimized re-renders)
// ============================================

export const selectVisualIdentity = (state: BrandStore) => state.config.visualIdentity
export const selectVoice = (state: BrandStore) => state.config.voice
export const selectExamples = (state: BrandStore) => state.config.examples
export const selectCompleteness = (state: BrandStore) => state.config.completeness
export const selectActiveSection = (state: BrandStore) => state.activeSection
export const selectHasUnsavedChanges = (state: BrandStore) => state.hasUnsavedChanges
