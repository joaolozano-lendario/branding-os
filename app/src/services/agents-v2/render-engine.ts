/**
 * Render Engine Agent v2.0
 * Branding OS - Academia Lendaria
 *
 * O SEXTO e ÚLTIMO agente do pipeline.
 * Transforma especificações visuais em HTML/CSS renderizável.
 *
 * NOTA: Este agente é DETERMINÍSTICO - não usa IA.
 * Ele simplesmente converte a especificação visual em código.
 */

import type {
  VisualSpecification,
  SlideVisualSpec,
  VisualElement,
  RenderOutput,
  RenderedSlide,
} from '@/types/pipeline'

// ============================================
// RENDER ENGINE (No AI - Pure Transformation)
// ============================================

export class RenderEngine {
  /* ===========================================================================
   * TEMPLATE SYSTEMS (FIGMA EXACT MATCH)
   * =========================================================================== */

  private getTemplateCSS(layoutId: string): string {
    // COVER TEMPLATE (35:1321) - FIGMA EXACT SPECS - ABSOLUTE POSITIONING
    if (layoutId === 'branding-os-cover-v1') {
      return `
        /* Cover Template Layout - Figma Node 35:1321 - ABSOLUTE POSITIONING */
        .slide-content-cover {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 10;
        }

        /* Header - ABSOLUTE: top: 80px */
        .cover-header {
          position: absolute;
          top: 80px;
          left: 80px;
          right: 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cover-header-text {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 600;
          line-height: 21.78px;
          color: #FFFFFF;
          letter-spacing: 0px;
        }

        /* Text wrapper - FLEXBOX positioned at bottom for consistent spacing */
        .cover-text-wrapper {
          position: absolute;
          bottom: 90px;
          left: 80px;
          width: 920px;
          display: flex;
          flex-direction: column;
          gap: 32px; /* Consistent 32px gap between headline and subtitle */
        }

        /* Headline - flows naturally inside wrapper */
        .cover-title {
          font-family: 'Inter', sans-serif;
          font-size: 96px;
          font-weight: 600;
          line-height: 104px;
          letter-spacing: 0px;
          color: #FFFFFF;
          text-align: left;
          margin: 0;
        }

        /* Subtitle - flows naturally below headline with 32px gap */
        .cover-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 32px;
          font-weight: 600;
          line-height: 40px;
          color: #969696;
          text-align: left;
          margin: 0;
        }

        /* GRADIENT OVERLAY - Figma exact: starts at y=42.78%, diagonal to bottom-left (208deg) */
        .cover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            208deg,
            transparent 0%,
            transparent 42%,
            rgba(0,0,0,0.2) 48%,
            rgba(0,0,0,0.7) 55%,
            rgba(0,0,0,1) 62%,
            rgba(0,0,0,1) 100%
          );
          z-index: 2;
        }

        /* Top gradient - subtle fade at top */
        .cover-top-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 13%;
          background: linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 100%);
          z-index: 3;
        }

        /* Arrow button - ABSOLUTE: bottom: 84px, right: 83px (Figma exact) */
        .cover-arrow-btn {
          position: absolute;
          bottom: 84px;
          right: 83px;
          width: 80px;
          height: 48px;
          z-index: 20;
        }

        .cover-arrow-btn img {
          width: 100%;
          height: 100%;
        }
      `
    }

    // BODY TEMPLATE (28:1018) - FIGMA EXACT SPECS - ABSOLUTE POSITIONING
    if (layoutId === 'branding-os-body-v1') {
      return `
        /* Body Template Layout - Figma Node 28:1018 - ABSOLUTE POSITIONING */

        .slide-content-body {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        /* Vertical stripe pattern - using listras-fundo.svg */
        .body-stripes {
          position: absolute;
          top: 80px;
          left: 79px;
          right: 79px;
          height: 1190px;
          background-image: url('/assets/patterns/listras-fundo.svg');
          background-repeat: repeat-x;
          background-position: center;
          background-size: 923px 100%;
          pointer-events: none;
          z-index: 1;
        }

        /* Header - ABSOLUTE: top: 80px (Figma exact) */
        .body-header {
          position: absolute;
          top: 80px;
          left: 80px;
          right: 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .body-header-text {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 600;
          line-height: 21.78px;
          color: #646464;
          letter-spacing: 0px;
        }

        /* Text container - FLEXBOX for proper spacing regardless of line count */
        .body-text-wrapper {
          position: absolute;
          top: 223px;
          left: 157px;
          width: 770px;
          display: flex;
          flex-direction: column;
          gap: 20px; /* Consistent 20px gap between headline and body */
          z-index: 10;
        }

        /* Headline - now flows naturally inside wrapper */
        .body-headline {
          font-family: 'Inter', sans-serif;
          font-size: 48px;
          font-weight: 600;
          line-height: 58px;
          color: #FFFFFF;
          margin: 0;
        }

        /* Body text - now flows naturally below headline with 20px gap */
        .body-text {
          font-family: 'Inter', sans-serif;
          font-size: 32px;
          font-weight: 600;
          line-height: 38px;
          color: #888888;
          white-space: pre-line;
          margin: 0;
        }

        /* Bullet List - flows naturally below headline */
        .body-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .body-list li {
          font-family: 'Inter', sans-serif;
          font-size: 32px;
          font-weight: 600;
          line-height: 38px;
          color: #888888;
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        /* Checkbox icon - using checked.svg (40x40) */
        .body-list li::before {
          content: "";
          display: block;
          width: 40px;
          height: 40px;
          background-image: url('/assets/patterns/checked.svg');
          background-size: contain;
          background-repeat: no-repeat;
          flex-shrink: 0;
        }

        /* IMAGE - ABSOLUTE: top: 519px, left: 80px (Figma exact - CRITICAL FIX) */
        .body-image-container {
          position: absolute;
          top: 519px;
          left: 80px;
          width: 924px;
          height: 634px;
          border-radius: 16px;
          overflow: hidden;
          z-index: 5;
        }

        .body-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
        }

        /* Pagination - ABSOLUTE: y=1239, x=80 (Figma Frame 159) */
        .body-pagination {
          position: absolute;
          top: 1239px;
          left: 80px;
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 20;
        }

        .pagination-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #484848;
        }

        .pagination-number {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 600;
          line-height: 21.78px;
          color: #FFD44A;
        }

        /* Swipe pill button - ABSOLUTE: y=1214, right=80 (Figma Frame 156) */
        .swipe-pill {
          position: absolute;
          top: 1214px;
          right: 80px;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 4px 4px 4px 32px;
          background-color: #242424;
          border-radius: 2000px;
          z-index: 20;
        }

        .swipe-text {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 600;
          line-height: 21.78px;
          color: #646464;
        }

        /* Arrow button - using seta-deslize.svg */
        .swipe-arrow-btn {
          width: 80px;
          height: 48px;
        }

        .swipe-arrow-btn img {
          width: 100%;
          height: 100%;
        }
      `
    }

    // LAST TEMPLATE (35:1335) - FIGMA EXACT SPECS - ABSOLUTE POSITIONING
    if (layoutId === 'branding-os-last-v1') {
      return `
        /* Final Template Layout - Figma Node 35:1335 - ABSOLUTE POSITIONING */

        .slide-content-last {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        /* Vertical stripe pattern - very subtle (opacity 0.02) using listras-fundo.svg */
        .last-stripes {
          position: absolute;
          top: 80px;
          left: 79px;
          right: 79px;
          height: 1190px;
          background-image: url('/assets/patterns/listras-fundo.svg');
          background-repeat: repeat-x;
          background-position: center;
          background-size: 923px 100%;
          opacity: 0.02;
          pointer-events: none;
          z-index: 1;
        }

        /* Header - ABSOLUTE: top: 80px (Figma exact) */
        .last-header {
          position: absolute;
          top: 80px;
          left: 80px;
          right: 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .last-header-text {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 600;
          line-height: 21.78px;
          color: #D0A711;
          letter-spacing: 0px;
        }

        /* Text wrapper - FLEXBOX for consistent spacing */
        .last-text-wrapper {
          position: absolute;
          top: 228px;
          left: 158px;
          width: 770px;
          display: flex;
          flex-direction: column;
          gap: 20px; /* Consistent gap between headline and body */
          z-index: 10;
        }

        /* Headline - flows naturally inside wrapper */
        .last-headline {
          font-family: 'Inter', sans-serif;
          font-size: 48px;
          font-weight: 600;
          line-height: 58px;
          color: #000000;
          margin: 0;
        }

        /* Body - flows naturally below headline with 20px gap */
        .last-body {
          font-family: 'Inter', sans-serif;
          font-size: 32px;
          font-weight: 600;
          line-height: 38.73px;
          color: #242424;
          margin: 0;
        }

        /* CTA Button - ABSOLUTE: top: 562px, left: 158px (Figma exact) */
        .last-cta-btn {
          position: absolute;
          top: 562px;
          left: 158px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 32px 48px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid transparent;
          border-radius: 200px;
          backdrop-filter: blur(4px);
          z-index: 10;
          /* Gradient border - diagonal from top-left to bottom-right */
          background-image: linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08)),
                            linear-gradient(135deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.16) 51%, rgba(255,255,255,0.48) 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }

        .last-cta-icon {
          width: 24px;
          height: 24px;
        }

        .last-cta-text {
          font-family: 'Inter', sans-serif;
          font-size: 24px;
          font-weight: 600;
          line-height: 29px;
          color: #000000;
        }

        /* IMAGE - ABSOLUTE: top: 687px, left: 80px (Figma exact) */
        .last-image-container {
          position: absolute;
          top: 687px;
          left: 80px;
          width: 924px;
          height: 583px;
          border-radius: 8px;
          overflow: hidden;
          z-index: 5;
        }

        .last-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
        }
      `
    }

    return ''
  }

