'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

const EventCard = ({ event, onViewAthletes }) => {
  const { toast } = useToast();
  const [registeredCount, setRegisteredCount] = useState(0);

  const copyCode = () => {
    navigator.clipboard.writeText(event.uniqueCode);
    toast({
      title: "Code Copied!",
      description: "Event code has been copied to clipboard.",
    });
  };

  useEffect(() => {
    if (!event?.id) return;

    const q = query(collection(db, 'registrations'), where('eventId', '==', event.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRegisteredCount(snapshot.size); // Using size instead of mapping entire data
    });

    return () => unsubscribe();
  }, [event?.id]);

  return (
    <Card className="bg-gray-900 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-white text-xl font-bold">{event.name}</CardTitle>
          <Badge
            variant="secondary"
            className="bg-athletePurple text-white font-bold hover:bg-athletePurple"
          >
            {registeredCount} Athletes
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-300">
          <Calendar size={16} />
          <span>{event.date} at {event.time}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300">
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>
        {event.description && (
          <p className="text-gray-400 text-sm">{event.description}</p>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">Event Code:</span>
            <code className="bg-gray-800 px-2 py-1 rounded text-purple-400 font-mono">
              {event.uniqueCode}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyCode}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
            >
              <Copy size={14} />
            </Button>
          </div>
          <Button
            onClick={() => onViewAthletes(event)}
            className="bg-apts-purple-dark hover:bg-apts-purple pulse-btn text-white"
            size="sm"
          >
            <Users size={14} className="mr-1" />
            View Athletes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
