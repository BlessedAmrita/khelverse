import { UserCircle, Calendar, Bell } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gradient">Performance Dashboard</h1>
        <p className="text-gray-400 text-sm">
          Track, analyze and improve your athletic performance
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
          <Calendar className="h-5 w-5 text-lavender" />
        </button>
        <button className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
          <Bell className="h-5 w-5 text-lavender" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-lavender flex items-center justify-center">
            <UserCircle className="h-6 w-6 text-black" />
          </div>
          <span className="text-sm font-medium hidden md:inline-block">
            Alex Johnson
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
