// 'use client';
// import React, {useState, useEffect} from 'react';
// import FeatureHero from '@/components/shared/FeatureHero';
// import EventsCalendar from '@/components/coach/coachEvent/EventCalendar';
// import {
//   FaTrophy,
//   FaCalendarCheck,
//   FaCalendarAlt,
// } from 'react-icons/fa';

// const events1 = [
//   {
//     title: 'Federation Cup Senior Athletics',
//     date: 'April 5, 2025',
//     location: 'Patiala',
//     daysLeft: 13,
//     icon: <FaTrophy />,
//   },
//   {
//     title: 'Indian Grand Prix 3',
//     date: 'April 25, 2025',
//     location: 'Guwahati',
//     daysLeft: 33,
//     icon: <FaTrophy />,
//   },
//   {
//     title: 'Indian Grand Prix 4',
//     date: 'May 12, 2025',
//     location: 'Chennai',
//     daysLeft: 50,
//     icon: <FaTrophy />,
//   },
//   {
//     title: 'National Inter-State Senior Athletics',
//     date: 'June 15, 2025',
//     location: 'Chennai',
//     daysLeft: 84,
//     icon: <FaTrophy />,
//   },
//   {
//     title: 'National Open Athletics Championship',
//     date: 'September 20, 2025',
//     location: 'Lucknow',
//     daysLeft: 181,
//     icon: <FaTrophy />,
//   },
//   {
//     title: 'East Zone Athletics Championship',
//     date: 'July 5, 2025',
//     location: 'Kolkata',
//     daysLeft: 104,
//     icon: <FaTrophy />,
//   },
// ];

// const events2 = [
//   {
//     title: 'Indian Grand Prix 1',
//     date: 'March 10, 2025',
//     location: 'Bangalore',
//     daysLeft: -13,
//     icon: <FaCalendarCheck />,
//   },
//   {
//     title: 'Indian Grand Prix 2',
//     date: 'March 18, 2025',
//     location: 'Thiruvananthapuram',
//     daysLeft: -5,
//     icon: <FaCalendarCheck />,
//   },
//   {
//     title: 'Khelo India Youth Games',
//     date: 'January 10, 2025',
//     location: 'Bhopal',
//     daysLeft: -72,
//     icon: <FaCalendarCheck />,
//   },
//   {
//     title: 'Youth National Athletics Championship',
//     date: 'February 25, 2025',
//     location: 'Bhopal',
//     daysLeft: -26,
//     icon: <FaCalendarCheck />,
//   },
//   {
//     title: 'State Level Marathon',
//     date: 'March 1, 2025',
//     location: 'Jaipur',
//     daysLeft: -22,
//     icon: <FaCalendarCheck />,
//   },
//   {
//     title: 'Winter Athletics Meet',
//     date: 'February 5, 2025',
//     location: 'Shimla',
//     daysLeft: -47,
//     icon: <FaCalendarCheck />,
//   },
// ];

// const events3 = [
//   {
//     title: 'Asian Athletics Championship Trial',
//     date: 'May 10, 2025',
//     location: 'Patiala',
//     daysLeft: 48,
//     icon: <FaCalendarAlt />,
//   },
//   {
//     title: 'Indian Masters Athletics Championship',
//     date: 'May 25, 2025',
//     location: 'Hyderabad',
//     daysLeft: 63,
//     icon: <FaCalendarAlt />,
//   },
//   {
//     title: 'South Asian Games Trial',
//     date: 'August 5, 2025',
//     location: 'Mumbai',
//     daysLeft: 135,
//     icon: <FaCalendarAlt />,
//   },
//   {
//     title: 'All India Inter-University Athletics Meet',
//     date: 'December 1, 2025',
//     location: 'Delhi',
//     daysLeft: 253,
//     icon: <FaCalendarAlt />,
//   },
//   {
//     title: 'West Zone Athletics Championship',
//     date: 'October 10, 2025',
//     location: 'Pune',
//     daysLeft: 201,
//     icon: <FaCalendarAlt />,
//   },
//   {
//     title: 'North East Games Athletics Event',
//     date: 'November 25, 2025',
//     location: 'Guwahati',
//     daysLeft: 247,
//     icon: <FaCalendarAlt />,
//   },
// ];

