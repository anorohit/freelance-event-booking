"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  MapPin,
  Calendar,
  User,
  Search,
  TrendingUp,
  Flame,
  Star,
  Music,
  Mic,
  Palette,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react"
import { MobileSearch } from "@/components/mobile-search"
import { EnhancedHorizontalCarousel } from "@/components/enhanced-horizontal-carousel"
import { OptimizedAccountModal } from "@/components/optimized-account-modal"
import { GoogleLoginModal } from "@/components/google-login-modal"
import { PhoneNumberModal } from "@/components/phone-number-modal"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { LocationDetector } from "@/components/location-detector"
import type { SessionUser } from '@/lib/ironSessionOptions'
import MaintenanceMode from "@/components/maintenance-mode"

const cities = [
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
  { value: "bangalore", label: "Bangalore" },
  { value: "chennai", label: "Chennai" },
  { value: "kolkata", label: "Kolkata" },
]

const categories = [
  { value: "all", label: "All Events", icon: Sparkles, color: "from-purple-500 to-pink-500" },
  { value: "concert", label: "Concerts", icon: Music, color: "from-blue-500 to-cyan-500" },
  { value: "comedy", label: "Comedy", icon: Mic, color: "from-yellow-500 to-orange-500" },
  { value: "workshop", label: "Workshops", icon: Palette, color: "from-pink-500 to-rose-500" },
]

const events = {
  mumbai: [
    {
      id: "1",
      title: "Coldplay Music of the Spheres World Tour",
      location: "DY Patil Stadium, Mumbai",
      date: "Jan 19, 2024",
      time: "7:00 PM",
      price: "₹2,500",
      image: "/placeholder.svg?height=300&width=400",
      category: "concert",
      rating: 4.9,
      attendees: "50K+",
      isHot: true,
    },
    {
      id: "2",
      title: "Stand-up Comedy Night with Zakir Khan",
      location: "NCPA, Mumbai",
      date: "Jan 25, 2024",
      time: "8:00 PM",
      price: "₹800",
      image: "/placeholder.svg?height=300&width=400",
      category: "comedy",
      rating: 4.7,
      attendees: "2K+",
      isPopular: true,
    },
    {
      id: "3",
      title: "Mumbai Food Festival 2024",
      location: "Mahalaxmi Racecourse",
      date: "Feb 2-4, 2024",
      time: "11:00 AM",
      price: "₹300",
      image: "/placeholder.svg?height=300&width=400",
      category: "food",
      rating: 4.5,
      attendees: "10K+",
    },
    {
      id: "4",
      title: "Bollywood Dance Workshop",
      location: "Shiamak Davar Dance Academy",
      date: "Jan 28, 2024",
      time: "4:00 PM",
      price: "₹1,200",
      image: "/placeholder.svg?height=300&width=400",
      category: "workshop",
      rating: 4.6,
      attendees: "500+",
    },
  ],
  delhi: [
    {
      id: "5",
      title: "Delhi Literature Festival",
      location: "India Habitat Centre",
      date: "Feb 10-12, 2024",
      time: "10:00 AM",
      price: "₹500",
      image: "/placeholder.svg?height=300&width=400",
      category: "literature",
      rating: 4.8,
      attendees: "5K+",
      isPopular: true,
    },
  ],
  bangalore: [
    {
      id: "6",
      title: "Bangalore Tech Summit",
      location: "Palace Grounds",
      date: "Mar 5-7, 2024",
      time: "9:00 AM",
      price: "₹1,500",
      image: "/placeholder.svg?height=300&width=400",
      category: "technology",
      rating: 4.7,
      attendees: "15K+",
      isHot: true,
    },
  ],
}

