"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, User, Star, TrendingUp, Flame, ChevronLeft, ChevronRight } from "lucide-react"

interface Event {
  id: string
  title: string
  location: string
  date: string
  time: string
  price: string
  image: string
  category: string
  rating: number
  attendees: string
  isHot?: boolean
  isPopular?: boolean
}

interface SimpleHorizontalCarouselProps {
  events: Event[]
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  badgeText?: string
  badgeColor?: string
  showBadge?: boolean
}

export function SimpleHorizontalCarousel({
  events,
  title,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = "from-blue-500 to-purple-500",
  showBadge = false,
}: SimpleHorizontalCarouselProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Check scroll position and update button states
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
  }, [])

  // Smooth scroll to specific direction
  const scrollTo = useCallback((direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (!container) return

    const cardWidth = 320 // Card width + gap
    const scrollAmount = cardWidth * 2 // Scroll 2 cards at a time

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }, [])

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return

    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)

    // Prevent text selection and image dragging
    e.preventDefault()
    document.body.style.userSelect = "none"
    document.body.style.cursor = "grabbing"
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !scrollContainerRef.current) return

      e.preventDefault()
      const x = e.pageX - scrollContainerRef.current.offsetLeft
      const walk = (x - startX) * 1.5 // Scroll speed multiplier
      scrollContainerRef.current.scrollLeft = scrollLeft - walk
    },
    [isDragging, startX, scrollLeft],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    document.body.style.userSelect = ""
    document.body.style.cursor = ""
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }
  }, [isDragging])

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return

    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !scrollContainerRef.current) return

      const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
      const walk = (x - startX) * 1.2
      scrollContainerRef.current.scrollLeft = scrollLeft - walk
    },
    [isDragging, startX, scrollLeft],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Wheel scroll handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return

    e.preventDefault()
    const scrollAmount = e.deltaY || e.deltaX
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "auto",
    })
  }, [])

  // Setup scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      checkScrollPosition()
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    checkScrollPosition() // Initial check

    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [checkScrollPosition])

  // Global mouse event listeners for drag
  useEffect(() => {
    if (!isDragging) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!scrollContainerRef.current) return

      const x = e.pageX - scrollContainerRef.current.offsetLeft
      const walk = (x - startX) * 1.5
      scrollContainerRef.current.scrollLeft = scrollLeft - walk
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }

    document.addEventListener("mousemove", handleGlobalMouseMove, { passive: false })
    document.addEventListener("mouseup", handleGlobalMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging, startX, scrollLeft])

  if (events.length === 0) return null

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 overflow-hidden h-full flex flex-col flex-shrink-0 w-[300px]">
      <div className="relative overflow-hidden">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {event.isHot && (
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg">
              <Flame className="w-3 h-3 mr-1" />
              Hot
            </Badge>
          )}
          {event.isPopular && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
          {showBadge && (
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg capitalize">
              {event.category}
            </Badge>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-black/70 text-white border-0 backdrop-blur-sm">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {event.rating}
          </Badge>
        </div>

        {/* Hover overlay with attendees */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Badge className="bg-white/90 dark:bg-slate-800/90 text-gray-900 dark:text-white border-0 backdrop-blur-sm">
            <User className="w-3 h-3 mr-1" />
            {event.attendees}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base leading-tight">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mr-2 text-teal-500 dark:text-teal-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-teal-500 dark:text-teal-400 flex-shrink-0" />
            <span>
              {event.date} • {event.time}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{event.price}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">onwards</span>
          </div>
          <Link href={`/event/${event.id}`} className="flex-shrink-0">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 py-2 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 text-sm">
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section className="relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          {Icon && (
            <div
              className={`w-12 h-12 bg-gradient-to-r ${badgeColor} rounded-full flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{title}</h2>
            {subtitle && <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>}
          </div>
        </div>
        {badgeText && (
          <Badge
            className={`bg-gradient-to-r ${badgeColor} text-white px-4 py-2 text-sm font-medium w-fit ${badgeText.includes("Trending") ? "animate-pulse" : ""}`}
          >
            {badgeText}
          </Badge>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Navigation Buttons */}
        {canScrollLeft && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollTo("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl border-0 w-12 h-12 rounded-full p-0 opacity-0 group-hover:opacity-100 hover:shadow-2xl hover:scale-110 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 hidden sm:flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}

        {canScrollRight && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollTo("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl border-0 w-12 h-12 rounded-full p-0 opacity-0 group-hover:opacity-100 hover:shadow-2xl hover:scale-110 transition-all duration-300 translate-x-2 group-hover:translate-x-0 hidden sm:flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className={`flex gap-6 overflow-x-auto scrollbar-hide pb-4 ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
          style={{
            scrollBehavior: isDragging ? "auto" : "smooth",
            WebkitOverflowScrolling: "touch",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(events.length / 3) }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === 0 ? `bg-gradient-to-r ${badgeColor}` : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* Interaction Hints */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="hidden sm:inline">Drag, scroll, or use navigation buttons to browse events</span>
            <span className="sm:hidden">Swipe to browse events</span>
          </p>
        </div>
      </div>
    </section>
  )
}
