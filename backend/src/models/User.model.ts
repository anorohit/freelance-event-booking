import mongoose, { Schema, Document } from 'mongoose'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Zod schema for validation
export const userSchemaZod = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  role: z.enum(['user', 'admin']).default('user')
})

export type UserInput = z.infer<typeof userSchemaZod>

export interface IUser extends Document {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  city?: string
  zipCode?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
  isPasswordCorrect(candidatePassword: string): Promise<boolean>
}

// Mongoose schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

// Method to check if password is correct
userSchema.methods.isPasswordCorrect = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

export const User = mongoose.model<IUser>('User', userSchema)