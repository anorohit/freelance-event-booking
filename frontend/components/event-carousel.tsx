"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSwipe } from "@/hooks/use-swipe"
import { SwipeIndicator } from "@/components/swipe-indicator"
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

interface EventCarouselProps {
  events: Event[]
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  badgeText?: string
  badgeColor?: string
  showBadge?: boolean
}

export function EventCarousel({
  events,
  title,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = "from-blue-500 to-purple-500",
  showBadge = false,
}: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, events.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, events.length - 2)) % Math.max(1, events.length - 2))
  }

  const {
    ref: swipeRef,
    swiping,
    direction,
  } = useSwipe({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    delta: 50,
  })

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || events.length <= 3) return

    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, events.length])

  // Pause auto-play on interaction
  const handleInteraction = () => {
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume after 10 seconds
  }

  if (events.length === 0) return null

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 overflow-hidden h-full flex flex-col min-w-[280px] sm:min-w-[320px]">
      <div className="relative overflow-hidden">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          width={400}
          height={200}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-700"
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
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base leading-tight">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-teal-500 dark:text-teal-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-teal-500 dark:text-teal-400 flex-shrink-0" />
            <span>
              {event.date} • {event.time}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{event.price}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">onwards</span>
          </div>
          <Link href={`/event/${event.id}`} className="flex-shrink-0">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-4 py-2 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 text-xs sm:text-sm">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          {Icon && (
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${badgeColor} rounded-full flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          )}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{title}</h2>
            {subtitle && <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{subtitle}</p>}
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
      <div className="relative">
        {/* Desktop Navigation Buttons */}
        <div className="hidden sm:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between pointer-events-none z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              prevSlide()
              handleInteraction()
            }}
            disabled={events.length <= 3}
            className="pointer-events-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 -ml-6 border-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              nextSlide()
              handleInteraction()
            }}
            disabled={events.length <= 3}
            className="pointer-events-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 -mr-6 border-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Swipeable Carousel */}
        <div
          ref={(el) => {
            if (el) {
              carouselRef.current = el
              // @ts-ignore
              swipeRef.current = el
            }
          }}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleInteraction}
          onTouchStart={handleInteraction}
        >
          <div
            className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6"
            style={{
              transform: `translateX(-${currentIndex * (280 + 16)}px)`, // 280px card width + 16px gap
            }}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <span className="mr-2">👈</span>
            Swipe to explore more events
            <span className="ml-2">👉</span>
          </p>
        </div>

        {/* Pagination Dots */}
        {events.length > 3 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.max(1, events.length - 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  handleInteraction()
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? `bg-gradient-to-r ${badgeColor} shadow-lg`
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Swipe Indicator */}
      <SwipeIndicator direction={direction} swiping={swiping} />
    </section>
  )
}
