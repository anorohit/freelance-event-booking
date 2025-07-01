import mongoose, { Schema, Document } from 'mongoose'
import { z } from 'zod'

export const reviewSchemaZod = z.object({
  userId: z.string(),
  eventId: z.string(),
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  eventAspects: z.object({
    venue: z.number().min(1).max(5),
    organization: z.number().min(1).max(5),
    value: z.number().min(1).max(5),
    experience: z.number().min(1).max(5)
  }).optional(),
  isVerified: z.boolean().default(false)
})

export type ReviewInput = z.infer<typeof reviewSchemaZod>

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId
  eventId: mongoose.Types.ObjectId
  bookingId: mongoose.Types.ObjectId
  rating: number
  eventAspects?: {
    venue: number
    organization: number
    value: number
    experience: number
  }
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
  verifyPurchase(): Promise<boolean>
  getRatingDistribution(): Promise<{ 5: number; 4: number; 3: number; 2: number; 1: number }>
}

const reviewSchema = new Schema<IReview>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  eventAspects: {
    venue: {
      type: Number,
      min: 1,
      max: 5
    },
    organization: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    experience: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

reviewSchema.methods.verifyPurchase = async function() {
  const booking = await mongoose.model('Booking').findOne({
    _id: this.bookingId,
    userId: this.userId,
    eventId: this.eventId,
    status: 'confirmed',
    paymentStatus: 'completed'
  })
  if (booking) {
    this.isVerified = true
    await this.save()
    return true
  }
  return false
}

reviewSchema.methods.getRatingDistribution = async function() {
  const reviews = await mongoose.model('Review').find({ 
    eventId: this.eventId,
    isVerified: true 
  })
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++
  })
  return distribution
}

reviewSchema.statics.getEventRatingDistribution = async function(eventId: string) {
  const reviews = await this.find({ 
    eventId,
    isVerified: true 
  })
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((review: any) => {
    distribution[review.rating as keyof typeof distribution]++
  })
  return distribution
}

reviewSchema.pre('save', async function(next) {
  if (!this.isVerified) {
    await this.verifyPurchase()
  }
  next()
})

reviewSchema.index({ eventId: 1, isVerified: 1 })
reviewSchema.index({ userId: 1, eventId: 1, bookingId: 1 }, { unique: true })

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema) 