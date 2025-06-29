"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, Navigation, Search, Loader2, CheckCircle } from "lucide-react"

interface Location {
  id: string
  name: string
  state: string
  country: string
  coordinates?: { lat: number; lng: number }
}

interface LocationDetectorProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: Location) => void
  currentLocation?: Location
}

const popularCities: Location[] = [
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", country: "India" },
  { id: "delhi", name: "Delhi", state: "Delhi", country: "India" },
  { id: "bangalore", name: "Bangalore", state: "Karnataka", country: "India" },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", country: "India" },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", country: "India" },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", country: "India" },
  { id: "pune", name: "Pune", state: "Maharashtra", country: "India" },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", country: "India" },
]

export function LocationDetector({ isOpen, onClose, onLocationSelect, currentLocation }: LocationDetectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedLocation, setDetectedLocation] = useState<Location | null>(null)
  const [filteredCities, setFilteredCities] = useState<Location[]>(popularCities)

  useEffect(() => {
    if (searchQuery) {
      const filtered = popularCities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCities(filtered)
    } else {
      setFilteredCities(popularCities)
    }
  }, [searchQuery])

  const detectLocation = async () => {
    setIsDetecting(true)
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser")
      }

      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        })
      })

      const { latitude, longitude } = position.coords

      // Reverse geocoding to get location name
      // For now, we'll use a simple mapping based on coordinates
      // In production, you'd use Google Maps Geocoding API or similar
      const detectedLocation = await reverseGeocode(latitude, longitude)
      
      setDetectedLocation(detectedLocation)
    } catch (error) {
      console.error("Location detection failed:", error)
      // Show user-friendly error message
      alert("Unable to detect your location. Please check your browser permissions or select a city manually.")
    } finally {
      setIsDetecting(false)
    }
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<Location> => {
    // This is a simplified reverse geocoding
    // In production, you'd use Google Maps Geocoding API or similar service
    
    // Mock reverse geocoding based on coordinates
    // You can replace this with actual API call
    const mockLocations = [
      { lat: 19.0760, lng: 72.8777, name: "Mumbai", state: "Maharashtra" },
      { lat: 28.7041, lng: 77.1025, name: "Delhi", state: "Delhi" },
      { lat: 12.9716, lng: 77.5946, name: "Bangalore", state: "Karnataka" },
      { lat: 13.0827, lng: 80.2707, name: "Chennai", state: "Tamil Nadu" },
      { lat: 22.5726, lng: 88.3639, name: "Kolkata", state: "West Bengal" },
      { lat: 17.3850, lng: 78.4867, name: "Hyderabad", state: "Telangana" },
      { lat: 18.5204, lng: 73.8567, name: "Pune", state: "Maharashtra" },
      { lat: 23.0225, lng: 72.5714, name: "Ahmedabad", state: "Gujarat" },
    ]

    // Find the closest location
    let closestLocation = mockLocations[0]
    let minDistance = Number.MAX_VALUE

    for (const location of mockLocations) {
      const distance = Math.sqrt(
        Math.pow(lat - location.lat, 2) + Math.pow(lng - location.lng, 2)
      )
      if (distance < minDistance) {
        minDistance = distance
        closestLocation = location
      }
    }

    return {
      id: "detected",
      name: closestLocation.name,
      state: closestLocation.state,
      country: "India",
      coordinates: { lat, lng }
    }
  }

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Choose Location</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Find events near you</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Current Location */}
          {currentLocation && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Current</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{currentLocation.name}, {currentLocation.state}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-600">
                  Active
                </Badge>
              </div>
            </div>
          )}

          {/* Detect Location */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Auto-detect</h3>
              <Button
                onClick={detectLocation}
                disabled={isDetecting}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/30"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Detecting
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    Detect
                  </>
                )}
              </Button>
            </div>
            
            {detectedLocation && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{detectedLocation.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{detectedLocation.state}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleLocationSelect(detectedLocation)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Use
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 dark:text-white">Search Cities</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Type city name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>

          {/* Popular Cities */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 dark:text-white">Popular Cities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCities.map((city) => (
                <Button
                  key={city.id}
                  variant="outline"
                  onClick={() => handleLocationSelect(city)}
                  className="w-full justify-start h-auto p-4 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">{city.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{city.state}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 