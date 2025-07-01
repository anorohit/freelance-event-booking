import mongoose, { Schema, Document } from 'mongoose'
import { z } from 'zod'
import { Ticket, ITicket } from './Ticket'

// Zod schema for validation
export const bookingItemSchemaZod = z.object({
  ticketTypeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ticket type ID'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  pricePerTicket: z.number().min(0, 'Price must be non-negative')
})

export const bookingSchemaZod = z.object({
  userId: z.string(),
  eventId: z.string(),
  totalAmount: z.number().min(0, 'Total amount must be non-negative'),
  status: z.enum(['pending', 'confirmed']).default('pending'),
  paymentStatus: z.enum(['pending', 'completed', 'failed']).default('pending'),
  bookingItems: z.array(bookingItemSchemaZod).min(1, 'At least one booking item required'),
  transactionId: z.string().optional()
})

export type BookingInput = z.infer<typeof bookingSchemaZod>

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId
  eventId: mongoose.Types.ObjectId
  totalAmount: number
  status: 'pending' | 'confirmed'
  paymentStatus: 'pending' | 'completed' | 'failed'
  bookingItems: Array<{
    ticketTypeId: mongoose.Types.ObjectId
    quantity: number
    pricePerTicket: number
  }>
  transactionId?: string
  createdAt: Date
  updatedAt: Date
  generateTickets(): Promise<ITicket[]>
  getTransactionDetails(): Promise<any>
}

const bookingSchema = new Schema<IBooking>({
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
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  bookingItems: [{
    ticketTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'TicketType',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    pricePerTicket: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
})

// Pre-save hook to generate transaction ID
bookingSchema.pre('save', function(next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    this.transactionId = `TXN${timestamp.toUpperCase()}${random.toUpperCase()}`
  }
  next()
})

bookingSchema.methods.generateTickets = async function(): Promise<ITicket[]> {
  const tickets: ITicket[] = []
  for (const item of this.bookingItems) {
    for (let i = 0; i < item.quantity; i++) {
      const ticket = new Ticket({
        bookingId: this._id,
        eventId: this.eventId,
        userId: this.userId,
        ticketTypeId: item.ticketTypeId
      })
      await ticket.save()
      tickets.push(ticket)
    }
  }
  return tickets
}

bookingSchema.methods.getTransactionDetails = async function() {
  const event = await mongoose.model('Event').findById(this.eventId)
  const tickets = await mongoose.model('Ticket').find({ bookingId: this._id })
  const ticketTypes = await mongoose.model('TicketType').find({
    _id: { $in: this.bookingItems.map((item: any) => item.ticketTypeId) }
  })
  return {
    transactionId: this.transactionId,
    eventTitle: event?.title,
    eventDate: event?.date,
    status: this.status,
    paymentStatus: this.paymentStatus,
    totalAmount: this.totalAmount,
    totalTickets: tickets.length,
    bookedOn: this.createdAt,
    tickets: tickets.map(ticket => ({
      ticketNumber: ticket.ticketNumber,
      ticketType: ticketTypes.find(tt => tt._id.equals(ticket.ticketTypeId))?.name,
      status: ticket.status
    }))
  }
}

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema) 