'use client';

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";

const EventCalendar = ({ events, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateClick = (day) => {
    setSelectedDate(day);
    onSelectDate(day);
  };

  const hasEventOnDay = (day) => {
    return events.some((event) => isSameDay(new Date(event.date), day));
  };

  return (
    <div className="apts-card ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <CalendarIcon size={18} /> Event Calendar
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 rounded hover:bg-[#232733] text-gray-400">
            <ChevronLeft size={20} />
          </button>
          <span className="text-white">{format(currentMonth, "MMMM yyyy")}</span>
          <button onClick={nextMonth} className="p-1 rounded hover:bg-[#232733] text-gray-400">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-gray-400 text-sm py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day, i) => {
          const hasEvent = hasEventOnDay(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={i}
              onClick={() => handleDateClick(day)}
              className={`h-10 flex items-center justify-center rounded-lg cursor-pointer text-sm
                ${!isSameMonth(day, currentMonth) ? "text-gray-600" : "text-white"}
                ${isSelected ? "bg-purple-middle" : ""}
                ${!isSelected && isCurrentDay ? "border border-apts-purple-light" : ""}
                ${!isSelected && !isCurrentDay ? "hover:bg-[#232733]" : ""}
              `}
            >
              <div className="relative">
                {format(day, "d")}
                {hasEvent && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-apts-purple-light" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventCalendar;
