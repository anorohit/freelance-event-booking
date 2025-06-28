"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, useMotionValue, useTransform, AnimatePresence, type PanInfo } from "framer-motion"
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

interface AdvancedMotionCarouselProps {
  events: Event[]
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  badgeText?: string
  badgeColor?: string
  showBadge?: boolean
}

export function AdvancedMotionCarousel({
  events,
  title,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = "from-blue-500 to-purple-500",
  showBadge = false,
}: AdvancedMotionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const CARD_WIDTH = 320
  const CARD_GAP = 24
  const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_GAP

  const maxScroll = -(events.length - 3) * TOTAL_CARD_WIDTH
  const progress = useTransform(x, [maxScroll, 0], [0, 1])

  // Update scroll state based on current position
  const updateScrollState = useCallback(
    (currentX: number) => {
      setCanScrollLeft(currentX < -10)
      setCanScrollRight(currentX > maxScroll + 10)
      setCurrentIndex(Math.round(-currentX / TOTAL_CARD_WIDTH))
    },
    [maxScroll],
  )

  // Smooth scroll to specific index
  const scrollToIndex = useCallback(
    (index: number) => {
      const targetX = -index * TOTAL_CARD_WIDTH
      const clampedX = Math.max(Math.min(targetX, 0), maxScroll)

      x.set(clampedX)
      updateScrollState(clampedX)
    },
    [x, maxScroll, updateScrollState],
  )

  // Navigation functions
  const scrollLeft = useCallback(() => {
    const newIndex = Math.max(currentIndex - 2, 0)
    scrollToIndex(newIndex)
  }, [currentIndex, scrollToIndex])

  const scrollRight = useCallback(() => {
    const maxIndex = Math.max(0, events.length - 3)
    const newIndex = Math.min(currentIndex + 2, maxIndex)
    scrollToIndex(newIndex)
  }, [currentIndex, events.length, scrollToIndex])

  // Enhanced drag handling
  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleDrag = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const currentX = x.get()
      updateScrollState(currentX)
    },
    [x, updateScrollState],
  )

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false)

      const currentX = x.get()
      const velocity = info.velocity.x
      const threshold = TOTAL_CARD_WIDTH * 0.3

      let targetIndex = currentIndex

      // Determine target based on drag distance and velocity
      if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
        if (info.offset.x > 0 || velocity > 500) {
          targetIndex = Math.max(0, currentIndex - 1)
        } else if (info.offset.x < 0 || velocity < -500) {
          targetIndex = Math.min(events.length - 3, currentIndex + 1)
        }
      }

      scrollToIndex(targetIndex)
    },
    [x, currentIndex, events.length, scrollToIndex],
  )

  // Wheel scroll handling
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const delta = e.deltaY || e.deltaX
      const sensitivity = 0.5
      const currentX = x.get()
      const newX = currentX - delta * sensitivity
      const clampedX = Math.max(Math.min(newX, 0), maxScroll)

      x.set(clampedX)
      updateScrollState(clampedX)
    },
    [x, maxScroll, updateScrollState],
  )

  // Initialize scroll state
  useEffect(() => {
    updateScrollState(0)
  }, [updateScrollState])

  if (events.length === 0) return null

  const EventCard = ({ event, index }: { event: Event; index: number }) => (
    <motion.div
      className="flex-shrink-0"
      style={{ width: CARD_WIDTH }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
              loading="lazy"
              draggable={false}
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {event.isHot && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg">
                  <Flame className="w-3 h-3 mr-1" />
                  Hot
                </Badge>
              </motion.div>
            )}
            {event.isPopular && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </motion.div>
            )}
            {showBadge && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}>
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg capitalize">
                  {event.category}
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Badge className="bg-black/70 text-white border-0 backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                {event.rating}
              </Badge>
            </motion.div>
          </div>

          {/* Hover overlay with attendees */}
          <motion.div
            className="absolute bottom-3 right-3"
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Badge className="bg-white/90 dark:bg-slate-800/90 text-gray-900 dark:text-white border-0 backdrop-blur-sm">
              <User className="w-3 h-3 mr-1" />
              {event.attendees}
            </Badge>
          </motion.div>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <motion.h3
            className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {event.title}
          </motion.h3>

          <motion.div
            className="space-y-2 mb-4 flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
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
          </motion.div>

          <motion.div
            className="flex items-center justify-between mt-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex flex-col">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{event.price}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">onwards</span>
            </div>
            <Link href={`/event/${event.id}`} className="flex-shrink-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 py-2 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 text-sm">
                  Book Now
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const progressBarScale = useTransform(progress, [0, 1], [0, 1])

  return (
    <section className="relative">
      {/* Section Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-4">
          {Icon && (
            <motion.div
              className={`w-12 h-12 bg-gradient-to-r ${badgeColor} rounded-full flex items-center justify-center shadow-lg`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
          )}
          <div>
            <motion.h2
              className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {title}
            </motion.h2>
            {subtitle && (
              <motion.p
                className="text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>
        {badgeText && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Badge
              className={`bg-gradient-to-r ${badgeColor} text-white px-4 py-2 text-sm font-medium w-fit ${badgeText.includes("Trending") ? "animate-pulse" : ""}`}
            >
              {badgeText}
            </Badge>
          </motion.div>
        )}
      </motion.div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Navigation Buttons */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0, x: -6 }}
              whileHover={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollLeft}
                  className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl border-0 w-12 h-12 rounded-full p-0 hover:shadow-2xl"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0, x: 6 }}
              whileHover={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollRight}
                  className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl border-0 w-12 h-12 rounded-full p-0 hover:shadow-2xl"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Container */}
        <div ref={containerRef} className="overflow-hidden" onWheel={handleWheel}>
          <motion.div
            className={`flex gap-6 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ x }}
            drag="x"
            dragConstraints={{ left: maxScroll, right: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            animate={{
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
            }}
          >
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </motion.div>
        </div>

        {/* Progress Indicators */}
        {events.length > 3 && (
          <motion.div
            className="flex justify-center mt-6 space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {Array.from({ length: Math.ceil(events.length / 3) }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => scrollToIndex(index * 3)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / 3) === index
                    ? `bg-gradient-to-r ${badgeColor} shadow-lg scale-125`
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>
        )}

        {/* Progress Bar */}
        <motion.div
          className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${badgeColor} rounded-full`}
            style={{
              scaleX: progressBarScale,
              originX: 0,
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}
