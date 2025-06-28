"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, MapPin, Calendar, Clock, Users, Star, Crown, Award, Medal, Flame, TrendingUp } from "lucide-react"
import { RatingFeedback } from "@/components/rating-feedback"

// Mock event data with enhanced details
const eventData = {
  "1": {
    id: "1",
    title: "Coldplay Music of the Spheres World Tour",
    location: "DY Patil Stadium, Mumbai",
    date: "Jan 19, 2024",
    time: "7:00 PM",
    image: "/placeholder.svg?height=400&width=800",
    category: "Concert",
    description:
      "Experience the magic of Coldplay live in concert! Join thousands of fans for an unforgettable night of music, lights, and pure energy. This spectacular show features songs from their latest album 'Music of the Spheres' along with all-time classics.",
    duration: "3 hours",
    ageLimit: "All ages",
    rating: 4.9,
    reviews: 1247,
    attendees: "50K+",
    isHot: true,
    ticketTypes: {
      bronze: {
        price: 1500,
        name: "Bronze",
        description: "General seating area",
        icon: Medal,
        color: "from-amber-500 to-amber-600",
      },
      silver: {
        price: 2500,
        name: "Silver",
        description: "Premium seating with better view",
        icon: Award,
        color: "from-gray-400 to-gray-500",
      },
      gold: {
        price: 4500,
        name: "Gold",
        description: "VIP seating with exclusive amenities",
        icon: Crown,
        color: "from-yellow-400 to-yellow-500",
      },
    },
  },
  "2": {
    id: "2",
    title: "Stand-up Comedy Night with Zakir Khan",
    location: "NCPA, Mumbai",
    date: "Jan 25, 2024",
    time: "8:00 PM",
    image: "/placeholder.svg?height=400&width=800",
    category: "Comedy",
    description:
      "Get ready to laugh until your stomach hurts! Zakir Khan brings his signature storytelling style to Mumbai with his latest comedy special featuring hilarious anecdotes and relatable humor.",
    duration: "2 hours",
    ageLimit: "18+",
    rating: 4.7,
    reviews: 892,
    attendees: "2K+",
    isPopular: true,
    ticketTypes: {
      bronze: {
        price: 600,
        name: "Bronze",
        description: "Standard seating",
        icon: Medal,
        color: "from-amber-500 to-amber-600",
      },
      silver: {
        price: 800,
        name: "Silver",
        description: "Premium seating",
        icon: Award,
        color: "from-gray-400 to-gray-500",
      },
      gold: {
        price: 1200,
        name: "Gold",
        description: "Front row with meet & greet",
        icon: Crown,
        color: "from-yellow-400 to-yellow-500",
      },
    },
  },
}

const mockRatings = [
  {
    id: "1",
    userId: "user1",
    userName: "Sarah Johnson",
    rating: 5,
    comment: "",
    date: "Dec 15, 2023",
    helpful: 24,
    eventAspects: {
      venue: 5,
      organization: 4,
      value: 4,
      experience: 5,
    },
  },
  {
    id: "2",
    userId: "user2",
    userName: "Mike Chen",
    rating: 4,
    comment: "",
    date: "Dec 12, 2023",
    helpful: 18,
    eventAspects: {
      venue: 3,
      organization: 4,
      value: 4,
      experience: 5,
    },
  },
  {
    id: "3",
    userId: "user3",
    userName: "Emily Rodriguez",
    rating: 5,
    comment: "",
    date: "Dec 10, 2023",
    helpful: 31,
    eventAspects: {
      venue: 5,
      organization: 5,
      value: 5,
      experience: 5,
    },
  },
]

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = eventData[params.id as keyof typeof eventData] || eventData["1"]
  const lowestPrice = Math.min(...Object.values(event.ticketTypes).map((t) => t.price))

  const handleRatingSubmit = async (rating: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Rating submitted:", rating)
    // In real app, this would update the ratings list
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Events</span>
            </Link>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                EventHub
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] overflow-hidden">
        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Floating badges */}
        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
          {event.isHot && (
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg backdrop-blur-sm">
              <Flame className="w-3 h-3 mr-1" />
              Hot
            </Badge>
          )}
          {event.isPopular && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg backdrop-blur-sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg backdrop-blur-sm">
            {event.category}
          </Badge>
        </div>

        {/* Rating badge */}
        <div className="absolute top-6 right-6">
          <Badge className="bg-black/70 text-white border-0 backdrop-blur-sm shadow-lg">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {event.rating} ({event.reviews} reviews)
          </Badge>
        </div>

        {/* Event title overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{event.attendees} attending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info Card */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 dark:border dark:border-slate-700/50">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Event Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Location</p>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Date & Time</p>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {event.date} • {event.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Duration</p>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{event.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Age Limit</p>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{event.ageLimit}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Event Card */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 dark:border dark:border-slate-700/50">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About This Event</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{event.description}</p>
              </CardContent>
            </Card>

            {/* Ticket Types Preview */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 dark:border dark:border-slate-700/50">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Tickets</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(event.ticketTypes).map(([key, ticket]) => {
                    const IconComponent = ticket.icon
                    return (
                      <div
                        key={key}
                        className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 p-4 hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${ticket.color} opacity-5`} />
                        <div className="relative">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-r ${ticket.color} flex items-center justify-center mb-3 shadow-lg`}
                          >
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1">{ticket.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{ticket.description}</p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            ₹{ticket.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-2xl border-0 dark:border dark:border-slate-700/50 sticky top-24">
              <CardContent className="p-6 lg:p-8">
                <div className="text-center mb-8">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Starting from</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{lowestPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">per person</p>
                </div>

                <Link href={`/booking/${event.id}`} className="block mb-6">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Book Tickets Now
                  </Button>
                </Link>

                <Separator className="my-6 dark:bg-gray-600" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">What's Included</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3"></div>
                      Instant confirmation
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3"></div>
                      Mobile tickets accepted
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3"></div>
                      Free cancellation up to 24h
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3"></div>
                      Customer support included
                    </div>
                  </div>
                </div>

                <Separator className="my-6 dark:bg-gray-600" />

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    <strong>Limited Time:</strong> Early bird pricing available for the next 48 hours!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Section Separator with Visual Divider */}
        <div className="relative my-16 sm:my-20 lg:my-24">
          {/* Decorative separator line */}
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          {/* Central decorative element */}
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-6 py-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Rating and Feedback Section with Enhanced Spacing */}
        <div className="pt-8 sm:pt-12 lg:pt-16">
          <RatingFeedback
            eventId={event.id}
            eventTitle={event.title}
            averageRating={4.6}
            totalRatings={mockRatings.length}
            ratings={mockRatings}
            onSubmitRating={handleRatingSubmit}
          />
        </div>
      </main>
    </div>
  )
}