// function AthleteEventsMain() {
//   //loader
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setIsLoading(false), 800);
//     return () => clearTimeout(timer);
//   }, []);
//   if (isLoading) {
//     return (
//       <div className="min-h-screen w-full flex items-center justify-center bg-apts-black">
//         <div className="text-center">
//           <div className="w-16 h-16 border-t-4 border-apts-purple rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-apts-white text-lg font-sprintura">TRACK. TRAIN. TRIUMPH</p>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className='w-full bg-black text-white'>
//       <FeatureHero
//         bg_url={
//           'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741330564/MacBook_Pro_16__-_1_4_zwatot.svg'
//         }
//         title={'EVENTS'}
//       />
//       {/* Top Section */}
//       <div className='w-full h-[70vh] sm:h-[50vh] flex flex-col sm:flex-row gap-y-3'>
//         {/* Left side - Scrollable List */}
//         <div className='w-full sm:w-[60%] h-full overflow-y-auto p-4 pt-0 bg-black shadow-lg'>
//           <div className='sticky top-0 bg-black py-2'>
//             <h2 className='text-xl font-bold text-center m-3 glass-card py-1 rounded-lg'>
//               REGISTERED EVENTS
//             </h2>
//           </div>
//           <ul>
//             {events1.map((event, index) => (
//               <li
//                 key={index}
//                 className='flex items-center justify-between p-2 mb-2 bg-white/5 rounded-lg shadow-md'
//               >
//                 <div className='flex items-center'>
//                   <div className='p-4 bg-gray-800 rounded-lg'>{event.icon}</div>
//                   <div className='ml-4'>
//                     <h3 className='text-md font-semibold'>{event.title}</h3>
//                     <p className='text-gray-400'>
//                       {event.date} • {event.location}
//                     </p>
//                   </div>
//                 </div>
//                 <div className='bg-purple-dark text-lavender-100  font-bold text-sm px-4 py-1 rounded-full'>
//                   {event.daysLeft} DAYS
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Right Calendar Section */}
//         <div className='w-full sm:w-[40%] h-full bg-black flex items-center justify-center'>
//            <div className='w-[90%]'>
//              <EventsCalendar events={[...events1, ...events2, ...events3]} />
//           </div>
//         </div>

//       </div>

//       {/* Bottom Section */}
//       <div className='w-full h-[70vh] sm:h-[50vh] flex flex-col sm:flex-row justify-between mt-3 mb-5 gap-y-3'>
//         <div className='w-full sm:w-[43%] h-full overflow-y-auto p-4 pt-0 bg-black shadow-lg'>
//           <div className='sticky top-0 bg-black py-2'>
//             <h2 className='text-xl font-bold text-center mb-1 glass-card py-1 rounded-lg'>
//               PAST EVENTS
//             </h2>
//           </div>
//           <ul>
//             {events2.map((event, index) => (
//               <li
//                 key={index}
//                 className='flex items-center justify-between p-2 mb-2 bg-white/5 rounded-lg shadow-md'
//               >
//                 <div className='flex items-center'>
//                   <div className='p-4 bg-gray-800 rounded-lg'>{event.icon}</div>
//                   <div className='ml-4'>
//                     <h3 className='text-md font-semibold'>{event.title}</h3>
//                     <p className='text-gray-400'>
//                       {event.date} • {event.location}
//                     </p>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className='w-full sm:w-[55%] h-full overflow-y-auto p-4 pt-0 bg-black shadow-lg'>
//           <div className='sticky top-0 bg-black py-2'>
//             <h2 className='text-xl font-bold text-center mb-1 glass-card py-1 rounded-lg'>
//               OTHER UPCOMING EVENTS
//             </h2>
//           </div>
//           <ul>
//             {events3.map((event, index) => (
//               <li
//                 key={index}
//                 className='flex items-center justify-between p-2 mb-2 bg-white/5 rounded-lg shadow-md'
//               >
//                 <div className='flex items-center'>
//                   <div className='p-4 bg-gray-800 rounded-lg'>{event.icon}</div>
//                   <div className='ml-4'>
//                     <h3 className='text-md font-semibold'>{event.title}</h3>
//                     <p className='text-gray-400'>
//                       {event.date} • {event.location}
//                     </p>
//                   </div>
//                 </div>
//                 <div className='flex gap-3'>
//                 <div className='bg-purple-dark text-lavender-100  font-bold text-sm px-4 py-1 rounded-full'>
//                   {event.daysLeft} DAYS
//                 </div>
//                 <div className='bg-purple-light text-black  font-bold text-sm px-4 py-1 rounded-full'>
//                   Register
//                 </div>

//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AthleteEventsMain;


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
import { CalendarIcon, Clock, MapPin, Trophy, Plus, Info, Check} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import FeatureHero from '@/components/shared/FeatureHero';

