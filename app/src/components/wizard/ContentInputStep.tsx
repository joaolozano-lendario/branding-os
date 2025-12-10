/**
 * Content Input Step
 * Branding OS - Academia Lendaria
 * E4: BRAND-025 - Step 4 of Generation Wizard
 */

import * as React from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/store/i18nStore'
import type { ContentInput } from '@/types/agent'

interface ContentInputStepProps {
  content: ContentInput
  onChange: (content: Partial<ContentInput>) => void
  errors: string[]
}

export function ContentInputStep({ content, onChange, errors }: ContentInputStepProps) {
  const { t } = useTranslation()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/plain']
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB limit
    })

    if (validFiles.length > 0) {
      onChange({
        files: [...(content.files || []), ...validFiles],
      })
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = [...(content.files || [])]
    newFiles.splice(index, 1)
    onChange({ files: newFiles })
  }

  const getFileIcon = (file: File): string => {
    if (file.type.startsWith('image/')) return 'picture'
    if (file.type === 'application/pdf') return 'document'
    return 'file'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-sans text-2xl font-bold tracking-tight">
          {t.wizard.steps.content.title}
        </h2>
        <p className="mt-2 font-serif text-muted-foreground">
          {t.wizard.steps.content.subtitle}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Text Content */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-base font-semibold">
            {t.wizard.steps.content.inputContent}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="content"
            value={content.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Paste your content, key points, or raw material here..."
            rows={8}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {content.text.length} characters
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">
            {t.wizard.steps.content.uploadFiles}
          </Label>

          <div
            className={cn(
              'relative rounded-xl border-2 border-dashed p-8 transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf,text/plain"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name="cloud-upload" size="size-6" />
              </div>
              <div>
                <p className="font-medium">{t.brand.examples.dragDropFiles}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.brand.examples.supportedFormats}
                </p>
              </div>
            </div>
          </div>

          {/* Uploaded Files */}
          {content.files && content.files.length > 0 && (
            <div className="space-y-2 mt-4">
              {content.files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background">
                    <Icon name={getFileIcon(file)} size="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="p-1 rounded hover:bg-background"
                  >
                    <Icon name="cross-small" size="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
