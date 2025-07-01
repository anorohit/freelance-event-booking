"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ArrowLeft,
  CheckCircle,
  Ticket,
  User,
  Crown,
  Award,
  Medal,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Lock,
  Shield,
  Calendar,
  MapPin,
  Clock,
  Star,
} from "lucide-react"
import { PullToRefresh } from "@/components/pull-to-refresh"

const eventData = {
  "1": {
    id: "1",
    title: "Coldplay Music of the Spheres World Tour",
    location: "DY Patil Stadium, Mumbai",
    date: "Jan 19, 2024",
    time: "7:00 PM",
    image: "/placeholder.svg?height=200&width=300",
    ticketTypes: {
      bronze: {
        price: 1500,
        name: "Bronze",
        description: "General seating area",
        features: ["General admission", "Standard entry", "Event merchandise discount"],
        color: "from-amber-500 to-amber-600",
        icon: Medal,
      },
      silver: {
        price: 2500,
        name: "Silver",
        description: "Premium seating with better view",
        features: ["Premium seating", "Priority entry", "Complimentary program", "Merchandise discount"],
        color: "from-gray-400 to-gray-500",
        icon: Award,
      },
      gold: {
        price: 4500,
        name: "Gold",
        description: "VIP seating with exclusive amenities",
        features: [
          "VIP seating",
          "Express entry",
          "Welcome drink",
          "Exclusive merchandise",
          "Meet & greet opportunity",
        ],
        color: "from-yellow-400 to-yellow-500",
        icon: Crown,
      },
    },
  },
  "2": {
    id: "2",
    title: "Stand-up Comedy Night with Zakir Khan",
    location: "NCPA, Mumbai",
    date: "Jan 25, 2024",
    time: "8:00 PM",
    image: "/placeholder.svg?height=200&width=300",
    ticketTypes: {
      bronze: {
        price: 600,
        name: "Bronze",
        description: "Standard seating",
        features: ["Standard seating", "General entry"],
        color: "from-amber-500 to-amber-600",
        icon: Medal,
      },
      silver: {
        price: 800,
        name: "Silver",
        description: "Premium seating",
        features: ["Premium seating", "Priority entry", "Complimentary snacks"],
        color: "from-gray-400 to-gray-500",
        icon: Award,
      },
      gold: {
        price: 1200,
        name: "Gold",
        description: "Front row with meet & greet",
        features: ["Front row seating", "Meet & greet", "Photo opportunity", "Exclusive merchandise"],
        color: "from-yellow-400 to-yellow-500",
        icon: Crown,
      },
    },
  },
}