  /**
   * Render a slide using strict Template Logic
   */
  private renderTemplateSlide(slide: SlideVisualSpec, signature: string = '@oalanicolas'): RenderedSlide {
    const index = slide.index || 1
    const layoutId = slide.layoutId || 'branding-os-body-v1'
    const canvas = slide.canvas || { width: 1080, height: 1350 }
    const elements = slide.elements || []

    let htmlContent = ''
    const safeHandle = signature || '@oalanicolas'
    const css = this.getTemplateCSS(layoutId)

    // COVER RENDER (35:1321) - FLEXBOX layout for consistent spacing
    if (layoutId === 'branding-os-cover-v1') {
      const headline = elements.find(e => e.role === 'headline')?.content || ''
      const subheadline = elements.find(e => e.role === 'subheadline')?.content || ''
      const hasSubheadline = subheadline && subheadline.trim().length > 0

      const bgImage = elements.find(e => e.role === 'background')?.content || ''
      const hasValidImage = bgImage && (bgImage.startsWith('http') || bgImage.startsWith('data:'))
      const bgUrl = hasValidImage ? bgImage : ''

      const slideCss = `
        .slide-${index} {
          position: relative;
          width: ${canvas.width}px;
          height: ${canvas.height}px;
          overflow: hidden;
          background-color: #000000;
        }

        ${hasValidImage ? `
        .slide-${index}::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url('${bgUrl}');
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        ` : ''}

        ${css}
      `

      htmlContent = `
        <div class="cover-overlay"></div>
        <div class="cover-top-gradient"></div>

        <div class="slide-content-cover">
          <!-- Header - ABSOLUTE: top: 80px -->
          <div class="cover-header">
            <span class="cover-header-text">${safeHandle}</span>
            <span class="cover-header-text">All right reserved</span>
          </div>

          <!-- Text wrapper - FLEXBOX at bottom: 90px with 32px gap -->
          <div class="cover-text-wrapper">
            <h1 class="cover-title">${headline}</h1>
            ${hasSubheadline ? `<h2 class="cover-subtitle">${subheadline}</h2>` : ''}
          </div>
        </div>

        <!-- Arrow button - ABSOLUTE: bottom: 84px, right: 83px -->
        <div class="cover-arrow-btn">
          <img src="/assets/patterns/seta-deslize.svg" alt="Deslize" />
        </div>
      `

      return { index, html: this.wrapSlide(index, canvas, htmlContent, ''), css: slideCss }
    }

    // BODY RENDER (28:1018) - FIGMA EXACT
    if (layoutId === 'branding-os-body-v1') {
      const headline = elements.find(e => e.role === 'headline')?.content || ''
      const body = elements.find(e => e.role === 'body')?.content || ''
      const imageElement = elements.find(e => e.role === 'image') || elements.find(e => e.role === 'background')

      const hasValidImage = imageElement?.content && (imageElement.content.startsWith('http') || imageElement.content.startsWith('data:'))
      const imageUrl = hasValidImage ? imageElement.content : ''

      // Check for bullet points in body content
      const isList = body.includes('•') || body.includes('- ')
      let bodyHtml = `<p class="body-text">${body}</p>`

      if (isList) {
        const items = body.split(/[\n•-]/).map(s => s.trim()).filter(s => s.length > 0)
        bodyHtml = `<ul class="body-list">${items.map(i => `<li>${i}</li>`).join('')}</ul>`
      }

      const slideCss = `
        .slide-${index} {
          position: relative;
          width: ${canvas.width}px;
          height: ${canvas.height}px;
          background-color: #000000;
          overflow: hidden;
        }
        ${css}
      `

      // Generate pagination dots (assuming 8 total slides for demo, current is index)
      const totalDots = 8
      let paginationHtml = ''
      for (let i = 1; i <= totalDots; i++) {
        if (i === index) {
          paginationHtml += `<span class="pagination-number">${i}</span>`
        } else {
          paginationHtml += `<span class="pagination-dot"></span>`
        }
      }

      htmlContent = `
        <div class="body-stripes"></div>

        <div class="slide-content-body">
          <!-- Header - ABSOLUTE: top: 80px -->
          <div class="body-header">
            <span class="body-header-text">${safeHandle}</span>
            <span class="body-header-text">All right reserved</span>
          </div>

          <!-- Text wrapper - FLEXBOX container for headline + body with consistent gap -->
          <div class="body-text-wrapper">
            <h3 class="body-headline">${headline}</h3>
            ${bodyHtml}
          </div>

          <!-- IMAGE - ABSOLUTE: top: 519px, left: 80px -->
          ${hasValidImage ? `
          <div class="body-image-container">
            <img src="${imageUrl}" class="body-image" alt="Visual" />
          </div>
          ` : ''}

          <!-- Pagination - ABSOLUTE: y=1239, x=80 -->
          <div class="body-pagination">
            ${paginationHtml}
          </div>

          <!-- Swipe pill - ABSOLUTE: y=1214, right=80 -->
          <div class="swipe-pill">
            <span class="swipe-text">Deslize para o lado</span>
            <div class="swipe-arrow-btn">
              <img src="/assets/patterns/seta-deslize.svg" alt="Deslize" />
            </div>
          </div>
        </div>
      `

      return { index, html: this.wrapSlide(index, canvas, htmlContent, ''), css: slideCss }
    }

    // LAST RENDER (35:1335) - FIGMA EXACT
    if (layoutId === 'branding-os-last-v1') {
      const headline = elements.find(e => e.role === 'headline')?.content || 'Para quem quer estar na vanguarda...'
      const body = elements.find(e => e.role === 'body')?.content || 'O futuro não espera. Seja parte da revolução.'
      const imageElement = elements.find(e => e.role === 'image') || elements.find(e => e.role === 'background')
      const hasValidImage = imageElement?.content && (imageElement.content.startsWith('http') || imageElement.content.startsWith('data:'))
      const imageUrl = hasValidImage ? imageElement.content : ''

      const slideCss = `
        .slide-${index} {
          position: relative;
          width: ${canvas.width}px;
          height: ${canvas.height}px;
          background-color: #FFD44A;
          overflow: hidden;
        }
        ${css}
      `

      htmlContent = `
        <div class="last-stripes"></div>

        <div class="slide-content-last">
          <!-- Header - ABSOLUTE: top: 80px -->
          <div class="last-header">
            <span class="last-header-text">${safeHandle}</span>
            <span class="last-header-text">All right reserved</span>
          </div>

          <!-- Text wrapper - FLEXBOX for consistent spacing -->
          <div class="last-text-wrapper">
            <h2 class="last-headline">${headline}</h2>
            <p class="last-body">${body}</p>
          </div>

          <!-- CTA Button - ABSOLUTE: top: 562px, left: 158px -->
          <div class="last-cta-btn">
            <svg class="last-cta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="last-cta-text">Link na BIO</span>
          </div>

          <!-- IMAGE - ABSOLUTE: top: 687px, left: 80px -->
          ${hasValidImage ? `
          <div class="last-image-container">
            <img src="${imageUrl}" class="last-image" alt="Visual" />
          </div>
          ` : ''}
        </div>
      `

      return { index, html: this.wrapSlide(index, canvas, htmlContent, ''), css: slideCss }
    }

    // Fallback if ID matches nothing
    return this.renderLegacySlide(slide)
  }

