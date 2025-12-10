/**
 * Preview & Export Step
 * Branding OS - Academia Lendaria
 * E4: BRAND-027 - Final step of Generation Wizard
 */

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { useTranslation } from '@/store/i18nStore'
import type {
  ComposerOutput,
  QualityGateOutput,
  ComplianceCategory,
} from '@/types/agent'

interface PreviewExportStepProps {
  composerOutput: ComposerOutput | null
  qualityOutput: QualityGateOutput | null
  onExport: (format: 'png' | 'pdf' | 'html') => void
  onSaveToLibrary: () => void
  onGenerateVariations: () => void
  onCreateNew: () => void
}

export function PreviewExportStep({
  composerOutput,
  qualityOutput,
  onExport,
  onSaveToLibrary,
  onGenerateVariations,
  onCreateNew,
}: PreviewExportStepProps) {
  const { t } = useTranslation()

  const getCategoryColor = (category: ComplianceCategory): string => {
    if (category.score >= 80) return 'text-green-600 dark:text-green-400'
    if (category.score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-destructive'
  }

  const getCategoryIcon = (passed: boolean): string => {
    return passed ? 'check-circle' : 'cross-circle'
  }

  const getCategoryLabel = (key: string): string => {
    switch (key) {
      case 'visual':
        return 'Visual'
      case 'voice':
        return 'Voice'
      case 'structure':
        return 'Structure'
      case 'accessibility':
        return 'Accessibility'
      default:
        return key
    }
  }

  if (!composerOutput) {
    return (
      <div className="text-center py-12">
        <Icon name="picture" size="size-12" className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No asset generated yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-sans text-2xl font-bold tracking-tight">
          {t.wizard.steps.preview.title}
        </h2>
        <p className="mt-2 font-serif text-muted-foreground">
          {t.wizard.steps.preview.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="eye" size="size-5" />
                {t.common.preview}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-background overflow-hidden">
                {/* HTML Preview */}
                <div
                  className="w-full min-h-[400px] p-4"
                  dangerouslySetInnerHTML={{ __html: composerOutput.html }}
                />
              </div>

              {/* Device Toggle (placeholder) */}
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Icon name="mobile" size="size-4" className="mr-2" />
                  Mobile
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="laptop" size="size-4" className="mr-2" />
                  Desktop
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quality Report & Actions */}
        <div className="space-y-6">
          {/* Quality Score */}
          {qualityOutput && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="shield-check" size="size-5" />
                    {t.wizard.steps.preview.complianceScore}
                  </span>
                  <Badge
                    variant={qualityOutput.passed ? 'default' : 'destructive'}
                  >
                    {qualityOutput.passed ? 'Passed' : 'Failed'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overall Score */}
                <div className="text-center">
                  <div
                    className={cn(
                      'text-4xl font-bold',
                      qualityOutput.overallScore >= 80
                        ? 'text-green-600 dark:text-green-400'
                        : qualityOutput.overallScore >= 60
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-destructive'
                    )}
                  >
                    {qualityOutput.overallScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>

                {/* Category Breakdown */}
                <div className="space-y-3">
                  {Object.entries(qualityOutput.categories).map(([key, category]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Icon
                            name={getCategoryIcon(category.passed)}
                            size="size-4"
                            className={getCategoryColor(category)}
                          />
                          {getCategoryLabel(key)}
                        </span>
                        <span className={cn('font-medium', getCategoryColor(category))}>
                          {category.score}%
                        </span>
                      </div>
                      <Progress value={category.score} className="h-1.5" />
                    </div>
                  ))}
                </div>

                {/* Issues */}
                {qualityOutput.issues.length > 0 && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Issues Found:</p>
                    <div className="space-y-2">
                      {qualityOutput.issues.slice(0, 3).map((issue, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Badge
                            variant={
                              issue.severity === 'critical'
                                ? 'destructive'
                                : issue.severity === 'major'
                                ? 'default'
                                : 'secondary'
                            }
                            className="shrink-0 text-xs"
                          >
                            {issue.severity}
                          </Badge>
                          <span className="text-muted-foreground">
                            {issue.message}
                          </span>
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
              {composerOutput.exportFormats.map((format) => (
                <Button
                  key={format}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onExport(format)}
                >
                  <Icon
                    name={format === 'png' ? 'picture' : format === 'pdf' ? 'document' : 'code'}
                    size="size-4"
                    className="mr-2"
                  />
                  Export as {format.toUpperCase()}
                </Button>
              ))}
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
    </div>
  )
}
