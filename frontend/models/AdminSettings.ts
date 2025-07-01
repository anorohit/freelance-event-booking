import mongoose, { Schema, Document } from 'mongoose'

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