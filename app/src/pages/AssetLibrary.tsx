/**
 * Asset Library Page
 * BRAND-017: Route placeholder for asset library
 * Shows uploaded brand examples and generated assets
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
    <div className="p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="font-sans text-3xl font-bold tracking-tight">
            {t.brand.examples.title}
          </h1>
          <p className="font-serif text-muted-foreground mt-2">
            {t.brand.examples.subtitle}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="upload" size="size-5" />
              {t.brand.examples.uploadExamples}
            </CardTitle>
            <CardDescription>
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
