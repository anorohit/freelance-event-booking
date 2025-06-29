import mongoose, { Schema, Document } from 'mongoose'
import { z } from 'zod'
import { EVENT_CATEGORIES } from './Event.model'

export const adminSettingsSchemaZod = z.object({
  showLocationEvents: z.boolean().default(true),
  showHotEvents: z.boolean().default(true),
  showPopularEvents: z.boolean().default(true),
  enabledCategories: z.array(z.enum(EVENT_CATEGORIES)).default([...EVENT_CATEGORIES]),
  categorySettings: z.array(z.object({
    name: z.enum(EVENT_CATEGORIES),
    enabled: z.boolean().default(true),
    displayName: z.string()
  })).default([])
})

export type AdminSettingsInput = z.infer<typeof adminSettingsSchemaZod>

export interface IAdminSettings extends Document {
  showLocationEvents: boolean
  showHotEvents: boolean
  showPopularEvents: boolean
  enabledCategories: string[]
  categorySettings: Array<{
    name: string
    enabled: boolean
    displayName: string
  }>
  createdAt: Date
  updatedAt: Date
}

const adminSettingsSchema = new Schema<IAdminSettings>({
  showLocationEvents: {
    type: Boolean,
    default: true
  },
  showHotEvents: {
    type: Boolean,
    default: true
  },
  showPopularEvents: {
    type: Boolean,
    default: true
  },
  enabledCategories: [{
    type: String,
    enum: EVENT_CATEGORIES,
    default: EVENT_CATEGORIES
  }],
  categorySettings: [{
    name: {
      type: String,
      enum: EVENT_CATEGORIES,
      required: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    displayName: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

export const AdminSettings = mongoose.model<IAdminSettings>('AdminSettings', adminSettingsSchema)