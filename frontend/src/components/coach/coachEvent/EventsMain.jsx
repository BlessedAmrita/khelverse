// 'use client';

// import React, { useState, useEffect } from "react";
// import StatsCard from "./StatsCard.jsx";
// import CoachHeader from "./CoachHeader.jsx";
// import EventFilter from "./EventFilter.jsx";
// import EventCard from "./EventCard.jsx";
// import EventCalendar from "./EventCalendar.jsx";
// import { Calendar, Award, TrendingUp, Users } from "lucide-react";
// import { add, format, isSameDay } from "date-fns";

// const Events = () => {
//   const [filter, setFilter] = React.useState("all");
//   const [search, setSearch] = React.useState("");
//   const [selectedDate, setSelectedDate] = React.useState(new Date());

//   const eventsData = [
//     {
//       id: "1",
//       title: "National Swimming Championship",
//       date: add(new Date(), { days: 5 }),
//       location: "Aquatic Center, New Delhi",
//       category: "National",
//       status: "upcoming",
//       registeredAthletes: [
//         { id: "a1", name: "Vikram Malhotra", sport: "Swimming - 100m Freestyle", level: "Elite" },
//         { id: "a2", name: "Priya Sharma", sport: "Swimming - 200m Backstroke", level: "Pro" },
//         { id: "a3", name: "Arjun Mehta", sport: "Swimming - 400m Freestyle", level: "Advanced" }
//       ]
//     },
//     {
//       id: "2",
//       title: "Regional Track & Field Competition",
//       date: new Date(),
//       location: "City Sports Complex, Mumbai",
//       category: "Regional",
//       status: "ongoing",
//       registeredAthletes: [
//         { id: "a4", name: "Megha Joshi", sport: "Track - 100m Sprint", level: "Elite" },
//         { id: "a5", name: "Rahul Kumar", sport: "Field - Javelin Throw", level: "Pro" }
//       ]
//     },
//     {
//       id: "3",
//       title: "State Badminton Tournament",
//       date: add(new Date(), { days: -15 }),
//       location: "Indira Gandhi Stadium, Delhi",
//       category: "State",
//       status: "completed",
//       registeredAthletes: [
//         { id: "a1", name: "Vikram Malhotra", sport: "Badminton - Singles", level: "Elite" },
//         { id: "a3", name: "Arjun Mehta", sport: "Badminton - Doubles", level: "Advanced" }
//       ]
//     },
//     {
//       id: "4",
//       title: "Inter-College Marathon",
//       date: add(new Date(), { days: 12 }),
//       location: "University Campus, Bangalore",
//       category: "Collegiate",
//       status: "upcoming",
//       registeredAthletes: [
//         { id: "a2", name: "Priya Sharma", sport: "Marathon - 42km", level: "Pro" },
//         { id: "a5", name: "Rahul Kumar", sport: "Marathon - 21km", level: "Pro" }
//       ]
//     }
//   ];

//   const filteredEvents = eventsData
//     .filter(event => (filter === "all" ? true : event.status === filter))
//     .filter(event =>
//       search
//         ? event.title.toLowerCase().includes(search.toLowerCase()) ||
//           event.location.toLowerCase().includes(search.toLowerCase()) ||
//           event.category.toLowerCase().includes(search.toLowerCase()) ||
//           event.registeredAthletes.some(athlete =>
//             athlete.name.toLowerCase().includes(search.toLowerCase()) ||
//             athlete.sport.toLowerCase().includes(search.toLowerCase())
//           )
//         : true
//     );

//   const eventsForSelectedDate = filteredEvents.filter(event => isSameDay(new Date(event.date), selectedDate));
  
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
//     <div className="flex min-h-screen bg-black">
//       <div className="flex-1 p-8">
//         <CoachHeader />
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <StatsCard title="Total Events" value={eventsData.length} icon={<Calendar size={24} />} />
//           <StatsCard title="Upcoming Events" value={eventsData.filter(e => e.status === "upcoming").length} icon={<TrendingUp size={24} />} iconBgColor="bg-apts-blue" />
//           <StatsCard title="Athletes Competing" value={12} icon={<Users size={24} />} />
//           <StatsCard title="Medals Won" value={8} icon={<Award size={24} />} iconBgColor="bg-apts-green" />
//         </div>

//         <h2 className="text-xl font-bold text-white mb-4">Event Management</h2>
//         <EventFilter onFilterChange={setFilter} onSearchChange={setSearch} activeFilter={filter} />
//         {filteredEvents.length > 0 ? (
//           <>{filteredEvents.map(event => <EventCard key={event.id} event={event} />)}</>
//         ) : (
//           <div className="apts-card flex items-center justify-center p-12">
//             <Calendar size={48} className="text-gray-500" />
//             <h3>No events found</h3>
//           </div>
//         )}

//         <EventCalendar events={eventsData} onSelectDate={setSelectedDate} />
//         <h3>Events on {format(selectedDate, "MMMM d, yyyy")}</h3>
//         {eventsForSelectedDate.length > 0 ? (
//           eventsForSelectedDate.map(event => <div key={event.id}>{event.title}</div>)
//         ) : (
//           <p>No events scheduled for this day</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Events;
'use client';
import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Users } from 'lucide-react';
import CreateEventForm from './CreateEventForm';
import EventCard from './EventCard';
import AthletesList from './AthletesList';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FeatureHero from '@/components/shared/FeatureHero';

