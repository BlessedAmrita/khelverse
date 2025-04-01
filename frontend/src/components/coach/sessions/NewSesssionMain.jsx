"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePickerDemo } from '@/components/ui/date-picker';  // Custom DatePicker component
import { GoogleCalendarAPI } from '@/services/GoogleCalendarAPI';  // Assuming you have set up the API service

const NewSessionMain = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [athlete, setAthlete] = useState('');
  const [coach, setCoach] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare the event details
      const eventDetails = {
        summary: title,
        start: new Date(`${date}T${time}`),
        end: new Date(`${date}T${parseInt(time.split(':')[0]) + 1}:${time.split(':')[1]}`), // Add 1 hour for duration
        description: `${athlete} with ${coach}`,
        attendees: [
          { email: 'coach@example.com' }, // Replace with coach's email
          { email: 'athlete@example.com' }, // Replace with athlete's email
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
            status: 'success',
          },
        },
      };

      // Call the Google Calendar API to create the event
      const response = await GoogleCalendarAPI.createEvent(eventDetails);
      
      // Handle the response (add session to Firestore or session state)
      if (response.success) {
        // Add the session to your session state or Firestore here
        alert('Session created successfully!');
      }
    } catch (error) {
      console.error('Error creating session: ', error);
      alert('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black py-8 px-4 text-lavender-100/90">
      <h1 className="text-3xl font-bold mb-4">Create New Session</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-5xl mx-auto">
        <Input
          label="Session Title"
          placeholder="Enter session title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="flex space-x-4">
          <DatePickerDemo
            label="Session Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Session Time"
            placeholder="Enter time (e.g., 10:00)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <Input
          label="Athlete Name"
          placeholder="Enter athlete's name"
          value={athlete}
          onChange={(e) => setAthlete(e.target.value)}
          required
        />
        <Input
          label="Coach Name"
          placeholder="Enter coach's name"
          value={coach}
          onChange={(e) => setCoach(e.target.value)}
          required
        />
        <Button type="submit" className="bg-purple-light hover:bg-lavender" disabled={loading}>
          {loading ? 'Creating...' : 'Create Session'}
        </Button>
      </form>
    </div>
  );
};

export default NewSessionMain;
