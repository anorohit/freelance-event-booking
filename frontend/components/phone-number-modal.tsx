"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Smartphone, CheckCircle } from "lucide-react"

interface PhoneNumberModalProps {
  isOpen: boolean
  onClose: () => void
  onPhoneSubmit: (phone: string) => void
}

export function PhoneNumberModal({ isOpen, onClose, onPhoneSubmit }: PhoneNumberModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValid, setIsValid] = useState(false)

  if (!isOpen) return null

  const validatePhone = (phone: string) => {
    // Basic phone validation - at least 10 digits
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value)
    setIsValid(validatePhone(value))
  }

  const handleSubmit = async () => {
    if (!isValid) return
    
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onPhoneSubmit(phoneNumber)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleSubmit()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl border-0 dark:border dark:border-slate-700/50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Welcome to EventHub!</CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Please add your phone number to complete your profile</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            {phoneNumber && !isValid && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Please enter a valid phone number
              </p>
            )}
            {isValid && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Valid phone number
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating Profile...</span>
                </div>
              ) : (
                "Complete Profile"
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full h-12 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl font-medium"
            >
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            Your phone number helps us send you important updates about your bookings and events.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 