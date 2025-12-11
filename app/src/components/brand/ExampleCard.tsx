/**
 * ExampleCard Component
 * BRAND-003: Configure Brand Examples
 * Display card for brand examples
 * Academia Lendária Design System
 */

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { BrandExample } from "@/types/brand"

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  carousel: { icon: "grid", color: "#5856D6" },
  ad: { icon: "megaphone", color: "#FF2D55" },
  slide: { icon: "presentation", color: "#007AFF" },
  post: { icon: "share", color: "#34C759" },
  other: { icon: "file", color: "#737373" },
}

interface ExampleCardProps {
  example: BrandExample
  onEdit?: () => void
  onDelete?: () => void
  onClick?: () => void
  selected?: boolean
  compact?: boolean
  className?: string
}

export function ExampleCard({
  example,
  onEdit,
  onDelete,
  onClick,
  selected = false,
  compact = false,
  className,
}: ExampleCardProps) {
  const typeConfig = TYPE_CONFIG[example.type] || TYPE_CONFIG.other

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return "picture"
    if (fileType === "application/pdf") return "document"
    return "file-alt"
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "group flex items-center gap-4 rounded-lg border p-4 text-left transition-all w-full",
          selected
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          className
        )}
      >
        {/* Thumbnail */}
        <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted">
          {example.url ? (
            <img
              src={example.url}
              alt={example.fileName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Icon
                name={getFileIcon(example.fileType)}
                size="size-5"
                className="text-muted-foreground"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{example.fileName}</p>
          <p className="text-xs text-muted-foreground truncate">
            {example.annotation || example.whatMakesItOnBrand}
          </p>
        </div>

        {/* Type Badge */}
        <Badge
          variant="outline"
          size="sm"
          style={{ borderColor: typeConfig.color, color: typeConfig.color }}
        >
          {example.type}
        </Badge>
      </button>
    )
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all",
        selected && "ring-2 ring-primary",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        {example.url ? (
          <img
            src={example.url}
            alt={example.fileName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <Icon
              name={getFileIcon(example.fileType)}
              size="size-10"
              className="text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-2 truncate max-w-[80%]">
              {example.fileName}
            </p>
          </div>
        )}

        {/* Type Badge */}
        <Badge
          className="absolute top-2 left-2"
          style={{ backgroundColor: typeConfig.color }}
        >
          <Icon name={typeConfig.icon} size="size-3" className="mr-1" />
          {example.type}
        </Badge>

        {/* Actions Overlay */}
        {(onEdit || onDelete) && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {onEdit && (
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                aria-label="Edit example"
              >
                <Icon name="pencil" size="size-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                aria-label="Delete example"
              >
                <Icon name="trash" size="size-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Annotation */}
        {example.annotation && (
          <p className="text-sm font-medium line-clamp-1">{example.annotation}</p>
        )}

        {/* What makes it on brand */}
        <p className="text-xs text-muted-foreground font-serif line-clamp-2">
          {example.whatMakesItOnBrand}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {formatDate(example.uploadedAt)}
          </span>

          {/* Tags */}
          {example.tags.length > 1 && (
            <div className="flex items-center gap-1">
              {example.tags.slice(0, 2).map((tag, i) => (
                <Badge key={i} variant="outline" size="sm" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
              {example.tags.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{example.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
