/**
 * CarouselSlide Component
 * Branding OS - Academia Lendaria
 *
 * Pixel-perfect carousel slide following Figma specs
 * Dimensions: 1080x1350px (4:5 Instagram aspect)
 */

import * as React from 'react'

// ============================================
// TYPES
// ============================================

export interface CarouselSlideContent {
  type: 'text' | 'bullets'
  data: string | string[]
}

export interface CarouselSlideProps {
  pageNumber: number
  totalPages: number
  title: string
  content?: CarouselSlideContent
  imageSrc?: string
  variant?: 'capa' | 'corpo'
  brandHandle?: string
}

// ============================================
// DESIGN TOKENS (from Figma)
// ============================================

const TOKENS = {
  colors: {
    background: '#000000',
    textPrimary: '#FFFFFF',
    textSecondary: '#888888',
    textHeader: '#484848',
    accent: '#FFD44A',
    indicatorInactive: '#484848',
    swipeButtonBg: '#242424',
    swipeButtonArrow: '#FACC15',
    swipeText: '#646464',
  },
  typography: {
    title: { size: '64px', weight: 600 },
    body: { size: '32px', weight: 500 },
    header: { size: '18px', weight: 600 },
  },
  spacing: {
    paddingX: 80,
    paddingTop: 152,
    paddingBottom: 224,
    headerTop: 80,
    footerBottom: 80,
  },
  dimensions: {
    width: 1080,
    height: 1350,
  },
}

// ============================================
// HELPER: Parse Bold Text
// ============================================

function parseBoldText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} style={{ color: TOKENS.colors.textPrimary }}>
          {part.slice(2, -2)}
        </span>
      )
    }
    return part
  })
}

// ============================================
// CAROUSEL SLIDE COMPONENT
// ============================================

export function CarouselSlide({
  pageNumber,
  totalPages,
  title,
  content,
  imageSrc,
  variant = 'corpo',
  brandHandle = '@academialendaria',
}: CarouselSlideProps) {
  const isCapa = variant === 'capa'

  return (
    <div
      className="carousel-slide"
      style={{
        position: 'relative',
        width: `${TOKENS.dimensions.width}px`,
        height: `${TOKENS.dimensions.height}px`,
        backgroundColor: TOKENS.colors.background,
        color: TOKENS.colors.textPrimary,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        backgroundImage: 'url(/listras-fundo.svg)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: `${TOKENS.spacing.headerTop}px`,
          left: `${TOKENS.spacing.paddingX}px`,
          right: `${TOKENS.spacing.paddingX}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 10,
          height: '24px',
        }}
      >
        <span
          style={{
            fontSize: TOKENS.typography.header.size,
            fontWeight: TOKENS.typography.header.weight,
            color: TOKENS.colors.textHeader,
            lineHeight: 1,
          }}
        >
          {brandHandle}
        </span>
        <span
          style={{
            fontSize: TOKENS.typography.header.size,
            fontWeight: TOKENS.typography.header.weight,
            color: TOKENS.colors.textHeader,
            lineHeight: 1,
          }}
        >
          All Rights Reserved
        </span>
      </div>

      {/* Body Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: `${TOKENS.spacing.paddingX}px`,
          paddingRight: `${TOKENS.spacing.paddingX}px`,
          paddingTop: `${TOKENS.spacing.paddingTop}px`,
          paddingBottom: `${TOKENS.spacing.paddingBottom}px`,
          width: '100%',
          justifyContent: isCapa ? 'center' : 'flex-start',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: isCapa ? '72px' : TOKENS.typography.title.size,
            fontWeight: TOKENS.typography.title.weight,
            color: TOKENS.colors.textPrimary,
            lineHeight: 1.1,
            marginBottom: isCapa ? '32px' : '48px',
            textAlign: isCapa ? 'center' : 'left',
          }}
        >
          {title}
        </h1>

        {/* Content - only for corpo variant */}
        {!isCapa && content && (
          <div>
            {content.type === 'text' && (
              <p
                style={{
                  fontSize: TOKENS.typography.body.size,
                  fontWeight: TOKENS.typography.body.weight,
                  color: TOKENS.colors.textSecondary,
                  lineHeight: 1.4,
                }}
              >
                {parseBoldText(content.data as string)}
              </p>
            )}

            {content.type === 'bullets' && (
              <ul
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                }}
              >
                {(content.data as string[]).map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                    }}
                  >
                    <img
                      src="/checked.svg"
                      alt="check"
                      width={24}
                      height={24}
                      style={{ marginTop: '4px', flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: TOKENS.typography.body.size,
                        fontWeight: TOKENS.typography.body.weight,
                        color: TOKENS.colors.textSecondary,
                      }}
                    >
                      {parseBoldText(item)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Image Area */}
        {imageSrc && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              flex: 1,
              borderRadius: '12px',
              overflow: 'hidden',
              marginTop: '64px',
            }}
          >
            <img
              src={imageSrc}
              alt="Slide content"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: `${TOKENS.spacing.footerBottom}px`,
          left: `${TOKENS.spacing.paddingX}px`,
          right: `${TOKENS.spacing.paddingX}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {/* Pagination */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {Array.from({ length: totalPages }).map((_, i) =>
            i + 1 === pageNumber ? (
              <span
                key={i}
                style={{
                  fontSize: TOKENS.typography.header.size,
                  fontWeight: TOKENS.typography.header.weight,
                  color: TOKENS.colors.accent,
                }}
              >
                {pageNumber}
              </span>
            ) : (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: TOKENS.colors.indicatorInactive,
                }}
              />
            )
          )}
        </div>

        {/* Swipe Hint */}
        <div
          style={{
            backgroundColor: TOKENS.colors.swipeButtonBg,
            borderRadius: '200px',
            paddingLeft: '32px',
            paddingRight: '4px',
            paddingTop: '4px',
            paddingBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span
            style={{
              fontSize: TOKENS.typography.header.size,
              fontWeight: TOKENS.typography.header.weight,
              color: TOKENS.colors.swipeText,
            }}
          >
            Deslize para o lado
          </span>
          <div
            style={{
              backgroundColor: TOKENS.colors.swipeButtonArrow,
              borderRadius: '50%',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="/seta-deslize.svg" alt="arrow" width={40} height={24} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarouselSlide
