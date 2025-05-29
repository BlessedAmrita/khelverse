'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const CreateEventForm = ({ onCreateEvent }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.date || !formData.time || !formData.location) {
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      ...formData,
      uniqueCode: generateUniqueCode(),
      registeredAthletes: []
    };

    onCreateEvent(newEvent);

    setFormData({
      name: '',
      date: '',
      time: '',
      location: '',
      description: ''
    });
  };

  return (
    <Card className="bg-transparent border-none">
      <CardHeader>
        <CardTitle className="text-white text-xl font-bold flex items-center font-sprintura">
          <Plus className="mr-2 text-khelverse-purple" size={20} />
          Schedule New Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Event Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-900 border-gray-800 text-white focus:border-purple-500"
                placeholder="Enter event name"
                required
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-gray-300">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-gray-900 border-gray-800 text-white focus:border-purple-500"
                placeholder="Enter location"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-gray-300">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-gray-900 border-gray-800 text-white focus:border-purple-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="time" className="text-gray-300">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="bg-gray-900 border-gray-800 text-white focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-900 border-gray-800 text-white focus:border-purple-500"
              placeholder="Enter event description (optional)"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-apts-purple-dark text-white hover:bg-apts-purple pulse-btn font-semibold py-2"
          >
            Schedule Event
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateEventForm;
