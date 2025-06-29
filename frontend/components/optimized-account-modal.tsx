"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Download, Eye, Trash2, Settings, CreditCard, Bell, Shield, LogOut } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  eventTitle: string
  date: string
  amount: string
  tickets: number
  status: string
  bookingDate: string
}

interface OptimizedAccountModalProps {
  isOpen: boolean
  onClose: () => void
  transactions: Transaction[]
  onLogout: () => void
}

export function OptimizedAccountModal({ isOpen, onClose, transactions, onLogout }: OptimizedAccountModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[90vh] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl border-0 dark:border dark:border-slate-700/50 flex flex-col">
        {/* Fixed Header */}
        <CardHeader className="pb-4 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Account Overview
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Scrollable Content */}
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Profile Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">John Doe</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">john.doe@example.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">+91 98765 43210</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Member Since</p>
                    <p className="font-medium text-gray-900 dark:text-white">January 2024</p>
                  </div>
                </div>
              </div>

              {/* Account Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {transactions.filter((t) => t.status === "Completed").length}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Events Attended</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {transactions.filter((t) => t.status === "Upcoming").length}
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Upcoming Events</div>
                </div>
              </div>

              <Separator />

              {/* Transaction History */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Transaction History</h3>
                  <Badge variant="outline" className="text-xs">
                    {transactions.length} transactions
                  </Badge>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                  {transactions.map((transaction, index) => (
                    <div
                      key={transaction.id}
                      className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 mr-3">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight mb-1">
                            {transaction.eventTitle}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={
                                transaction.status === "Completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs"
                              }
                            >
                              {transaction.status}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">#{transaction.id}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-gray-900 dark:text-white text-sm">{transaction.amount}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.tickets} ticket{transaction.tickets > 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300 mb-3">
                        <div>
                          <span className="font-medium">Event Date:</span>
                          <div>{transaction.date}</div>
                        </div>
                        <div>
                          <span className="font-medium">Booked On:</span>
                          <div>{transaction.bookingDate}</div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-600">
                        <Button variant="outline" size="sm" className="text-xs h-7 flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        {transaction.status === "Completed" && (
                          <Button variant="outline" size="sm" className="text-xs h-7 flex-1">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Account Settings */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start h-12">
                    <Settings className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Edit Profile</div>
                      <div className="text-xs text-gray-500">Update personal information</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-12">
                    <Shield className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Privacy & Security</div>
                      <div className="text-xs text-gray-500">Password & privacy settings</div>
                    </div>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    Download All Tickets
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700 hover:border-red-300"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>

              {/* Support Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Contact our support team for assistance with your account or bookings.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    Email Support
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Help Center
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
