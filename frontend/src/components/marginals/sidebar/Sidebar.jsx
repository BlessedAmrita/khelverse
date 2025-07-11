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
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = {
    guest: [{ name: 'Home', path: '/', icon: Home }],
    athlete: [
      { name: 'Dashboard', path: '/dashboard/athlete', icon: LayoutDashboard },
      { name: 'Profile', path: '/dashboard/athlete/profile', icon: User },
      { name: 'Targets & Plans', path: '/dashboard/athlete/targets', icon: Target },
      { name: 'Diet Plan', path: '/dashboard/athlete/diet', icon: Salad },
      { name: 'Recovery Plan', path: '/dashboard/athlete/injury', icon: HeartPulse },
      { name: 'Smart Trainer', path: 'https://huggingface.co/spaces/khelverse/live-train', icon: Dumbbell },
      { name: 'Tracking', path: '/dashboard/athlete/performance_evaluation', icon: ChartColumnIncreasing },
      { name: 'Events', path: '/dashboard/athlete/events', icon: Calendar },
      { name: 'Career Guidance', path: '/dashboard/athlete/careerGuidance', icon: CircleHelp },
      { name: 'Your Coach', path: '/dashboard/athlete/your_coach', icon: ShieldUser },
    ],
    coach: [
      { name: 'Dashboard', path: '/dashboard/coach', icon: LayoutDashboard },
      { name: 'Profile', path: '/dashboard/coach/profile', icon: User },
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

  const activeNav = user?.role ? navItems[user.role] || [] : navItems.guest;

  const handleGetStarted = async () => {
    const { user, isNewUser } = await signInWithGoogle(dispatch);
    if (user) {
      if (isNewUser || !user.role) router.push('/onboardingForm');
      else router.push(`/dashboard/${user.role}`);
    }
  };

  const handleLogout = async () => {
    await logout(dispatch);
    router.push('/');
    router.refresh();
  };

  return (
    <div className="relative h-min-screen bg-black">
      {/* Mobile menu icon */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(true)}>
          <Menu size={30} className="text-white transition-transform duration-300" />
        </button>
      </div>

      {/* Desktop Sidebar with Framer Motion */}
      <motion.aside
        animate={{ width: isOpen ? 250 : 64 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="hidden md:flex flex-col sticky top-0 h-screen pb-[50px] text-white bg-gradient-to-r from-black to-khelverse-purple/20 pt-[20px] pl-[16px] overflow-hidden"
      >
        {/* Header */}
        <div className="flex gap-[5px] items-center justify-between mb-[20px] pr-4">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4 }}
              >
                <h1
                  className="font-samarkan select-none"
                  style={{ fontFamily: 'Samarkan, fantasy' }}
                >
                  <div className="flex gap-2 items-center">
                    <img
                      src="https://res.cloudinary.com/dgj1gzq0l/image/upload/v1743663818/Group_2280_1_tyylqw.svg"
                      width={40}
                    />
                    <span className="khelverse-gradient text-3xl">Khelverse</span>
                  </div>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col space-y-4 pr-[20px]">
          {activeNav.map(({ name, path, icon: Icon }, i) => {
            const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link
                  href={path}
                  className={`flex items-center space-x-2 py-2 pl-[5px] rounded transition-all duration-300 ${isActive ? 'text-apts-purple-light' : 'hover:bg-apts-purple-light'
                    }`}
                >
                  <Icon size={20} />
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {name}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Button
              onClick={user?.isAuthenticated ? handleLogout : handleGetStarted}
              className="w-full flex items-center justify-center gap-3 p-5 mt-auto bg-apts-purple-dark text-white hover:bg-apts-purple pulse-btn rounded-3xl"
            >
              {user?.isAuthenticated ? <LogOut size={20} /> : <LogIn size={20} />}
              {isOpen && <span>{user?.isAuthenticated ? 'Logout' : 'Login'}</span>}
            </Button>
          </motion.div>
        </nav>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`
          fixed inset-0 z-50 md:hidden flex flex-col items-center justify-center px-6
          bg-black bg-opacity-90 bg-gradient-to-r from-black to-khelverse-purple/20
          transform transition-all duration-500 ease-in-out
          ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}
        `}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          ✕
        </button>

        <h1 className="font-samarkan text-3xl text-white mb-8 flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/dgj1gzq0l/image/upload/v1743663818/Group_2280_1_tyylqw.svg"
            width={40}
          />
          Khelverse
        </h1>

        <nav className="flex flex-col items-center space-y-6 text-lg text-white">
          {activeNav.map(({ name, path, icon: Icon }) => {
            const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
            return (
              <Link
                key={name}
                href={path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-center gap-3 hover:text-dustypink transition-all ${isActive ? 'text-apts-purple-light' : 'hover:bg-apts-purple-light'
                  }`}
              >
                <Icon size={22} />
                <span>{name}</span>
              </Link>
            );
          })}

          <Button
            onClick={() => {
              setIsOpen(false);
              user?.isAuthenticated ? handleLogout() : handleGetStarted();
            }}
            className="flex items-center justify-center gap-3 p-4 mt-6 w-full bg-apts-purple-dark text-white rounded-xl hover:bg-apts-purple"
          >
            {user?.isAuthenticated ? <LogOut size={20} /> : <LogIn size={20} />}
            <span>{user?.isAuthenticated ? 'Logout' : 'Login'}</span>
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
