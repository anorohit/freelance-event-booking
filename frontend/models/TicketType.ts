import mongoose, { Schema, Document } from 'mongoose'

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