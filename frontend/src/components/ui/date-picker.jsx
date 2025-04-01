"use client";
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from './calendar';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

export function DatePickerDemo({ value, onChange }) {
  const [date, setDate] = useState(null);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onChange(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP') : 'Select date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar selectedDate={date} onChange={handleDateChange} />
      </PopoverContent>
    </Popover>
  );
}
