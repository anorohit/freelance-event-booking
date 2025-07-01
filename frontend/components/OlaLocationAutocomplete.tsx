import { useState } from "react"
import { useOlaLocationAutocomplete, OlaSuggestion as BaseOlaSuggestion } from "@/hooks/useOlaLocationAutocomplete"
import { Input } from "@/components/ui/input"

interface OlaSuggestion extends BaseOlaSuggestion {
  lat?: number
  lng?: number
}

interface Props {
  value: string
  onChange: (val: string) => void
  onSelectSuggestion?: (suggestion: OlaSuggestion) => void
  placeholder?: string
  className?: string
}

const OLA_MAP_API_KEY = process.env.NEXT_PUBLIC_OLA_MAP_API_KEY

export default function OlaLocationAutocomplete({ value, onChange, onSelectSuggestion, placeholder, className }: Props) {
  const [showDropdown, setShowDropdown] = useState(false)
  const { suggestions, loading, fetchSuggestions, clearSuggestions } = useOlaLocationAutocomplete()
  const [detailsLoading, setDetailsLoading] = useState(false)

  async function handleSelect(s: OlaSuggestion) {
    onChange(s.description)
    setShowDropdown(false)
    clearSuggestions()
    if (onSelectSuggestion) {
      setDetailsLoading(true)
      try {
        let lat = s.lat
        let lng = s.lng
        // If geometry.location exists, extract lat/lng from there
        if (!lat && !lng && (s as any).geometry?.location) {
          lat = (s as any).geometry.location.lat
          lng = (s as any).geometry.location.lng
        }
        if (!lat || !lng) {
          // fallback to details API if needed (existing logic)
          const url = `https://api.olamaps.io/places/v1/details?place_id=${encodeURIComponent(s.place_id)}&api_key=${OLA_MAP_API_KEY}`
          const res = await fetch(url)
          const data = await res.json()
          const loc = data?.result?.geometry?.location
          lat = loc?.lat
          lng = loc?.lng
        }
        onSelectSuggestion({ ...s, lat, lng })
      } catch (e) {
        onSelectSuggestion(s)
      }
      setDetailsLoading(false)
    }
  }

  return (
    <div style={{ position: "relative" }} className={className}>
      <Input
        value={value}
        onChange={e => {
          onChange(e.target.value)
          if (e.target.value.length > 2) {
            fetchSuggestions(e.target.value)
            setShowDropdown(true)
          } else {
            clearSuggestions()
            setShowDropdown(false)
          }
        }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        onFocus={() => { if (value.length > 2 && suggestions.length > 0) setShowDropdown(true) }}
        placeholder={placeholder || "Search location..."}
        className={className}
        autoComplete="off"
      />
      {(loading || detailsLoading) && <div className="absolute left-0 mt-1 bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded shadow p-2 text-sm text-slate-900 dark:text-white">Loading...</div>}
      {showDropdown && suggestions.length > 0 && !detailsLoading && (
        <ul className="absolute left-0 right-0 mt-1 bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded shadow z-10 max-h-56 overflow-auto">
          {suggestions.map(s => (
            <li
              key={s.place_id}
              className="px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 text-slate-900 dark:text-white"
              onMouseDown={() => handleSelect(s)}
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 