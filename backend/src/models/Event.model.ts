import mongoose, { Schema, Document } from 'mongoose'
import { z } from 'zod'

// Define enums - remove EVENT_CITIES
export const EVENT_CATEGORIES = [
  'concert', 'comedy', 'workshop'
] as const

export type EventCategory = typeof EVENT_CATEGORIES[number]

// Zod schema for validation - remove city
export const eventSchemaZod = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  about: z.string().optional(),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  date: z.string(),
  time: z.string(),
  duration: z.string(),
  ageLimit: z.string(),
  category: z.enum(EVENT_CATEGORIES),
  image: z.string().url('Invalid image URL'),
  status: z.enum(['active', 'upcoming', 'completed', 'cancelled']).default('active'),
  tickets: z.array(z.object({
    name: z.enum(['Bronze', 'Silver', 'Gold']),
    description: z.string(),
    price: z.number().min(0),
    available: z.number().min(0),
    tags: z.array(z.string()).default([])
  })).default([]),
  isHot: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  attendees: z.number().default(0)
})

export interface IEvent extends Document {
  title: string
  description: string
  about?: string
  location: string
  category: EventCategory
  date: string
  time: string
  duration: string
  ageLimit: string
  image: string
  status: 'active' | 'upcoming' | 'completed' | 'cancelled'
  tickets: Array<{
    name: 'Bronze' | 'Silver' | 'Gold'
    description: string
    price: number
    available: number
    tags: string[]
  }>
  isHot: boolean
  isPopular: boolean
  attendees: number
  createdAt: Date
  updatedAt: Date
  getRating(): Promise<number>
  getReviewCount(): Promise<number>
  updateHotStatus(): Promise<void>
  updatePopularStatus(): Promise<void>
}

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  about: {
    type: String
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: EVENT_CATEGORIES,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  ageLimit: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'upcoming', 'completed', 'cancelled'],
    default: 'active'
  },
  tickets: [{
    name: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    available: {
      type: Number,
      required: true,
      min: 0
    },
    tags: {
      type: [String],
      default: []
    }
  }],
  isHot: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  attendees: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Add indexes for filtering - remove city index
eventSchema.index({ category: 1, status: 1 })
eventSchema.index({ isHot: 1, status: 1 })
eventSchema.index({ isPopular: 1, status: 1 })

// Methods
eventSchema.methods.getRating = async function() {
  const reviews = await mongoose.model('Review').find({ 
    eventId: this._id,
    isVerified: true
  })
  
  if (reviews.length === 0) return 0
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  return Math.round((totalRating / reviews.length) * 10) / 10
}

eventSchema.methods.getReviewCount = async function() {
  return await mongoose.model('Review').countDocuments({ 
    eventId: this._id,
    isVerified: true
  })
}

eventSchema.methods.updateHotStatus = async function() {
  const now = new Date()
  const daysUntilEvent = Math.ceil((this.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  // Hot criteria (location-based logic is in static methods, not here)
  const recentBookings = await mongoose.model('Booking').countDocuments({
    eventId: this._id,
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  })
  
  const totalBookings = await mongoose.model('Booking').countDocuments({ eventId: this._id })
  
  this.isHot = (
    recentBookings >= 30 ||
    totalBookings >= 150 || 
    (daysUntilEvent <= 30 && totalBookings >= 80)
  )
  
  await this.save()
}

eventSchema.methods.updatePopularStatus = async function() {
  const reviews = await mongoose.model('Review').find({ 
    eventId: this._id,
    isVerified: true 
  })
  
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0
  
  this.isPopular = (
    reviews.length >= 15 && // Lower threshold for location-based
    avgRating >= 4.3
  )
  
  await this.save()
}

// Static methods for getting location-based events
eventSchema.statics.getHotEventsByLocation = async function(location: string, limit: number = 10) {
  const city = location.toLowerCase()
  
  // First try to get hot events from user's location
  let hotEvents = await this.find({
    status: 'published',
    isHot: true,
    location: { $regex: city, $options: 'i' }
  }).limit(limit)
  
  // If not enough events in user's location, get global hot events
  if (hotEvents.length < limit) {
    const globalHotEvents = await this.find({
      status: 'published',
      isHot: true,
      location: { $not: { $regex: city, $options: 'i' } }
    }).limit(limit - hotEvents.length)
    
    hotEvents = [...hotEvents, ...globalHotEvents]
  }
  
  return hotEvents
}

eventSchema.statics.getPopularEventsByLocation = async function(location: string, limit: number = 10) {
  const city = location.toLowerCase()
  
  // First try to get popular events from user's location
  let popularEvents = await this.find({
    status: 'published',
    isPopular: true,
    location: { $regex: city, $options: 'i' }
  }).limit(limit)
  
  // If not enough events in user's location, get global popular events
  if (popularEvents.length < limit) {
    const globalPopularEvents = await this.find({
      status: 'published',
      isPopular: true,
      location: { $not: { $regex: city, $options: 'i' } }
    }).limit(limit - popularEvents.length)
    
    popularEvents = [...popularEvents, ...globalPopularEvents]
  }
  
  return popularEvents
}

// Get events by location with category filter
eventSchema.statics.getEventsByLocation = async function(location: string, category?: string, limit: number = 10) {
  const city = location.toLowerCase()
  const query: any = {
    status: 'published',
    location: { $regex: city, $options: 'i' }
  }
  
  if (category && category !== 'all') {
    query.category = category
  }
  
  return await this.find(query).limit(limit)
}

export const Event = mongoose.model<IEvent>('Event', eventSchema)