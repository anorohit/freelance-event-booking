"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Download, Eye, Trash2, Settings, CreditCard, Bell, Shield, LogOut, Pencil } from "lucide-react"
import Link from "next/link"
import type { SessionUser } from '@/lib/ironSessionOptions';
import { useState } from "react"

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
  user: SessionUser | null
  onAddPhone: () => void
  onEditProfile: (name: string, phone: string) => void
}

export function OptimizedAccountModal({ isOpen, onClose, transactions, onLogout, user, onAddPhone, onEditProfile }: OptimizedAccountModalProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  const handleEditClick = () => {
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setShowEditModal(true);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
  };

  const handleEditSave = () => {
    if (editName.trim()) {
      onEditProfile(editName, editPhone);
      setShowEditModal(false);
    }
  };

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

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-auto border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Edit Profile
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-8">
                <Button variant="outline" onClick={handleEditCancel}>Cancel</Button>
                <Button onClick={handleEditSave} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Save</Button>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    Profile Information
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                      title="Edit Profile"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.name || ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.email || ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Phone</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{user?.phone || ''}</span>
                      {!user?.phone && (
                        <Button size="xs" variant="outline" className="h-6 px-2 py-0 text-xs" onClick={onAddPhone}>
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Member Since</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) : ''}
                    </p>
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
