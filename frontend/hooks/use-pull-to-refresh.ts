"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>
  threshold?: number
  resistance?: number
  enabled?: boolean
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true,
}: PullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const currentY = useRef(0)
  const containerRef = useRef<HTMLElement>(null)

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || window.scrollY > 0) return
      startY.current = e.touches[0].clientY
    },
    [enabled],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || window.scrollY > 0 || startY.current === 0) return

      currentY.current = e.touches[0].clientY
      const diff = currentY.current - startY.current

      if (diff > 0) {
        const distance = Math.min(diff / resistance, threshold * 1.5)
        setPullDistance(distance)
        setIsPulling(distance > 10)

        if (distance > 10) {
          e.preventDefault()
        }
      }
    },
    [enabled, threshold, resistance],
  )

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isPulling) return

    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }

    setIsPulling(false)
    setPullDistance(0)
    startY.current = 0
    currentY.current = 0
  }, [enabled, isPulling, pullDistance, threshold, onRefresh])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    element.addEventListener("touchstart", handleTouchStart, { passive: true })
    element.addEventListener("touchmove", handleTouchMove, { passive: false })
    element.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
      element.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    shouldTrigger: pullDistance >= threshold,
  }
}
