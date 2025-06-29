"use client"

import { useState, useEffect, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MapPin, 
  Navigation, 
  Loader2, 
  CheckCircle,
  X,
  Globe,
  Plus
} from "lucide-react"

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
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

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

          // Initialize SearchBox
          if (searchInputRef.current) {
            const searchBoxInstance = new google.maps.places.SearchBox(searchInputRef.current)
            setSearchBox(searchBoxInstance)

            // Listen for search results
            searchBoxInstance.addListener("places_changed", () => {
              const places = searchBoxInstance.getPlaces()
              if (places && places.length > 0) {
                setSearchResults(places)
                
                // Pan to first result
                const place = places[0]
                if (place.geometry && place.geometry.location) {
                  mapInstance.panTo(place.geometry.location)
                  mapInstance.setZoom(12)
                }
              }
            })
          }
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initMap()
  }, [])

  const handleSearch = () => {
    if (searchBox && searchQuery.trim()) {
      searchBox.setBounds(map?.getBounds() || new google.maps.LatLngBounds())
    }
  }

  const handleLocationSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry && place.geometry.location) {
      const location: Location = {
        id: place.place_id || `location-${Date.now()}`,
        name: place.name || "Unknown Location",
        state: place.address_components?.find(comp => 
          comp.types.includes("administrative_area_level_1")
        )?.long_name || "",
        country: place.address_components?.find(comp => 
          comp.types.includes("country")
        )?.long_name || "India",
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      }
      
      setSelectedLocation(location)
      
      // Pan map to selected location
      if (map) {
        map.panTo(place.geometry.location)
        map.setZoom(14)
      }
    }
  }

  const confirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation)
    }
  }

  const clearSelection = () => {
    setSelectedLocation(null)
    setSearchResults([])
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            ref={searchInputRef}
            placeholder="Search for cities, landmarks, or addresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 pr-20 h-12 text-base"
          />
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3"
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col xl:flex-row min-h-0">
        {/* Map */}
        <div className="flex-1 relative min-h-[300px] sm:min-h-[400px] xl:min-h-0">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-800">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
              </div>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full xl:w-80 border-t xl:border-t-0 xl:border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Search className="w-4 h-4 mr-2" />
                Search Results ({searchResults.length})
              </h3>
              <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
                {searchResults.map((place, index) => (
                  <Card
                    key={place.place_id || index}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleLocationSelect(place)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {place.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {place.formatted_address}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

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
          {!searchResults.length && !selectedLocation && (
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