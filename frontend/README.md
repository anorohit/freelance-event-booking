# 🎫 Event Booking Platform

A modern, fullstack event booking platform built with Next.js, featuring an intuitive admin dashboard, interactive location management, and seamless user experience.

## ✨ Features

### 🎯 User Features
- **Event Discovery**: Browse and search events by location, category, and date
- **Interactive Location Selection**: Choose your city with an intuitive location detector
- **Event Details**: Comprehensive event information with ticket tiers and pricing
- **Booking System**: Secure ticket booking with multiple payment options
- **Responsive Design**: Optimized for all devices - mobile, tablet, and desktop
- **Dark/Light Mode**: Toggle between themes for better user experience

### 🔧 Admin Dashboard
- **Comprehensive Analytics**: Real-time statistics and revenue tracking
- **Event Management**: Full CRUD operations for events with detailed forms
- **Interactive Location Management**: Google Maps integration for adding popular cities
- **Password Security**: Secure password update with forgot password functionality
- **Site Settings**: Toggle section visibility and maintenance mode
- **Responsive Interface**: Professional admin panel optimized for all screen sizes

### 🗺️ Location Management
- **Google Maps Integration**: Real-time location search and selection
- **Popular Cities**: Manage frequently searched locations
- **Interactive Map**: Click-to-select location functionality
- **Search Results**: Real-time search with formatted addresses

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern component library
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Maps & Location
- **Google Maps JavaScript API** - Interactive maps
- **Google Places API** - Location search and autocomplete
- **@googlemaps/js-api-loader** - Google Maps integration

### UI/UX
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Sonner** - Toast notifications
- **Next Themes** - Dark/light mode support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freelance-event-booking/frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Get Google Maps API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API
   - Go to "Credentials" and create an API key
   - Add the key to your `.env.local` file

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── booking/           # Booking flow pages
│   ├── event/             # Event detail pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── location-map.tsx  # Google Maps integration
│   └── ...               # Other custom components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Additional styles
```

## 🎨 Key Components

### LocationMap Component
Interactive Google Maps integration for location selection:
- Real-time search with Google Places API
- Click-to-select functionality
- Responsive design with sidebar
- Search results with formatted addresses

### Admin Dashboard
Comprehensive admin interface with:
- Event management with CRUD operations
- Interactive location management
- Password security modals
- Site settings and analytics

### Event Management
Full-featured event creation and editing:
- Multi-tier ticket system
- Image upload functionality
- Detailed event information
- Revenue calculation

## 🔐 Security Features

- **Password Validation**: Minimum 8 characters, confirmation matching
- **Form Validation**: Comprehensive input validation
- **Secure Modals**: Protected admin functions
- **API Key Protection**: Environment variable configuration

## 📱 Responsive Design

The platform is fully responsive with:
- **Mobile-first approach**
- **Progressive enhancement**
- **Touch-friendly interfaces**
- **Optimized layouts for all screen sizes**

## 🎯 Admin Features

### Dashboard Overview
- Real-time statistics
- Recent events display
- Revenue tracking
- Quick actions

### Event Management
- Create, edit, and delete events
- Multi-tier ticket system
- Image management
- Status tracking

### Location Settings
- Interactive map interface
- Popular cities management
- Search and add locations
- Coordinate tracking

### Security
- Password update functionality
- Forgot password flow
- Form validation
- Secure modal dialogs

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Environment Variables for Production
Make sure to set up your production environment variables:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Any other required API keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Review the documentation
3. Create a new issue with detailed information

## 🎉 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Google Maps Platform](https://developers.google.com/maps) for location services
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

**Built with ❤️ using Next.js and modern web technologies**
