// backend/src/services/eventStatusService.ts
import { Event } from '../models/Event.model'

export const updateEventStatuses = async () => {
  try {
    const events = await Event.find({ status: 'published' })
    
    for (const event of events) {
      await event.updateHotStatus()
      await event.updatePopularStatus()
    }
    
    console.log(`✅ Updated status for ${events.length} events`)
  } catch (error) {
    console.error('❌ Error updating event statuses:', error)
  }
}

// Run this function periodically
export const scheduleEventStatusUpdates = () => {
  // Update every 6 hours
  setInterval(updateEventStatuses, 6 * 60 * 60 * 1000)
  
  // Also run immediately on startup
  updateEventStatuses()
  
  console.log('🕐 Event status update scheduler started')
}