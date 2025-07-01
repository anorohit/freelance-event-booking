import mongoose, { Schema, Document } from 'mongoose'
import { z } from 'zod'

export const ticketTypeSchemaZod = z.object({
  eventId: z.string(),
  name: z.enum(['Bronze', 'Silver', 'Gold']),
  description: z.string(),
  price: z.number().min(0, 'Price must be non-negative'),
  available: z.number().min(0, 'Quantity must be non-negative'),
  tags: z.array(z.string()).default([])
})

export type TicketTypeInput = z.infer<typeof ticketTypeSchemaZod>

export interface ITicketType extends Document {
  eventId: mongoose.Types.ObjectId
  name: 'Bronze' | 'Silver' | 'Gold'
  description: string
  price: number
  available: number
  tags: string[]
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
    enum: ['Bronze', 'Silver', 'Gold'],
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
  available: {
    type: Number,
    required: true,
    min: 0
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
})

ticketTypeSchema.index({ eventId: 1, name: 1 }, { unique: true })

export const TicketType = mongoose.models.TicketType || mongoose.model<ITicketType>('TicketType', ticketTypeSchema) 