/**
 * ToneGuidelinesEditor Component
 * BRAND-002: Configure Brand Voice
 * Academia Lendária Design System
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import type { ToneGuideline } from "@/types/brand"

interface ToneGuidelinesEditorProps {
  guidelines: ToneGuideline[]
  onAdd: (text: string) => void
  onUpdate: (id: string, text: string) => void
  onRemove: (id: string) => void
  maxGuidelines?: number
  disabled?: boolean
  className?: string
}

const PLACEHOLDER_EXAMPLES = [
  "We speak with confidence but never arrogance. Our tone is assured without being condescending.",
  "We use clear, simple language. If a 12-year-old can't understand it, we rewrite it.",
  "We celebrate our customers' wins. Every success story is a chance to show genuine enthusiasm.",
  "We acknowledge challenges honestly. When something is hard, we say so - then help solve it.",
  "We avoid jargon unless it adds value. Industry terms are fine when our audience expects them.",
]

export function ToneGuidelinesEditor({
  guidelines,
  onAdd,
  onUpdate,
  onRemove,
  maxGuidelines = 5,
  disabled = false,
  className,
}: ToneGuidelinesEditorProps) {
  const [newGuideline, setNewGuideline] = React.useState("")
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editText, setEditText] = React.useState("")

  const canAddMore = guidelines.length < maxGuidelines
  const unusedExamples = PLACEHOLDER_EXAMPLES.filter(
    (ex) => !guidelines.some((g) => g.text === ex)
  )

  const handleAdd = () => {
    if (newGuideline.trim()) {
      onAdd(newGuideline.trim())
      setNewGuideline("")
    }
  }

  const handleSaveEdit = () => {
    if (editingId && editText.trim()) {
      onUpdate(editingId, editText.trim())
      setEditingId(null)
      setEditText("")
    }
  }

  const handleStartEdit = (guideline: ToneGuideline) => {
    setEditingId(guideline.id)
    setEditText(guideline.text)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const handleAddExample = (example: string) => {
    onAdd(example)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label>Tone Guidelines</Label>
        <span className="text-sm text-muted-foreground">
          {guidelines.length}/{maxGuidelines} guidelines
        </span>
      </div>

      <p className="text-sm text-muted-foreground font-serif">
        Describe how your brand should sound. These guidelines help the AI match your
        tone when writing copy.
      </p>

      {/* Existing Guidelines */}
      <div className="space-y-3">
        {guidelines.map((guideline, index) => (
          <div
            key={guideline.id}
            className="group rounded-lg border border-border p-4 transition-colors hover:border-primary/50"
          >
            {editingId === guideline.id ? (
              // Edit Mode
              <div className="space-y-3">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[80px]"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <p className="flex-1 text-sm font-serif text-muted-foreground leading-relaxed">
                  {guideline.text}
                </p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleStartEdit(guideline)}
                    disabled={disabled}
                    aria-label="Edit guideline"
                  >
                    <Icon name="pencil" size="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onRemove(guideline.id)}
                    disabled={disabled}
                    aria-label="Delete guideline"
                  >
                    <Icon name="trash" size="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Guideline */}
      {canAddMore && (
        <div className="space-y-3">
          <div className="rounded-lg border border-dashed border-border p-4">
            <Textarea
              value={newGuideline}
              onChange={(e) => setNewGuideline(e.target.value)}
              placeholder="Write a tone guideline... e.g., 'We use humor sparingly but effectively. A well-placed joke can make complex topics feel approachable.'"
              className="min-h-[80px] border-0 p-0 focus-visible:ring-0 resize-none"
              disabled={disabled}
            />
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleAdd}
                disabled={disabled || !newGuideline.trim()}
                size="sm"
              >
                <Icon name="plus" size="size-4" className="mr-2" />
                Add Guideline
              </Button>
            </div>
          </div>

          {/* Example Suggestions */}
          {unusedExamples.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Example Guidelines
              </p>
              <div className="flex flex-wrap gap-2">
                {unusedExamples.slice(0, 3).map((example, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddExample(example)}
                    disabled={disabled}
                    className="text-left text-xs text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-md px-3 py-2 transition-colors line-clamp-1 max-w-[300px]"
                  >
                    <Icon name="plus" size="size-3" className="inline mr-1" />
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Max Reached Message */}
      {!canAddMore && (
        <p className="text-sm text-muted-foreground text-center py-2">
          Maximum guidelines reached. Remove one to add another.
        </p>
      )}
    </div>
  )
}
