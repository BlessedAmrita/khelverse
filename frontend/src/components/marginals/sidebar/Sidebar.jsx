'use client';
import {
  Home,
  User,
  Calendar,
  Settings,
  LogOut,
  LogIn,
  Target,
  Menu,
  Salad,
  HeartPulse,
  Dumbbell,
  ChartColumnIncreasing,
  CircleHelp,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { signInWithGoogle, logout } from '@/firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Sidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = {
    guest: [{ name: 'Home', path: '/', icon: Home }],
    athlete: [
      { name: 'Dashboard', path: '/dashboard/athlete', icon: LayoutDashboard },
      { name: 'Profile', path: '/dashboard/athlete/profile', icon: User },
      { name: 'Targets', path: '/dashboard/athlete/targets', icon: Target },
      { name: 'Diet Plan', path: '/dashboard/athlete/diet', icon: Salad },
      { name: 'Injury', path: '/dashboard/athlete/injury', icon: HeartPulse },
      { name: 'Training', path: '/dashboard/athlete/training', icon: Dumbbell },
      { name: 'Tracking', path: '/dashboard/athlete/performance_evaluation', icon: ChartColumnIncreasing },
      { name: 'Events', path: '/dashboard/athlete/events', icon: Calendar },
      { name: 'Career Guidance', path: '/dashboard/athlete/careerGuidance', icon: CircleHelp },
    ],
    coach: [
      { name: 'Dashboard', path: '/dashboard/coach', icon: LayoutDashboard },
      { name: 'Athlete Profiles', path: '/dashboard/coach/athlete_profiles', icon: User },
      { name: 'Sessions', path: '/dashboard/coach/sessions', icon: Users },
      { name: 'Events', path: '/dashboard/coach/events', icon: Calendar },
    ],
    organization: [
      { name: 'Dashboard', path: '/dashboard/organization', icon: LayoutDashboard },
      { name: 'Athlete Management', path: '/dashboard/organization/athlete_management', icon: Settings },
      { name: 'Events', path: '/events', icon: Calendar },
    ],
  };

  const activeNav = user?.isOnboarded ? (navItems[user.role] || []) : navItems.guest;

  const handleGetStarted = async () => {
    const { user, isNewUser } = await signInWithGoogle(dispatch);

    if (user.isOnboarded) {
      console.log('User Onboarded:', user);

      // 🔥 Redirect to onboarding if new or role not set
      if (isNewUser || !user.role) {
        router.push('/onboardingForm');
      } else {
        // ✅ Redirect to role-based dashboard
        router.push(`/dashboard/${user.role}`);
      }
    }
  };

  const handleLogout = async () => {
    await logout(dispatch);
    router.push('/'); // Redirect to home
    router.refresh();
  };

  return (
    <div className='h-min-screen bg-apts-dark'>
      <aside className={`sticky top-0 left-0 h-auto pb-[50px] ${isOpen ? 'w-64' : 'w-16'} transition-all bg-apts-dark text-white pt-[20px] pl-[20px] `}>
        {/* Sidebar Toggle */}
        <div className='flex gap-[5px] items-center justify-between mb-[20px]'>
          {isOpen && <h1 
        className={`font-samarkan select-none`}
        style={{ fontFamily: 'Samarkan, fantasy' }} // Adding inline style as fallback
       >
        <span className="khelverse-gradient text-4xl">Khelverse</span>
       </h1>}
          <button onClick={() => setIsOpen(!isOpen)} className={`${isOpen ? 'p-2' : 'mr-2'}`}>
            <Menu size={24} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className='flex flex-col space-y-4 pr-[20px]'>
          {activeNav.map(({ name, path, icon: Icon }) => (
            <Link key={name} href={path} className='flex items-center space-x-2 py-2 pl-[5px] hover:bg-dustypink rounded'>
              <Icon size={20} />
              {isOpen && <span>{name}</span>}
            </Link>
          ))}

          {/* Login / Logout Button */}
          <Button
            onClick={user?.isAuthenticated ? handleLogout : handleGetStarted}
            className='flex items-center justify-center gap-3 p-5 mt-auto hover:bg-lavender-800 rounded-3xl'
          >
            {user?.isAuthenticated ? <LogOut size={20} /> : <LogIn size={20} />}
            {isOpen && <span>{user?.isAuthenticated ? 'Logout' : 'Login'}</span>}
          </Button>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
