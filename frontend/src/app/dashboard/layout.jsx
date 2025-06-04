'use client';

import Chatbot from '@/components/athlete/chatbot/Chatbot';
import { useSelector } from 'react-redux';

export default function DashboardLayout({ children }) {
  const user = useSelector((state) => state.user);
  const isAthlete = user?.role === 'athlete';

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col bg-black">
        <main>{children}</main>
      </div>

      {/* Show Chatbot only for athletes */}
      {isAthlete && <Chatbot/>}
    </div>
  );
}