interface CartItem {
  ticketType: string
  quantity: number
  price: number
  name: string
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const { id } = use(params)
  const [currentStep, setCurrentStep] = useState<"selection" | "details" | "payment" | "confirmation">("selection")
  const [cart, setCart] = useState<CartItem[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const event = eventData[id as keyof typeof eventData] || eventData["1"]

  // Auto-scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

  const updateCart = (ticketType: string, quantity: number) => {
    const ticketInfo = event.ticketTypes[ticketType as keyof typeof event.ticketTypes]

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.ticketType === ticketType)

      if (quantity === 0) {
        return prevCart.filter((item) => item.ticketType !== ticketType)
      }

      if (existingItem) {
        return prevCart.map((item) => (item.ticketType === ticketType ? { ...item, quantity } : item))
      } else {
        return [
          ...prevCart,
          {
            ticketType,
            quantity,
            price: ticketInfo.price,
            name: ticketInfo.name,
          },
        ]
      }
    })
  }

  const getCartQuantity = (ticketType: string) => {
    const item = cart.find((item) => item.ticketType === ticketType)
    return item ? item.quantity : 0
  }

  const totalTickets = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const serviceFee = Math.round(subtotal * 0.12)
  const processingFee = 99
  const total = subtotal + serviceFee + processingFee

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (currentStep === "selection" && cart.length > 0) {
      setCurrentStep("details")
    } else if (currentStep === "details") {
      setCurrentStep("payment")
    } else if (currentStep === "payment") {
      setCurrentStep("confirmation")
    }
  }

  const handlePrevStep = () => {
    if (currentStep === "payment") {
      setCurrentStep("details")
    } else if (currentStep === "details") {
      setCurrentStep("selection")
    }
  }

  const steps = [
    { step: "selection", label: "Select", fullLabel: "Select Tickets", icon: Ticket },
    { step: "details", label: "Details", fullLabel: "Your Details", icon: User },
    { step: "payment", label: "Payment", fullLabel: "Payment", icon: CreditCard },
    { step: "confirmation", label: "Done", fullLabel: "Confirmation", icon: CheckCircle },
  ]

  const currentStepIndex = steps.findIndex((s) => s.step === currentStep)

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Booking data refreshed")
  }

  if (currentStep === "confirmation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-2xl border-0 dark:border dark:border-slate-700">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Booking Confirmed!</h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                Your premium tickets have been secured
              </p>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-4 sm:p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover mr-4"
                />
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-lg">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 flex items-center mt-1 text-xs sm:text-sm">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {event.location}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 flex items-center text-xs sm:text-sm">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {event.date} • {event.time}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {cart.map((item) => {
                  const ticketInfo = event.ticketTypes[item.ticketType as keyof typeof event.ticketTypes]
                  const IconComponent = ticketInfo.icon
                  return (
                    <div
                      key={item.ticketType}
                      className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r ${ticketInfo.color} flex items-center justify-center`}
                        >
                          <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                            {item.name}
                          </span>
                          <span className="text-gray-600 dark:text-gray-300 ml-2 text-sm">×{item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  )
                })}
              </div>

              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Total Paid</span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Download E-Tickets
              </Button>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="outline"
                  className="flex-1 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-slate-700"
                >
                  View Booking Details
                </Button>
                <Link href="/" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-slate-700"
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link
              href={`/event/${event.id}`}
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium text-sm sm:text-base">Back</span>
            </Link>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              <Link
                href="/"
                className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                EventHub
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-14 sm:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Mobile Stepper */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {steps[currentStepIndex].fullLabel}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop Progress Steps */}
          <div className="hidden sm:flex items-center justify-center space-x-4 lg:space-x-8">
            {steps.map(({ step, fullLabel, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center space-x-2 ${
                    currentStep === step
                      ? "text-blue-600 dark:text-blue-400"
                      : index < currentStepIndex
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-gray-400 dark:text-gray-600"
                  }`}
                >
                  <div
                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep === step
                        ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                        : index < currentStepIndex
                          ? "border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                          : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <span className="font-medium text-sm lg:text-base">{fullLabel}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 lg:w-16 h-0.5 mx-4 ${
                      index < currentStepIndex ? "bg-emerald-600 dark:bg-emerald-400" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PullToRefresh onRefresh={handleRefresh}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === "selection" && (
                <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl border-0 dark:border dark:border-slate-700">
                  <CardHeader className="pb-4 sm:pb-6">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-600 dark:text-blue-400" />
                      Select Your Tickets
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      Choose your preferred seating and quantity
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {Object.entries(event.ticketTypes).map(([key, ticket]) => {
                      const IconComponent = ticket.icon
                      const quantity = getCartQuantity(key)

                      return (
                        <div key={key} className="group">
                          <div
                            className={`relative overflow-hidden rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                              quantity > 0
                                ? "border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                                : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                            }`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-r ${ticket.color} opacity-5`} />

                            <div className="relative p-4 sm:p-6">
                              <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                  <div
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r ${ticket.color} flex items-center justify-center shadow-lg`}
                                  >
                                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                      {ticket.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                                      {ticket.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    ₹{ticket.price.toLocaleString()}
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">per ticket</div>
                                </div>
                              </div>

                              <div className="mb-3 sm:mb-4">
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                  {ticket.features.map((feature, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="bg-white/80 dark:bg-slate-700/80 text-gray-700 dark:text-gray-300 text-xs"
                                    >
                                      <Star className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateCart(key, Math.max(0, quantity - 1))}
                                    disabled={quantity === 0}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0 dark:border-gray-600"
                                  >
                                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </Button>
                                  <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white w-6 sm:w-8 text-center">
                                    {quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateCart(key, quantity + 1)}
                                    disabled={quantity >= 8}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0 dark:border-gray-600"
                                  >
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </Button>
                                </div>

                                {quantity > 0 && (
                                  <div className="text-right">
                                    <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                                      ₹{(ticket.price * quantity).toLocaleString()}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                      {quantity} ticket{quantity > 1 ? "s" : ""}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}

              {currentStep === "details" && (
                <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl border-0 dark:border dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-600 dark:text-blue-400" />
                      Your Details
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      Please provide your information for ticket delivery
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-medium">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                            className="h-10 sm:h-12 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            className="h-10 sm:h-12 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-700 dark:text-gray-200 font-medium">
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            required
                            className="h-10 sm:h-12 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-gray-700 dark:text-gray-200 font-medium">
                            City *
                          </Label>
                          <Input
                            id="city"
                            type="text"
                            placeholder="Enter your city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            required
                            className="h-10 sm:h-12 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-gray-700 dark:text-gray-200 font-medium">
                          Address
                        </Label>
                        <Input
                          id="address"
                          type="text"
                          placeholder="Enter your address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="h-10 sm:h-12 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {currentStep === "payment" && (
                <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl border-0 dark:border dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-600 dark:text-blue-400" />
                      Payment Details
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-300 flex items-center text-sm sm:text-base">
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-emerald-500" />
                      Your payment information is secure and encrypted
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardName" className="text-gray-700 dark:text-gray-200 font-medium">
                          Cardholder Name *
                        </Label>
                        <Input
                          id="cardName"
                          type="text"
                          placeholder="Name on card"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange("cardName", e.target.value)}
                          required
                          className="h-10 sm:h-12 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-gray-700 dark:text-gray-200 font-medium">
                          Card Number *
                        </Label>
                        <Input
                          id="cardNumber"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                          required
                          className="h-10 sm:h-12 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate" className="text-gray-700 dark:text-gray-200 font-medium">
                            Expiry Date *
                          </Label>
                          <Input
                            id="expiryDate"
                            type="text"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                            required
                            className="h-10 sm:h-12 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="text-gray-700 dark:text-gray-200 font-medium">
                            CVV *
                          </Label>
                          <Input
                            id="cvv"
                            type="text"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange("cvv", e.target.value)}
                            required
                            className="h-10 sm:h-12 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 text-sm sm:text-base">
                              Secure Payment
                            </h4>
                            <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
                              Your payment is protected by 256-bit SSL encryption
                            </p>
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl border-0 dark:border dark:border-slate-700 sticky top-32 sm:top-36">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Ticket className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Event Info */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{event.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                          <MapPin className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                          {event.location}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                          <Clock className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                          {event.date} • {event.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cart Items */}
                  {cart.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        Selected Tickets
                      </h4>
                      {cart.map((item) => {
                        const ticketInfo = event.ticketTypes[item.ticketType as keyof typeof event.ticketTypes]
                        const IconComponent = ticketInfo.icon
                        return (
                          <div
                            key={item.ticketType}
                            className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                          >
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div
                                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r ${ticketInfo.color} flex items-center justify-center`}
                              >
                                <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                                  {item.name}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-300">
                                  ₹{item.price.toLocaleString()} × {item.quantity}
                                </div>
                              </div>
                            </div>
                            <div className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No tickets selected</p>
                    </div>
                  )}

                  {cart.length > 0 && (
                    <>
                      <Separator />

                      {/* Price Breakdown */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between text-gray-600 dark:text-gray-300 text-sm">
                          <span>Subtotal ({totalTickets} tickets)</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-300 text-sm">
                          <span>Service Fee</span>
                          <span>₹{serviceFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-300 text-sm">
                          <span>Processing Fee</span>
                          <span>₹{processingFee}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                          <span>Total</span>
                          <span className="text-blue-600 dark:text-blue-400">₹{total.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 sm:space-y-3">
                        {currentStep === "selection" && (
                          <Button
                            onClick={handleNextStep}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 text-sm sm:text-lg"
                          >
                            Continue to Details
                          </Button>
                        )}

                        {currentStep === "details" && (
                          <div className="space-y-2">
                            <Button
                              onClick={handleNextStep}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 text-sm sm:text-lg"
                            >
                              Continue to Payment
                            </Button>
                            <Button
                              onClick={handlePrevStep}
                              variant="outline"
                              className="w-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-slate-700"
                            >
                              Back to Tickets
                            </Button>
                          </div>
                        )}

                        {currentStep === "payment" && (
                          <div className="space-y-2">
                            <Button
                              onClick={handleNextStep}
                              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 sm:py-4 text-sm sm:text-lg"
                            >
                              <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              Complete Payment
                            </Button>
                            <Button
                              onClick={handlePrevStep}
                              variant="outline"
                              className="w-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-slate-700"
                            >
                              Back to Details
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </PullToRefresh>
    </div>
  )
}
