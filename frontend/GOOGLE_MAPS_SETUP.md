# Google Maps API Setup

To use the interactive map feature for adding new locations in the admin dashboard, you need to set up Google Maps API.

## Steps to Setup:

1. **Get a Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API
   - Go to "Credentials" and create an API key

2. **Set Environment Variable:**
   Create a `.env.local` file in the root directory and add:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. **Restart Development Server:**
   ```bash
   pnpm dev
   ```

## Features:
- Interactive map interface
- Search for cities, landmarks, and addresses
- Real-time search results
- Click to select locations
- Automatic coordinate extraction
- Responsive design

## Note:
Make sure to restrict your API key to your domain for security. 