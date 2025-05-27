"use client";
import SearchCoach from "./SearchCoach";
import Notifications from "./Notifications";
import Message from "./Message";
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

<div
    className="min-h-screen bg-cover bg-center bg-no-repeat "
    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
  >
      <div className="min-h-screen bg-black/55 flex flex-col md:flex-row gap-6 p-4">
      <div className="w-full md:w-1/2">
        <SearchCoach />
        <Message />
      </div>
      <div className="w-full md:w-1/2">
        <Notifications />
      </div>
      </div>
    </div>
    </div>
  ); 
}