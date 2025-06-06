'use client';
import { User, MapPin, Trophy, Calendar, Target, Award, Star, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useSelector } from 'react-redux';


  

const CoachProfile = () => {
  const reduxUser = useSelector((state) => state.user);
  const [coachProfile, setCoachProfile] = useState(null);
  const [expertiseList, setExpertiseList] = useState([]);
  const [certificationsList, setCertificationsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [athleteCount, setAthleteCount] = useState(0);

  useEffect(() => {
    if (!reduxUser?.uid) return;

    const fetchStats = async () => {
      try {
        console.log('Fetching stats for user:', reduxUser.uid);

        // Fetch connected athletes from the coach's document
        const coachDocRef = doc(db, 'users', reduxUser.uid);
        const coachDocSnap = await getDoc(coachDocRef);

        if (coachDocSnap.exists()) {
          const coachData = coachDocSnap.data();
          console.log('Coach data:', coachData);
          const athletes = coachData.connectedAthletes || [];
          setAthleteCount(athletes.length);
        } else {
          console.warn('No coach document found');
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, [reduxUser?.uid]);


  const activeUid = reduxUser?.uid;

  // --- Data Fetching Logic ---
  useEffect(() => {
    if (activeUid) {
      fetchCoachProfile(activeUid);
    }
  }, [activeUid]);

  const fetchCoachProfile = async (uid) => {
    try {
      const coachDoc = await getDoc(doc(db, "users", uid));
      if (coachDoc.exists()) {
        const data = coachDoc.data();
        setCoachProfile({ uid, ...data });

        // Parse expertise and certifications from comma-separated strings
        setExpertiseList(data.expertise ? data.expertise.split(',').map(s => s.trim()).filter(s => s) : []);
        setCertificationsList(data.certifications ? data.certifications.split(',').map(s => s.trim()).filter(s => s) : []);

      } else {
        console.warn("Coach profile not found for UID:", uid);
        setCoachProfile({
          uid,
          name: 'Set Your Name',
          city: 'N/A',
          state: 'N/A',
          sport: 'General',
          experience: '0',
          level: 'Beginner',
          specialization: 'Set your specialization and bio here.',
          photoURL: '',
          dob: '',
          certifications: '', // Initialize as empty string
          expertise: '',     // Initialize as empty string
        });
        setExpertiseList([]);
        setCertificationsList([]);
      }
    } catch (err) {
      console.error("Failed to fetch coach profile:", err);
      setCoachProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return 'N/A';
    let age = new Date().getFullYear() - birthDate.getFullYear();
    const m = new Date().getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) age--;
    return age;
  };


  // --- Data Update Logic ---
  const handleEditField = async (field, initialValue = '') => {
    const newValue = prompt(`Enter new ${field}:`, initialValue);
    if (!newValue || newValue.trim() === initialValue) return;

    try {
      const docRef = doc(db, "users", activeUid);
      await updateDoc(docRef, {
        [field]: newValue.trim()
      });
      fetchCoachProfile(activeUid); // Refresh profile data
      alert(`${field} updated successfully!`);
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
      alert(`Failed to update ${field}. Please try again.`);
    }
  };

  // MODIFIED: To add to expertise string
  const addExpertise = async () => {
    const newSkill = prompt('Enter new expertise:');
    if (newSkill && newSkill.trim()) {
      try {
        const currentExpertise = coachProfile.expertise || ''; // Get current string
        const updatedExpertise = currentExpertise ? `${currentExpertise}, ${newSkill.trim()}` : newSkill.trim();

        await updateDoc(doc(db, "users", activeUid), { expertise: updatedExpertise });
        fetchCoachProfile(activeUid); // Refresh to show the updated list
        alert('Expertise added!');
      } catch (err) {
        console.error("Failed to add expertise:", err);
        alert("Failed to add expertise. Try again.");
      }
    }
  };

  // MODIFIED: To add to certifications string
  const addCertification = async () => {
    const newCert = prompt('Enter new certification:');
    if (newCert && newCert.trim()) {
      try {
        const currentCertifications = coachProfile.certifications || ''; // Get current string
        const updatedCertifications = currentCertifications ? `${currentCertifications}, ${newCert.trim()}` : newCert.trim();

        await updateDoc(doc(db, "users", activeUid), { certifications: updatedCertifications });
        fetchCoachProfile(activeUid); // Refresh to show the updated list
        alert('Certification added!');
      } catch (err) {
        console.error("Failed to add certification:", err);
        alert("Failed to add certification. Try again.");
      }
    }
  };

  // --- Render Logic ---
  if (isLoading || !coachProfile) {
    return (
      <div className='min-h-screen w-full flex items-center justify-center bg-apts-black'>
        <div className='text-center'>
          <div className='w-16 h-16 border-t-4 border-apts-purple rounded-full animate-spin mx-auto'></div>
          <p className='mt-4 text-apts-white text-lg font-sprintura'>TRACK. TRAIN. TRIUMPH</p>
        </div>
      </div>
    );
  }

  const coachName = coachProfile.firstName && coachProfile.lastName ? `${coachProfile.firstName} ${coachProfile.lastName}` : coachProfile.name || 'Coach Name';
  const coachSport = coachProfile.sport || 'Not Set';
  const coachCityState = coachProfile.city && coachProfile.state ? `${coachProfile.city}, ${coachProfile.state}` : 'Location Not Set';
  const coachSpecialization = coachProfile.specialization || 'Set your specialization and bio here.';
  const coachPhoto = coachProfile.photoURL || 'https://www.apc.edu.au/wp-content/uploads/2022/12/APC-EU-Educator-Placeholder.jpg';
  const coachAge = calculateAge(coachProfile.dob);
  const coachExperience = coachProfile.experience || '0';

  const statsCards = [
    {
      icon: User,
      label: 'Age',
      value: coachAge.toString(),
      editable: true,
      onEdit: () => handleEditField('dob', coachProfile.dob),
    },
    {
      icon: Calendar,
      label: 'Experience',
      value: `${coachExperience} Years`,
      editable: true,
      onEdit: () => handleEditField('experience', coachProfile.experience),
    },
    {
      icon: Target,
      label: 'Level',
      value: coachProfile.level || 'N/A',
      editable: true,
      onEdit: () => handleEditField('level', coachProfile.level),
    },
  ];

  return (
    <div
      className='min-h-screen bg-cover bg-center bg-no-repeat'
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')",
      }}
    >
      <div className='min-h-screen bg-black/55'>
        <div className='relative z-10 container mx-auto px-6 py-8'>

          {/* Header Section */}
          <div className='relative w-full bg-transparent border-none'>
            <div className='absolute inset-0 bg-transparent rounded-3xl'></div>
            <div className='bg-transparent rounded-3xl p-8 md:p-12 overflow-hidden'>
              <div className='flex flex-col md:flex-row items-center gap-8'>
                <div className='relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-khelverse-purple to-purple-light p-1'>
                  <img
                    src={coachPhoto}
                    alt='Profile'
                    className='w-full h-full rounded-full object-cover'
                    onError={(e) => {
                      e.target.src = 'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1749203206/I_Made_Some_Profile_Pictures_For_You_Pandas_9_Pics_phdvbn.jpg';
                    }}
                  />
                </div>

                <div className='flex-1 text-center md:text-left'>
                  <h1 className='text-4xl md:text-5xl font-bold mb-2 font-sprintura text-white'> {coachName}</h1>
                  <div className='inline-flex items-center px-3 py-1 rounded-full bg-purple/20 text-purple-light mb-4'>
                    <span className='mr-2'>{coachSport}</span>
                  </div>
                  <div className='flex items-center justify-center lg:justify-start gap-2 mb-3'>
                    <MapPin className='w-5 h-5 text-purple-light' />
                    <span className='text-gray-300 text-lg'>{coachCityState}</span>
                  </div>

                  <p className='text-muted-foreground'>
                  Passionate {coachSport} coach focused on unlocking athletes' full potential through strategic training, mentorship, and              performance excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            {statsCards.map((stat, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-khelverse-purple/20 to-black transform transition-all hover:scale-[1.02]`}
              >
                <div className='p-6 relative z-20 flex flex-col h-full'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full bg-white/10 p-2 backdrop-blur-sm'>
                        <stat.icon className='w-5 h-5 text-white' />
                      </div>
                      <h3 className='text-sm font-medium text-white/80'>{stat.label}</h3>
                    </div>
                    {stat.editable && (
                      <button
                        onClick={stat.onEdit}
                        className='bg-white/10 rounded-full p-1 hover:bg-white/20 transition backdrop-blur-sm'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-4 w-4 text-khelverse-purple'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15.232 5.232l3.536 3.536M16.732 3.732a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className='flex items-end justify-center'>
                    <span className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-khelverse-purple'>
                      {stat.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Expertise Section */}
          <div className='mb-12'>
            <div className='flex items-center justify-between mb-8'>
              <div className='flex items-center gap-3'>
                <Star className='w-8 h-8 text-purple-light' />
                <h2 className='text-2xl font-bold text-white font-sprintura'>EXPERTISE</h2>
              </div>
              <Button
                onClick={addExpertise}
                className='bg-purple-light/20 border border-purple-400/30 hover:bg-purple-light/40 text-purple-200 hover:text-white transition-all duration-300'
                size='sm'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Expertise
              </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {expertiseList.length > 0 ? (
                expertiseList.map((skill, index) => (
                  <Card
                    key={index}
                    className='bg-transparent border-slate-700/50 backdrop-blur-sm hover:bg-black/20 transition-all duration-300 group'
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center'>
                          <Star className='w-5 h-5 text-purple-light' />
                        </div>
                        <span className='text-white font-medium text-lg'>{skill}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400">No expertise listed yet. Add some!</p>
              )}
            </div>
          </div>

          {/* Coaching Performance Section */}
          <div className='mb-12 bg-transparent'>
            <div className='flex items-center gap-3 mb-8'>
              <Trophy className='w-8 h-8 text-purple-light' />
              <h2 className='text-2xl font-bold text-white font-sprintura'>COACHING PERFORMANCE</h2>
            </div>

            <div className='relative'>
              <Card className='bg-transparent border-none p-8'>
                <div className='text-center'>
                  <div className='relative inline-block mb-6'>
                    <div className='w-48 h-48 rounded-full border-8 border-purple-500/30 flex items-center justify-center relative'>
                      <div className='absolute inset-0 rounded-full border-8 border-transparent border-t-purple-light border-r-purple-light animate-slowspin'></div>
                      <div className='text-center z-10'>
                        <div className='text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-khelverse-purple'>
                          {athleteCount? athleteCount : 'N/A'}
                        </div>
                        <div className='text-purple-300 font-medium'>Athletes Trained</div>
                      </div>
                    </div>
                  </div>
                  <p className='text-lavender text-xl font-medium'>Building champions!</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Certifications Section */}
          <div>
            <div className='flex items-center justify-between mb-8'>
              <div className='flex items-center gap-3'>
                <Award className='w-8 h-8 text-purple-light' />
                <h2 className='text-2xl font-bold text-white font-sprintura'>CERTIFICATIONS</h2>
              </div>
              <Button
                onClick={addCertification}
                className='bg-purple-light/20 border border-purple-400/30 hover:bg-purple-light/40 text-purple-200 hover:text-white transition-all duration-300'
                size='sm'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Certification
              </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {certificationsList.length > 0 ? (
                certificationsList.map((cert, index) => (
                  <Card
                    key={index}
                    className='bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300'
                  >
                    <CardContent className='p-6'>
                      <div className='flex items-start gap-4'>
                        <div className='w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0'>
                          <Award className='w-6 h-6 text-purple-light' />
                        </div>
                        <div>
                          <h3 className='text-white font-semibold text-lg mb-2'>{cert}</h3>
                          <p className='text-gray-400 text-sm'>Professional Certification</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400">No certifications listed yet. Add some!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachProfile;