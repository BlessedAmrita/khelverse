"use client";
import FloatingHelpButton from "./FloatingHelpButton";
import { usePathname } from "next/navigation";

const helpContentByRoute = (pathname) => {
  // Athlete routes
  if (pathname === "/dashboard/athlete") {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Dashboard Help</h3><p class='text-white'>Your dashboard gives you a quick overview of your journey. Here you can:</p><ul class='list-disc pl-5 text-white'><li><b>See your progress</b> in training and events</li><li><b>Check upcoming sessions</b> and important updates</li><li>Use the sidebar to explore all features</li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/athlete/profile")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Profile Help</h3><p class='text-white'>Keep your profile up to date for the best experience:</p><ul class='list-disc pl-5 text-white'><li><b>Edit your personal info</b> and achievements</li><li>Add or update your <b>sports details</b></li><li>Showcase your <b>awards and milestones</b></li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/athlete/targets")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Targets & Plans Help</h3><p class='text-white'>Set and manage your training goals:</p><ul class='list-disc pl-5 text-white'><li><b>Create new targets</b> for your sport</li><li>Track your <b>progress</b> and adjust plans as needed</li><li>Review feedback from your coach</li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/athlete/diet")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Diet Plan Help</h3><p class='text-white'>Stay on top of your nutrition:</p><ul class='list-disc pl-5 text-white'><li><b>View your personalized diet plan</b></li><li>Track your <b>meals and calories</b></li><li>Get <b>nutrition tips</b> for better performance</li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/athlete/injury")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Recovery Plan Help</h3><p class='text-white'>Take care of your body and recover faster:</p><ul class='list-disc pl-5 text-white'><li><b>Follow your recovery plan</b> and routines</li><li>Log your <b>rest and rehab activities</b></li><li>Monitor your <b>injury status</b> and get tips</li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/athlete/performance_evaluation")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Tracking Help</h3><p class='text-white'>Track your athletic journey:</p><ul class='list-disc pl-5 text-white'><li><b>Log workouts</b> and training sessions</li><li>See <b>progress charts</b> and stats</li><li>Spot trends and <b>improve your performance</b></li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/athlete/events")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Events Help</h3><p class='text-white'>Never miss an event:</p><ul class='list-disc pl-5 text-white'><li><b>Browse and register</b> for sports events</li><li>See your <b>upcoming and past events</b></li><li>Track your <b>results and participation</b></li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/athlete/careerGuidance")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Career Guidance Help</h3><p class='text-white'>Plan your future in sports:</p><ul class='list-disc pl-5 text-white'><li><b>Get AI-powered career advice</b></li><li>Explore <b>job and sponsorship</b> opportunities</li><li>Find <b>retirement resources</b> and expert tips</li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/athlete/your_coach")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Your Coach Help</h3><p class='text-white'>Connect and communicate with your coach:</p><ul class='list-disc pl-5 text-white'><li><b>View your coach's profile</b></li><li><b>Chat</b> for advice and feedback</li><li>Manage your <b>coaching relationship</b></li></ul></div>`;
  }
  // Coach routes
  if (pathname === "/dashboard/coach") {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Dashboard Help</h3><p class='text-white'>Your coach dashboard gives you a quick overview:</p><ul class='list-disc pl-5 text-white'><li><b>See all your athletes</b> and sessions</li><li>Check <b>upcoming events</b> and updates</li><li>Use the menu for more features</li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/coach/profile")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Profile Help</h3><p class='text-white'>Keep your coach profile updated:</p><ul class='list-disc pl-5 text-white'><li><b>Edit your details</b> and experience</li><li>Add <b>certifications and achievements</b></li><li>Showcase your <b>coaching style</b></li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/coach/athlete_profiles")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Athlete Profiles Help</h3><p class='text-white'>Manage your athletes easily:</p><ul class='list-disc pl-5 text-white'><li><b>View athlete stats</b> and progress</li><li>Give <b>feedback and advice</b></li><li>Schedule <b>sessions</b> or send messages</li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/coach/training_plans")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Training Plans Help</h3><p class='text-white'>Help your athletes succeed:</p><ul class='list-disc pl-5 text-white'><li><b>Review and update</b> training plans</li><li>Track <b>progress and completion</b></li><li>Suggest <b>improvements</b> and new goals</li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/coach/sessions")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Sessions Help</h3><p class='text-white'>Organize and track training sessions:</p><ul class='list-disc pl-5 text-white'><li><b>Schedule new sessions</b> for athletes</li><li>Track <b>attendance and feedback</b></li><li>Review <b>past and upcoming sessions</b></li></ul></div>`;
  }
  if (pathname.startsWith("/dashboard/coach/events")) {
    return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Events Help</h3><p class='text-white'>Manage events for your athletes:</p><ul class='list-disc pl-5 text-white'><li><b>Create and edit events</b></li><li>View <b>participants and results</b></li><li>Share <b>event details</b> with athletes</li></ul></div>`;
  }
  // Default help
  return `<div><h3 class='text-lg font-bold mb-2 text-apts-purple'>Khelverse Help</h3><p class='text-white'>Use the menu to explore features. Click the <b>?</b> for help on any page.</p><div className="mt-4 text-center"><a href="/help" className="text-apts-purple hover:text-apts-purple/80 font-medium">Learn more</a></div></div>`;
};

export default function DynamicHelpButton() {
  const pathname = usePathname();
  const pageHelp = helpContentByRoute(pathname);
  return <FloatingHelpButton pageHelp={pageHelp} />;
} 