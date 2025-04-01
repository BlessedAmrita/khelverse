'use client';

import React, { useState, useEffect } from "react";
import StatsCard from "./StatsCard.jsx";
import CoachHeader from "./CoachHeader";
import EventFilter from "./EventFilter";
import EventCard from "./EventCard";
import EventCalendar from "./EventCalendar";
import { Calendar, Award, TrendingUp, Users } from "lucide-react";
import { add, format, isSameDay } from "date-fns";

const Events = () => {
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const eventsData = [
    {
      id: "1",
      title: "National Swimming Championship",
      date: add(new Date(), { days: 5 }),
      location: "Aquatic Center, New Delhi",
      category: "National",
      status: "upcoming",
      registeredAthletes: [
        { id: "a1", name: "Vikram Malhotra", sport: "Swimming - 100m Freestyle", level: "Elite" },
        { id: "a2", name: "Priya Sharma", sport: "Swimming - 200m Backstroke", level: "Pro" },
        { id: "a3", name: "Arjun Mehta", sport: "Swimming - 400m Freestyle", level: "Advanced" }
      ]
    },
    {
      id: "2",
      title: "Regional Track & Field Competition",
      date: new Date(),
      location: "City Sports Complex, Mumbai",
      category: "Regional",
      status: "ongoing",
      registeredAthletes: [
        { id: "a4", name: "Megha Joshi", sport: "Track - 100m Sprint", level: "Elite" },
        { id: "a5", name: "Rahul Kumar", sport: "Field - Javelin Throw", level: "Pro" }
      ]
    },
    {
      id: "3",
      title: "State Badminton Tournament",
      date: add(new Date(), { days: -15 }),
      location: "Indira Gandhi Stadium, Delhi",
      category: "State",
      status: "completed",
      registeredAthletes: [
        { id: "a1", name: "Vikram Malhotra", sport: "Badminton - Singles", level: "Elite" },
        { id: "a3", name: "Arjun Mehta", sport: "Badminton - Doubles", level: "Advanced" }
      ]
    },
    {
      id: "4",
      title: "Inter-College Marathon",
      date: add(new Date(), { days: 12 }),
      location: "University Campus, Bangalore",
      category: "Collegiate",
      status: "upcoming",
      registeredAthletes: [
        { id: "a2", name: "Priya Sharma", sport: "Marathon - 42km", level: "Pro" },
        { id: "a5", name: "Rahul Kumar", sport: "Marathon - 21km", level: "Pro" }
      ]
    }
  ];

  const filteredEvents = eventsData
    .filter(event => (filter === "all" ? true : event.status === filter))
    .filter(event =>
      search
        ? event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.location.toLowerCase().includes(search.toLowerCase()) ||
          event.category.toLowerCase().includes(search.toLowerCase()) ||
          event.registeredAthletes.some(athlete =>
            athlete.name.toLowerCase().includes(search.toLowerCase()) ||
            athlete.sport.toLowerCase().includes(search.toLowerCase())
          )
        : true
    );

  const eventsForSelectedDate = filteredEvents.filter(event => isSameDay(new Date(event.date), selectedDate));
  
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
    <div className="flex min-h-screen bg-black">
      <div className="flex-1 p-8">
        <CoachHeader />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Events" value={eventsData.length} icon={<Calendar size={24} />} />
          <StatsCard title="Upcoming Events" value={eventsData.filter(e => e.status === "upcoming").length} icon={<TrendingUp size={24} />} iconBgColor="bg-apts-blue" />
          <StatsCard title="Athletes Competing" value={12} icon={<Users size={24} />} />
          <StatsCard title="Medals Won" value={8} icon={<Award size={24} />} iconBgColor="bg-apts-green" />
        </div>

        <h2 className="text-xl font-bold text-white mb-4">Event Management</h2>
        <EventFilter onFilterChange={setFilter} onSearchChange={setSearch} activeFilter={filter} />
        {filteredEvents.length > 0 ? (
          <>{filteredEvents.map(event => <EventCard key={event.id} event={event} />)}</>
        ) : (
          <div className="apts-card flex items-center justify-center p-12">
            <Calendar size={48} className="text-gray-500" />
            <h3>No events found</h3>
          </div>
        )}

        <EventCalendar events={eventsData} onSelectDate={setSelectedDate} />
        <h3>Events on {format(selectedDate, "MMMM d, yyyy")}</h3>
        {eventsForSelectedDate.length > 0 ? (
          eventsForSelectedDate.map(event => <div key={event.id}>{event.title}</div>)
        ) : (
          <p>No events scheduled for this day</p>
        )}
      </div>
    </div>
  );
};

export default Events;
