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
  ShieldUser,
  ClipboardList,
  Activity,
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
      { name: 'Training', path: 'https://huggingface.co/spaces/khelverse/live-train', icon: Dumbbell },
      { name: 'Tracking', path: '/dashboard/athlete/performance_evaluation', icon: ChartColumnIncreasing },
      { name: 'Events', path: '/dashboard/athlete/events', icon: Calendar },
      { name: 'Career Guidance', path: '/dashboard/athlete/careerGuidance', icon: CircleHelp },
      { name: 'Your Coach', path: '/dashboard/athlete/your_coach', icon: ShieldUser },
    ],
    coach: [
      { name: 'Dashboard', path: '/dashboard/coach', icon: LayoutDashboard },
      { name: 'Profile', path:'/dashboard/coach/profile', icon: User },
      { name: 'Athlete Profiles', path: '/dashboard/coach/athlete_profiles', icon: Users },
      { name: 'Training Plans', path: '/dashboard/coach/training_plans', icon: Activity },
      { name: 'Sessions', path: '/dashboard/coach/sessions', icon: ClipboardList },
      { name: 'Events', path: '/dashboard/coach/events', icon: Calendar },
    ],
    organization: [
      { name: 'Dashboard', path: '/dashboard/organization', icon: LayoutDashboard },
      { name: 'Athlete Management', path: '/dashboard/organization/athlete_management', icon: Settings },
      { name: 'Events', path: '/events', icon: Calendar },
    ],
  };

  // const activeNav = user?.isOnboarded ? (navItems[user.role] || []) : navItems.guest;
  const activeNav = user?.role ? navItems[user.role] || [] : navItems.guest;

  const handleGetStarted = async () => {
    const { user, isNewUser } = await signInWithGoogle(dispatch);

    if (user) {
      console.log('User Logged In:', user);

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
    <div className={`
              relative h-min-screen bg-black
             ${isOpen ? ' bg-gradient-to-r from-black to-khelverse-purple/20' : ''} 
            `}>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50 ">
        <button onClick={() => setIsOpen(true)}>
          <Menu size={30} className="text-white" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:block sticky top-0 left-0 h-auto pb-[50px]
          ${isOpen ? 'w-64 bg-gradient-to-r from-black to-khelverse-purple/20' : 'w-16'}
          transition-all bg-black text-white pt-[20px] pl-[20px]
        `}
      >
        {/* Sidebar Toggle */}
        <div className='flex gap-[5px] items-center justify-between mb-[20px]'>
          {isOpen && <h1
            className={`font-samarkan select-none`}
            style={{ fontFamily: 'Samarkan, fantasy' }}
          >
            <div className='flex gap-2 items-center'>
              <img src='https://res.cloudinary.com/dgj1gzq0l/image/upload/v1743663818/Group_2280_1_tyylqw.svg'
                width={40}
              />
              <span className="khelverse-gradient text-3xl">Khelverse </span>
            </div>
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
            className='flex items-center justify-center gap-3 p-5 mt-auto bg-apts-purple-dark text-white hover:bg-apts-purple pulse-btn rounded-3xl'
          >
            {user?.isAuthenticated ? <LogOut size={20} /> : <LogIn size={20} />}
            {isOpen && <span>{user?.isAuthenticated ? 'Logout' : 'Login'}</span>}
          </Button>
        </nav>
      </aside>

      {/* Mobile Overlay Sidebar */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-90 bg-gradient-to-r from-black to-khelverse-purple/20 flex flex-col items-center justify-center px-6">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            ✕
          </button>

          {/* Mobile Sidebar Content */}
          <h1 className="font-samarkan text-3xl text-white mb-8 flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/dgj1gzq0l/image/upload/v1743663818/Group_2280_1_tyylqw.svg"
              width={40}
            />
            Khelverse
          </h1>

          <nav className="flex flex-col items-center space-y-6 text-lg text-white">
  {activeNav.map(({ name, path, icon: Icon }) => (
    <Link
      key={name}
      href={path}
      onClick={() => setIsOpen(false)}
      className="flex items-center justify-center gap-3 hover:text-dustypink"
    >
      <Icon size={22} />
      <span>{name}</span>
    </Link>
  ))}

  <Button
    onClick={() => {
      setIsOpen(false);
      user?.isAuthenticated ? handleLogout() : handleGetStarted();
    }}
    className="flex items-center justify-center gap-3 p-4 mt-6 bg-apts-purple-dark text-white rounded-xl hover:bg-apts-purple"
  >
    {user?.isAuthenticated ? <LogOut size={20} /> : <LogIn size={20} />}
    <span>{user?.isAuthenticated ? 'Logout' : 'Login'}</span>
  </Button>
</nav>
        </div>
      )}
    </div>
  );
};

export default Sidebar;