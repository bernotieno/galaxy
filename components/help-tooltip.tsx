"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HelpCircle, Info } from "lucide-react"
import { ReactNode } from "react"

interface HelpTooltipProps {
  content: string | ReactNode
  children?: ReactNode
  side?: "top" | "right" | "bottom" | "left"
  variant?: "icon" | "inline"
}

export function HelpTooltip({
  content,
  children,
  side = "top",
  variant = "icon"
}: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <span className="inline-flex items-center justify-center cursor-help">
              {variant === "icon" ? (
                <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
              ) : (
                <Info className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
              )}
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          {typeof content === "string" ? <p>{content}</p> : content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function QuickTip({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800 text-sm">
      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium text-blue-800 dark:text-blue-200">{title}</p>
        <p className="text-blue-700 dark:text-blue-300 mt-1">{description}</p>
      </div>
    </div>
  )
}