  private wrapSlide(index: number, canvas: { width: number, height: number }, content: string, style: string): string {
    return `<div class="slide slide-${index}" data-slide="${index}" style="width: ${canvas.width}px; height: ${canvas.height}px; ${style}; position: relative; overflow: hidden;">
      ${content}
    </div>`
  }

  /**
   * ORIGINAL RENDER method (Legacy Support)
   */
  private renderLegacySlide(slide: SlideVisualSpec): RenderedSlide {
    const index = slide.index || 1
    const canvas = slide.canvas || { width: 1080, height: 1080 }
    const background = slide.background || { type: 'solid', value: '#1A1A1A' }
    const elements = slide.elements || []

    // Build background style
    let backgroundStyle = ''
    if (background.type === 'solid') {
      backgroundStyle = `background-color: ${background.value}`
    } else if (background.type === 'gradient') {
      backgroundStyle = `background: ${background.value}`
    } else if (background.type === 'image') {
      backgroundStyle = `background-image: url('${background.value}'); background-size: cover; background-position: center`
    }

    if (background.opacity !== undefined && background.opacity < 1) {
      backgroundStyle += `; opacity: ${background.opacity}`
    }

    // Render elements using absolute positioning
    const elementsHTML = elements.map(el => this.renderElement(el)).join('\n    ')

    // Build slide HTML
    const html = `<div class="slide slide-${index}" data-slide="${index}" style="
  position: relative;
  width: ${canvas.width}px;
  height: ${canvas.height}px;
  ${backgroundStyle};
  overflow: hidden;
">
    ${elementsHTML}
  </div>`

    // Build slide-specific CSS
    const css = `
/* Slide ${index} */
.slide-${index} {
  position: relative;
  width: ${canvas.width}px;
  height: ${canvas.height}px;
  ${backgroundStyle};
  overflow: hidden;
}
`

    return {
      index,
      html,
      css
    }
  }

