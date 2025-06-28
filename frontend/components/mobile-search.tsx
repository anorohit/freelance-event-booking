"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, SlidersHorizontal, X, Filter } from "lucide-react"

interface MobileSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  categories: Array<{
    value: string
    label: string
    icon: any
    color: string
  }>
}

export function MobileSearch({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}: MobileSearchProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-4">
      {/* Enhanced Mobile Search Bar */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
        <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
          <div className="flex items-center p-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search events, artists, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 text-base bg-transparent border-0 focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="ml-2 p-2 h-10 w-10 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="px-3 pb-3">
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                  >
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                  >
                    {categories.find((c) => c.value === selectedCategory)?.label}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Category Filters */}
      {showFilters && (
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl border-0 dark:border dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Categories</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon
                const isSelected = selectedCategory === category.value

                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-300 ${
                      isSelected
                        ? "bg-white dark:bg-slate-600 shadow-lg scale-105"
                        : "bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-center leading-tight text-gray-900 dark:text-white">
                      {category.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {(searchQuery || selectedCategory !== "all") && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
