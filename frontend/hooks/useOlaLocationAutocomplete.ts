import { useState } from "react"

const OLA_MAP_API_KEY = process.env.NEXT_PUBLIC_OLA_MAP_API_KEY

export interface OlaSuggestion {
  description: string
  place_id: string
}

export function useOlaLocationAutocomplete() {
  const [suggestions, setSuggestions] = useState<OlaSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchSuggestions(query: string) {
    if (!OLA_MAP_API_KEY) {
      console.error('Ola Maps API key missing!')
      return
    }
    setLoading(true)
    try {
      const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(query)}&api_key=${OLA_MAP_API_KEY}`
      console.log('Fetching Ola Maps:', url)
      const res = await fetch(url)
      const data = await res.json()
      console.log('Ola Maps suggestions:', data)
      setSuggestions(data.predictions || [])
    } catch (e) {
      console.error('Ola Maps fetch error:', e)
      setSuggestions([])
    }
    setLoading(false)
  }

  function clearSuggestions() {
    setSuggestions([])
  }

  return { suggestions, loading, fetchSuggestions, clearSuggestions }
} 