'use client';
import React, {useState, useEffect} from 'react';
import FeatureHero from '../shared/FeatureHero';
import EventsCalendar from '../coachEvent/EventCalendar';
import {
  FaTrophy,
  FaCheck,
  FaClipboardList,
  FaCalendarCheck,
  FaHistory,
  FaClock,
  FaCalendarAlt,
  FaArrowCircleRight,
} from 'react-icons/fa';

const events1 = [
  {
    title: 'Federation Cup Senior Athletics',
    date: 'April 5, 2025',
    location: 'Patiala',
    daysLeft: 13,
    icon: <FaTrophy />,
  },
  {
    title: 'Indian Grand Prix 3',
    date: 'April 25, 2025',
    location: 'Guwahati',
    daysLeft: 33,
    icon: <FaTrophy />,
  },
  {
    title: 'Indian Grand Prix 4',
    date: 'May 12, 2025',
    location: 'Chennai',
    daysLeft: 50,
    icon: <FaTrophy />,
  },
  {
    title: 'National Inter-State Senior Athletics',
    date: 'June 15, 2025',
    location: 'Chennai',
    daysLeft: 84,
    icon: <FaTrophy />,
  },
  {
    title: 'National Open Athletics Championship',
    date: 'September 20, 2025',
    location: 'Lucknow',
    daysLeft: 181,
    icon: <FaTrophy />,
  },
  {
    title: 'East Zone Athletics Championship',
    date: 'July 5, 2025',
    location: 'Kolkata',
    daysLeft: 104,
    icon: <FaTrophy />,
  },
];

const events2 = [
  {
    title: 'Indian Grand Prix 1',
    date: 'March 10, 2025',
    location: 'Bangalore',
    daysLeft: -13,
    icon: <FaCalendarCheck />,
  },
  {
    title: 'Indian Grand Prix 2',
    date: 'March 18, 2025',
    location: 'Thiruvananthapuram',
    daysLeft: -5,
    icon: <FaCalendarCheck />,
  },
  {
    title: 'Khelo India Youth Games',
    date: 'January 10, 2025',
    location: 'Bhopal',
    daysLeft: -72,
    icon: <FaCalendarCheck />,
  },
  {
    title: 'Youth National Athletics Championship',
    date: 'February 25, 2025',
    location: 'Bhopal',
    daysLeft: -26,
    icon: <FaCalendarCheck />,
  },
  {
    title: 'State Level Marathon',
    date: 'March 1, 2025',
    location: 'Jaipur',
    daysLeft: -22,
    icon: <FaCalendarCheck />,
  },
  {
    title: 'Winter Athletics Meet',
    date: 'February 5, 2025',
    location: 'Shimla',
    daysLeft: -47,
    icon: <FaCalendarCheck />,
  },
];

const events3 = [
  {
    title: 'Asian Athletics Championship Trial',
    date: 'May 10, 2025',
    location: 'Patiala',
    daysLeft: 48,
    icon: <FaCalendarAlt />,
  },
  {
    title: 'Indian Masters Athletics Championship',
    date: 'May 25, 2025',
    location: 'Hyderabad',
    daysLeft: 63,
    icon: <FaCalendarAlt />,
  },
  {
    title: 'South Asian Games Trial',
    date: 'August 5, 2025',
    location: 'Mumbai',
    daysLeft: 135,
    icon: <FaCalendarAlt />,
  },
  {
    title: 'All India Inter-University Athletics Meet',
    date: 'December 1, 2025',
    location: 'Delhi',
    daysLeft: 253,
    icon: <FaCalendarAlt />,
  },
  {
    title: 'West Zone Athletics Championship',
    date: 'October 10, 2025',
    location: 'Pune',
    daysLeft: 201,
    icon: <FaCalendarAlt />,
  },
  {
    title: 'North East Games Athletics Event',
    date: 'November 25, 2025',
    location: 'Guwahati',
    daysLeft: 247,
    icon: <FaCalendarAlt />,
  },
];

