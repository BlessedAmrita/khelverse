import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData } from '@/config/slices/userSlice';

function CoachHero() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const uid = user?.uid;

  useEffect(() => {
    if (uid) {
      dispatch(fetchUserData(uid));
    }
  }, [dispatch, uid]);

  console.log('Redux User Data:', user);

  const profileImage = user?.photoURL || 'https://via.placeholder.com/60';
  const userName = user?.additionalData?.firstName || 'Coach';

  return (
    <div className="h-[100px] bg-gradient-to-br backdrop-blur-lg overflow-hidden mb-[10px] w-full flex items-center justify-between text-lavender px-[30px] top-0 sticky z-10">
      <h1 className="text-xl font-semibold">Hey {userName}!</h1>
      <div className="flex gap-[20px] items-center">
        <img 
          src={profileImage} 
          alt="Profile" 
          className="w-[60px] h-[60px] rounded-full bg-white object-cover" 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }} 
        />
      </div>
    </div>
  );
}

export default CoachHero;
