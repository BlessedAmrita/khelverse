"use client"; 
import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropTypes from "prop-types";

export function DatePickerDemo({ date, setDate, time, setTime }) {
  // Generate time slots from 8 AM to 9 PM in 30-minute intervals
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 21; hour++) {
      const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour < 12 ? "AM" : "PM";

      slots.push(`${hourFormatted}:00 ${period}`);
      if (hour < 21) {
        slots.push(`${hourFormatted}:30 ${period}`);
      }
    }
    return slots; 
  }, []);

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 text-white">
      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-[240px] justify-start text-left font-normal bg-black/40 border-white/10",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-black/90 border border-white/10">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            className="bg-transparent pointer-events-auto text-white"
          />
        </PopoverContent>
      </Popover>

      {/* Time Picker */}
      <Select value={time} onValueChange={setTime}>
        <SelectTrigger className="w-full sm:w-[180px] bg-black/40 border-white/10">
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border border-white/10 text-white">
          {timeSlots.map((slot) => (
            <SelectItem key={slot} value={slot}>
              {slot}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// PropTypes for validation
DatePickerDemo.propTypes = {
  date: PropTypes.instanceOf(Date),
  setDate: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired,
  setTime: PropTypes.func.isRequired,
};

export default DatePickerDemo;
