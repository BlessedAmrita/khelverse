'use client';
export default function DashboardLayout({ children }) {
  return (
    <div className='flex min-h-screen'>
      <div className='flex-1 flex flex-col bg-black'>
        <main className=''>{children}</main>
      </div>
    </div>
  );
}