  /**
   * Convert a single element to HTML (Legacy)
   */
  private renderElement(element: VisualElement): string {
    if (!element) return ''

    const type = element.type || 'text'
    const role = element.role || 'body'
    const content = element.content || ''
    const style = element.style || {}
    const position = element.position || { x: 80, y: 400, width: 920 }

    // Build inline styles
    const styles: string[] = [
      `position: absolute`,
      `left: ${position.x || 80}px`,
      `top: ${position.y || 400}px`,
      `width: ${position.width || 920}px`,
      position.height && position.height !== 'auto' ? `height: ${position.height}px` : '',
    ].filter(Boolean)

    if (type === 'text') {
      styles.push(
        `font-family: '${style.fontFamily || 'Inter'}', sans-serif`,
        `font-size: ${style.fontSize || '24px'}`,
        `font-weight: ${style.fontWeight || 400}`,
        `color: ${style.color || '#FFFFFF'}`,
        `text-align: ${style.textAlign || 'center'}`,
        style.lineHeight ? `line-height: ${style.lineHeight}` : '',
        style.letterSpacing ? `letter-spacing: ${style.letterSpacing}` : '',
        style.textTransform ? `text-transform: ${style.textTransform}` : '',
      )

      // Escape HTML in content
      const escapedContent = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

      // Choose semantic tag based on role
      let tag = 'p'
      if (role === 'headline') tag = 'h1'
      else if (role === 'subheadline') tag = 'h2'
      else if (role === 'stat') tag = 'span'
      else if (role === 'cta') tag = 'button'
      else if (role === 'caption') tag = 'span'

      const styleString = styles.filter(Boolean).join('; ')

      if (role === 'cta') {
        // CTA as button
        return `<button class="cta-button" data-role="${role}" style="${styleString}; cursor: pointer; border: none; background: transparent;">${escapedContent}</button>`
      }

      return `<${tag} class="element element-${role}" data-role="${role}" style="${styleString}">${escapedContent}</${tag}>`
    }

    // For non-text elements (future: icons, shapes, images)
    return `<div class="element element-${role}" data-role="${role}" style="${styles.join('; ')}"></div>`
  }

