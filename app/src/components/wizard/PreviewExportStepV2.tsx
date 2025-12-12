/**
 * Preview & Export Step V2
 * Branding OS - Academia Lendaria
 * E6: Pipeline V2 - Individual Slide Preview with Quality Report
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { useTranslation } from '@/store/i18nStore'
import type { PipelineResult } from '@/types/pipeline'

interface PreviewExportStepV2Props {
  pipelineResult: PipelineResult | null
  onExport: (format: 'png' | 'pdf' | 'html') => void
  onSaveToLibrary: () => void
  onGenerateVariations: () => void
  onCreateNew: () => void
}

// Canvas dimensions (fixed for Instagram carousel)
const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1080


export function PreviewExportStepV2({
  pipelineResult,
  onExport,
  onSaveToLibrary,
  onGenerateVariations,
  onCreateNew,
}: PreviewExportStepV2Props) {
  const { t } = useTranslation()
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0)

  if (!pipelineResult?.render) {
    return (
      <div className="text-center py-12">
        <Icon name="picture" size="size-12" className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No asset generated yet</p>
      </div>
    )
  }

  const { render, quality, summary } = pipelineResult
  void pipelineResult.visual // Used for future features
  const slides = render.slides
  const currentSlide = slides[currentSlideIndex]

  const _getCategoryColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-destructive'
  }
  void _getCategoryColor // Reserved for future category display

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-sans text-2xl font-bold tracking-tight">
          {t.wizard.steps.preview.title}
        </h2>
        <p className="mt-2 font-serif text-muted-foreground">
          {summary.slideCount} slides generated using "{summary.template}" template
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slide Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="eye" size="size-5" />
                  Slide {currentSlideIndex + 1} of {slides.length}
                </CardTitle>
                <Badge variant="secondary">slide</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Slide Navigation */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
                  disabled={currentSlideIndex === 0}
                >
                  <Icon name="arrow-left" size="size-4" />
                </Button>
                <div className="flex gap-1">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlideIndex(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        index === currentSlideIndex
                          ? 'bg-primary w-4'
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      )}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
                  disabled={currentSlideIndex === slides.length - 1}
                >
                  <Icon name="arrow-right" size="size-4" />
                </Button>
              </div>

              {/* Slide Preview */}
              <div className="rounded-lg border bg-background overflow-hidden">
                <div
                  className="w-full flex items-center justify-center p-4"
                  style={{ minHeight: '500px', background: '#0a0a0a' }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: currentSlide.html }}
                    style={{
                      width: CANVAS_WIDTH,
                      height: CANVAS_HEIGHT,
                      maxWidth: '100%',
                      transform: 'scale(0.45)',
                      transformOrigin: 'center',
                    }}
                  />
                </div>
              </div>

              {/* Slide Thumbnails */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {slides.map((_slide, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={cn(
                      'shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all',
                      index === currentSlideIndex
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center text-xs bg-muted"
                      style={{ fontSize: '10px' }}
                    >
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quality Report & Actions */}
        <div className="space-y-6">
          {/* Quality Score */}
          {quality && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="shield-check" size="size-5" />
                    Quality Report
                  </span>
                  <Badge variant={quality.passed ? 'default' : 'destructive'}>
                    {quality.passed ? 'Passed' : 'Needs Review'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overall Score */}
                <div className="text-center">
                  <div
                    className={cn(
                      'text-4xl font-bold',
                      quality.score >= 80
                        ? 'text-green-600 dark:text-green-400'
                        : quality.score >= 60
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-destructive'
                    )}
                  >
                    {quality.score}%
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>

                {/* Category Breakdown */}
                <div className="space-y-3">
                  {quality.checks.map((check) => (
                    <div key={check.rule} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Icon
                            name={check.passed ? 'check-circle' : 'cross-circle'}
                            size="size-4"
                            className={check.passed ? 'text-green-500' : 'text-destructive'}
                          />
                          {check.rule}
                        </span>
                        <span className={cn('font-medium', check.passed ? 'text-green-600' : 'text-destructive')}>
                          {check.passed ? 100 : 0}%
                        </span>
                      </div>
                      <Progress value={check.passed ? 100 : 0} className="h-1.5" />
                    </div>
                  ))}
                </div>

                {/* Issues */}
                {quality.checks.filter(c => !c.passed).length > 0 && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Issues Found:</p>
                    <div className="space-y-2">
                      {quality.checks.filter(c => !c.passed).slice(0, 3).map((issue, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Badge
                            variant={
                              issue.severity === 'critical'
                                ? 'destructive'
                                : issue.severity === 'warning'
                                ? 'default'
                                : 'secondary'
                            }
                            className="shrink-0 text-xs"
                          >
                            {issue.severity}
                          </Badge>
                          <span className="text-muted-foreground">{issue.details}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="download" size="size-5" />
                {t.wizard.steps.preview.exportOptions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => onExport('html')}>
                <Icon name="code" size="size-4" className="mr-2" />
                Export as HTML
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onExport('png')} disabled>
                <Icon name="picture" size="size-4" className="mr-2" />
                Export as PNG (coming soon)
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onExport('pdf')} disabled>
                <Icon name="document" size="size-4" className="mr-2" />
                Export as PDF (coming soon)
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full" onClick={onSaveToLibrary}>
              <Icon name="folder-add" size="size-4" className="mr-2" />
              {t.wizard.steps.preview.saveToLibrary}
            </Button>

            <Button variant="outline" className="w-full" onClick={onGenerateVariations}>
              <Icon name="magic-wand" size="size-4" className="mr-2" />
              {t.wizard.steps.preview.generateVariations}
            </Button>

            <Button variant="ghost" className="w-full" onClick={onCreateNew}>
              <Icon name="plus" size="size-4" className="mr-2" />
              {t.wizard.steps.preview.createNew}
            </Button>
          </div>
        </div>
      </div>

      {/* All Slides Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Slides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={cn(
                  'aspect-square rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg',
                  index === currentSlideIndex
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div
                  className="w-full h-full bg-[#0a0a0a] p-2 flex items-center justify-center"
                  style={{ fontSize: '6px' }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: slide.html }}
                    style={{
                      transform: 'scale(0.15)',
                      transformOrigin: 'center',
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
