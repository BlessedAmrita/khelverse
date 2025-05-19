"use client";
import SearchCoach from "./SearchCoach";
import Notifications from "./Notifications";
import FeatureHero from "@/components/shared/FeatureHero";

export default function YourCoachMain() {
  return (
    <div className='w-full'>
      <FeatureHero
        bg_url={
          'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741323594/MacBook_Pro_16__-_1_2_qakdds.svg'
        }
        title={'Your Coach'}
      />
      <div className="flex flex-col md:flex-row gap-6 p-4">
      <div className="w-full md:w-1/2">
        <SearchCoach />
      </div>
      <div className="w-full md:w-1/2">
        <Notifications />
      </div>
    </div>
    </div>
  );
}