const Index = () => {
  const [events, setEvents] = useState([
    {
      id: '1',
      name: 'Swimming Championship',
      date: '2024-06-15',
      time: '09:00',
      location: 'Aquatic Center',
      description: 'Annual swimming championship for all age groups',
      uniqueCode: 'SWIM24',
      registeredAthletes: [
        { id: '1', name: 'Alex Johnson', sport: 'Swimming', team: 'Blue Sharks' },
        { id: '2', name: 'Emma Davis', sport: 'Swimming', team: 'Wave Riders' },
        { id: '3', name: 'Michael Chen', sport: 'Swimming', team: 'Blue Sharks' }
      ]
    },
    {
      id: '2',
      name: 'Track & Field Meet',
      date: '2024-06-20',
      time: '14:00',
      location: 'Stadium Complex',
      description: 'Inter-school track and field competition',
      uniqueCode: 'TRACK24',
      registeredAthletes: [
        { id: '4', name: 'Sarah Wilson', sport: 'Track', team: 'Lightning Bolts' },
        { id: '5', name: 'James Rodriguez', sport: 'Field', team: 'Thunder Hawks' }
      ]
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect for initial loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // // NEW: Effect to scroll to top on component mount (page load)
  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'auto' // Use 'auto' for instant scroll on initial load
  //   });
  // }, []); 

  // Existing useEffect for scrolling to top when selectedEvent changes (for internal navigation)
  useEffect(() => {
    if (selectedEvent) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [selectedEvent]);

  const handleCreateEvent = (newEvent) => {
    setEvents([newEvent, ...events]);
  };

  const handleViewAthletes = (event) => {
    setSelectedEvent(event);
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    // You might want to scroll to top when going back as well
    window.scrollTo({
       top: 0,
       behavior: 'smooth'
    });
  };

  const eventDates = events.map(event => new Date(event.date));

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
        {/* Header */}
        <FeatureHero title={'Events'}/>

        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
        >
          <div className="min-h-screen bg-black/55">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* ... (Your existing stats cards) ... */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-khelverse-purple/20 to-black transform transition-all hover:scale-[1.02] p-6">
                {/* Radial fade overlay */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at center, transparent 50%, black 100%)',
                      opacity: 0.65,
                      mixBlendMode: 'multiply',
                    }}
                ></div>

                {/* Soft glowing accents */}
                <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-khelverse-purple/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 -ml-5 -mb-5 bg-khelverse-purple/20 rounded-full blur-xl"></div>

                {/* Main card content */}
                <div className="relative z-20 flex items-center">
                  <Calendar className="text-khelverse-purple mr-3" size={24} />
                  <div>
                    <h3 className="text-white font-semibold font-sprintura">Total Events</h3>
                    <p className="text-2xl font-bold text-khelverse-light-purple">{events.length}</p>
                  </div>
                </div>
              </div>

              {/* UPCOMING EVENTS */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-khelverse-purple/20 to-black transform transition-all hover:scale-[1.02] p-6">
                {/* Radial fade overlay */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at center, transparent 50%, black 100%)',
                      opacity: 0.65,
                      mixBlendMode: 'multiply',
                    }}
                ></div>

                {/* Soft glowing accents */}
                <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-khelverse-purple/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 -ml-5 -mb-5 bg-khelverse-purple/20 rounded-full blur-xl"></div>

                {/* Main card content */}
                <div className="relative z-20 flex items-center">
                  <Trophy className="text-khelverse-purple mr-3" size={24} />
                  <div>
                    <h3 className="text-white font-semibold font-sprintura">Upcoming Events</h3>
                    <p className="text-2xl font-bold text-khelverse-light-purple">
                      {events.filter(event => new Date(event.date) >= new Date()).length}
                    </p>
                  </div>
                </div>
              </div>
              {/* REGISTERED ATHLETES */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-khelverse-purple/20 to-black transform transition-all hover:scale-[1.02] p-6">
                {/* Radial fade overlay */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at center, transparent 50%, black 100%)',
                      opacity: 0.65,
                      mixBlendMode: 'multiply',
                    }}
                ></div>

                {/* Soft glowing accents */}
                <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-khelverse-purple/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 -ml-5 -mb-5 bg-khelverse-purple/20 rounded-full blur-xl"></div>

                {/* Main card content */}
                <div className="relative z-20 flex items-center">
                  <Users className="text-khelverse-purple mr-3" size={24} />
                  <div>
                    <h3 className="text-white font-semibold font-sprintura">Registered Athletes</h3>
                    <p className="text-2xl font-bold text-khelverse-light-purple">
                      {events.reduce((total, event) => total + event.registeredAthletes.length, 0)}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Create Event Form and Calendar Layout */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-3/4">
                <CreateEventForm onCreateEvent={handleCreateEvent} />
              </div>
              <div className="">
                <Card className="bg-transparent border-none">
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
                        className="rounded-md border-gray-700 bg-gray-900 text-white"
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