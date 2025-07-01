import mongoose, { Schema, Document } from 'mongoose'

export interface ITicket extends Document {
  bookingId: mongoose.Types.ObjectId
  eventId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  ticketTypeId: mongoose.Types.ObjectId
  ticketNumber: string
  qrCode: string
  status: 'active' | 'used'
  usedAt?: Date
  usedBy?: string
  downloadUrl?: string
  createdAt: Date
  updatedAt: Date
  generateTicketNumber(): string
  generateQRCode(): string
  generateDownloadUrl(): string
}

const ticketSchema = new Schema<ITicket>({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketTypeId: {
    type: Schema.Types.ObjectId,
    ref: 'TicketType',
    required: true
  },
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  qrCode: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'used'],
    default: 'active'
  },
  usedAt: {
    type: Date
  },
  usedBy: {
    type: String
  },
  downloadUrl: {
    type: String
  }
}, {
  timestamps: true
})

// Generate unique ticket number
ticketSchema.methods.generateTicketNumber = function() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `TKT-${timestamp}-${random}`.toUpperCase()
}

// Generate QR code data
ticketSchema.methods.generateQRCode = function() {
  return JSON.stringify({
    ticketId: this._id,
    ticketNumber: this.ticketNumber,
    eventId: this.eventId,
    userId: this.userId
  })
}

// Generate download URL for ticket
ticketSchema.methods.generateDownloadUrl = function() {
  return `/api/tickets/${this._id}/download`
}

// Pre-save hook to generate ticket number, QR code, and download URL
ticketSchema.pre('save', function(next) {
  if (!this.ticketNumber) {
    this.ticketNumber = this.generateTicketNumber()
  }
  if (!this.qrCode) {
    this.qrCode = this.generateQRCode()
  }
  if (!this.downloadUrl) {
    this.downloadUrl = this.generateDownloadUrl()
  }
  next()
})

// Indexes for performance
ticketSchema.index({ ticketNumber: 1 }, { unique: true })
ticketSchema.index({ qrCode: 1 }, { unique: true })
ticketSchema.index({ bookingId: 1 })
ticketSchema.index({ eventId: 1 })
ticketSchema.index({ userId: 1 })

export const Ticket = mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', ticketSchema) 