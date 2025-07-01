import mongoose, { Schema, Document } from 'mongoose'

export interface PopularCity extends Document {
  id: string
  name: string
  stateCode: string
  countryCode: string
  latitude?: string
  longitude?: string
  createdAt: Date
  updatedAt: Date
}

// Define a separate schema and model for PopularCity
const PopularCitySchema = new Schema<PopularCity>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  stateCode: { type: String, required: true },
  countryCode: { type: String, required: true },
  latitude: { type: String },
  longitude: { type: String }
}, { timestamps: true });

export const PopularCity = mongoose.models.PopularCity || mongoose.model<PopularCity>('PopularCity', PopularCitySchema);

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