function AthleteEventsMain() {
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
    <div className='w-full bg-black text-white'>
      <FeatureHero
        bg_url={
          'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741330564/MacBook_Pro_16__-_1_4_zwatot.svg'
        }
        title={'EVENTS'}
      />
      {/* Top Section */}
      <div className='w-full h-[70vh] sm:h-[50vh] flex flex-col sm:flex-row gap-y-3'>
        {/* Left side - Scrollable List */}
        <div className='w-full sm:w-[60%] h-full overflow-y-auto p-4 pt-0 bg-black shadow-lg'>
          <div className='sticky top-0 bg-black py-2'>
            <h2 className='text-xl font-bold text-center m-3 glass-card py-1 rounded-lg'>
              REGISTERED EVENTS
            </h2>
          </div>
          <ul>
            {events1.map((event, index) => (
              <li
                key={index}
                className='flex items-center justify-between p-2 mb-2 bg-white/5 rounded-lg shadow-md'
              >
                <div className='flex items-center'>
                  <div className='p-4 bg-gray-800 rounded-lg'>{event.icon}</div>
                  <div className='ml-4'>
                    <h3 className='text-md font-semibold'>{event.title}</h3>
                    <p className='text-gray-400'>
                      {event.date} • {event.location}
                    </p>
                  </div>
                </div>
                <div className='bg-purple-dark text-lavender-100  font-bold text-sm px-4 py-1 rounded-full'>
                  {event.daysLeft} DAYS
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Calendar Section */}
        <div className='w-full sm:w-[40%] h-full bg-black flex items-center justify-center'>
           <div className='w-[90%]'>
             <EventsCalendar events={[...events1, ...events2, ...events3]} />
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className='w-full h-[70vh] sm:h-[50vh] flex flex-col sm:flex-row justify-between mt-3 mb-5 gap-y-3'>
        <div className='w-full sm:w-[43%] h-full overflow-y-auto p-4 pt-0 bg-black shadow-lg'>
          <div className='sticky top-0 bg-black py-2'>
            <h2 className='text-xl font-bold text-center mb-1 glass-card py-1 rounded-lg'>
              PAST EVENTS
            </h2>
          </div>
          <ul>
            {events2.map((event, index) => (
              <li
                key={index}
                className='flex items-center justify-between p-2 mb-2 bg-white/5 rounded-lg shadow-md'
              >
                <div className='flex items-center'>
                  <div className='p-4 bg-gray-800 rounded-lg'>{event.icon}</div>
                  <div className='ml-4'>
                    <h3 className='text-md font-semibold'>{event.title}</h3>
                    <p className='text-gray-400'>
                      {event.date} • {event.location}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className='w-full sm:w-[55%] h-full overflow-y-auto p-4 pt-0 bg-black shadow-lg'>
          <div className='sticky top-0 bg-black py-2'>
            <h2 className='text-xl font-bold text-center mb-1 glass-card py-1 rounded-lg'>
              OTHER UPCOMING EVENTS
            </h2>
          </div>
          <ul>
            {events3.map((event, index) => (
              <li
                key={index}
                className='flex items-center justify-between p-2 mb-2 bg-white/5 rounded-lg shadow-md'
              >
                <div className='flex items-center'>
                  <div className='p-4 bg-gray-800 rounded-lg'>{event.icon}</div>
                  <div className='ml-4'>
                    <h3 className='text-md font-semibold'>{event.title}</h3>
                    <p className='text-gray-400'>
                      {event.date} • {event.location}
                    </p>
                  </div>
                </div>
                <div className='flex gap-3'>
                <div className='bg-purple-dark text-lavender-100  font-bold text-sm px-4 py-1 rounded-full'>
                  {event.daysLeft} DAYS
                </div>
                <div className='bg-purple-light text-black  font-bold text-sm px-4 py-1 rounded-full'>
                  Register
                </div>

                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AthleteEventsMain;
