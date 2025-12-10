/**
 * LogoUploader Component
 * BRAND-001: Configure Visual Identity
 * Academia Lendária Design System
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { BrandLogo } from "@/types/brand"

interface LogoUploaderProps {
  logo: BrandLogo
  onUpload: (updates: Partial<BrandLogo>) => void
  onRemove: () => void
  disabled?: boolean
  className?: string
}

const ACCEPTED_TYPES = ["image/png", "image/svg+xml"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function LogoUploader({
  logo,
  onUpload,
  onRemove,
  disabled = false,
  className,
}: LogoUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleFileSelect = React.useCallback(
    (file: File) => {
      setError(null)

      // Validate file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Please upload a PNG or SVG file")
        return
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size must be less than 5MB")
        return
      }

      // Create preview URL
      const url = URL.createObjectURL(file)
      const fileType = file.type === "image/svg+xml" ? "svg" : "png"

      onUpload({
        file,
        url,
        fileName: file.name,
        fileType,
        uploadedAt: new Date(),
      })
    },
    [onUpload]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleRemove = () => {
    if (logo.url) {
      URL.revokeObjectURL(logo.url)
    }
    onRemove()
    setError(null)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area or Preview */}
      {logo.url ? (
        // Logo Preview
        <div className="relative group">
          <div className="flex items-center justify-center rounded-xl border border-border bg-card p-8 transition-colors hover:border-primary/50">
            <img
              src={logo.url}
              alt="Brand Logo"
              className="max-h-32 max-w-full object-contain"
            />
          </div>

          {/* Logo Info */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" size="sm">
                {logo.fileType?.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                {logo.fileName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                <Icon name="refresh" size="size-4" className="mr-2" />
                Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
              >
                <Icon name="trash" size="size-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Upload Dropzone
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Icon name="cloud-upload" size="size-8" />
          </div>

          <h4 className="font-sans font-semibold text-foreground mb-1">
            Upload your logo
          </h4>

          <p className="text-sm text-muted-foreground text-center mb-4">
            Drag and drop or click to browse
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" size="sm">PNG</Badge>
            <Badge variant="outline" size="sm">SVG</Badge>
            <span>Max 5MB</span>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept=".png,.svg,image/png,image/svg+xml"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mt-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
