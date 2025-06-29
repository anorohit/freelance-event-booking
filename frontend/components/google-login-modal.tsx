"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface GoogleLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: () => void
}

export function GoogleLoginModal({ isOpen, onClose, onLoginSuccess }: GoogleLoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    // Simulate Google login process
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl border-0 dark:border dark:border-slate-700/50">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to EventHub</CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Sign in to access your account and manage your bookings</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-14 bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </div>
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">or</span>
            </div>
          </div>

          {/* Guest Access */}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full h-12 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl font-medium"
          >
            Continue as Guest
          </Button>

          {/* Terms */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 