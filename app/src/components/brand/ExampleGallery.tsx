/**
 * ExampleGallery Component
 * BRAND-003: Configure Brand Examples
 * Gallery view for brand examples with filtering
 * Academia Lendária Design System
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ExampleCard } from "./ExampleCard"
import type { BrandExample, ExampleType } from "@/types/brand"

const EXAMPLE_TYPES: { value: ExampleType | "all"; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "apps" },
  { value: "carousel", label: "Carousel", icon: "grid" },
  { value: "ad", label: "Ad", icon: "megaphone" },
  { value: "slide", label: "Slide", icon: "presentation" },
  { value: "post", label: "Post", icon: "share" },
  { value: "other", label: "Other", icon: "file" },
]

interface ExampleGalleryProps {
  examples: BrandExample[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onSelect?: (id: string) => void
  selectedId?: string
  emptyMessage?: string
  className?: string
}

export function ExampleGallery({
  examples,
  onEdit,
  onDelete,
  onSelect,
  selectedId,
  emptyMessage = "No examples uploaded yet",
  className,
}: ExampleGalleryProps) {
  const [filter, setFilter] = React.useState<ExampleType | "all">("all")
  const [search, setSearch] = React.useState("")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")

  // Filter examples
  const filteredExamples = React.useMemo(() => {
    return examples.filter((example) => {
      // Type filter
      if (filter !== "all" && example.type !== filter) return false

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesFileName = example.fileName.toLowerCase().includes(searchLower)
        const matchesAnnotation = example.annotation?.toLowerCase().includes(searchLower)
        const matchesOnBrand = example.whatMakesItOnBrand.toLowerCase().includes(searchLower)
        if (!matchesFileName && !matchesAnnotation && !matchesOnBrand) return false
      }

      return true
    })
  }, [examples, filter, search])

  // Count by type
  const countByType = React.useMemo(() => {
    const counts: Record<string, number> = { all: examples.length }
    examples.forEach((e) => {
      counts[e.type] = (counts[e.type] || 0) + 1
    })
    return counts
  }, [examples])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Icon
            name="search"
            size="size-4"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search examples..."
            className="pl-9"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <Icon name="grid" size="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <Icon name="list" size="size-4" />
          </Button>
        </div>
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => setFilter(type.value)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors",
              filter === type.value
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            <Icon name={type.icon} size="size-4" />
            {type.label}
            {countByType[type.value] !== undefined && (
              <Badge variant="secondary" size="sm">
                {countByType[type.value]}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredExamples.length} of {examples.length} examples
        {filter !== "all" && ` (filtered by ${filter})`}
        {search && ` matching "${search}"`}
      </p>

      {/* Gallery */}
      {filteredExamples.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
            <Icon name={examples.length === 0 ? "cloud-upload" : "search"} size="size-8" />
          </div>
          <p className="text-muted-foreground font-serif text-center">
            {examples.length === 0 ? emptyMessage : "No examples match your filters"}
          </p>
          {(filter !== "all" || search) && (
            <Button
              variant="link"
              onClick={() => {
                setFilter("all")
                setSearch("")
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredExamples.map((example) => (
            <ExampleCard
              key={example.id}
              example={example}
              onEdit={onEdit ? () => onEdit(example.id) : undefined}
              onDelete={onDelete ? () => onDelete(example.id) : undefined}
              onClick={onSelect ? () => onSelect(example.id) : undefined}
              selected={selectedId === example.id}
            />
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-2">
          {filteredExamples.map((example) => (
            <ExampleCard
              key={example.id}
              example={example}
              onEdit={onEdit ? () => onEdit(example.id) : undefined}
              onDelete={onDelete ? () => onDelete(example.id) : undefined}
              onClick={onSelect ? () => onSelect(example.id) : undefined}
              selected={selectedId === example.id}
              compact
            />
          ))}
        </div>
      )}
    </div>
  )
}
