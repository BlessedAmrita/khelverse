'use client';

import { Provider } from 'react-redux';
import { store } from '@/config/store';
import { monitorAuthState } from '@/firebase/auth';
import Sidebar from '@/components/marginals/sidebar/Sidebar';
import Footer from '@/components/marginals/footer/Footer';
import { Toaster } from 'react-hot-toast';

monitorAuthState();

export default function ClientWrapper({ children }) {
  return (
    <Provider store={store}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="min-h-screen w-full flex flex-col ">
        <div className="flex flex-grow">
          <Sidebar />
          <main className="flex-grow transition-all bg-black">
            {children}
            <Footer />
          </main>
        </div>
      </div>
    </Provider>
  );
}
 