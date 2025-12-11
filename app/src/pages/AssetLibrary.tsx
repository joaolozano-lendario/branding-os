/**
 * Asset Library Page
 * BRAND-017: Route placeholder for asset library
 * Shows uploaded brand examples and generated assets
 * FIGMA SPECS: #5856D6 primary, #F8F8F8 inactive, #E8E8E8 border
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { useTranslation } from "@/store/i18nStore"
import { useBrandStore, selectExamples } from "@/store/brandStore"
import { ExampleGallery } from "@/components/brand/ExampleGallery"
import { ExampleUploader } from "@/components/brand/ExampleUploader"

export function AssetLibrary() {
  const { t } = useTranslation()
  const examples = useBrandStore(selectExamples)
  const { addExample, removeExample } = useBrandStore()

  return (
    // Figma: bg #FFFFFF
    <div className="p-8 bg-background min-h-screen">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          {/* Figma: Inter SemiBold 32px */}
          <h1 className="text-[32px] font-semibold text-foreground">
            {t.brand.examples.title}
          </h1>
          {/* Figma: Inter Medium 16px, #888888 */}
          <p className="text-base font-medium text-muted-foreground mt-2">
            {t.brand.examples.subtitle}
          </p>
        </div>

        {/* Figma: Card with border #E8E8E8, radius 8px */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Icon name="upload" className="w-[18px] h-[18px] text-brand-indigo" />
              {t.brand.examples.uploadExamples}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground">
              {t.brand.examples.dragDropFiles}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExampleUploader onUpload={addExample} />
          </CardContent>
        </Card>

        <ExampleGallery
          examples={examples.examples}
          onDelete={removeExample}
          emptyMessage={t.brand.examples.noExamples}
        />
      </div>
    </div>
  )
}