  /**
   * Main render method
   */
  private renderSlide(slide: SlideVisualSpec, signature?: string): RenderedSlide {
    // If layoutId is present, use Template System
    if (slide.layoutId) {
      return this.renderTemplateSlide(slide, signature)
    }
    // Fallback to legacy
    return this.renderLegacySlide(slide)
  }

  /**
   * Generate global CSS for all slides
   */
  private generateGlobalCSS(tokens: VisualSpecification['tokens']): string {
    const colors = tokens?.colors || {}
    const fonts = tokens?.fonts || {}
    const spacing = tokens?.spacing || {}

    return `
/* Branding OS Generated Styles */
/* Generated at: ${new Date().toISOString()} */

:root {
  /* Brand Colors */
  ${Object.entries(colors).map(([name, value]) =>
      `--color-${name}: ${value};`
    ).join('\n  ') || '--color-primary: #5856D6;'}

  /* Brand Fonts */
  ${Object.entries(fonts).map(([role, family]) =>
      `--font-${role}: '${family}', sans-serif;`
    ).join('\n  ') || "--font-heading: 'Inter', sans-serif;"}

  /* Spacing */
  ${Object.entries(spacing).map(([name, value]) =>
      `--spacing-${name}: ${value}px;`
    ).join('\n  ') || '--spacing-margin: 80px;'}
}

/* Base Reset */
.slide * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Element Base */
.element {
  display: block;
}

/* Text Elements */
.element-headline {
  font-family: var(--font-heading);
}

.element-subheadline {
  font-family: var(--font-heading);
}

.element-body {
  font-family: var(--font-body);
}

.element-caption {
  font-family: var(--font-body);
}

.element-stat {
  font-family: var(--font-heading);
}

/* CTA Button */
.cta-button {
  font-family: var(--font-heading);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.cta-button:hover {
  transform: scale(1.02);
  opacity: 0.9;
}

/* Bullet Points */
.element-bullets {
  list-style: none;
}

.element-bullets li {
  margin-bottom: var(--spacing-gap-small);
}

/* Quote */
.element-quote {
  font-style: italic;
}

/* Responsive (for preview) */
@media (max-width: 1080px) {
  .slide {
    transform-origin: top left;
    transform: scale(calc(100vw / 1080));
  }
}
`
  }

