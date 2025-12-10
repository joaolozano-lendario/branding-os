import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon } from "./icon"
import { Button } from "./button"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive bg-destructive/10 [&>svg]:text-destructive",
        success:
          "border-success/50 text-success dark:border-success bg-success/10 [&>svg]:text-success",
        warning:
          "border-warning/50 text-foreground dark:border-warning bg-warning/10 [&>svg]:text-warning",
        info:
          "border-info/50 text-info dark:border-info bg-info/10 [&>svg]:text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconMap = {
  default: "info-circle",
  destructive: "exclamation",
  success: "check-circle",
  warning: "triangle-warning",
  info: "info-circle",
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onDismiss?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", onDismiss, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <Icon name={iconMap[variant || "default"]} size="size-4" />
        <div className="flex-1">{children}</div>
        {(onDismiss || action) && (
          <div className="absolute right-4 top-4 flex items-center gap-2">
            {action && (
              <Button
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                className="h-auto py-1 px-2 text-xs"
              >
                {action.label}
              </Button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-current opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Dismiss"
              >
                <Icon name="cross-small" size="size-4" />
              </button>
            )}
          </div>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-sans font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-serif [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription, alertVariants }
