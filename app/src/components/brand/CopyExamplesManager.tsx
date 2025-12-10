/**
 * CopyExamplesManager Component
 * BRAND-002: Configure Brand Voice
 * Academia Lendária Design System
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { CopyExample } from "@/types/brand"

interface CopyExamplesManagerProps {
  examples: CopyExample[]
  onAdd: (example: Omit<CopyExample, "id">) => void
  onRemove: (id: string) => void
  maxExamples?: number
  disabled?: boolean
  className?: string
}

export function CopyExamplesManager({
  examples,
  onAdd,
  onRemove,
  maxExamples = 5,
  disabled = false,
  className,
}: CopyExamplesManagerProps) {
  const [isAdding, setIsAdding] = React.useState(false)
  const [newExample, setNewExample] = React.useState({
    text: "",
    context: "",
    isGood: true,
    notes: "",
  })

  const canAddMore = examples.length < maxExamples
  const goodExamples = examples.filter((e) => e.isGood)
  const badExamples = examples.filter((e) => !e.isGood)

  const handleAdd = () => {
    if (newExample.text.trim()) {
      onAdd({
        text: newExample.text.trim(),
        context: newExample.context.trim(),
        isGood: newExample.isGood,
        notes: newExample.notes.trim() || undefined,
      })
      setNewExample({ text: "", context: "", isGood: true, notes: "" })
      setIsAdding(false)
    }
  }

  const handleCancel = () => {
    setNewExample({ text: "", context: "", isGood: true, notes: "" })
    setIsAdding(false)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label>Copy Examples</Label>
        <span className="text-sm text-muted-foreground">
          {examples.length}/{maxExamples} examples
        </span>
      </div>

      <p className="text-sm text-muted-foreground font-serif">
        Add examples of brand-aligned copy. Include both good examples (to emulate)
        and bad examples (to avoid) for better AI training.
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <Badge variant="success" className="gap-1">
          <Icon name="check" size="size-3" />
          {goodExamples.length} good
        </Badge>
        <Badge variant="destructive" className="gap-1">
          <Icon name="cross" size="size-3" />
          {badExamples.length} avoid
        </Badge>
      </div>

      {/* Existing Examples */}
      <div className="space-y-3">
        {examples.map((example) => (
          <Card
            key={example.id}
            className={cn(
              "group transition-colors",
              example.isGood
                ? "border-success/20 hover:border-success/50"
                : "border-destructive/20 hover:border-destructive/50"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    example.isGood
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  <Icon
                    name={example.isGood ? "check" : "cross"}
                    size="size-4"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-sm font-serif leading-relaxed">
                    "{example.text}"
                  </p>

                  {example.context && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold">Context:</span> {example.context}
                    </p>
                  )}

                  {example.notes && (
                    <p className="text-xs text-muted-foreground italic">
                      {example.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                  onClick={() => onRemove(example.id)}
                  disabled={disabled}
                  aria-label="Delete example"
                >
                  <Icon name="trash" size="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Example Form */}
      {isAdding ? (
        <Card className="border-dashed">
          <CardContent className="p-4 space-y-4">
            {/* Good/Bad Toggle */}
            <div className="flex items-center gap-4">
              <Label className="text-sm">Example Type:</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant={newExample.isGood ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewExample({ ...newExample, isGood: true })}
                >
                  <Icon name="check" size="size-4" className="mr-1" />
                  Good Example
                </Button>
                <Button
                  variant={!newExample.isGood ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setNewExample({ ...newExample, isGood: false })}
                >
                  <Icon name="cross" size="size-4" className="mr-1" />
                  Bad Example
                </Button>
              </div>
            </div>

            {/* Copy Text */}
            <div className="space-y-2">
              <Label required>Copy Text</Label>
              <Textarea
                value={newExample.text}
                onChange={(e) =>
                  setNewExample({ ...newExample, text: e.target.value })
                }
                placeholder={
                  newExample.isGood
                    ? "e.g., 'Your journey to mastery begins here. Let's build something legendary together.'"
                    : "e.g., 'Buy now! Limited offer! Don't miss out!!!'"
                }
                className="min-h-[80px]"
              />
            </div>

            {/* Context */}
            <div className="space-y-2">
              <Label>Context (Optional)</Label>
              <Input
                value={newExample.context}
                onChange={(e) =>
                  setNewExample({ ...newExample, context: e.target.value })
                }
                placeholder="e.g., Homepage hero headline, Email subject line, CTA button"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Input
                value={newExample.notes}
                onChange={(e) =>
                  setNewExample({ ...newExample, notes: e.target.value })
                }
                placeholder={
                  newExample.isGood
                    ? "Why this is on-brand..."
                    : "Why this should be avoided..."
                }
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={!newExample.text.trim()}
              >
                <Icon name="plus" size="size-4" className="mr-2" />
                Add Example
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        canAddMore && (
          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={() => setIsAdding(true)}
            disabled={disabled}
          >
            <Icon name="plus" size="size-4" className="mr-2" />
            Add Copy Example
          </Button>
        )
      )}

      {!canAddMore && !isAdding && (
        <p className="text-sm text-muted-foreground text-center py-2">
          Maximum examples reached. Remove one to add another.
        </p>
      )}
    </div>
  )
}
