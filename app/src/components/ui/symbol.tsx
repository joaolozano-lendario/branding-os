import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Symbol component for Unicode brand symbols
 * Part of Academia Lendaria visual identity
 */

const SYMBOLS = {
  infinity: "\u221E",    // ∞ - Main brand mark
  star: "\u2726",        // ✦ - Highlights
  diamond: "\u25C6",     // ◆ - Markers
  bullet: "\u00B7",      // · - Separators
  arrow: "\u2192",       // → - Direction
  check: "\u2713",       // ✓ - Checkmarks
} as const

export type SymbolName = keyof typeof SYMBOLS

export interface SymbolProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: SymbolName
}

const Symbol = React.forwardRef<HTMLSpanElement, SymbolProps>(
  ({ name, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("inline-block", className)}
        aria-hidden="true"
        {...props}
      >
        {SYMBOLS[name]}
      </span>
    )
  }
)
Symbol.displayName = "Symbol"

export { Symbol, SYMBOLS }
