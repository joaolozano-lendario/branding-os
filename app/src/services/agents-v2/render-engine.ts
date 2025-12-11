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
  /**
   * Convert a single element to HTML
   */
  private renderElement(element: VisualElement): string {
    const { type, role, content, style, position } = element

    // Build inline styles
    const styles: string[] = [
      `position: absolute`,
      `left: ${position.x}px`,
      `top: ${position.y}px`,
      `width: ${position.width}px`,
      position.height !== 'auto' ? `height: ${position.height}px` : '',
    ].filter(Boolean)

    if (type === 'text') {
      styles.push(
        `font-family: '${style.fontFamily}', sans-serif`,
        `font-size: ${style.fontSize}`,
        `font-weight: ${style.fontWeight}`,
        `color: ${style.color}`,
        `text-align: ${style.textAlign}`,
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
   * Render a single slide to HTML
   */
  private renderSlide(slide: SlideVisualSpec): RenderedSlide {
    const { index, canvas, background, elements } = slide

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

    // Render elements
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
   * Generate global CSS for all slides
   */
  private generateGlobalCSS(tokens: VisualSpecification['tokens']): string {
    return `
/* Branding OS Generated Styles */
/* Generated at: ${new Date().toISOString()} */

:root {
  /* Brand Colors */
  ${Object.entries(tokens.colors).map(([name, value]) =>
    `--color-${name}: ${value};`
  ).join('\n  ')}

  /* Brand Fonts */
  ${Object.entries(tokens.fonts).map(([role, family]) =>
    `--font-${role}: '${family}', sans-serif;`
  ).join('\n  ')}

  /* Spacing */
  ${Object.entries(tokens.spacing).map(([name, value]) =>
    `--spacing-${name}: ${value}px;`
  ).join('\n  ')}
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
    const fonts = Object.values(tokens.fonts)
    return [...new Set(fonts)]
  }

  /**
   * Main render function
   */
  render(visual: VisualSpecification): RenderOutput {
    // Render each slide
    const renderedSlides = visual.slides.map(slide => this.renderSlide(slide))

    // Generate global CSS
    const globalCSS = this.generateGlobalCSS(visual.tokens)

    // Extract fonts
    const fontsToLoad = this.extractFonts(visual.tokens)

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
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  ${fontsLink}
  <style>
    ${globalCSS}
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  ${slide.html}
</body>
</html>`
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const renderEngine = new RenderEngine()
