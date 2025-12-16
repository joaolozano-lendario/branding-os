/**
 * i18n Types
 * Branding OS - Academia Lendaria
 * BRAND-017: Added auth types
 */

export type Locale = 'en' | 'es' | 'pt-br'

export interface TranslationKeys {
  // Common
  common: {
    save: string
    cancel: string
    delete: string
    edit: string
    add: string
    remove: string
    close: string
    back: string
    next: string
    previous: string
    loading: string
    error: string
    success: string
    warning: string
    confirm: string
    search: string
    filter: string
    clear: string
    export: string
    import: string
    download: string
    upload: string
    preview: string
    generate: string
    regenerate: string
    copy: string
    copied: string
    settings: string
    help: string
    language: string
    theme: string
    lightMode: string
    darkMode: string
    systemTheme: string
  }

  // Navigation
  nav: {
    dashboard: string
    brandConfig: string
    visualIdentity: string
    brandVoice: string
    examples: string
    generation: string
    generate: string
    wizard: string
    library: string
    settings: string
  }

  // Authentication
  auth: {
    login: string
    logout: string
    register: string
    email: string
    password: string
    confirmPassword: string
    name: string
    enterCredentials: string
    invalidCredentials: string
    noAccount: string
    hasAccount: string
    createAccount: string
    passwordMismatch: string
    registrationFailed: string
    passwordMinLength: string
  }

  // Brand Configuration
  brand: {
    title: string
    subtitle: string
    completeness: string
    completeProfile: string
    exportConfig: string

    // Visual Identity
    visual: {
      title: string
      subtitle: string
      logo: string
      logoUpload: string
      logoDragDrop: string
      logoFormats: string
      colors: string
      colorPrimary: string
      colorSecondary: string
      colorAccent: string
      colorNeutral: string
      addColor: string
      typography: string
      headingFont: string
      bodyFont: string
      accentFont: string
      selectFont: string
      wcagCompliance: string
      contrastRatio: string
    }

    // Voice
    voice: {
      title: string
      subtitle: string
      attributes: string
      attributesHelp: string
      selectUpTo: string
      toneGuidelines: string
      guidelinesHelp: string
      addGuideline: string
      copyExamples: string
      goodExample: string
      badExample: string
      addExample: string
      context: string
      notes: string
    }

    // Examples
    examples: {
      title: string
      subtitle: string
      uploadExamples: string
      dragDropFiles: string
      supportedFormats: string
      type: string
      annotation: string
      whatMakesItOnBrand: string
      filterByType: string
      noExamples: string
      carousel: string
      ad: string
      slide: string
      post: string
      other: string
      contentPlaceholder: string
    }
  }

  // Agents
  agents: {
    title: string
    subtitle: string
    analyzer: {
      name: string
      description: string
      status: {
        idle: string
        analyzing: string
        complete: string
        error: string
      }
    }
    strategist: {
      name: string
      description: string
      status: {
        idle: string
        strategizing: string
        complete: string
        error: string
      }
    }
    copywriter: {
      name: string
      description: string
      status: {
        idle: string
        writing: string
        complete: string
        error: string
      }
    }
    visualDirector: {
      name: string
      description: string
      status: {
        idle: string
        designing: string
        complete: string
        error: string
      }
    }
    composer: {
      name: string
      description: string
      status: {
        idle: string
        composing: string
        complete: string
        error: string
      }
    }
    qualityGate: {
      name: string
      description: string
      status: {
        idle: string
        checking: string
        passed: string
        failed: string
      }
    }
    pipeline: {
      title: string
      status: string
      progress: string
      startGeneration: string
      stopGeneration: string
      viewResults: string
      idle: string
      running: string
      complete: string
      error: string
      failed: string
    }
    // V2 Agents
    v2: {
      brandStrategist: {
        name: string
        description: string
      }
      storyArchitect: {
        name: string
        description: string
      }
      copywriter: {
        name: string
        description: string
      }
      visualCompositor: {
        name: string
        description: string
      }
      qualityValidator: {
        name: string
        description: string
      }
      renderEngine: {
        name: string
        description: string
      }
    }
  }

  // Generation Wizard
  wizard: {
    title: string
    step: string
    stepOf: string
    steps: {
      assetType: {
        title: string
        subtitle: string
        carousel: string
        carouselDesc: string
        slide: string
        slideDesc: string
        ad: string
        adDesc: string
        post: string
        postDesc: string
      }
      context: {
        title: string
        subtitle: string
        productName: string
        description: string
        targetAudience: string
        keyFeatures: string
      }
      goal: {
        title: string
        subtitle: string
        goalLabel: string
        angleLabel: string
        awareness: string
        consideration: string
        conversion: string
        retention: string
        angle: string
        benefitFocused: string
        problemSolution: string
        socialProof: string
        urgency: string
        instructions: string
      }
      content: {
        title: string
        subtitle: string
        inputContent: string
        uploadFiles: string
        generating: string
        estimatedTime: string
      }
      preview: {
        title: string
        subtitle: string
        complianceScore: string
        exportOptions: string
        generateVariations: string
        saveToLibrary: string
        createNew: string
      }
    }
  }

  // Settings
  settings: {
    title: string
    general: {
      title: string
      language: string
      languageDesc: string
      theme: string
      themeDesc: string
    }
    api: {
      title: string
      geminiApiKey: string
      geminiApiKeyDesc: string
      testConnection: string
      connectionSuccess: string
      connectionError: string
    }
    quality: {
      title: string
      minScore: string
      minScoreDesc: string
      blockingMode: string
      blockingModeDesc: string
      categoryWeights: string
    }
  }

  // Dashboard
  dashboard: {
    gettingStarted: string
    steps: {
      step1: string
      step2: string
      step3: string
      step4: string
    }
    aiPowered: string
  }

  // Errors
  errors: {
    generic: string
    network: string
    apiKey: string
    validation: string
    fileSize: string
    fileType: string
    required: string
    minLength: string
    maxLength: string
    invalidColor: string
    generationFailed: string
    complianceFailed: string
  }
}

export type Translation = TranslationKeys
