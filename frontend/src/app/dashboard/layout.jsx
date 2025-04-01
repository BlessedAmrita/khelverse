'use client';
// import Sidebar from "@/components/Sidebar";
// import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className='flex min-h-screen'>
      {/* <Sidebar /> Sidebar stays on the left */}
      <div className='flex-1 flex flex-col bg-black'>
        {/* <Navbar /> Navbar stays at the top */}
        <main className=''>{children}</main> {/* Dashboard content */}
      </div>
    </div>
  );
}
