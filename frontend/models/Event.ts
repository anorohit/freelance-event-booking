import mongoose, { Schema, Document } from 'mongoose'

// Define enums
export const EVENT_CATEGORIES = [
  'concert', 'comedy', 'workshop'
] as const

export type EventCategory = typeof EVENT_CATEGORIES[number]

export interface IEvent extends Document {
  title: string
  about: string
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
  about: {
    type: String,
    required: true
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

eventSchema.index({ category: 1, status: 1 })
eventSchema.index({ isHot: 1, status: 1 })
eventSchema.index({ isPopular: 1, status: 1 })

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
  const daysUntilEvent = Math.ceil((new Date(this.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
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
    reviews.length >= 15 &&
    avgRating >= 4.3
  )
  await this.save()
}

eventSchema.statics.getHotEventsByLocation = async function(location: string, limit: number = 10) {
  const city = location.toLowerCase()
  let hotEvents = await this.find({
    status: 'published',
    isHot: true,
    location: { $regex: city, $options: 'i' }
  }).limit(limit)
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
  let popularEvents = await this.find({
    status: 'published',
    isPopular: true,
    location: { $regex: city, $options: 'i' }
  }).limit(limit)
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

export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema) 