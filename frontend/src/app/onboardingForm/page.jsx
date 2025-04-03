'use client';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';

const RoleSelection = () => {
  const router = useRouter();

  const handleSelectRole = async (role) => {
    const user = auth.currentUser;
    if (!user) {
      console.error('User not found!');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role,
        isAuthenticated: false,
        isOnboarded: false, // 🚀 New field to track onboarding completion
      });

      router.push(`/onboardingForm/${role}`); // ✅ Redirect to role-specific form
    } catch (error) {
      console.error('🔥 Error setting role in Firestore:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] rounded-2xl bg-apts-lightdark text-white  bg-transparent'>
      <h1 className='text-4xl font-bold mb-6 text-lavender-200 font-sprintura'>Select Your Role</h1>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
        {['athlete', 'coach', 'organization'].map((role) => (
          <button
            key={role}
            onClick={() => handleSelectRole(role)}
            className='px-6 h-[60px] text-lg py-4 font-bold bg-purple-dark text-lavender-100 rounded-lg shadow-md hover:bg-apts-lightdark hover:text-lavender transition-colors duration-500'
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;