const AthleteEventsMain = () => {

  const [events, setEvents] = useState([
    {
      id: '1',
      name: 'National Athletics Championship',
      code: 'NAC2024',
      date: new Date('2024-06-15'),
      location: 'Delhi Sports Complex',
      isPast: true
    },
    {
      id: '2',
      name: 'State Swimming Meet',
      code: 'SSM2024',
      date: new Date('2024-04-20'),
      location: 'Aquatic Center',
      isPast: true
    }
  ]);

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    code: '',
    date: undefined,
    location: ''
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  // Auto-update past events based on current date
  useEffect(() => {
    const updateEventStatus = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setEvents(prevEvents =>
        prevEvents.map(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return {
            ...event,
            isPast: eventDate < today
          };
        })
      );
    };

    updateEventStatus();
    // Update every day at midnight
    const interval = setInterval(updateEventStatus, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const upcomingEvents = events.filter(event => !event.isPast);
  const pastEvents = events.filter(event => event.isPast);

  const getDaysLeft = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDateCopy = new Date(eventDate);
    eventDateCopy.setHours(0, 0, 0, 0);
    const diffTime = eventDateCopy.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddEvent = () => {
    if (!newEvent.name || !newEvent.code || !newEvent.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(newEvent.date);
    eventDate.setHours(0, 0, 0, 0);

    const event = {
      id: Date.now().toString(),
      name: newEvent.name,
      code: newEvent.code,
      date: newEvent.date,
      location: newEvent.location,
      isPast: eventDate < today
    };

    setEvents([...events, event]);
    setNewEvent({ name: '', code: '', date: undefined, location: '' });
    setIsAddEventOpen(false);

    toast({
      title: "Event Added",
      description: `${newEvent.name} has been added to your events.`
    });
  };

  const handleDateClick = (date) => {
    console.log('Date clicked:', date);
    if (!date) return;

    setSelectedDate(date);

    // Find events on the selected date
    const eventsOnDate = events.filter(event => {
      const eventDate = new Date(event.date);
      const clickedDate = new Date(date);
      // Compare dates without time
      return eventDate.toDateString() === clickedDate.toDateString();
    });

    console.log('Events on date:', eventsOnDate);

    if (eventsOnDate.length > 0) {
      setSelectedDateEvents(eventsOnDate);
      setIsEventDetailsOpen(true);
    } else {
      // Show a message if no events on this date
      toast({
        title: "No Events",
        description: "No events scheduled for this date.",
      });
    }
  };

  const eventDates = events.map(event => event.date);
    //loader
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
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
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
  >
      <div className="min-h-screen bg-black/55">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Upcoming Events Section */}
          <div className="lg:col-span-2">
            <div className="  rounded-2xl p-6 mb-8 ">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="text-purple-400" size={24} />
                  <h2 className="text-2xl font-bold font-sprintura text-lavender-100">Upcoming Events</h2>
                </div>
                <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-apts-purple-dark  hover:bg-apts-purple pulse-btn text-white">
                      <Plus size={16} className="mr-2" />
                      Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className=" bg-black/90 border-purple-500/30 text-white">
                  <div
    className=" bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
  >
      <div className=" bg-black/90">
                    <DialogHeader>
                      <DialogTitle className="font-sprintura">Add New Event</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Register for a new sports event
                      </DialogDescription>
                    </DialogHeader>
                    <div className=" mt-2 space-y-4">
                      <div>
                        <Label htmlFor="eventName">Event Name</Label>
                        <Input
                          id="eventName"
                          value={newEvent.name}
                          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                          className="mt-1 bg-gray-900 border-gray-800  text-white"
                          placeholder="Enter event name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventCode">Event Code</Label>
                        <Input
                          id="eventCode"
                          value={newEvent.code}
                          onChange={(e) => setNewEvent({ ...newEvent, code: e.target.value })}
                          className="mt-1 bg-gray-900 border-gray-800 text-white"
                          placeholder="Enter event code"
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
                      <Button onClick={handleAddEvent} className="w-full bg-apts-purple-dark  hover:bg-apts-purple pulse-btn">
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
                  <p className="text-gray-400 text-lg">No upcoming events. Add your first event to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="bg-gray-900/50 border-purple-700/30 hover:border-purple-400/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-white">{event.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-300">
                              <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                                {event.code}
                              </span>
                              <span className="flex items-center gap-1">
                                <CalendarIcon size={14} />
                                {format(event.date, "MMMM d, yyyy")}
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Past Events Section */}
            <div className=" rounded-2xl p-6 ">
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
                                {event.code}
                              </span>
                              <span className="flex items-center gap-1">
                                <CalendarIcon size={12} />
                                {format(event.date, "MMMM d, yyyy")}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {event.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-green-500 text-sm">
                            <Check size={16} />
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
                {/* <CardDescription className="text-gray-400">
                  Click on dates with events to view details
                </CardDescription> */}
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
                        return eventDates.some(eventDate => {
                          const event = new Date(eventDate);
                          return event.toDateString() === date.toDateString();
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
              Event Details - {selectedDate && format(selectedDate, "MMMM d, yyyy")}
            </DialogTitle>
            {/* <DialogDescription className="text-gray-400">
              Event scheduled for this date
            </DialogDescription> */}
          </DialogHeader>
          <div className="space-y-4">
            {selectedDateEvents.map((event) => (
              <Card key={event.id} className="bg-gray-900/60 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{event.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                        {event.code}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {event.location}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs ${
                        event.isPast
                          ? 'bg-red-600/20 text-red-300'
                          : 'bg-green-600/20 text-green-300'
                      }`}>
                        {event.isPast ? 'Completed' : `${getDaysLeft(event.date)} days left`}
                      </span>
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