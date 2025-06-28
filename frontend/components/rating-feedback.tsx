"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Send, User, Calendar } from "lucide-react"

interface Rating {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  helpful: number
  eventAspects: {
    venue: number
    organization: number
    value: number
    experience: number
  }
}

interface RatingFeedbackProps {
  eventId: string
  eventTitle: string
  averageRating: number
  totalRatings: number
  ratings: Rating[]
  onSubmitRating: (rating: {
    rating: number
    comment: string
    eventAspects: {
      venue: number
      organization: number
      value: number
      experience: number
    }
  }) => Promise<void>
}

export function RatingFeedback({
  eventId,
  eventTitle,
  averageRating,
  totalRatings,
  ratings,
  onSubmitRating,
}: RatingFeedbackProps) {
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [aspectRatings, setAspectRatings] = useState({
    venue: 0,
    organization: 0,
    value: 0,
    experience: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const StarRating = ({
    rating,
    onRatingChange,
    size = "w-5 h-5",
    interactive = false,
  }: {
    rating: number
    onRatingChange?: (rating: number) => void
    size?: string
    interactive?: boolean
  }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRatingChange?.(star)}
          disabled={!interactive}
          className={`${interactive ? "hover:scale-110 transition-transform duration-200" : ""} ${!interactive ? "cursor-default" : ""}`}
        >
          <Star
            className={`${size} ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
            } ${interactive ? "hover:text-yellow-400" : ""}`}
          />
        </button>
      ))}
    </div>
  )

  const handleSubmitRating = async () => {
    if (userRating === 0) return

    setIsSubmitting(true)
    try {
      await onSubmitRating({
        rating: userRating,
        comment: "",
        eventAspects: aspectRatings,
      })
      setShowRatingForm(false)
      setUserRating(0)
      setAspectRatings({ venue: 0, organization: 0, value: 0, experience: 0 })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]
    ratings.forEach((rating) => {
      distribution[rating.rating - 1]++
    })
    return distribution.reverse()
  }

  const ratingDistribution = getRatingDistribution()

  return (
    <div className="space-y-6">
      {/* Overall Rating Summary */}
      <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl border-0 dark:border dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Ratings & Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</div>
                <StarRating rating={Math.round(averageRating)} />
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{totalRatings} reviews</div>
              </div>
            </div>

            <Button
              onClick={() => setShowRatingForm(!showRatingForm)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Star className="w-4 h-4 mr-2" />
              Rate Event
            </Button>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars, index) => (
              <div key={stars} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">{stars}★</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${totalRatings > 0 ? (ratingDistribution[index] / totalRatings) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{ratingDistribution[index]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rating Form */}
      {showRatingForm && (
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl border-0 dark:border dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Rate Your Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Rating */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-200 font-medium">Overall Rating *</Label>
              <StarRating rating={userRating} onRatingChange={setUserRating} size="w-8 h-8" interactive />
            </div>

            {/* Aspect Ratings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(aspectRatings).map(([aspect, rating]) => (
                <div key={aspect} className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-200 font-medium capitalize">{aspect}</Label>
                  <StarRating
                    rating={rating}
                    onRatingChange={(newRating) => setAspectRatings((prev) => ({ ...prev, [aspect]: newRating }))}
                    size="w-5 h-5"
                    interactive
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRatingForm(false)}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitRating}
                disabled={userRating === 0 || isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {ratings.map((rating) => (
          <Card
            key={rating.id}
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg border-0 dark:border dark:border-slate-700/50"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{rating.userName}</div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-3 h-3" />
                      <span>{rating.date}</span>
                    </div>
                  </div>
                </div>
                <StarRating rating={rating.rating} />
              </div>

              {rating.comment && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{rating.comment}</p>
              )}

              {/* Aspect Ratings */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {Object.entries(rating.eventAspects).map(([aspect, aspectRating]) => (
                  <div key={aspect} className="text-center">
                    <div className="text-xs text-gray-600 dark:text-gray-400 capitalize mb-1">{aspect}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{aspectRating}/5</div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-end">
                <Badge variant="outline" className="text-xs">
                  Verified Purchase
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
