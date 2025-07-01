import React, { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { City as CSCity, ICity } from "country-state-city"

interface City {
  name: string
  stateCode: string
  countryCode: string
  latitude?: string
  longitude?: string
}

interface IndianCityAutocompleteProps {
  value: City | null
  onChange: (city: City | null) => void
  placeholder?: string
  className?: string
}

const allIndianCities: City[] = (CSCity.getCitiesOfCountry("IN") || []).map(city => ({
  name: city.name,
  stateCode: city.stateCode,
  countryCode: city.countryCode,
  latitude: city.latitude ?? undefined,
  longitude: city.longitude ?? undefined,
}))

export default function IndianCityAutocomplete({ value, onChange, placeholder, className }: IndianCityAutocompleteProps) {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<City[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) setInputValue(value.name)
  }, [value])

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([])
      return
    }
    // Filter cities by name (case-insensitive, startsWith)
    const filtered = allIndianCities.filter(city =>
      city.name.toLowerCase().startsWith(inputValue.trim().toLowerCase())
    )
    setSuggestions(filtered.slice(0, 10)) // limit to 10 suggestions
  }, [inputValue])

  // Hide suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={className} ref={containerRef} style={{ position: "relative" }}>
      <Input
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value)
          setShowSuggestions(true)
          onChange(null)
        }}
        placeholder={placeholder || "Search Indian city..."}
        autoComplete="off"
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && inputValue.trim() && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto shadow-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          {suggestions.length > 0 ? (
            suggestions.map((city, idx) => (
              <div
                key={city.name + city.stateCode + idx}
                className="px-4 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
                onClick={() => {
                  setInputValue(city.name)
                  setShowSuggestions(false)
                  onChange(city)
                }}
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-xs text-gray-500 ml-2">{city.stateCode}, India</span>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500">No cities found.</div>
          )}
        </Card>
      )}
    </div>
  )
} 