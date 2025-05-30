'use client';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { CalendarIcon, ClockIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import { getGoogleAccessToken } from '@/utils/getAccessToken';
import { saveSessionToFirestore } from '@/firebase/session';

export default function NewSessionMain() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [connectedAthletes, setConnectedAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [loading, setLoading] = useState(false); // ⏳ Loader
  const user = useSelector((state) => state.user);

  const fetchConnectedAthletes = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'athlete'),
        where('connectedCoachId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const athleteList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConnectedAthletes(athleteList);
    } catch (err) {
      console.error('Failed to fetch athletes:', err);
      toast.error('Error fetching athletes');
    }
  };

  useEffect(() => {
    if (user.uid && user.role === 'coach') {
      fetchConnectedAthletes();
    }
  }, [user]);

  const handleCreateSession = async () => {
    if (!title || !description || !date || !time || !selectedAthlete) {
      toast.error('Please fill all fields');
      return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('Not authenticated');
      return;
    }

    try {
      setLoading(true); // 🔁 Start loader

      const accessToken = await getGoogleAccessToken();
      if (!accessToken) {
        toast.error('Google Calendar access token not found. Please re-login.');
        return;
      }

      const response = await fetch('/api/create-meet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          date,
          time,
          athleteEmail: selectedAthlete.email,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to create meeting');

      const sessionData = {
        title,
        description,
        date,
        time,
        coachEmail: user.email,
        coachId: user.uid,
        athleteEmail: selectedAthlete.email,
        athleteId: selectedAthlete.id,
        athleteName: selectedAthlete.name,
        athleteFirstName: selectedAthlete.firstName,
        athleteLastName: selectedAthlete.lastName,
        athleteSport: selectedAthlete.sport,
        athletePhotoURL: selectedAthlete.photoURL,
        meetLink: data.meetLink,
        createdAt: serverTimestamp(),
        startDateTime: new Date(`${date}T${time}`).toISOString(),
      };

      await saveSessionToFirestore(sessionData); // 💾 Save to Firestore
      toast.success('Session scheduled successfully!'); // ✅ Toast success

      // 🧹 Clear form
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setSelectedAthlete(null);
    } catch (error) {
      console.error('Google Calendar Error:', error);
      toast.error(error.message || 'Failed to create session');
    } finally {
      setLoading(false); // 🛑 Stop loader
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
    >
      <div className="min-h-screen bg-black/55">
        <div className="max-w-xl mt-3 mx-auto p-4 bg-transparent text-white rounded-2xl shadow-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-center font-sprintura">Create New Session</h2>

          <div className="space-y-1">
            <Label>Title</Label>
            <Input value={title} className="border-white/30" onChange={(e) => setTitle(e.target.value)} placeholder="Session title" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} className="border-white/30" onChange={(e) => setDescription(e.target.value)} placeholder="Enter details..." />
          </div>

          {/* <div className="flex gap-4">
            <div className="space-y-1 flex-1">
              <Label>Date</Label>
              <Input type="date" value={date} className="border-white/30" onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1 flex-1">
              <Label>Time</Label>
              <Input type="time" value={time} className="border-white/30" onChange={(e) => setTime(e.target.value)} />
            </div>
          </div> */}

          <div className="flex gap-4">
            {/* Date Picker with Calendar */}
            <div className="space-y-1 flex-1">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="w-full text-left border border-white/30 rounded-md px-3 py-2 bg-transparent hover:bg-white/10 transition-all flex items-center justify-between"
                  >
                    <span>{date ? format(new Date(date), "PPP") : "Pick a date"}</span>
                    <CalendarIcon className="h-4 w-4 text-white/50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black text-white border-white/30 border">
                  <Calendar
                    mode="single"
                    selected={date ? new Date(date) : undefined}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDate(selectedDate.toISOString().split("T")[0]);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="space-y-1 flex-1">
              <Label>Time</Label>
              <div className="relative">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border-white/30 pr-10"
                />
                <ClockIcon className="absolute right-2 top-2.5 h-4 w-4 text-white/50" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Connected Athlete</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full bg-gray-950 border-white/30 hover:bg-gray-200 justify-start">
                  {selectedAthlete ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedAthlete.photoURL} />
                        <AvatarFallback>
                          {(selectedAthlete?.firstName && selectedAthlete?.lastName)
                            ? `${selectedAthlete.firstName} ${selectedAthlete.lastName}`
                            : selectedAthlete?.name ?? "N/A"}
                        </AvatarFallback>

                      </Avatar>
                      <div className='flex items-center gap-2'>
                        <p className="text-sm font-medium">
                          {(selectedAthlete.firstName && selectedAthlete.lastName)
                            ? `${selectedAthlete.firstName} ${selectedAthlete.lastName}`
                            : selectedAthlete.name ?? 'N/A'}
                        </p>

                        <p className="text-xs text-gray-400"> ({selectedAthlete.sport} • {selectedAthlete.experienceLevel})</p>
                      </div>
                    </div>
                  ) : (
                    'Select an athlete'
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72">
                {connectedAthletes.map((athlete) => (
                  <DropdownMenuItem key={athlete.id} onClick={() => setSelectedAthlete(athlete)}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={athlete.photoURL} />
                        <AvatarFallback>
                          {(athlete.firstName?.[0] || '') + (athlete.lastName?.[0] || '') || athlete.name?.[0] || 'A'}
                        </AvatarFallback>

                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {(athlete.firstName && athlete.lastName)
                            ? `${athlete.firstName} ${athlete.lastName}`
                            : athlete.name ?? 'N/A'}
                        </p>

                        <p className="text-xs text-gray-500">{athlete.sport} • {athlete.experienceLevel}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button onClick={handleCreateSession} className="w-full bg-apts-purple-dark text-white hover:bg-apts-purple pulse-btn" disabled={loading}>
            {loading ? 'Scheduling...' : 'Schedule Session'}
          </Button>
        </div>
      </div>
    </div>
  );
}

