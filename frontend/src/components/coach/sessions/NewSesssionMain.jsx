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
    <div className="max-w-xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Create New Session</h2>

      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Session title" />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter details..." />
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-2 flex-1">
          <Label>Time</Label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Connected Athlete</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
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
                  <div>
                    <p className="text-sm font-medium">
                      {(selectedAthlete.firstName && selectedAthlete.lastName)
                        ? `${selectedAthlete.firstName} ${selectedAthlete.lastName}`
                        : selectedAthlete.name ?? 'N/A'}
                    </p>

                    <p className="text-xs text-gray-500">{selectedAthlete.sport} • {selectedAthlete.level}</p>
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

                    <p className="text-xs text-gray-500">{athlete.sport} • {athlete.level}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Button onClick={handleCreateSession} className="w-full" disabled={loading}>
        {loading ? 'Scheduling...' : 'Schedule Session'}
      </Button>
    </div>
  );
}

