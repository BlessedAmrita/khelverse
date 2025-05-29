'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Trophy } from 'lucide-react';

const AthletesList = ({ event, onBack }) => {
  return (
    <div
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
>
    <div className="min-h-screen bg-black/55">
    <Card className="bg-transparent border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
            >
              <ArrowLeft size={16} className='text-khelverse-purple' />
            </Button>
            <div>
              <CardTitle className="text-white text-xl font-bold">{event.name}</CardTitle>
              <p className="text-gray-400 text-sm">
                {event.date} at {event.time}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-athletePurple text-white font-bold hover:bg-athletePurple">
            {event.registeredAthletes.length} Athletes
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {event.registeredAthletes.length === 0 ? (
          <div className="text-center py-8">
            <User size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-gray-400 text-lg font-semibold mb-2">No Athletes Registered Yet</h3>
            <p className="text-gray-500 text-sm">
              Share the event code{' '}
              <span className="text-purple-400 font-mono">{event.uniqueCode}</span> with your
              athletes to get them registered.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {event.registeredAthletes.map((athlete) => (
              <div
                key={athlete.id}
                className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-khelverse-purple rounded-full p-2">
                    <User size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{athlete.name}</h4>
                    <p className="text-gray-400 text-sm">{athlete.sport}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy size={14} className="text-khelverse-purple" />
                  <Badge variant="outline" className="border-purple-500/30 text-khelverse-purple">
                    {athlete.sport}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
    </div>
    </div>
  );
};

export default AthletesList;



