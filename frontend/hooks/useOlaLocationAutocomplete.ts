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

export function extractOlaAddressComponents(address_components: any[], fallbackName: string = ""): { name: string, city: string, state: string, country: string, postal_code: string } {
  let city = "";
  let state = "";
  let country = "";
  let postal_code = "";
  let name = fallbackName;
  for (const comp of address_components) {
    if (comp.types?.includes("locality")) city = comp.long_name;
    if (comp.types?.includes("administrative_area_level_1")) state = comp.long_name;
    if (comp.types?.includes("country")) country = comp.long_name;
    if (comp.types?.includes("postal_code")) postal_code = comp.long_name;
    if (comp.types?.includes("postal_town") && !city) city = comp.long_name;
  }
  return { name, city, state, country, postal_code };
} 