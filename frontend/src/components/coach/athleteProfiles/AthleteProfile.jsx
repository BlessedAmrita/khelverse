import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dummy athlete data (would come from an API in a real app)
const ATHLETES = [
  {
    id: '1',
    name: 'Michael Johnson',
    sport: 'Track & Field',
    specialization: '100m Sprint',
    level: 'Elite',
    age: 24,
    weight: '75kg',
    height: '182cm',
    status: 'Active',
    recentPerformance: 'Good',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    bio: 'Michael is a dedicated sprinter who has shown consistent improvement over the past season. His work ethic and natural talent make him a promising athlete.',
    achievements: [
      'Gold Medal - National Championship 2023',
      'Silver Medal - University Games 2022',
      'Bronze Medal - Regional Tournament 2021'
    ],
    upcomingEvents: [
      { name: 'State Championship', date: '2023-05-15' },
      { name: 'Olympic Trials', date: '2023-06-20' }
    ],
    trainingProgress: {
      endurance: 85,
      strength: 90,
      technique: 80,
      nutrition: 75
    },
    recentStats: [
      { date: 'Apr 15', value: 10.2 },
      { date: 'Apr 22', value: 10.15 },
      { date: 'Apr 29', value: 10.1 },
      { date: 'May 6', value: 10.05 },
      { date: 'May 13', value: 10.05 },
      { date: 'May 20', value: 10.0 }
    ]
  },
  // ... other athletes with similar structure
];

const AthleteProfile = ( {athlete }) => {
  const { id } = useParams();
  const athlete = ATHLETES.find(a => a.id === id);
  
  if (!athlete) {
    return (
      <div className="min-h-screen bg-gradient-athlete p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Athlete Not Found</h2>
          <Link to="/athletes" className="text-athletePurple-light hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Athletes
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Recovery':
        return 'bg-amber-500';
      case 'Competing':
        return 'bg-blue-500';
      case 'Training':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-athlete p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/athletes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Athletes
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-card border-athletePurple-dark/40">
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <div className="h-32 w-32 rounded-full bg-accent overflow-hidden mb-4">
                  <img 
                    src={athlete.image} 
                    alt={athlete.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3';
                    }}
                  />
                </div>
                <CardTitle className="text-2xl mb-1">{athlete.name}</CardTitle>
                <div className="text-muted-foreground mb-3">{athlete.sport} - {athlete.specialization}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/60 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Age</p>
                    <p className="font-medium flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-athletePurple-light" />
                      {athlete.age}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AthleteProfile;