const hotEvents = [
  {
    id: "7",
    title: "AR Rahman Live in Concert",
    location: "Phoenix MarketCity",
    date: "Feb 14, 2024",
    time: "7:30 PM",
    price: "₹3,000",
    image: "/placeholder.svg?height=300&width=400",
    category: "concert",
    rating: 4.9,
    attendees: "25K+",
    isHot: true,
  },
  {
    id: "8",
    title: "International Food & Music Festival",
    location: "Jawaharlal Nehru Stadium",
    date: "Feb 20-22, 2024",
    time: "5:00 PM",
    price: "₹600",
    image: "/placeholder.svg?height=300&width=400",
    category: "festival",
    rating: 4.8,
    attendees: "30K+",
    isHot: true,
  },
  {
    id: "9",
    title: "Tech Innovation Summit 2024",
    location: "Bangalore International Centre",
    date: "Mar 15, 2024",
    time: "9:00 AM",
    price: "₹2,000",
    image: "/placeholder.svg?height=300&width=400",
    category: "technology",
    rating: 4.7,
    attendees: "8K+",
    isHot: true,
  },
  {
    id: "13",
    title: "Bollywood Night Live",
    location: "Mumbai Convention Center",
    date: "Feb 28, 2024",
    time: "8:00 PM",
    price: "₹1,800",
    image: "/placeholder.svg?height=300&width=400",
    category: "concert",
    rating: 4.6,
    attendees: "12K+",
    isHot: true,
  },
  {
    id: "14",
    title: "Street Food Carnival",
    location: "Central Park, Delhi",
    date: "Mar 8-10, 2024",
    time: "4:00 PM",
    price: "₹400",
    image: "/placeholder.svg?height=300&width=400",
    category: "food",
    rating: 4.5,
    attendees: "20K+",
    isHot: true,
  },
]

const popularEvents = [
  {
    id: "10",
    title: "Comedy Central Live",
    location: "Hard Rock Cafe",
    date: "Feb 18, 2024",
    time: "8:30 PM",
    price: "₹1,000",
    image: "/placeholder.svg?height=300&width=400",
    category: "comedy",
    rating: 4.6,
    attendees: "1.5K+",
    isPopular: true,
  },
  {
    id: "11",
    title: "Wine & Dine Experience",
    location: "The Leela Palace",
    date: "Feb 25, 2024",
    time: "7:00 PM",
    price: "₹2,500",
    image: "/placeholder.svg?height=300&width=400",
    category: "food",
    rating: 4.8,
    attendees: "800+",
    isPopular: true,
  },
  {
    id: "12",
    title: "Digital Art Workshop",
    location: "Creative Hub",
    date: "Mar 2, 2024",
    time: "2:00 PM",
    price: "₹1,800",
    image: "/placeholder.svg?height=300&width=400",
    category: "workshop",
    rating: 4.5,
    attendees: "300+",
    isPopular: true,
  },
  {
    id: "15",
    title: "Photography Masterclass",
    location: "Art Gallery, Bangalore",
    date: "Mar 12, 2024",
    time: "10:00 AM",
    price: "₹2,200",
    image: "/placeholder.svg?height=300&width=400",
    category: "workshop",
    rating: 4.7,
    attendees: "150+",
    isPopular: true,
  },
  {
    id: "16",
    title: "Jazz Night Special",
    location: "Blue Frog, Mumbai",
    date: "Mar 18, 2024",
    time: "9:00 PM",
    price: "₹1,500",
    image: "/placeholder.svg?height=300&width=400",
    category: "concert",
    rating: 4.8,
    attendees: "800+",
    isPopular: true,
  },
]

