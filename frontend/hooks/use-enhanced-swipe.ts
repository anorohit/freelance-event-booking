"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"

interface SwipeInput {
  onSwipedLeft?: () => void
  onSwipedRight?: () => void
  onSwipedUp?: () => void
  onSwipedDown?: () => void
  preventDefaultTouchmoveEvent?: boolean
  delta?: number
  velocity?: number
  onSwipeStart?: () => void
  onSwipeEnd?: () => void
}

interface SwipeOutput {
  ref: React.RefObject<HTMLElement>
  swiping: boolean
  direction: string | null
  progress: number
  velocity: number
}

export function useEnhancedSwipe(input: SwipeInput): SwipeOutput {
  const {
    onSwipedLeft,
    onSwipedRight,
    onSwipedUp,
    onSwipedDown,
    preventDefaultTouchmoveEvent = false,
    delta = 50,
    velocity: minVelocity = 0.3,
    onSwipeStart,
    onSwipeEnd,
  } = input

  const [swiping, setSwiping] = useState(false)
  const [direction, setDirection] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const ref = useRef<HTMLElement>(null)

  const startTime = useRef(0)
  const startX = useRef(0)
  const startY = useRef(0)
  const currentX = useRef(0)
  const currentY = useRef(0)

  const calculateVelocity = useCallback((distance: number, time: number) => {
    return time > 0 ? Math.abs(distance) / time : 0
  }, [])

  const calculateProgress = useCallback((distance: number, maxDistance = 200) => {
    return Math.min(Math.abs(distance) / maxDistance, 1)
  }, [])

  useEffect(() => {
    let animationFrame: number

    const handleTouchStart = (e: TouchEvent) => {
      setSwiping(true)
      setDirection(null)
      setProgress(0)
      setVelocity(0)
      startTime.current = Date.now()
      startX.current = e.touches[0].clientX
      startY.current = e.touches[0].clientY
      currentX.current = startX.current
      currentY.current = startY.current
      onSwipeStart?.()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (preventDefaultTouchmoveEvent) {
        e.preventDefault()
      }

      currentX.current = e.touches[0].clientX
      currentY.current = e.touches[0].clientY

      const deltaX = currentX.current - startX.current
      const deltaY = currentY.current - startY.current
      const currentTime = Date.now()
      const timeDiff = currentTime - startTime.current

      // Determine primary direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        const newDirection = deltaX > 0 ? "right" : "left"
        setDirection(newDirection)
        setProgress(calculateProgress(deltaX))
        setVelocity(calculateVelocity(deltaX, timeDiff))
      } else {
        const newDirection = deltaY > 0 ? "down" : "up"
        setDirection(newDirection)
        setProgress(calculateProgress(deltaY))
        setVelocity(calculateVelocity(deltaY, timeDiff))
      }
    }

    const handleTouchEnd = () => {
      const deltaX = currentX.current - startX.current
      const deltaY = currentY.current - startY.current
      const timeDiff = Date.now() - startTime.current
      const currentVelocity = Math.max(calculateVelocity(deltaX, timeDiff), calculateVelocity(deltaY, timeDiff))

      setSwiping(false)
      setDirection(null)
      setProgress(0)
      setVelocity(0)
      onSwipeEnd?.()

      // Determine if swipe was significant enough
      const meetsDistanceThreshold = Math.abs(deltaX) > delta || Math.abs(deltaY) > delta
      const meetsVelocityThreshold = currentVelocity > minVelocity

      if (meetsDistanceThreshold || meetsVelocityThreshold) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0) {
            onSwipedRight?.()
          } else {
            onSwipedLeft?.()
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            onSwipedDown?.()
          } else {
            onSwipedUp?.()
          }
        }
      }
    }

    const element = ref.current
    if (element) {
      element.addEventListener("touchstart", handleTouchStart, { passive: true })
      element.addEventListener("touchmove", handleTouchMove, { passive: !preventDefaultTouchmoveEvent })
      element.addEventListener("touchend", handleTouchEnd, { passive: true })

      return () => {
        element.removeEventListener("touchstart", handleTouchStart)
        element.removeEventListener("touchmove", handleTouchMove)
        element.removeEventListener("touchend", handleTouchEnd)
        if (animationFrame) {
          cancelAnimationFrame(animationFrame)
        }
      }
    }
  }, [
    onSwipedLeft,
    onSwipedRight,
    onSwipedUp,
    onSwipedDown,
    preventDefaultTouchmoveEvent,
    delta,
    minVelocity,
    onSwipeStart,
    onSwipeEnd,
    calculateVelocity,
    calculateProgress,
  ])

  return { ref, swiping, direction, progress, velocity }
}
