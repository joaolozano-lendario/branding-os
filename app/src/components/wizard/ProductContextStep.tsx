/**
 * Product Context Step
 * Branding OS - Academia Lendaria
 * Pixel-perfect from Figma specs
 * Updated with predefined products and ICP personas
 */

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import type { ProductContext } from '@/types/agent'

interface ProductContextStepProps {
  context: ProductContext
  onChange: (context: Partial<ProductContext>) => void
  errors: string[]
}

// Predefined products from Academia Lendaria ecosystem
const PREDEFINED_PRODUCTS = [
  { value: 'comunidade-lendaria', label: 'Comunidade Lendária', description: 'R$ 1.488 - Produto principal' },
  { value: 'formacao-lendaria', label: 'Formação Lendária', description: 'R$ 12.888 - Programa completo 6 meses' },
  { value: 'academia-lendaria', label: 'Academia Lendária', description: 'Ecossistema completo (Comunidade + Formação + outros)' },
  { value: 'gestor-ia', label: 'Gestor IA', description: 'R$ 6.888 - Programa premium' },
  { value: 'dominando-obsidian', label: 'Dominando O Obsidian', description: 'R$ 288 - Segundo Cérebro com IA' },
  { value: 'outro', label: 'Outro produto...', description: 'Digite manualmente' },
] as const

// ICP Personas from research (150+ member presentations)
const ICP_PERSONAS = [
  {
    value: 'empreendedor-travado',
    label: 'Empreendedor Digital Travado (~30%)',
    description: 'Múltiplos projetos, zero foco. Sabe muito, executa pouco.'
  },
  {
    value: 'executivo-exausto',
    label: 'Executivo Exausto (~25%)',
    description: 'CLT bem-sucedido mas esgotado. Quer transição para autonomia.'
  },
  {
    value: 'tecnico-visionario',
    label: 'Técnico Visionário (~20%)',
    description: 'Domina a parte técnica, não sabe vender/comunicar valor.'
  },
  {
    value: 'veterano-desprezado',
    label: 'Veterano Desprezado (~15%)',
    description: '15-20+ anos de experiência. Sente-se ignorado pelo mercado jovem.'
  },
  {
    value: 'multipotencial-ansioso',
    label: 'Multipotencial Ansioso (~10%)',
    description: 'Energia caótica, muitos interesses. Começa muito, termina pouco.'
  },
  {
    value: 'outro',
    label: 'Outro público...',
    description: 'Digite manualmente'
  },
] as const

