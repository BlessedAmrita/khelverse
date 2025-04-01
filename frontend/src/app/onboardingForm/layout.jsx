'use client';
export default function OnboardingLayout({ children }) {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50'>
      <div className='w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg'>{children}</div>
    </div>
  );
}