  /**
   * Extract fonts to load
   */
  private extractFonts(tokens: VisualSpecification['tokens']): string[] {
    const fonts = Object.values(tokens?.fonts || { heading: 'Inter', body: 'Source Serif 4' })
    return [...new Set(fonts)]
  }

  /**
   * Main render function
   */
  render(visual: VisualSpecification & { signature?: string }): RenderOutput {
    // Ensure visual has required structure
    const slides = visual?.slides || []
    const signature = visual?.signature
    const tokens = visual?.tokens || {
      colors: { background: '#1A1A1A', text: '#FFFFFF', accent: '#C9B298' },
      fonts: { heading: 'Inter', body: 'Source Serif 4' },
      spacing: { margin: 80, 'gap-large': 48, 'gap-medium': 24, 'gap-small': 16 }
    }

    // Render each slide with signature
    const renderedSlides = slides.map(slide => this.renderSlide(slide, signature))

    // Generate global CSS
    const globalCSS = this.generateGlobalCSS(tokens)

    // Extract fonts
    const fontsToLoad = this.extractFonts(tokens)

    return {
      slides: renderedSlides,
      globalCSS,
      fontsToLoad,
      exportReady: {
        html: true,
        png: true,  // Would need html-to-image or similar
        pdf: false  // Would need additional library
      }
    }
  }

