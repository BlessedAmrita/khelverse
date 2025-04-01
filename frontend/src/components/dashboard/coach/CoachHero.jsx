import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData } from '@/config/slices/userSlice';

function CoachHero() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const uid = user?.uid;

  useEffect(() => {
    if (uid) {
      dispatch(fetchUserData(uid));
    }
  }, [dispatch, uid]);

  console.log('Redux User Data:', user);
  console.log('Redux User Data:', user.photoURL);

  const profileImage = user?.photoURL || 'https://www.apc.edu.au/wp-content/uploads/2022/12/APC-EU-Educator-Placeholder.jpg';
  const userName = user?.additionalData?.firstName || 'Coach';

  return (
    <div className="h-[100px] bg-gradient-to-br backdrop-blur-lg overflow-hidden mb-[10px] w-full flex items-center justify-between text-lavender px-[30px] top-0 sticky z-10">
      <h1 className="text-xl font-semibold font-sprintura tracking-widest">Hey {userName}!</h1>
      <div className="flex gap-[20px] items-center">
      <p className='text-md font-semibold font-poppins tracking-wider'>{today}</p>
      <div className="flex gap-[20px] items-center">
        <img 
          src={profileImage} 
          alt="Profile" 
          className="w-[60px] h-[60px] rounded-full bg-white object-cover" 
          onError={(e) => { e.target.src = 'https://www.apc.edu.au/wp-content/uploads/2022/12/APC-EU-Educator-Placeholder.jpg'; }} 
        />
      </div>
      </div>
    </div>
  );
}

export default CoachHero;
