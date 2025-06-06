'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Trophy } from 'lucide-react';

const AthletesList = ({ event, onBack }) => {
  const [registeredAthletesData, setRegisteredAthletesData] = useState([]);
  const [isLoadingAthletes, setIsLoadingAthletes] = useState(true);

  useEffect(() => {
    if (!event?.id) {
      setIsLoadingAthletes(false);
      return;
    }

    setIsLoadingAthletes(true);
    const q = query(collection(db, 'registrations'), where('eventId', '==', event.id));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const athletes = snapshot.docs.map((regDoc) => {
          const registration = regDoc.data();
          const details = registration.athleteDetails || {};
          return {
            id: registration.athleteId,
            name: `${details.firstName} ${details.lastName}`,
            sport: details.sport,
            experienceLevel: details.experienceLevel,
          };
        });

        setRegisteredAthletesData(athletes);
        setIsLoadingAthletes(false);
      },
      (error) => {
        console.error('Error fetching registered athletes:', error);
        setIsLoadingAthletes(false);
      }
    );

    return () => unsubscribe();
  }, [event]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')",
      }}
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
                  <ArrowLeft size={16} className="text-khelverse-purple" />
                </Button>
                <div>
                  <CardTitle className="text-white text-xl font-bold">{event.name}</CardTitle>
                  <p className="text-gray-400 text-sm">
                    {event.date} at {event.time}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-athletePurple text-white font-bold hover:bg-athletePurple">
                {registeredAthletesData.length} Athletes
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingAthletes ? (
              <div className="text-center py-8 text-white">Loading registered athletes...</div>
            ) : registeredAthletesData.length === 0 ? (
              <div className="text-center py-8">
                <User size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-gray-400 text-lg font-semibold mb-2">No Athletes Registered Yet</h3>
              </div>
            ) : (
              <div className="space-y-3">
                {registeredAthletesData.map((athlete) => (
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
                        <p className="text-gray-400 text-sm">{athlete.experienceLevel}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy size={14} className="text-khelverse-purple" />
                      <Badge
                        variant="outline"
                        className="border-purple-500/30 text-khelverse-purple"
                      >
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
