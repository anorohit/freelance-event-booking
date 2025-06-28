"use client"

import type React from "react"

import { RefreshCw, ArrowDown } from "lucide-react"
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  className?: string
  enabled?: boolean
}

export function PullToRefresh({ onRefresh, children, className = "", enabled = true }: PullToRefreshProps) {
  const { containerRef, isPulling, isRefreshing, pullDistance, shouldTrigger } = usePullToRefresh({
    onRefresh,
    enabled,
  })

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>} className={`relative ${className}`}>
      {/* Pull to Refresh Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-300 ease-out z-50"
        style={{
          transform: `translateY(${Math.max(0, pullDistance - 60)}px)`,
          opacity: isPulling ? 1 : 0,
        }}
      >
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-full p-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          {isRefreshing ? (
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
          ) : shouldTrigger ? (
            <ArrowDown className="w-5 h-5 text-green-600 dark:text-green-400 animate-bounce" />
          ) : (
            <ArrowDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${isPulling ? Math.min(pullDistance, 60) : 0}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