  /**
   * Generate complete HTML document for export
   */
  generateExportHTML(renderOutput: RenderOutput): string {
    const { slides, globalCSS, fontsToLoad } = renderOutput

    // Generate Google Fonts link
    const fontsQuery = fontsToLoad
      .map(f => f.replace(/ /g, '+'))
      .join('&family=')
    const fontsLink = fontsToLoad.length > 0
      ? `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${fontsQuery}:wght@400;500;600;700&display=swap" rel="stylesheet">`
      : ''

    // Combine all slide HTML
    const slidesHTML = slides.map(s => s.html).join('\n\n')

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Carousel - Branding OS</title>
  ${fontsLink}
  <style>
    ${globalCSS}

    /* Export Layout */
    body {
      margin: 0;
      padding: 20px;
      background: #0a0a0a;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }

    .slide {
      flex-shrink: 0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      border-radius: 8px;
    }

    /* Navigation for preview */
    .carousel-nav {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 999px;
    }

    .carousel-nav button {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: background 0.2s;
    }

    .carousel-nav button.active,
    .carousel-nav button:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  </style>
</head>
<body>
  ${slidesHTML}

  <nav class="carousel-nav">
    ${slides.map((_, i) =>
      `<button data-slide="${i + 1}" ${i === 0 ? 'class="active"' : ''}></button>`
    ).join('\n    ')}
  </nav>

  <script>
    // Simple carousel navigation
    const buttons = document.querySelectorAll('.carousel-nav button');
    const slides = document.querySelectorAll('.slide');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const slideIndex = parseInt(btn.dataset.slide);
        const targetSlide = document.querySelector(\`.slide-\${slideIndex}\`);
        if (targetSlide) {
          targetSlide.scrollIntoView({ behavior: 'smooth', block: 'center' });
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });
  </script>
</body>
</html>`
  }

  /**
   * Generate single slide HTML (for PNG export via html-to-image)
   */
  generateSlideHTML(slide: RenderedSlide, globalCSS: string, fontsToLoad: string[]): string {
    const fontsQuery = fontsToLoad
      .map(f => f.replace(/ /g, '+'))
      .join('&family=')
    const fontsLink = fontsToLoad.length > 0
      ? `<link href="https://fonts.googleapis.com/css2?family=${fontsQuery}:wght@400;500;600;700&display=swap" rel="stylesheet">`
      : ''

    return `<!DOCTYPE html>
<html>
<head>
  <style>
    ${globalCSS}
  </style>
  ${fontsLink}
</head>
<body>
  ${slide.html}
</body>
</html>`
  }
}

export const renderEngine = new RenderEngine()