const mockTransactions = [
  {
    id: "TXN001",
    eventTitle: "Coldplay Music of the Spheres World Tour",
    date: "2024-01-15",
    amount: "₹7,500",
    tickets: 3,
    status: "Completed",
    bookingDate: "2024-01-10",
  },
  {
    id: "TXN002",
    eventTitle: "Stand-up Comedy Night with Zakir Khan",
    date: "2024-01-20",
    amount: "₹1,600",
    tickets: 2,
    status: "Completed",
    bookingDate: "2024-01-12",
  },
  {
    id: "TXN003",
    eventTitle: "Mumbai Food Festival 2024",
    date: "2024-02-02",
    amount: "₹900",
    tickets: 3,
    status: "Upcoming",
    bookingDate: "2024-01-18",
  },
  {
    id: "TXN004",
    eventTitle: "AR Rahman Live in Concert",
    date: "2024-02-14",
    amount: "₹6,000",
    tickets: 2,
    status: "Upcoming",
    bookingDate: "2024-01-25",
  },
  {
    id: "TXN005",
    eventTitle: "Tech Innovation Summit 2024",
    date: "2024-03-15",
    amount: "₹4,000",
    tickets: 2,
    status: "Upcoming",
    bookingDate: "2024-02-01",
  },
]

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState("mumbai")
  const [currentLocation, setCurrentLocation] = useState({
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    country: "India"
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [user, setUser] = useState<SessionUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [sectionVisibility, setSectionVisibility] = useState({
    showLocationEvents: true,
    showHotEvents: true,
    showPopularEvents: true,
    maintenanceMode: false,
  })

  const cityEvents = events[selectedCity as keyof typeof events] || []
  const shouldShowPopularEvents = cityEvents.length === 0

  // Filter events based on search query and category
  const filteredEvents = useMemo(() => {
    const eventsToFilter = shouldShowPopularEvents ? [...hotEvents, ...popularEvents] : cityEvents

    return eventsToFilter.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || event.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [cityEvents, shouldShowPopularEvents, searchQuery, selectedCategory])

  // Get hot and popular events for current category
  const getHotEvents = () => {
    return hotEvents.filter((event) => selectedCategory === "all" || event.category === selectedCategory)
  }

  const getPopularEvents = () => {
    return popularEvents.filter((event) => selectedCategory === "all" || event.category === selectedCategory)
  }

  const handleRefresh = async () => {
    // Simulate API call to refresh events
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Events refreshed")
  }

  const handleAccountClick = () => {
    if (isLoggedIn) {
      setShowAccountModal(true)
    } else {
      setShowLoginModal(true)
    }
  }

  const handleLoginSuccess = () => {
    // After Google login, the backend will redirect and session will be set.
    // This handler can just close the modal (session check will update state)
    setShowLoginModal(false)
  }

  const handlePhoneSubmit = async (phone: string) => {
    // Save the phone number to your backend
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setShowPhoneModal(false);
        setIsNewUser(false);
      } else {
        alert(data.error || 'Failed to update phone number');
      }
    } catch (err) {
      alert('Failed to update phone number');
    }
  }

  const handlePhoneSkip = () => {
    setShowPhoneModal(false)
    setIsNewUser(false)
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setIsLoggedIn(false)
    setUser(null)
    setShowAccountModal(false)
  }

  const handleLocationSelect = (location: any) => {
    setCurrentLocation(location)
    setSelectedCity(location.id)
  }

  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => {
        setIsLoggedIn(data.loggedIn)
        setUser(data.user)
      })
      .finally(() => setAuthLoading(false))
  }, [])

  useEffect(() => {
    async function fetchSectionVisibility() {
      try {
        const res = await fetch("/api/admin/settings")
        const data = await res.json()
        if (data.success && data.data) {
          setSectionVisibility({
            showLocationEvents: data.data.showLocationEvents,
            showHotEvents: data.data.showHotEvents,
            showPopularEvents: data.data.showPopularEvents,
            maintenanceMode: data.data.maintenanceMode,
          })
        }
      } catch {}
    }
    fetchSectionVisibility()
  }, [])

  const handleEditProfile = async (name: string, phone: string) => {
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const EventCard = ({ event, showBadge = false }: { event: any; showBadge?: boolean }) => (
    <Card className="transition-all duration-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 overflow-hidden h-full flex flex-col">
      <div className="relative overflow-hidden">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

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
        <div className="absolute bottom-3 right-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Badge className="bg-white/90 dark:bg-slate-800/90 text-gray-900 dark:text-white border-0 backdrop-blur-sm">
            <User className="w-3 h-3 mr-1" />
            {event.attendees}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-base sm:text-lg leading-tight">
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
            <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{event.price}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">onwards</span>
          </div>
          <Link href={`/event/${event.id}`} className="flex-shrink-0">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-3 sm:px-4 py-1.5 font-semibold transition-all duration-300 text-xs sm:text-sm">
              View More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  if (sectionVisibility.maintenanceMode) {
    return <MaintenanceMode />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                EventHub
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                onClick={() => setShowLocationModal(true)}
                variant="outline"
                size="sm"
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 hover:bg-white/80 dark:hover:bg-slate-700/80"
              >
                <MapPin className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{currentLocation.name}</span>
              </Button>

              <ThemeToggle />

              <Button
                onClick={handleAccountClick}
                variant="outline"
                size="sm"
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 hover:bg-white/80 dark:hover:bg-slate-700/80"
              >
                <User className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">
                  {authLoading ? (
                    <span className="inline-block w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse align-middle" />
                  ) : isLoggedIn ? (user?.name || user?.email || "Account") : "Login"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Discover
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Extraordinary
              </span>
              <br className="hidden sm:block" />
              <span className="block sm:inline"> Events</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
              Immerse yourself in unforgettable experiences. From world-class concerts to intimate workshops, discover
              premium events curated just for you in{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {currentLocation.name}
              </span>
            </p>

            {/* Premium Search Section */}
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              {/* Mobile Search */}
              <div className="block sm:hidden">
                <MobileSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categories={categories}
                />
              </div>

              {/* Desktop Search Bar */}
              <div className="hidden sm:block relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-6 h-6" />
                      <Input
                        type="text"
                        placeholder="Search events, artists, venues, or experiences..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-14 pr-6 h-16 text-lg bg-transparent border-0 focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>

              {/* Desktop Category Tabs */}
              <div className="hidden sm:block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl blur-xl" />
                <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6">
                  <div className="flex items-center justify-center mb-6">
                    <SlidersHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Explore Categories
                    </span>
                  </div>

                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-3 bg-gray-100/50 dark:bg-slate-700/50 p-3 rounded-xl h-auto">
                      {categories.map((category) => {
                        const IconComponent = category.icon
                        return (
                          <TabsTrigger
                            key={category.value}
                            value={category.value}
                            className="flex flex-col items-center space-y-2 p-4 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 group"
                          >
                            <div
                              className={`w-10 h-10 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                            >
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-center leading-tight">{category.label}</span>
                          </TabsTrigger>
                        )
                      })}
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        {filteredEvents.length === 0 ? (
                          "No events found"
                        ) : (
                          <>
                            {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
                          </>
                        )}
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">
                        {searchQuery && <>for "{searchQuery}"</>}
                        {selectedCategory !== "all" && (
                          <> in {categories.find((c) => c.value === selectedCategory)?.label}</>
                        )}
                      </p>
                    </div>
                    {(searchQuery || selectedCategory !== "all") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedCategory("all")
                        }}
                        className="bg-white/80 dark:bg-slate-800/80 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 w-full sm:w-auto"
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Events Sections */}
          <div className="space-y-12 sm:space-y-16">
            {/* Main Events Section */}
            {sectionVisibility.showLocationEvents && (!shouldShowPopularEvents && cityEvents.length > 4 ? (
              <EnhancedHorizontalCarousel
                events={filteredEvents}
                title={`Events in ${currentLocation.name}`}
                subtitle="Discover what's happening in your city"
                badgeText={`${filteredEvents.length} Events`}
                badgeColor="from-green-500 to-emerald-500"
                showBadge
              />
            ) : (
              <>
                {sectionVisibility.showLocationEvents && (
                  <>
                    {filteredEvents.length > 4 ? (
                      <EnhancedHorizontalCarousel
                        events={filteredEvents}
                        title={`Events in ${currentLocation.name}`}
                        subtitle="Discover what's happening in your city"
                        badgeText={`${filteredEvents.length} Events`}
                        badgeColor="from-green-500 to-emerald-500"
                        showBadge
                      />
                    ) : (
                      <section>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                              Events in {currentLocation.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">Discover what's happening in your city</p>
                          </div>
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-medium w-fit">
                            {filteredEvents.length} Events
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                          {filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} showBadge />
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                )}
              </>
            ))}

            {/* Hot Events Section */}
            {sectionVisibility.showHotEvents && getHotEvents().length > 0 && (
              <EnhancedHorizontalCarousel
                events={getHotEvents()}
                title="🔥 Hot Events"
                subtitle="Trending events everyone's talking about"
                icon={Flame}
                badgeText="Trending Now"
                badgeColor="from-red-500 to-orange-500"
                showBadge
              />
            )}

            {/* Popular Events Section */}
            {sectionVisibility.showPopularEvents && getPopularEvents().length > 0 && (
              <EnhancedHorizontalCarousel
                events={getPopularEvents()}
                title="⭐ Popular Events"
                subtitle="Highly rated experiences loved by our community"
                icon={TrendingUp}
                badgeText="Community Favorites"
                badgeColor="from-purple-500 to-pink-500"
                showBadge
              />
            )}

            {/* No Results State */}
            {filteredEvents.length === 0 && (searchQuery || selectedCategory !== "all") && (
              <section className="text-center py-16 sm:py-20">
                <div className="max-w-md mx-auto px-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">No events found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-sm sm:text-base">
                    We couldn't find any events matching your criteria. Try adjusting your search terms or explore
                    different categories.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Explore All Events
                  </Button>
                </div>
              </section>
            )}
          </div>
        </main>
      </PullToRefresh>

      {/* Location Detector Modal */}
      <LocationDetector
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleLocationSelect}
        currentLocation={currentLocation}
      />

      {/* Google Login Modal */}
      <GoogleLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Phone Number Modal */}
      <PhoneNumberModal
        isOpen={showPhoneModal}
        onClose={handlePhoneSkip}
        onPhoneSubmit={handlePhoneSubmit}
      />

      {/* Optimized Account Modal */}
      <OptimizedAccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        transactions={mockTransactions}
        onLogout={handleLogout}
        user={user}
        onAddPhone={() => {
          setShowAccountModal(false);
          setShowPhoneModal(true);
        }}
        onEditProfile={handleEditProfile}
      />
    </div>
  )
}
