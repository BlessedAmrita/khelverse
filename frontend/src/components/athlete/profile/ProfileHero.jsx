'use client';
const ProfileHero = ({athlete}) => {
  const sport = athlete?.sport || 'Unknown Sport';
  const experienceLevel = athlete?.experienceLevel || 'N/A'; 
  const fullName = (athlete?.firstName || athlete?.lastName)
    ? `${athlete?.firstName ?? ''} ${athlete?.lastName ?? ''}`.trim()
    : 'Athlete';
  const profileImage = athlete?.photoURL || 'https://www.apc.edu.au/wp-content/uploads/2022/12/APC-EU-Educator-Placeholder.jpg';

  return (
    <div className="relative w-full bg-transparent animate-fade-in border-none">
      <div className="absolute inset-0 bg-transparent  rounded-3xl"></div>
      <div className="bg-transparent rounded-3xl p-8 md:p-12 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-khelverse-purple to-purple-light p-1">
            <img 
              src={profileImage} 
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
              onError={(e) => { e.target.src = 'https://www.apc.edu.au/wp-content/uploads/2022/12/APC-EU-Educator-Placeholder.jpg'; }}
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 font-sprintura">{fullName}</h1>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple/20 text-purple-light mb-4">
              <span className="mr-2">{sport}</span>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Elite athlete specializing in {sport} with a focus on peak performance and continuous improvement. Experience Level: {experienceLevel}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
