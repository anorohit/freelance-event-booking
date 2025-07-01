"use client"

import { useState, useEffect, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Navigation, 
  Loader2, 
  CheckCircle,
  Globe,
  Plus
} from "lucide-react"
import OlaLocationAutocomplete from "@/components/OlaLocationAutocomplete"

interface Location {
  id: string
  name: string
  state: string
  country: string
  coordinates?: { lat: number; lng: number }
}

interface LocationMapProps {
  onLocationSelect: (location: Location) => void
  onClose: () => void
}

export function LocationMap({ onLocationSelect, onClose }: LocationMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [popularCities, setPopularCities] = useState<Location[]>([])
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = async () => {
      setIsLoading(true)
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY", // Replace with your actual API key
          version: "weekly",
          libraries: ["places"]
        })

        const google = await loader.load()
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 20.5937, lng: 78.9629 }, // Center of India
            zoom: 5,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          })

          setMap(mapInstance)
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initMap()
  }, [])

  // Fetch popular cities on mount
  useEffect(() => {
    fetchPopularCities()
  }, [])

  const fetchPopularCities = async () => {
    try {
      const res = await fetch('/api/admin/settings/popular-cities')
      const data = await res.json()
      if (data.success && data.data) {
        setPopularCities(data.data)
      }
    } catch {}
  }

  // New handler for Ola suggestion select
  async function handleOlaSuggestion(s: { description: string; lat?: number; lng?: number }) {
    setSearchQuery(s.description)
    if (s.lat && s.lng) {
      if (map) {
        // Center map to Ola suggestion
        // @ts-ignore
        map.panTo({ lat: s.lat, lng: s.lng })
        map.setZoom(14)
      }
      setSelectedLocation({
        id: `ola-${Date.now()}`,
        name: s.description,
        state: "",
        country: "India",
        coordinates: { lat: s.lat, lng: s.lng },
      })
    }
  }

  const confirmLocation = async () => {
    if (selectedLocation) {
      // Add location to backend
      const newCity = {
        id: selectedLocation.name.toLowerCase().replace(/\s+/g, '-'),
        name: selectedLocation.name,
        state: selectedLocation.state || "",
        country: selectedLocation.country,
        coordinates: selectedLocation.coordinates
      }
      try {
        const res = await fetch('/api/admin/settings/popular-cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCity),
        })
        const data = await res.json()
        if (data.success) {
          await fetchPopularCities()
        }
      } catch {}
      setSelectedLocation(null)
      setSearchQuery("")
    }
  }

  const clearSelection = () => {
    setSelectedLocation(null)
    setSearchQuery("")
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Location</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Search and select a location on the map</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <OlaLocationAutocomplete
          value={searchQuery}
          onChange={setSearchQuery}
          onSelectSuggestion={handleOlaSuggestion}
          placeholder="Search for cities, landmarks, or addresses..."
          className="w-full"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col xl:flex-row min-h-0">
        {/* Map and Added Locations */}
        <div className="flex-1 relative min-h-[300px] sm:min-h-[400px] xl:min-h-0 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-slate-800">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
              </div>
            </div>
          ) : (
            <>
              <div ref={mapRef} className="w-full h-full flex-1" />
              {popularCities && popularCities.length > 0 && (
                <Card className="bg-white/90 dark:bg-slate-800/90 border border-gray-200 dark:border-gray-700 shadow-sm mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500 dark:text-blue-300" />
                      Added Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-40 overflow-y-auto p-2">
                    <ul className="space-y-2">
                      {popularCities.map(city => (
                        <li key={city.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{city.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{city.country}</div>
                            {city.coordinates && (
                              <div className="text-[10px] text-gray-400 dark:text-gray-500">
                                {city.coordinates.lat.toFixed(4)}, {city.coordinates.lng.toFixed(4)}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full xl:w-80 border-t xl:border-t-0 xl:border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Selected Location */}
          {selectedLocation && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Selected Location
              </h3>
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedLocation.name}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedLocation.state}, {selectedLocation.country}
                    </p>
                    {selectedLocation.coordinates && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
                      </p>
                    )}
                    <Badge variant="outline" className="text-green-600 border-green-300 dark:text-green-400 dark:border-green-600">
                      Ready to add
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Instructions */}
          {!selectedLocation && (
            <div className="p-4 flex-1">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Find Your Location
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use the search bar above to find cities, landmarks, or addresses. Click on any result to select it.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {selectedLocation ? (
              <>
                <Button
                  onClick={confirmLocation}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
                <Button
                  onClick={clearSelection}
                  variant="outline"
                  className="w-full"
                >
                  Clear Selection
                </Button>
              </>
            ) : (
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 