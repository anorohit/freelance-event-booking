import mongoose, { Schema, Document } from 'mongoose'
import { z } from 'zod'

export const adminSettingsSchemaZod = z.object({
  showLocationEvents: z.boolean().default(true),
  showHotEvents: z.boolean().default(true),
  showPopularEvents: z.boolean().default(true),
  maintenanceMode: z.boolean().default(false)
})

export type AdminSettingsInput = z.infer<typeof adminSettingsSchemaZod>

export interface IAdminSettings extends Document {
  showLocationEvents: boolean
  showHotEvents: boolean
  showPopularEvents: boolean
  maintenanceMode: boolean
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
  maintenanceMode: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export const AdminSettings = mongoose.models.AdminSettings || mongoose.model<IAdminSettings>('AdminSettings', adminSettingsSchema) 