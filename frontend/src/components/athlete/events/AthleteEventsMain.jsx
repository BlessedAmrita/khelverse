'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, Trophy, Plus, Info, Check, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import FeatureHero from '@/components/shared/FeatureHero';
import { useSelector } from 'react-redux';
// Firebase Imports
import { db } from '@/firebase/firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

const AthleteEventsMain = () => {
  const user = useSelector((state) => state.user);
  const [atheleteProfile, setAthleteProfile] = useState(null);
  const [athleteCoachId, setAthleteCoachId] = useState(null);
  const [events, setEvents] = useState([]); // Personal events
  const [coachEvents, setCoachEvents] = useState([]); // Coach's events
  const [registeredEvents, setRegisteredEvents] = useState([]); // Event IDs user is registered for
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: undefined,
    location: ''
  });
  const [selectedCoachEventToRegister, setSelectedCoachEventToRegister] = useState(null);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to convert Firestore Timestamp to JavaScript Date
  // It also handles cases where date might already be a JS Date or null/undefined
  const normalizeEventDate = (eventDocData) => {
    return {
      ...eventDocData,
      date: eventDocData.date && typeof eventDocData.date.toDate === 'function'
        ? eventDocData.date.toDate() // Convert Firestore Timestamp to Date
        : eventDocData.date instanceof Date
          ? eventDocData.date // Already a JS Date
          : (eventDocData.date ? new Date(eventDocData.date) : undefined) // Try converting if it's a string or other
    };
  };

  useEffect(() => {
    const fetchAthleteDataAndEvents = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // 1. Fetch current athlete's document to get their coachId
        const athleteDocRef = doc(db, 'users', user.uid);
        const athleteDocSnap = await getDoc(athleteDocRef);
        if (athleteDocSnap.exists()) {
        const data = athleteDocSnap.data();
        setAthleteProfile({...data,uid:user.uid });
      } else {
        console.warn("Athlete profile not found for UID:");
      }

        let currentAthleteCoachId = null;
        if (athleteDocSnap.exists()) {
          currentAthleteCoachId = athleteDocSnap.data().connectedCoachId || null;
          setAthleteCoachId(currentAthleteCoachId);
        } else {
          console.warn("Athlete document not found for UID:", user.uid);
          setAthleteCoachId(null);
        }

        const eventsRef = collection(db, 'events');
        const registrationsRef = collection(db, 'registrations');

        // 2. Fetch personal events created by the current athlete
        const personalEventsQuery = query(eventsRef, where('createdBy', '==', user.uid));
        const personalEventsSnapshot = await getDocs(personalEventsQuery);
        const personalEventsData = personalEventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...normalizeEventDate(doc.data()),
          type: 'personal' // Tag personal events
        }));
        setEvents(personalEventsData);

        // 3. Fetch registrations made by the current athlete
        const registrationsQuery = query(registrationsRef, where('athleteId', '==', user.uid));
        const registrationsSnapshot = await getDocs(registrationsQuery);
        const registeredEventIds = new Set(registrationsSnapshot.docs.map(doc => doc.data().eventId));
        setRegisteredEvents(Array.from(registeredEventIds));

        // 4. If the athlete is connected to a coach, fetch the coach's events
        if (currentAthleteCoachId) {
          const coachEventsQuery = query(eventsRef, where('createdBy', '==', currentAthleteCoachId));
          const coachEventsSnapshot = await getDocs(coachEventsQuery);
          const coachEventsData = coachEventsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...normalizeEventDate(doc.data()),
            type: 'coach' // Tag coach events
          }));
          setCoachEvents(coachEventsData);
        } else {
          setCoachEvents([]);
        }
      } catch (error) {
        console.error("Error fetching athlete data or events:", error);
        toast({
          title: "Error",
          description: "Failed to load events. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAthleteDataAndEvents();
  }, [user?.uid]);

  // Effect to update event status (past/upcoming) based on current date
  useEffect(() => {
    const updateEventStatus = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const mapEventsWithPastStatus = (eventList) => {
        return eventList.map(event => {
          // 'event.date' should already be a JS Date object due to normalizeEventDate
          const eventDate = event.date;
          if (!eventDate || !(eventDate instanceof Date)) {
            console.warn("Event date is not a valid Date object:", event);
            return { ...event, isPast: true }; // Default to past if date is invalid
          }
          const eventDateCopy = new Date(eventDate); // Work on a copy
          eventDateCopy.setHours(0, 0, 0, 0); // Ensure time is set to beginning of day
          return {
            ...event,
            isPast: eventDateCopy < today
          };
        });
      };

      // Apply the status update to current events and coach events
      setEvents(prevEvents => mapEventsWithPastStatus(prevEvents));
      setCoachEvents(prevCoachEvents => mapEventsWithPastStatus(prevCoachEvents));
    };

    // Run this effect whenever events or coachEvents states are updated (e.g., after initial fetch)
    // using their lengths to trigger when data is populated.
    updateEventStatus();
  }, [events.length, coachEvents.length]);

  const allDisplayEvents = [
    ...events,
    ...(athleteCoachId ? coachEvents : [])
  ];

  // NOW, events.date is guaranteed to be a JavaScript Date object, so .toDate() is removed.
  const upcomingEvents = allDisplayEvents.filter(event => !event.isPast).sort((a, b) => a.date.getTime() - b.date.getTime());
  const pastEvents = allDisplayEvents.filter(event => event.isPast).sort((a, b) => b.date.getTime() - a.date.getTime());

  // Helper function to calculate days left until an event
  const getDaysLeft = (eventDate) => { // eventDate here is already a JS Date object
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDateCopy = new Date(eventDate);
    eventDateCopy.setHours(0, 0, 0, 0);
    const diffTime = eventDateCopy.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddPersonalEvent = async () => {
    if (!newEvent.name || !newEvent.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        name: newEvent.name,
        date: newEvent.date, // This is already a JS Date from the calendar
        location: newEvent.location,
        createdBy: user.uid,
        createdAt: new Date(),
      });

      // Update local state: newEvent.date is already a JS Date, so it's consistent.
      setEvents(prev => [...prev, { id: docRef.id, ...newEvent, isPast: false, createdBy: user.uid, type: 'personal' }]);
      setNewEvent({ name: '', date: undefined, location: '' });
      setIsAddEventOpen(false);

      toast({
        title: "Event Added",
        description: `${newEvent.name} has been added to your personal events.`
      });
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateClick = (date) => {
    if (!date) return;

    setSelectedDate(date);

    const eventsOnDate = allDisplayEvents.filter(event => {
      // event.date is now consistently a JS Date object
      const eventDate = event.date;
      const clickedDate = new Date(date);
      return eventDate.toDateString() === clickedDate.toDateString();
    });

    if (eventsOnDate.length > 0) {
      setSelectedDateEvents(eventsOnDate);
      setIsEventDetailsOpen(true);
    } else {
      toast({
        title: "No Events",
        description: "No events scheduled for this date.",
      });
    }
  };

  const handleRegisterForCoachEvent = async () => {
    if (!selectedCoachEventToRegister || !user?.uid || !athleteCoachId) return;

    setIsLoading(true);
    try {
      const existingRegistrationQuery = query(
        collection(db, 'registrations'),
        where('eventId', '==', selectedCoachEventToRegister.id),
        where('athleteId', '==', user.uid)
      );
      const existingRegistrationSnapshot = await getDocs(existingRegistrationQuery);

      if (!existingRegistrationSnapshot.empty) {
        toast({
          title: "Already Registered",
          description: `You are already registered for ${selectedCoachEventToRegister.name}.`,
          variant: "default"
        });
        setIsRegisterDialogOpen(false);
        setIsLoading(false);
        return;
      }

      // Collect athlete details from the user object
      const athleteDetails = {
        firstName: atheleteProfile.firstName || '',
        lastName: atheleteProfile.lastName || '',
        sport: atheleteProfile.sport || '', // Assuming 'sport' and 'experienceLevel' are part of the user object
        experienceLevel: atheleteProfile.experienceLevel || '',
      };
      console.log("user details:", atheleteProfile);
      console.log("Athlete Details:", athleteDetails);
      await addDoc(collection(db, 'registrations'), {
        eventId: selectedCoachEventToRegister.id,
        athleteId: user.uid,
        coachId: athleteCoachId,
        registeredAt: new Date(),
        athleteDetails: athleteDetails, // Include athlete's details here
      });

      setRegisteredEvents(prev => [...prev, selectedCoachEventToRegister.id]);
      setIsRegisterDialogOpen(false);
      toast({
        title: "Registration Successful",
        description: `You have successfully registered for ${selectedCoachEventToRegister.name}.`
      });
    } catch (error) {
      console.error("Error registering for event:", error);
      toast({
        title: "Registration Failed",
        description: "Could not register for the event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // event.date is now a JS Date object, so directly use it.
  const eventDates = allDisplayEvents.map(event => event.date);

  const isConnectedToCoach = !!athleteCoachId;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white">
      <FeatureHero
        bg_url={
          'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741330564/MacBook_Pro_16__-_1_4_zwatot.svg'
        }
        title={'EVENTS'}
      />
      <div
        className="min-h-screen bg-repeat bg-left-top"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
      >
        <div className="min-h-screen bg-black/55">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Upcoming Events Section */}
              <div className="lg:col-span-2">
              <div className="rounded-2xl p-6 mb-8">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div className="flex items-center gap-3">
      <Clock className="text-purple-400" size={24} />
      <h2 className="text-2xl font-bold font-sprintura text-lavender-100">Upcoming Events</h2>
    </div>

    {/* Button remains inside, responsive and never overflows */}
    <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full sm:w-auto bg-apts-purple-dark hover:bg-apts-purple pulse-btn text-white"
        >
          <Plus size={16} className="mr-2" />
          Add Personal Event
        </Button>
      </DialogTrigger>
                      <DialogContent className=" bg-black/90 border-purple-500/30 text-white">
                        <div
                          className=" bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
                        >
                          <div className=" bg-black/90">
                            <DialogHeader>
                              <DialogTitle className="font-sprintura">Add New Personal Event</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Add a new sports event for your personal tracking.
                              </DialogDescription>
                            </DialogHeader>
                            <div className=" mt-2 space-y-4">
                              <div>
                                <Label htmlFor="eventName">Event Name</Label>
                                <Input
                                  id="eventName"
                                  value={newEvent.name}
                                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                  className="mt-1 bg-gray-900 border-gray-800 text-white"
                                  placeholder="Enter event name"
                                />
                              </div>
                              <div>
                                <Label>Event Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal mt-1 bg-gray-900 border-gray-800 text-white hover:bg-gray-800 hover:text-white",
                                        !newEvent.date && "text-gray-400"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {newEvent.date ? format(newEvent.date, "PPP") : "Pick a date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800 text-white">
                                    <Calendar
                                      mode="single"
                                      selected={newEvent.date}
                                      onSelect={(date) => setNewEvent({ ...newEvent, date })}
                                      initialFocus
                                      className="p-3 pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div>
                                <Label htmlFor="eventLocation">Location (Optional)</Label>
                                <Input
                                  id="eventLocation"
                                  value={newEvent.location}
                                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                  className="mt-1 bg-gray-900 border-gray-800 text-white"
                                  placeholder="Enter event location"
                                />
                              </div>
                              <Button onClick={handleAddPersonalEvent} className="w-full bg-apts-purple-dark hover:bg-apts-purple pulse-btn">
                                Add Event
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <Trophy className="mx-auto text-gray-500 mb-4" size={48} />
                      <p className="text-gray-400 text-lg">No upcoming events. {isConnectedToCoach ? "Your coach might add some soon!" : "Add your first event to get started!"}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <Card key={event.id} className="bg-gray-900/50 border-purple-700/30 hover:border-purple-400/50 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-white">{event.name}</h3>
                                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-300">
                                  <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                                    {event.type === 'coach' ? 'Coach Event' : 'Personal Event'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon size={14} />
                                    {format(event.date, "EEEE, MMMM d, yyyy")}
                                  </span>
                                  {event.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin size={14} />
                                      {event.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-purple-400">
                                  {getDaysLeft(event.date)}
                                </div>
                                <div className="text-sm text-gray-400">days left</div>
                                {/* Show registration button if connected to coach AND event is from coach */}
                                {isConnectedToCoach && event.createdBy === athleteCoachId && (
                                  <Dialog open={isRegisterDialogOpen && selectedCoachEventToRegister?.id === event.id} onOpenChange={setIsRegisterDialogOpen}>
                                    <DialogTrigger asChild>
                                      <Button
                                        className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                                        disabled={registeredEvents.includes(event.id)}
                                        onClick={() => setSelectedCoachEventToRegister(event)}
                                      >
                                        {registeredEvents.includes(event.id) ? (
                                          <> <Check size={16} className="mr-1" /> Registered </>
                                        ) : (
                                          <> <UserPlus size={16} className="mr-1" /> Register </>
                                        )}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-black/90 border-purple-500/30 text-white">
                                      <DialogHeader>
                                        <DialogTitle className="font-sprintura">Register for Event</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                          Confirm your registration for:
                                        </DialogDescription>
                                      </DialogHeader>
                                      {selectedCoachEventToRegister && (
                                        <div className="space-y-2">
                                          <p className="text-lg font-bold">{selectedCoachEventToRegister.name}</p>
                                          <p>Date: {format(selectedCoachEventToRegister.date, "MMMM d,PPPP")}</p>
                                          {selectedCoachEventToRegister.location && <p>Location: {selectedCoachEventToRegister.location}</p>}
                                          {selectedCoachEventToRegister.description && (<p>Description: {selectedCoachEventToRegister.description}</p>)}
                                        </div>
                                      )}
                                      <Button onClick={handleRegisterForCoachEvent} className="w-full bg-apts-purple-dark hover:bg-apts-purple pulse-btn">
                                        Confirm Registration
                                      </Button>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Past Events Section */}
                <div className="rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Trophy className="text-gray-400" size={24} />
                    <h2 className="text-2xl font-bold font-sprintura text-lavender-100">Past Events</h2>
                  </div>

                  {pastEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No past events yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {pastEvents.map((event) => (
                        <Card key={event.id} className="bg-gray-800/30 border-gray-600/30">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold text-white mb-1">{event.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <span className="bg-gray-600/20 text-gray-300 px-2 py-1 rounded text-xs">
                                    {event.type === 'coach' ? 'Coach Event' : 'Personal Event'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon size={12} />
                                    {format(event.date, "EEEE, MMMM d, yyyy")}
                                  </span>
                                  {event.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin size={12} />
                                      {event.location}
                                    </span>
                                  )}
                                  {registeredEvents.includes(event.id) && (
                                    <span className="flex items-center gap-1 text-green-500">
                                      <Check size={16} /> Registered
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Event Calendar Section */}
              <div className="lg:col-span-1">
                <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20 sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-lavender-100 flex items-center gap-2 font-sprintura">
                      <CalendarIcon size={20} />
                      Event Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-6">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateClick}
                        onDayClick={handleDateClick}
                        className="rounded-md border-0 text-white w-full pointer-events-auto"
                        classNames={{
                          months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                          month: "space-y-4 w-full flex flex-col",
                          table: "w-full h-full border-collapse space-y-1",
                          head_row: "flex w-full",
                          head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-gray-400 flex-1 text-center",
                          row: "flex w-full mt-2",
                          cell: "relative p-0 text-center text-sm !bg-transparent focus-within:relative focus-within:z-20 flex-1",
                          day: "h-8 w-8 p-0 font-normal text-white hover:bg-purple-600/20 rounded-md transition-colors flex items-center justify-center mx-auto cursor-pointer",
                          day_range_end: "day-range-end",
                          day_selected: "bg-purple-600 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 ",
                          day_today: " bg-apts-purple-dark text-blue-400 font-semibold",
                          day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          day_hidden: "invisible",
                        }}
                        modifiers={{
                          eventDay: (date) => {
                            // eventDates now contains JS Date objects
                            return eventDates.some(eventDate => {
                              return eventDate.toDateString() === date.toDateString();
                            });
                          }
                        }}
                        modifiersStyles={{
                          eventDay: {
                            backgroundColor: '#7c3aed',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '50%'
                          }
                        }}
                        disabled={false}
                      />
                    </div>
                    <div className="px-6 pb-6 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                        <span className="text-gray-300">Event Day</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-apts-purple-dark rounded-full"></div>
                        <span className="text-gray-300">Today</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Event Details Dialog */}
          <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
            <DialogContent className="bg-gray-900/50 border-purple-800/30 text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 ">
                  <Info size={20} />
                  Event Details - {selectedDate && format(selectedDate, "MMMM d,PPPP")}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <Card key={event.id} className="bg-gray-900/60 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">{event.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                            {event.type === 'coach' ? 'Coach Event' : 'Personal Event'}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {event.location}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded text-xs ${event.isPast
                            ? 'bg-red-600/20 text-red-300'
                            : 'bg-green-600/20 text-green-300'
                            }`}>
                            {event.isPast ? 'Completed' : `${getDaysLeft(event.date)} days left`}
                          </span>
                          {registeredEvents.includes(event.id) && (
                            <span className="flex items-center gap-1 text-green-500">
                              <Check size={16} /> Registered
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AthleteEventsMain;