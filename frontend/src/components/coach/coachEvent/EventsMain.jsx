'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, addDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Trophy, Calendar, Users } from 'lucide-react';
import CreateEventForm from './CreateEventForm'; 
import EventCard from './EventCard';          
import AthletesList from './AthletesList';     
import { Calendar as CalendarComponent } from '@/components/ui/calendar'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import FeatureHero from '@/components/shared/FeatureHero'; 

const Index = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [totalRegisteredAthletes, setTotalRegisteredAthletes] = useState(0);

  // 1. Authenticate User
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false); // Set loading to false once auth state is known
    });
    return unsubscribeAuth;
  }, []);

  // 2. Fetch Events created by the current coach
  useEffect(() => {
    if (!user || !user.uid) {
      setEvents([]);
      return;
    }

    const q = query(collection(db, 'events'), where('createdBy', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    }, (error) => {
      console.error("Error fetching coach's events:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Calculate total registered athletes for this coach's events
  // This requires fetching all registrations that belong to events created by this coach.
  useEffect(() => {
    if (!user || !user.uid || events.length === 0) {
      setTotalRegisteredAthletes(0);
      return;
    }

    // Get the IDs of events created by this coach
    const coachEventIds = events.map(event => event.id);

    if (coachEventIds.length === 0) {
      setTotalRegisteredAthletes(0);
      return;
    }

    // Query registrations for events created by this coach
    // Note: Firestore 'in' query is limited to 10 items. For more, you'd need multiple queries or a batched read.
    // For simplicity, assuming less than 10 events for now for 'in' query.
    // A more robust solution might be a Cloud Function that aggregates this.
    const qRegistrations = query(collection(db, 'registrations'), where('eventId', 'in', coachEventIds));

    const unsubscribeRegistrations = onSnapshot(qRegistrations, (snapshot) => {
      setTotalRegisteredAthletes(snapshot.size); // Count total documents (registrations)
    }, (error) => {
      console.error("Error fetching total registered athletes for coach's events:", error);
    });

    return () => unsubscribeRegistrations();
  }, [user, events]); // Re-run when user or events change

  const handleCreateEvent = async (newEvent) => {
    if (!user) {
      console.error("User not authenticated to create event.");
      return;
    }
    try {
      await addDoc(collection(db, 'events'), {
        ...newEvent,
        createdBy: user.uid, // Coach's UID
        createdAt: new Date(),
        // No registeredAthletes array here, as registrations are in a separate collection
      });
      console.log('Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleViewAthletes = (event) => {
    setSelectedEvent(event);
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prepare dates for the calendar component
  const eventDates = events.map(event => event.date ? new Date(event.date.seconds * 1000) : null).filter(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-apts-black">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-apts-purple rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-apts-white text-lg font-sprintura">TRACK. TRAIN. TRIUMPH</p>
        </div>
      </div>
    );
  }

  if (selectedEvent) {
    return (
      <div className="min-h-screen khelverse-bg">
        <div className="container mx-auto px-4 py-8">
          <AthletesList event={selectedEvent} onBack={handleBackToEvents} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen khelverse-bg">
      <div className="">
        <FeatureHero title={'Events'} />

        <div
          className="min-h-screen bg-repeat bg-left-top"
          style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
        >
          <div className="min-h-screen bg-black/55 p-8 md:p-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Events */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-khelverse-purple/20 to-black transform transition-all hover:scale-[1.02] p-6">
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 50%, black 100%)', opacity: 0.65, mixBlendMode: 'multiply' }}></div>
                <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-khelverse-purple/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 -ml-5 -mb-5 bg-khelverse-purple/20 rounded-full blur-xl"></div>
                <div className="relative z-20 flex items-center">
                  <Calendar className="text-khelverse-purple mr-3" size={24} />
                  <div>
                    <h3 className="text-white font-semibold font-sprintura">Total Events</h3>
                    <p className="text-2xl font-bold text-khelverse-light-purple">{events.length}</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-khelverse-purple/20 to-black transform transition-all hover:scale-[1.02] p-6">
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 50%, black 100%)', opacity: 0.65, mixBlendMode: 'multiply' }}></div>
                <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-khelverse-purple/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 -ml-5 -mb-5 bg-khelverse-purple/20 rounded-full blur-xl"></div>
                <div className="relative z-20 flex items-center">
                  <Trophy className="text-khelverse-purple mr-3" size={24} />
                  <div>
                    <h3 className="text-white font-semibold font-sprintura">Upcoming Events</h3>
                    <p className="text-2xl font-bold text-khelverse-light-purple">
                      {events.filter(event => {
                        if (!event.date) return false;

                        const eventDate = new Date(event.date);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        return eventDate >= today;
                      }).length}
                    </p>

                  </div>
                </div>
              </div>


              {/* Registered Athletes (across all coach's events) */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-khelverse-purple/20 to-black transform transition-all hover:scale-[1.02] p-6">
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 50%, black 100%)', opacity: 0.65, mixBlendMode: 'multiply' }}></div>
                <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-khelverse-purple/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 -ml-5 -mb-5 bg-khelverse-purple/20 rounded-full blur-xl"></div>
                <div className="relative z-20 flex items-center">
                  <Users className="text-khelverse-purple mr-3" size={24} />
                  <div>
                    <h3 className="text-white font-semibold font-sprintura">Total Registrations</h3>
                    <p className="text-2xl font-bold text-khelverse-light-purple">
                      {totalRegisteredAthletes}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Event Form and Calendar Layout */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-3/4"> {/* Adjusted width for better responsiveness */}
                <CreateEventForm onCreateEvent={handleCreateEvent} />
              </div>
              <div className="w-full md:w-1/4 flex justify-center items-center"> {/* Adjusted width */}
                <Card className="bg-transparent border-none w-full">
                  <CardHeader>
                    <CardTitle className="text-white text-lg font-bold flex items-center font-sprintura">
                      <Calendar className="mr-2 text-khelverse-purple" size={20} />
                      Events Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CalendarComponent
                      mode="multiple"
                      selected={eventDates}
                      className="rounded-md border-gray-700 bg-black text-white"
                      classNames={{
                        months: "flex flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center text-white",
                        caption_label: "text-sm font-medium text-white",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 text-purple-400 hover:bg-purple-900/20",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-gray-400 rounded-md w-8 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "h-8 w-8 text-center text-sm p-0 relative text-white",
                        day: "h-8 w-8 p-0 font-normal text-white hover:bg-purple-900/20 rounded-md",
                        day_range_end: "day-range-end",
                        day_selected: "bg-purple-600 text-white hover:bg-purple-700",
                        day_today: "bg-purple-400 text-white font-bold",
                        day_outside: "text-gray-600 opacity-50",
                        day_disabled: "text-gray-600 opacity-50",
                        day_range_middle: "aria-selected:bg-purple-600 aria-selected:text-white",
                        day_hidden: "invisible",
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Events List */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 font-sprintura">Your Events</h3>
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar size={64} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-gray-400 text-xl font-semibold mb-2">No Events Created Yet</h3>
                  <p className="text-gray-500">Create your first event using the form above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onViewAthletes={handleViewAthletes}
                      // Pass the current user's UID to EventCard for conditional rendering (e.g., edit/delete)
                      currentUserId={user?.uid}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;