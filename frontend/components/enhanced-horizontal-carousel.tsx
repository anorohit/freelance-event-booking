"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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

interface EnhancedHorizontalCarouselProps {
  events: Event[]
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  badgeText?: string
  badgeColor?: string
  showBadge?: boolean
}

export function EnhancedHorizontalCarousel({
  events,
  title,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = "from-blue-500 to-purple-500",
  showBadge = false,
}: EnhancedHorizontalCarouselProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Simple scroll position checker
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    const maxScroll = scrollWidth - clientWidth

    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < maxScroll - 10)
  }

  // Simple scroll functions
  const scrollLeft = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const cardWidth = 344 // Card width + gap
    const scrollAmount = cardWidth * 2 // Scroll 2 cards at a time
    const newScrollLeft = Math.max(0, container.scrollLeft - scrollAmount)

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  const scrollRight = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const cardWidth = 344 // Card width + gap
    const scrollAmount = cardWidth * 2 // Scroll 2 cards at a time
    const maxScroll = container.scrollWidth - container.clientWidth
    const newScrollLeft = Math.min(maxScroll, container.scrollLeft + scrollAmount)

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  // Check scroll position on mount and scroll events
  useEffect(() => {
    checkScrollPosition()
    
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollPosition)
      return () => container.removeEventListener("scroll", checkScrollPosition)
    }
  }, [events])

  if (events.length === 0) return null

  const EventCard = ({ event, index }: { event: Event; index: number }) => (
    <div className="flex-shrink-0 w-80">
      <Card className="transition-all duration-500 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover transition-transform duration-300"
            loading="lazy"
            draggable={false}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {event.isHot && (
              <div>
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg">
                  <Flame className="w-3 h-3 mr-1" />
                  Hot
                </Badge>
              </div>
            )}
            {event.isPopular && (
              <div>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </div>
            )}
            {showBadge && (
              <div>
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg capitalize">
                  {event.category}
                </Badge>
              </div>
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
          <div className="absolute bottom-3 right-3 opacity-0 hover:opacity-100 transition-opacity duration-200">
            <Badge className="bg-white/90 dark:bg-slate-800/90 text-gray-900 dark:text-white border-0 backdrop-blur-sm">
              <User className="w-3 h-3 mr-1" />
              {event.attendees}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-base leading-tight">
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
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-3 py-1.5 font-semibold transition-all duration-300 text-xs">
                View More
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <section className="relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          {Icon && (
            <div className={`w-12 h-12 bg-gradient-to-r ${badgeColor} rounded-full flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-300">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {badgeText && (
          <div>
            <Badge
              className={`bg-gradient-to-r ${badgeColor} text-white px-4 py-2 text-sm font-medium w-fit ${badgeText.includes("Trending") ? "animate-pulse" : ""}`}
            >
              {badgeText}
            </Badge>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Navigation Buttons */}
        {canScrollLeft && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="hover:scale-110 active:scale-90 transition-transform duration-200">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollLeft}
                className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl border-0 w-12 h-12 rounded-full p-0 hover:shadow-2xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {canScrollRight && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="hover:scale-110 active:scale-90 transition-transform duration-200">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollRight}
                className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl border-0 w-12 h-12 rounded-full p-0 hover:shadow-2xl"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Simple Scrollable Container */}
        <div 
          ref={scrollContainerRef} 
          className="overflow-x-auto scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth'
          }}
        >
          <div className="flex gap-6 pb-4">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
