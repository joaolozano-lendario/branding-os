/**
 * ExampleUploader Component
 * BRAND-003: Configure Brand Examples
 * Upload and manage brand example files
 * Academia Lendária Design System
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { BrandExample, ExampleType } from "@/types/brand"

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "text/plain",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const EXAMPLE_TYPES: { value: ExampleType; label: string; icon: string; color: string }[] = [
  { value: "carousel", label: "Carousel", icon: "grid", color: "#5856D6" },
  { value: "ad", label: "Ad", icon: "megaphone", color: "#FF2D55" },
  { value: "slide", label: "Slide", icon: "presentation", color: "#007AFF" },
  { value: "post", label: "Post", icon: "share", color: "#34C759" },
  { value: "other", label: "Other", icon: "file", color: "#737373" },
]

interface ExampleUploaderProps {
  onUpload: (example: Omit<BrandExample, "id" | "uploadedAt">) => void
  disabled?: boolean
  className?: string
}

export function ExampleUploader({
  onUpload,
  disabled = false,
  className,
}: ExampleUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  // Form state
  const [exampleType, setExampleType] = React.useState<ExampleType>("carousel")
  const [annotation, setAnnotation] = React.useState("")
  const [whatMakesItOnBrand, setWhatMakesItOnBrand] = React.useState("")

  const resetForm = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setExampleType("carousel")
    setAnnotation("")
    setWhatMakesItOnBrand("")
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleFileSelect = React.useCallback((file: File) => {
    setError(null)

    // Validate file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a PNG, JPG, PDF, or TXT file")
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10MB")
      return
    }

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }

    setSelectedFile(file)
  }, [])

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

  const handleSubmit = () => {
    if (!selectedFile) return

    onUpload({
      file: selectedFile,
      url: previewUrl,
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      type: exampleType,
      tags: [exampleType],
      annotation,
      whatMakesItOnBrand,
    })

    resetForm()
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "picture"
    if (type === "application/pdf") return "document"
    return "file-alt"
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* File Selection / Preview */}
      {selectedFile ? (
        // Preview State
        <div className="space-y-4">
          {/* File Preview */}
          <div className="relative rounded-xl border border-border bg-card overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-contain bg-muted/30"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-48 bg-muted/30">
                <Icon name={getFileIcon(selectedFile.type)} size="size-12" className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedFile.name}
                </p>
              </div>
            )}

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={resetForm}
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
              aria-label="Close"
            >
              <Icon name="cross" size="size-4" />
            </Button>
          </div>

          {/* Example Type Selection */}
          <div className="space-y-2">
            <Label>Example Type</Label>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setExampleType(type.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                    exampleType === type.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Icon name={type.icon} size="size-4" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Annotation */}
          <div className="space-y-2">
            <Label htmlFor="annotation">Annotation (Optional)</Label>
            <Input
              id="annotation"
              value={annotation}
              onChange={(e) => setAnnotation(e.target.value)}
              placeholder="Brief description of this example..."
            />
          </div>

          {/* What Makes It On Brand */}
          <div className="space-y-2">
            <Label htmlFor="onbrand" required>
              What makes this on-brand?
            </Label>
            <Textarea
              id="onbrand"
              value={whatMakesItOnBrand}
              onChange={(e) => setWhatMakesItOnBrand(e.target.value)}
              placeholder="Explain why this example represents your brand well. This helps the AI understand your brand standards."
              className="min-h-[100px]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!whatMakesItOnBrand.trim()}
            >
              <Icon name="plus" size="size-4" className="mr-2" />
              Add Example
            </Button>
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
            Upload brand example
          </h4>

          <p className="text-sm text-muted-foreground text-center mb-4">
            Drag and drop or click to browse
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" size="sm">PNG</Badge>
            <Badge variant="outline" size="sm">JPG</Badge>
            <Badge variant="outline" size="sm">PDF</Badge>
            <Badge variant="outline" size="sm">TXT</Badge>
            <span>Max 10MB</span>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.pdf,.txt,image/png,image/jpeg,application/pdf,text/plain"
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