export function ProductContextStep({ context, onChange, errors }: ProductContextStepProps) {
  const [newFeature, setNewFeature] = React.useState('')
  const [selectedProduct, setSelectedProduct] = React.useState<string>('')
  const [selectedPersona, setSelectedPersona] = React.useState<string>('')
  const [showCustomProduct, setShowCustomProduct] = React.useState(false)
  const [showCustomPersona, setShowCustomPersona] = React.useState(false)

  // Initialize selections based on existing context
  React.useEffect(() => {
    if (context.name) {
      const matchedProduct = PREDEFINED_PRODUCTS.find(p =>
        p.label.toLowerCase() === context.name.toLowerCase() ||
        context.name.toLowerCase().includes(p.label.toLowerCase().split(' ')[0])
      )
      if (matchedProduct && matchedProduct.value !== 'outro') {
        setSelectedProduct(matchedProduct.value)
      } else if (context.name) {
        setSelectedProduct('outro')
        setShowCustomProduct(true)
      }
    }

    if (context.targetAudience) {
      const matchedPersona = ICP_PERSONAS.find(p =>
        context.targetAudience?.toLowerCase().includes(p.label.split(' ')[0].toLowerCase())
      )
      if (matchedPersona && matchedPersona.value !== 'outro') {
        setSelectedPersona(matchedPersona.value)
      } else if (context.targetAudience) {
        setSelectedPersona('outro')
        setShowCustomPersona(true)
      }
    }
  }, [])

  const handleProductSelect = (value: string) => {
    setSelectedProduct(value)
    if (value === 'outro') {
      setShowCustomProduct(true)
      onChange({ name: '' })
    } else {
      setShowCustomProduct(false)
      const product = PREDEFINED_PRODUCTS.find(p => p.value === value)
      if (product) {
        onChange({ name: product.label })
      }
    }
  }

  const handlePersonaSelect = (value: string) => {
    setSelectedPersona(value)
    if (value === 'outro') {
      setShowCustomPersona(true)
      onChange({ targetAudience: '' })
    } else {
      setShowCustomPersona(false)
      const persona = ICP_PERSONAS.find(p => p.value === value)
      if (persona) {
        // Use just the persona name without the percentage
        const personaName = persona.label.split(' (~')[0]
        onChange({ targetAudience: personaName })
      }
    }
  }

  const handleAddFeature = () => {
    if (newFeature.trim() && !context.keyFeatures.includes(newFeature.trim())) {
      onChange({
        keyFeatures: [...context.keyFeatures, newFeature.trim()],
      })
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (feature: string) => {
    onChange({
      keyFeatures: context.keyFeatures.filter((f) => f !== feature),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddFeature()
    }
  }

  return (
    <div className="space-y-8">
      {/* Figma: Title left, subtitle right */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        {/* Figma: Inter SemiBold 40px, black */}
        <h2 className="font-sans text-[40px] font-semibold leading-tight text-foreground">
          Contextualize
          <br />
          sobre a sua criação
        </h2>
        {/* Figma: Inter Medium 16px, #888888 */}
        <p className="text-base font-medium text-[#888888] md:max-w-[278px]">
          Conte pra mim qual o contexto do seu produto ou serviço.
        </p>
      </div>

      {/* Figma: gap 24px between fields */}
      <div className="space-y-6">
        {/* Row 1: Product Name + Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name - With Dropdown */}
          <div className="space-y-2">
            {/* Figma: Inter SemiBold 12px, black */}
            <label className="text-xs font-semibold text-foreground">
              Nome do Produto / Serviço:
            </label>
            {/* Dropdown Select */}
            <select
              value={selectedProduct}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full h-[62px] px-6 rounded-lg border border-border bg-secondary text-foreground transition-all duration-[800ms] text-base font-medium focus:outline-none focus:!border-[#5856D6] hover:!border-[#5856D6] cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                backgroundSize: '20px',
              }}
            >
              <option value="" disabled>Selecione um produto...</option>
              {PREDEFINED_PRODUCTS.map((product) => (
                <option key={product.value} value={product.value}>
                  {product.label}
                </option>
              ))}
            </select>

            {/* Custom input when "Outro" is selected */}
            {showCustomProduct && (
              <input
                type="text"
                value={context.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Digite o nome do produto..."
                className="w-full h-[62px] px-6 rounded-lg border border-border bg-secondary text-foreground transition-all duration-[800ms] text-base font-medium placeholder:text-muted-foreground focus:outline-none focus:!border-[#5856D6] hover:!border-[#5856D6]"
              />
            )}
          </div>

          {/* Description - Same height as name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Breve descrição:
            </label>
            <input
              type="text"
              value={context.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="ex.: criador de cursos lendários"
              className="w-full h-[62px] px-6 rounded-lg border border-border bg-secondary text-foreground transition-all duration-[800ms] text-base font-medium placeholder:text-muted-foreground focus:outline-none focus:!border-[#5856D6] hover:!border-[#5856D6]"
            />
          </div>
        </div>

        {/* Row 2: Target Audience/ICP + Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Audience / ICP - With Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Público Alvo / ICP:
            </label>
            {/* Dropdown Select */}
            <select
              value={selectedPersona}
              onChange={(e) => handlePersonaSelect(e.target.value)}
              className="w-full h-[62px] px-6 rounded-lg border border-border bg-secondary text-foreground transition-all duration-[800ms] text-base font-medium focus:outline-none focus:!border-[#5856D6] hover:!border-[#5856D6] cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                backgroundSize: '20px',
              }}
            >
              <option value="" disabled>Selecione uma persona...</option>
              {ICP_PERSONAS.map((persona) => (
                <option key={persona.value} value={persona.value}>
                  {persona.label}
                </option>
              ))}
            </select>

            {/* Show persona description */}
            {selectedPersona && selectedPersona !== 'outro' && (
              <p className="text-xs text-muted-foreground mt-1 px-1">
                {ICP_PERSONAS.find(p => p.value === selectedPersona)?.description}
              </p>
            )}

            {/* Custom input when "Outro" is selected */}
            {showCustomPersona && (
              <input
                type="text"
                value={context.targetAudience || ''}
                onChange={(e) => onChange({ targetAudience: e.target.value })}
                placeholder="Descreva seu público alvo..."
                className="w-full h-[62px] px-6 rounded-lg border border-border bg-secondary text-foreground transition-all duration-[800ms] text-base font-medium placeholder:text-muted-foreground focus:outline-none focus:!border-[#5856D6] hover:!border-[#5856D6]"
              />
            )}
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Características e Benefícios Chave
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ex: Automação com IA"
                className="flex-1 h-[62px] px-6 rounded-lg border border-border bg-secondary text-foreground transition-all duration-[800ms] text-base font-medium placeholder:text-muted-foreground focus:outline-none focus:!border-[#5856D6] hover:!border-[#5856D6]"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                disabled={!newFeature.trim()}
                className={`h-[62px] w-[62px] rounded-lg border border-border shrink-0 transition-all duration-[800ms] flex items-center justify-center hover:!border-[#5856D6] disabled:opacity-50 ${newFeature.trim() ? 'bg-[#5856D6]' : 'bg-secondary'
                  }`}
              >
                <Icon name="plus" className={`w-5 h-5 ${newFeature.trim() ? 'text-white' : 'text-[#888888]'}`} />
              </button>
            </div>

            {context.keyFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {context.keyFeatures.map((feature) => (
                  <Badge
                    key={feature}
                    variant="secondary"
                    className="pl-3 pr-1.5 py-1.5 gap-1.5 text-sm bg-secondary text-foreground border-0"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="rounded-full p-0.5 hover:bg-[#E8E8E8] transition-colors"
                      aria-label={`Remove ${feature}`}
                    >
                      <Icon name="cross-small" className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="text-center text-sm text-destructive">
          {errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}
    </div>
  )
}
