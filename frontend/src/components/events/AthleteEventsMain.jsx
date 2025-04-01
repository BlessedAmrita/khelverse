'use client';
import React from 'react';
import FeatureHero from '../shared/FeatureHero';
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
    icon: <FaCalendarCheck />,
  },
  {
    title: 'Indian Masters Athletics Championship',
    date: 'May 25, 2025',
    location: 'Hyderabad',
    daysLeft: 63,
    icon: <FaCalendarCheck />,
  },
  {
    title: 'South Asian Games Trial',
    date: 'August 5, 2025',
    location: 'Mumbai',
    daysLeft: 135,
    icon: <FaCalendarCheck />,
  },
  {
    title: 'All India Inter-University Athletics Meet',
    date: 'December 1, 2025',
    location: 'Delhi',
    daysLeft: 253,
    icon: <FaCalendarCheck />,
  },
  {
    title: 'West Zone Athletics Championship',
    date: 'October 10, 2025',
    location: 'Pune',
    daysLeft: 201,
    icon: <FaCalendarCheck />,
  },
  {
    title: 'North East Games Athletics Event',
    date: 'November 25, 2025',
    location: 'Guwahati',
    daysLeft: 247,
    icon: <FaCalendarCheck />,
  },
];

function AthleteEventsMain() {
  return (
    <div className='w-full'>
      <FeatureHero
        bg_url={
          'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741330564/MacBook_Pro_16__-_1_4_zwatot.svg'
        }
        title={'EVENTS'}
      />
      {/* Top Section */}
      <div className='w-full h-[70vh] sm:h-[50vh] flex flex-col sm:flex-row gap-y-3'>
        {/* Left side - Scrollable List */}
        <div className='w-full sm:w-[60%] h-full overflow-y-auto p-4 pt-0 bg-gray-50 shadow-lg'>
          <div className='sticky top-0 bg-gray-50 py-2'>
            <h2 className='text-xl font-bold text-center m-3 bg-gray-200 py-3 rounded-lg'>
              REGISTERED EVENTS
            </h2>
          </div>
          <ul>
            {events1.map((event, index) => (
              <li
                key={index}
                className='flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-md'
              >
                <div className='flex items-center'>
                  <div className='p-4 bg-gray-200 rounded-lg'>{event.icon}</div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold'>{event.title}</h3>
                    <p className='text-gray-500'>
                      {event.date} • {event.location}
                    </p>
                  </div>
                </div>
                <div className='bg-lavender text-black font-bold text-sm px-4 py-2 rounded-full'>
                  {event.daysLeft} DAYS
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Calendar Section */}
        <div className='w-[full] sm:w-[40%] h-full bg-gray-50 '>
          <h2 className='text-xl font-bold text-center p-4 '>CALENDER</h2>
          <iframe
            src='https://calendar.google.com/calendar/embed?src=tanyavardhan2005%40gmail.com&ctz=UTC'
            style={{ border: 0 }}
            width='100%'
            height='90%'
            className='px-3 pb-2 '
          ></iframe>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='w-full h-[70vh] sm:h-[50vh] flex flex-col sm:flex-row justify-between mt-3 mb-5 gap-y-3'>
        <div className='w-[full] sm:w-[43%] h-full overflow-y-auto p-4 pt-0 bg-gray-50 shadow-lg'>
          <div className='sticky top-0 bg-gray-50 py-2'>
            <h2 className='text-xl font-bold text-center mb-1 bg-gray-200 py-3 rounded-lg'>
              PAST EVENTS
            </h2>
          </div>
          <ul className=''>
            {events2.map((event, index) => (
              <li
                key={index}
                className='flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-md'
              >
                <div className='flex items-center'>
                  <div className='p-4 bg-gray-200 rounded-lg'>{event.icon}</div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold'>{event.title}</h3>
                    <p className='text-gray-500'>
                      {event.date} • {event.location}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className='w-[full] sm:w-[55%] h-full overflow-y-auto p-4 pt-0 bg-gray-50 shadow-lg'>
          <div className='sticky top-0 bg-gray-50 py-2'>
            <h2 className='text-xl font-bold text-center mb-1 bg-gray-200 py-3 rounded-lg'>
              {' '}
              OTHER UPCOMING EVENTS
            </h2>
          </div>
          <ul>
            {events3.map((event, index) => (
              <li
                key={index}
                className='flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-md'
              >
                <div className='flex items-center'>
                  <div className='p-4 bg-gray-200 rounded-lg'>{event.icon}</div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold'>{event.title}</h3>
                    <p className='text-gray-500'>
                      {event.date} • {event.location}
                    </p>
                  </div>
                </div>
                <div className='bg-lavender text-black font-bold text-sm px-4 py-2 rounded-full'>
                  {event.daysLeft} DAYS
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
