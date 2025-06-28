"use client"

import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"

interface SwipeIndicatorProps {
  direction: string | null
  swiping: boolean
  className?: string
}

export function SwipeIndicator({ direction, swiping, className = "" }: SwipeIndicatorProps) {
  if (!swiping || !direction) return null

  const getIcon = () => {
    switch (direction) {
      case "left":
        return <ChevronLeft className="w-8 h-8" />
      case "right":
        return <ChevronRight className="w-8 h-8" />
      case "up":
        return <ChevronUp className="w-8 h-8" />
      case "down":
        return <ChevronDown className="w-8 h-8" />
      default:
        return null
    }
  }

  const getPositionClasses = () => {
    switch (direction) {
      case "left":
        return "left-4 top-1/2 -translate-y-1/2"
      case "right":
        return "right-4 top-1/2 -translate-y-1/2"
      case "up":
        return "top-4 left-1/2 -translate-x-1/2"
      case "down":
        return "bottom-4 left-1/2 -translate-x-1/2"
      default:
        return ""
    }
  }

  return (
    <div className={`fixed z-50 pointer-events-none ${getPositionClasses()} ${className}`}>
      <div className="bg-black/70 text-white rounded-full p-3 backdrop-blur-sm animate-pulse">{getIcon()}</div>
    </div>
  )
}
