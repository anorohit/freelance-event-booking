"use client"

import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"

interface EnhancedSwipeIndicatorProps {
  direction: string | null
  swiping: boolean
  progress: number
  velocity: number
  className?: string
}

export function EnhancedSwipeIndicator({
  direction,
  swiping,
  progress,
  velocity,
  className = "",
}: EnhancedSwipeIndicatorProps) {
  if (!swiping || !direction) return null

  const getIcon = () => {
    switch (direction) {
      case "left":
        return <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      case "right":
        return <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      case "up":
        return <ChevronUp className="w-6 h-6 sm:w-8 sm:h-8" />
      case "down":
        return <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
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

  const getIntensity = () => {
    const baseIntensity = Math.min(progress * 2, 1)
    const velocityBoost = Math.min(velocity * 0.5, 0.5)
    return Math.min(baseIntensity + velocityBoost, 1)
  }

  const intensity = getIntensity()

  return (
    <div className={`fixed z-50 pointer-events-none ${getPositionClasses()} ${className}`}>
      <div
        className="bg-black/70 text-white rounded-full p-3 backdrop-blur-sm transition-all duration-150 ease-out"
        style={{
          transform: `scale(${0.8 + intensity * 0.4})`,
          opacity: 0.6 + intensity * 0.4,
        }}
      >
        <div
          className="transition-transform duration-150 ease-out"
          style={{
            transform: `scale(${1 + intensity * 0.2})`,
          }}
        >
          {getIcon()}
        </div>
      </div>

      {/* Progress Ring */}
      <div className="absolute inset-0 rounded-full">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2"
            strokeDasharray={`${progress * 283} 283`}
            className="transition-all duration-150 ease-out"
          />
        </svg>
      </div>
    </div>
  )
}
