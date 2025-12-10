import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon, type IconProps } from "./icon"
import { Button } from "./button"

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "py-8 px-4 space-y-3",
        default: "py-12 px-6 space-y-4",
        lg: "py-16 px-8 space-y-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: string
  iconType?: IconProps["type"]
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      size,
      icon = "folder-open",
      iconType = "regular",
      title,
      description,
      action,
      secondaryAction,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ size, className }))}
        {...props}
      >
        {/* Icon Container */}
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <Icon
            name={icon}
            type={iconType}
            size="size-8"
            className="text-muted-foreground"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-2 max-w-sm">
          <h3 className="font-sans font-semibold text-foreground text-lg">
            {title}
          </h3>
          {description && (
            <p className="font-serif text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex items-center gap-3 pt-2">
            {action && (
              <Button
                variant={action.variant || "default"}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState, emptyStateVariants }
