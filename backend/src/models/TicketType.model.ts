import mongoose, { Schema, Document } from 'mongoose'
import { z } from 'zod'

export const ticketTypeSchemaZod = z.object({
  eventId: z.string(),
  name: z.enum(['bronze', 'silver', 'gold']),
  description: z.string(),
  price: z.number().min(0, 'Price must be non-negative'),
  quantityAvailable: z.number().min(0, 'Quantity must be non-negative'),
  features: z.array(z.string()).default([])
})

export type TicketTypeInput = z.infer<typeof ticketTypeSchemaZod>

export interface ITicketType extends Document {
  eventId: mongoose.Types.ObjectId
  name: 'bronze' | 'silver' | 'gold'
  description: string
  price: number
  quantityAvailable: number
  features: string[]
  createdAt: Date
  updatedAt: Date
}

const ticketTypeSchema = new Schema<ITicketType>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: {
    type: String,
    enum: ['bronze', 'silver', 'gold'],
    required: true,
    trim: true
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
  quantityAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  features: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
})

ticketTypeSchema.index({ eventId: 1, name: 1 }, { unique: true })

export const TicketType = mongoose.model<ITicketType>('TicketType', ticketTypeSchema)