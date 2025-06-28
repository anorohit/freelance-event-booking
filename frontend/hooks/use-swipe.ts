"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface SwipeInput {
  onSwipedLeft?: () => void
  onSwipedRight?: () => void
  onSwipedUp?: () => void
  onSwipedDown?: () => void
  preventDefaultTouchmoveEvent?: boolean
  delta?: number
}

interface SwipeOutput {
  ref: React.RefObject<HTMLElement>
  swiping: boolean
  direction: string | null
}

export function useSwipe(input: SwipeInput): SwipeOutput {
  const {
    onSwipedLeft,
    onSwipedRight,
    onSwipedUp,
    onSwipedDown,
    preventDefaultTouchmoveEvent = false,
    delta = 50,
  } = input

  const [swiping, setSwiping] = useState(false)
  const [direction, setDirection] = useState<string | null>(null)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    let startX = 0
    let startY = 0
    let endX = 0
    let endY = 0

    const handleTouchStart = (e: TouchEvent) => {
      setSwiping(true)
      setDirection(null)
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (preventDefaultTouchmoveEvent) {
        e.preventDefault()
      }
      endX = e.touches[0].clientX
      endY = e.touches[0].clientY

      // Determine swipe direction for visual feedback
      const deltaX = endX - startX
      const deltaY = endY - startY

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setDirection(deltaX > 0 ? "right" : "left")
      } else {
        setDirection(deltaY > 0 ? "down" : "up")
      }
    }

    const handleTouchEnd = () => {
      setSwiping(false)
      setDirection(null)

      const deltaX = endX - startX
      const deltaY = endY - startY

      // Determine if swipe was significant enough
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > delta) {
          if (deltaX > 0) {
            onSwipedRight?.()
          } else {
            onSwipedLeft?.()
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > delta) {
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
      }
    }
  }, [onSwipedLeft, onSwipedRight, onSwipedUp, onSwipedDown, preventDefaultTouchmoveEvent, delta])

  return { ref, swiping, direction }
}
