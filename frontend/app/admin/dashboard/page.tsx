"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  Activity, 
  ArrowLeft,
  Calendar as CalendarIcon, 
  Clock, 
  DollarSign, 
  Edit,
  Eye, 
  EyeOff, 
  Filter,
  Flame, 
  Globe, 
  LogOut,
  MapPin, 
  PieChart,
  Plus, 
  Search, 
  Settings, 
  Shield,
  Star, 
  Ticket,
  Trash2, 
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { LocationMap } from "@/components/location-map"
import OlaLocationAutocomplete from "@/components/OlaLocationAutocomplete"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface Ticket {
  name: string
  description: string
  price: number
  available: number
  tags: string[]
}

interface EventForm {
  id: string
  title: string
  location: string
  date: string
  time: string
  duration: string
  ageLimit: string
  status: string
  revenue: string
  description: string
  about: string
  tickets: Ticket[]
  category: string
  image: string
}

interface PopularCity {
  id: string
  name: string
  state: string
  country: string
  coordinates?: { lat: number; lng: number }
}



export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sectionVisibility, setSectionVisibility] = useState({
    showLocationEvents: true,
    showHotEvents: true,
    showPopularEvents: true,
  })
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Mock data for dashboard
  const stats = {
    totalEvents: 156,
    totalRevenue: "₹2,45,000",
    avgRating: 4.6,
  }

  const [events, setEvents] = useState<any[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  // Fetch events from API
  useEffect(() => {
    async function fetchEvents() {
      setLoadingEvents(true)
      try {
        const res = await fetch("/api/admin/events")
        const data = await res.json()
        if (data.success) setEvents(data.data)
        else toast({ title: "Failed to fetch events" })
      } catch (e) {
        toast({ title: "Error fetching events" })
      }
      setLoadingEvents(false)
    }
    fetchEvents()
  }, [])

  const [modalOpen, setModalOpen] = useState(false)
  const [editEvent, setEditEvent] = useState<typeof events[number] | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<EventForm>({
    id: "",
    title: "",
    location: "",
    date: "",
    time: "",
    duration: "",
    ageLimit: "",
    status: "active",
    revenue: "",
    description: "",
    about: "",
    tickets: [
      { name: "Bronze", description: "General seating area", price: 0, available: 0, tags: [] },
      { name: "Silver", description: "Premium seating with better view", price: 0, available: 0, tags: [] },
      { name: "Gold", description: "VIP seating with exclusive amenities", price: 0, available: 0, tags: [] }
    ],
    category: "concert",
    image: ""
  })

  const categories = [
    { id: "concert", name: "Concerts", count: 45, color: "bg-blue-500" },
    { id: "comedy", name: "Comedy", count: 23, color: "bg-yellow-500" },
    { id: "workshop", name: "Workshops", count: 34, color: "bg-pink-500" },
  ]

  const [selectedEvent, setSelectedEvent] = useState<typeof events[number] | null>(null)
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false)

  // Popular Cities Management
  const [popularCities, setPopularCities] = useState<PopularCity[]>([])
  const [cityModalOpen, setCityModalOpen] = useState(false)
  const [mapModalOpen, setMapModalOpen] = useState(false)
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false)
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false)

  // Credentials form state
  const [credentialsForm, setCredentialsForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Forgot password form state
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  })

  const router = useRouter()

  // Add state for date picker open/close
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Add after other useState hooks
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch admin settings on mount
  useEffect(() => {
    async function fetchSettings() {
      setSettingsLoading(true)
      try {
        const res = await fetch("/api/admin/settings")
        const data = await res.json()
        if (data.success && data.data) {
          setSectionVisibility({
            showLocationEvents: data.data.showLocationEvents,
            showHotEvents: data.data.showHotEvents,
            showPopularEvents: data.data.showPopularEvents,
          })
          setMaintenanceMode(data.data.maintenanceMode)
          // Fetch popular cities separately
          const cityRes = await fetch("/api/admin/settings/popular-cities")
          const cityData = await cityRes.json()
          if (cityData.success && cityData.data) {
            setPopularCities(cityData.data)
          }
        } else {
          toast({ title: "Failed to fetch site settings" })
        }
      } catch (e) {
        toast({ title: "Error fetching site settings" })
      }
      setSettingsLoading(false)
    }
    fetchSettings()
  }, [])

  // Handler to update settings
  const updateSettings = async (updates: Partial<typeof sectionVisibility> & { maintenanceMode?: boolean }) => {
    setSettingsLoading(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      if (data.success && data.data) {
        setSectionVisibility({
          showLocationEvents: data.data.showLocationEvents,
          showHotEvents: data.data.showHotEvents,
          showPopularEvents: data.data.showPopularEvents,
        })
        setMaintenanceMode(data.data.maintenanceMode)
        toast({ title: "Settings updated" })
      } else {
        toast({ title: "Failed to update settings" })
      }
    } catch (e) {
      toast({ title: "Error updating settings" })
    }
    setSettingsLoading(false)
  }

  // Handlers
  const openAddModal = () => {
    setForm({ 
      id: "", 
      title: "", 
      location: "", 
      date: "", 
      time: "", 
      duration: "", 
      ageLimit: "", 
      status: "active", 
      revenue: "", 
      description: "", 
      about: "", 
      tickets: [
        { name: "Bronze", description: "General seating area", price: 0, available: 0, tags: [] },
        { name: "Silver", description: "Premium seating with better view", price: 0, available: 0, tags: [] },
        { name: "Gold", description: "VIP seating with exclusive amenities", price: 0, available: 0, tags: [] }
      ], 
      category: "concert", 
      image: "" 
    })
    setEditEvent(null)
    setModalOpen(true)
  }
  const openEditModal = (event: typeof events[number]) => {
    setForm({
      id: event._id,
      title: event.title,
      location: event.location,
      date: event.date,
      time: event.time || "",
      duration: event.duration || "",
      ageLimit: event.ageLimit || "",
      status: event.status,
      revenue: event.revenue || "",
      description: event.description || "",
      about: event.about || "",
      tickets: event.tickets || [
        { name: "Bronze", description: "General seating area", price: 0, available: 0, tags: [] },
        { name: "Silver", description: "Premium seating with better view", price: 0, available: 0, tags: [] },
        { name: "Gold", description: "VIP seating with exclusive amenities", price: 0, available: 0, tags: [] }
      ],
      category: event.category || "concert",
      image: event.image || ""
    })
    setEditEvent(event)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setEditEvent(null)
    setImagePreview(null)
  }
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: (name === 'duration' || name === 'ageLimit') ? Number(value) : value
    }));
  }
  const handleSave = async () => {
    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.date.trim() ||
      !form.time.trim() ||
      !form.duration.toString().trim() ||
      !form.ageLimit.toString().trim() ||
      !form.status.trim() ||
      !form.category.trim() ||
      !form.image.trim() ||
      !form.about.trim() ||
      form.tickets.some(
        t =>
          !t.name.trim() ||
          !t.description.trim() ||
          String(t.price).trim() === "" ||
          String(t.available).trim() === ""
      )
    ) {
      toast({ title: "Please fill all required fields." });
      return;
    }
    const { id, description, ...rest } = form;
    const eventData = {
      ...rest,
      ageLimit: Number(form.ageLimit),
      duration: Number(form.duration),
      tickets: form.tickets.map(t => ({
        ...t,
        price: Number(t.price),
        available: Number(t.available)
      })),
      revenue: `₹${calculateRevenue(form.tickets).toLocaleString()}`
    };
    try {
      if (editEvent) {
        // PATCH
        const res = await fetch(`/api/admin/events/${editEvent._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData)
        })
        const data = await res.json()
        if (data.success) {
          setEvents((prev) => prev.map((ev) => (ev._id === editEvent._id ? data.data : ev)))
          toast({ title: "Event updated successfully!" })
        } else {
          toast({ title: "Failed to update event" })
        }
      } else {
        // POST
        const res = await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData)
        })
        const data = await res.json()
        if (data.success) {
          setEvents((prev) => [data.data, ...prev])
          toast({ title: "Event added successfully!" })
        } else {
          toast({ title: "Failed to add event" })
        }
      }
    } catch (e) {
      toast({ title: "Error saving event" })
    }
    closeModal()
  }
  const confirmDelete = (id: string) => setDeleteId(id)
  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/events/${deleteId}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        setEvents((prev) => prev.filter((ev) => ev._id !== deleteId))
        toast({ title: "Event deleted!" })
      } else {
        toast({ title: "Failed to delete event" })
      }
    } catch (e) {
      toast({ title: "Error deleting event" })
    }
    setDeleteId(null)
  }
  const cancelDelete = () => setDeleteId(null)

  // Ticket management
  const addTicket = () => {
    setForm(prev => ({
      ...prev,
      tickets: [...prev.tickets, { name: "", description: "", price: 0, available: 0, tags: [] }]
    }))
  }

  const removeTicket = (index: number) => {
    setForm(prev => ({
      ...prev,
      tickets: prev.tickets.filter((_, i) => i !== index)
    }))
  }

  const updateTicket = (index: number, field: string, value: string | number) => {
    setForm(prev => ({
      ...prev,
      tickets: prev.tickets.map((ticket, i) =>
        i === index ? { ...ticket, [field]: (field === 'price' || field === 'available') ? Number(value) : value } : ticket
      )
    }))
  }

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file)); // Show preview immediately
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm(prev => ({ ...prev, image: data.url }));
      } else {
        toast({ title: "Image upload failed" });
      }
    } catch (err) {
      toast({ title: "Image upload failed" });
    }
    setImageUploading(false);
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  // Calculate total revenue
  const calculateRevenue = (eventTickets: any[]) => {
    return eventTickets.reduce((total: any, ticket: any) => {
      return total + (ticket.available * ticket.price)
    }, 0)
  }

  // Tag management for tickets
  const addTag = (ticketIndex: number, tag: string) => {
    if (tag.trim() && !form.tickets[ticketIndex].tags.includes(tag.trim())) {
      setForm(prev => ({
        ...prev,
        tickets: prev.tickets.map((ticket, i) => 
          i === ticketIndex 
            ? { ...ticket, tags: [...ticket.tags, tag.trim()] }
            : ticket
        )
      }))
    }
  }

  const removeTag = (ticketIndex: number, tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tickets: prev.tickets.map((ticket, i) => 
        i === ticketIndex 
          ? { ...ticket, tags: ticket.tags.filter(tag => tag !== tagToRemove) }
          : ticket
      )
    }))
  }

  // Calculate event statistics
  const getEventStats = (event: any) => {
    const totalTickets = event.tickets.reduce((sum: any, ticket: any) => sum + ticket.available, 0)
    const totalRevenue = event.tickets.reduce((sum: any, ticket: any) => sum + (ticket.price * ticket.available), 0)
    const avgPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0
    
    return {
      totalTickets,
      totalRevenue,
      avgPrice,
      ticketBreakdown: event.tickets.map((ticket: any) => ({
        name: ticket.name,
        available: ticket.available,
        price: ticket.price,
        revenue: ticket.price * ticket.available,
        percentage: totalTickets > 0 ? ((ticket.available / totalTickets) * 100).toFixed(1) : '0'
      }))
    }
  }

  // Popular Cities Handlers
  const openMapModal = () => {
    setMapModalOpen(true)
  }

  const closeMapModal = () => {
    setMapModalOpen(false)
  }

  const closeCityModal = () => {
    setCityModalOpen(false)
  }

  // Credentials modal handlers
  const openCredentialsModal = () => {
    setCredentialsModalOpen(true)
    setCredentialsForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
  }

  const closeCredentialsModal = () => {
    setCredentialsModalOpen(false)
    setCredentialsForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
  }

  const openForgotPasswordModal = () => {
    setForgotPasswordModalOpen(true)
    setForgotPasswordForm({
      email: "",
      newPassword: "",
      confirmPassword: ""
    })
  }

  const closeForgotPasswordModal = () => {
    setForgotPasswordModalOpen(false)
    setForgotPasswordForm({
      email: "",
      newPassword: "",
      confirmPassword: ""
    })
  }

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentialsForm(prev => ({ ...prev, [name]: value }))
  }

  const handleForgotPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForgotPasswordForm(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateCredentials = () => {
    // Validate form
    if (!credentialsForm.oldPassword) {
      toast({
        title: "Current Password Required",
        description: "Please enter your current password.",
        variant: "destructive",
      })
      return
    }

    if (!credentialsForm.newPassword) {
      toast({
        title: "New Password Required",
        description: "Please enter a new password.",
        variant: "destructive",
      })
      return
    }

    if (credentialsForm.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    if (credentialsForm.newPassword !== credentialsForm.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically make an API call to update credentials
    // For now, we'll just show a success message
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully.",
    })
    
    closeCredentialsModal()
  }

  const handleForgotPassword = () => {
    // Validate form
    if (!forgotPasswordForm.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    if (!forgotPasswordForm.newPassword) {
      toast({
        title: "New Password Required",
        description: "Please enter a new password.",
        variant: "destructive",
      })
      return
    }

    if (forgotPasswordForm.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    if (forgotPasswordForm.newPassword !== forgotPasswordForm.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically make an API call to reset password
    // For now, we'll just show a success message
    toast({
      title: "Password Reset",
      description: "Your password has been reset successfully. Please check your email for confirmation.",
    })
    
    closeForgotPasswordModal()
  }

  // Restore deleteCity for Manage Locations modal
  const deleteCity = async (cityId: string) => {
    const city = popularCities.find(c => c.id === cityId)
    try {
      const res = await fetch(`/api/admin/settings/popular-cities?id=${encodeURIComponent(cityId)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setPopularCities(prev => prev.filter(c => c.id !== cityId))
        toast({
          title: "City Removed",
          description: `${city?.name} has been removed from popular cities.`,
        })
      } else {
        toast({
          title: "Failed to remove city",
          description: data.message || 'City not found',
          variant: "destructive",
        })
      }
    } catch (e) {
      toast({
        title: "Error removing city",
        description: e instanceof Error ? e.message : 'An error occurred',
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Background Pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 dark:opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"
      />

      <div className="relative">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-auto sm:h-16 py-4 sm:py-0 gap-2 sm:gap-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                <div className="flex items-center space-x-2">
                  <Link
                    href="/admin"
                    className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Login</span>
                  </Link>
                </div>
                <div className="hidden sm:block h-6 w-px bg-gray-300 dark:bg-gray-600" />
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">Admin Dashboard</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                <ThemeToggle />
                <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEvents}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Tickets</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Ticket className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRevenue}</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgRating}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                    <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-gray-200 dark:border-slate-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30">
                Overview
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30">
                Events
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Events */}
                <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span>Recent Events</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div key={event._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                              <Clock className="w-4 h-4 mr-1" />
                              {event.date} • {event.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={event.status === "active" ? "default" : "secondary"}>
                              {event.status}
                            </Badge>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                              {event.revenue}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span>Event Categories</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${category.color}`} />
                            <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                          </div>
                          <Badge variant="outline">{category.count} events</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Event Management</CardTitle>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" onClick={openAddModal}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          placeholder="Search events..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-48">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </div>

                    {/* Events Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Event</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Location</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date & Time</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">More</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events
                            .filter((event) =>
                              event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                              (selectedCategory === "all" || event.category === selectedCategory)
                            )
                            .map((event) => (
                              <tr key={event._id} className="border-b border-gray-100 dark:border-slate-800">
                                <td className="py-3 px-4">
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{event.location}</td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                  <div>
                                    <p>{event.date}</p>
                                    <p className="text-sm">{event.time}</p>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge variant={event.status === "active" ? "default" : "secondary"}>
                                    {event.status}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedEvent(event)
                                      setEventDetailsOpen(true)
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => openEditModal(event)}>
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-red-600 dark:text-red-400" onClick={() => confirmDelete(event._id)}>
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Add/Edit Event Modal */}
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editEvent ? "Edit Event" : "Add Event"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
                      
                      <div>
                        <Label htmlFor="title">Event Title *</Label>
                        <Input id="title" name="title" value={form.title} onChange={handleFormChange} required />
                      </div>
                      
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <OlaLocationAutocomplete value={form.location} onChange={val => setForm(prev => ({ ...prev, location: val }))} placeholder="Search location..." />
                      </div>
                      
                      <div>
                        <Label htmlFor="date">Date *</Label>
                        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                          <PopoverTrigger asChild>
                            <Input
                              id="date"
                              name="date"
                              value={form.date}
                              placeholder="Select date"
                              readOnly
                              required
                            />
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={form.date ? new Date(form.date) : undefined}
                              onSelect={(date: Date | undefined) => {
                                if (date) {
                                  setForm(prev => ({ ...prev, date: date.toISOString().slice(0, 10) }));
                                  setDatePickerOpen(false);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label htmlFor="time">Time (24h) *</Label>
                        <Input
                          id="time"
                          name="time"
                          type="text"
                          placeholder="HH:MM"
                          value={form.time}
                          onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
                          required
                          className="w-32"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="duration">Duration (hours) *</Label>
                        <Input
                          id="duration"
                          name="duration"
                          type="number"
                          min={0}
                          placeholder="e.g., 2"
                          value={form.duration}
                          onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))}
                          required
                          className="w-32"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="ageLimit">Age Limit *</Label>
                        <Input
                          id="ageLimit"
                          name="ageLimit"
                          type="number"
                          min={0}
                          placeholder="e.g., 18"
                          value={form.ageLimit}
                          onChange={e => setForm(prev => ({ ...prev, ageLimit: e.target.value }))}
                          required
                          className="w-32"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={form.status} onValueChange={(v) => setForm((prev) => ({ ...prev, status: v }))} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Image Upload */}
                      <div>
                        <Label htmlFor="event-image" className="block mb-2 font-medium">Event Image</Label>
                        {(imagePreview || form.image) ? (
                          <div className="relative">
                            <img
                              src={imagePreview || form.image}
                              alt="Event preview"
                              className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-slate-700"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90"
                              onClick={() => {
                                setForm(prev => ({ ...prev, image: "" }));
                                setImagePreview(null);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                            onClick={() => document.getElementById('event-image')?.click()}
                          >
                            <input
                              type="file"
                              id="event-image"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={imageUploading}
                            />
                            <div className="space-y-2">
                              <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                <Plus className="w-6 h-6 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Upload Event Image</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 10MB</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description & About */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">About This Event *</h3>
                      
                      <div>
                        <Textarea
                          id="about"
                          name="about"
                          value={form.about}
                          onChange={handleFormChange}
                          rows={4}
                          required
                          placeholder="Tell more about the event"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ticket Management */}
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ticket Tiers</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {form.tickets.map((ticket: any, index: any) => (
                        <div key={index} className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900 dark:text-white">{ticket.name} Ticket</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Description</Label>
                              <Input 
                                value={ticket.description} 
                                onChange={(e) => updateTicket(index, 'description', e.target.value)}
                                placeholder="e.g., General seating area"
                              />
                            </div>
                            <div>
                              <Label>Price (₹)</Label>
                              <Input
                                type="number"
                                min={0}
                                value={ticket.price}
                                onChange={(e) => updateTicket(index, 'price', Number(e.target.value))}
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <Label>Available</Label>
                              <Input
                                type="number"
                                min={0}
                                value={ticket.available}
                                onChange={(e) => updateTicket(index, 'available', Number(e.target.value))}
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <Label>Tags</Label>
                              <div className="space-y-2">
                                <div className="flex gap-2 flex-wrap">
                                  {ticket.tags.map((tag: any, tagIndex: any) => (
                                    <Badge 
                                      key={tagIndex} 
                                      variant="secondary" 
                                      className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30"
                                      onClick={() => removeTag(index, tag)}
                                    >
                                      {tag} ×
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Add tag (e.g., General admission)"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault()
                                        const input = e.target as HTMLInputElement
                                        addTag(index, input.value)
                                        input.value = ''
                                      }
                                    }}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                      addTag(index, input.value)
                                      input.value = ''
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Press Enter or click Add to add tags like "General admission", "Standard entry", etc.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={closeModal} type="button">Cancel</Button>
                    <Button onClick={handleSave}>{editEvent ? "Update" : "Add"} Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <Dialog open={!!deleteId} onOpenChange={cancelDelete}>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Delete Event?</DialogTitle>
                  </DialogHeader>
                  <div>Are you sure you want to delete this event? This action cannot be undone.</div>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={cancelDelete} type="button">Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Event Details Modal */}
              <Dialog open={eventDetailsOpen} onOpenChange={setEventDetailsOpen}>
                <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden rounded-xl">
                  <DialogHeader className="sticky top-0 z-10 bg-white dark:bg-slate-900 px-4 sm:px-8 pt-4 pb-2 border-b border-gray-100 dark:border-slate-800 rounded-t-xl">
                    <DialogTitle>Event Details</DialogTitle>
                  </DialogHeader>
                  {selectedEvent && (
                    <div className="space-y-6 px-4 sm:px-8 py-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 60px)' }}>
                      {/* Event Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white break-words">{selectedEvent.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{selectedEvent.location}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Date & Time</p>
                            <p className="text-gray-600 dark:text-gray-400">{selectedEvent.date} • {selectedEvent.time}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Duration</p>
                            <p className="text-gray-600 dark:text-gray-400">{selectedEvent.duration}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Age Limit</p>
                            <p className="text-gray-600 dark:text-gray-400">{selectedEvent.ageLimit}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Status</p>
                            <Badge variant={selectedEvent.status === "active" ? "default" : "secondary"}>
                              {selectedEvent.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Event Statistics */}
                      <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white">Event Statistics</h4>
                        {(() => {
                          const stats = getEventStats(selectedEvent)
                          return (
                            <div className="flex flex-col sm:flex-row gap-4">
                              <div className="flex-1 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg min-w-[140px]">
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Tickets</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalTickets.toLocaleString()}</p>
                              </div>
                              <div className="flex-1 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg min-w-[140px]">
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Revenue</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">₹{stats.totalRevenue.toLocaleString()}</p>
                              </div>
                            </div>
                          )
                        })()}
                      </div>

                      {/* Ticket Breakdown */}
                      <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white">Ticket Breakdown</h4>
                        <div className="flex flex-col gap-3">
                          {(() => {
                            const stats = getEventStats(selectedEvent)
                            return stats.ticketBreakdown.map((ticket: any, index: any) => (
                              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg gap-2">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    index === 0 ? 'bg-yellow-500' : 
                                    index === 1 ? 'bg-gray-400' : 'bg-yellow-600'
                                  }`} />
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{ticket.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {ticket.available.toLocaleString()} tickets ({ticket.percentage}%)
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900 dark:text-white">₹{ticket.price.toLocaleString()}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ₹{ticket.revenue.toLocaleString()} total
                                  </p>
                                </div>
                              </div>
                            ))
                          })()}
                        </div>
                      </div>

                      {/* Event Description */}
                      {selectedEvent.about && (
                        <div className="space-y-2">
                          <h4 className="text-md font-medium text-gray-900 dark:text-white">About This Event</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{selectedEvent.about}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <DialogFooter className="mt-6 px-4 sm:px-8 pb-4">
                    <Button variant="outline" onClick={() => setEventDetailsOpen(false)} className="w-full sm:w-auto">Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Site Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Section Visibility</h3>
                      <div className="space-y-4">
                        {Object.entries(sectionVisibility).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {value ? <Eye className="w-5 h-5 text-green-600" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {value ? "Visible to users" : "Hidden from users"}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={value}
                              onCheckedChange={(checked) => updateSettings({ [key]: checked })}
                              disabled={settingsLoading}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Site Maintenance</h3>
                      <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Flame className={maintenanceMode ? "w-5 h-5 text-yellow-600" : "w-5 h-5 text-gray-400"} />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Maintenance Mode</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {maintenanceMode ? "The site is currently in maintenance mode. Users will see a maintenance page." : "The site is live for users."}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={maintenanceMode}
                          onCheckedChange={(checked) => updateSettings({ maintenanceMode: checked })}
                          disabled={settingsLoading}
                        />
                      </div>
                    </div>

                    {/* Popular Cities Management */}
                    <div className="pt-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Location Settings</h3>
                      <div className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">Popular Locations</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage cities that appear in the popular locations list
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={openMapModal}
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto"
                          >
                            <Globe className="w-5 h-5 mr-2" />
                            Manage Locations
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Admin Credentials</h3>
                      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                              <Shield className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">Password Security</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Update your password and manage account security
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={openCredentialsModal}
                            size="lg"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 w-full sm:w-auto"
                          >
                            <Shield className="w-5 h-5 mr-2" />
                            Update Password
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* City Management Modal - Moved outside tabs */}
          <Dialog open={cityModalOpen} onOpenChange={closeCityModal}>
            <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader className="pb-4">
                <DialogTitle className="flex items-center space-x-3 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <span>Manage Popular Locations</span>
                </DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add, remove, and manage cities that appear in the popular locations list
                </p>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto">
                {/* Cities List */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Current Cities</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {popularCities.length} location{popularCities.length !== 1 ? 's' : ''} in the list
                      </p>
                    </div>
                    <Button
                      onClick={openMapModal}
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add New Location
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {popularCities.map((city) => (
                      <div key={city.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-white text-lg">{city.name}</h5>
                            <p className="text-gray-600 dark:text-gray-400">{city.state}, {city.country}</p>
                            {city.coordinates && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {city.coordinates.lat.toFixed(4)}, {city.coordinates.lng.toFixed(4)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteCity(city.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/30 px-4 w-full sm:w-auto"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {popularCities.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Globe className="w-8 h-8 text-gray-400" />
                        </div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">No locations added yet</h5>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Start by adding your first popular location using the button above.
                        </p>
                        <Button
                          onClick={openMapModal}
                          size="lg"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add First Location
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={closeCityModal} size="lg" className="px-6 w-full sm:w-auto">
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Map Search Modal */}
          <Dialog open={mapModalOpen} onOpenChange={closeMapModal}>
            <DialogContent className="max-w-7xl w-[95vw] h-[90vh] sm:h-[85vh] p-0 overflow-hidden">
              <DialogTitle className="sr-only m-0 p-0">Map Search</DialogTitle>
              <LocationMap 
                onLocationSelect={() => {}}
                onClose={closeMapModal}
              />
            </DialogContent>
          </Dialog>

          {/* Credentials Update Modal */}
          <Dialog open={credentialsModalOpen} onOpenChange={closeCredentialsModal}>
            <DialogContent className="max-w-md w-[95vw] sm:w-full">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span>Update Password</span>
                </DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Update your password for enhanced security
                </p>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <Input
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={credentialsForm.oldPassword}
                    onChange={handleCredentialsChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={credentialsForm.newPassword}
                    onChange={handleCredentialsChange}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={credentialsForm.confirmPassword}
                    onChange={handleCredentialsChange}
                    className="mt-1"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    onClick={openForgotPasswordModal}
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm"
                  >
                    Forgot your password?
                  </Button>
                </div>
              </div>
              
              <DialogFooter className="space-y-2 sm:space-y-0">
                <Button
                  variant="outline"
                  onClick={closeCredentialsModal}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateCredentials}
                  className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Update Password
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Forgot Password Modal */}
          <Dialog open={forgotPasswordModalOpen} onOpenChange={closeForgotPasswordModal}>
            <DialogContent className="max-w-md w-[95vw] sm:w-full">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span>Reset Password</span>
                </DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Enter your email and new password to reset your account
                </p>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="resetEmail">Email Address</Label>
                  <Input
                    id="resetEmail"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={forgotPasswordForm.email}
                    onChange={handleForgotPasswordChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="resetNewPassword">New Password</Label>
                  <Input
                    id="resetNewPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={forgotPasswordForm.newPassword}
                    onChange={handleForgotPasswordChange}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="resetConfirmPassword">Confirm New Password</Label>
                  <Input
                    id="resetConfirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={forgotPasswordForm.confirmPassword}
                    onChange={handleForgotPasswordChange}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <DialogFooter className="space-y-2 sm:space-y-0">
                <Button
                  variant="outline"
                  onClick={closeForgotPasswordModal}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleForgotPassword}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Reset Password
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
} 