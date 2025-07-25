import axios from 'axios'; 

const API_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';  

// Function to create an event in Google Calendar
export const GoogleCalendarAPI = {
  createEvent: async (eventDetails) => {
    try {
      const response = await axios.post(API_URL, eventDetails, {
        headers: {
          'Authorization': `Bearer YOUR_GOOGLE_ACCESS_TOKEN`,  
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        return { success: true, data: response.data };
      }
      return { success: false, error: 'Failed to create event' };
    } catch (error) {
      console.error('Error creating event in Google Calendar: ', error);
      return { success: false, error: error.message };
    }
  },
};
