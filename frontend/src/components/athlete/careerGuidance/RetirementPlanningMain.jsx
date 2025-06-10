import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, Shield, Heart, GraduationCap, Star, StarOff } from 'lucide-react';

// Define opportunities data
const opportunities = [
  {
    "id": 1,
    "title": "Group 'C' & 'D' Posts (Central Govt.)",
    "organization": "Various Central Ministries/Depts. (DoPT Guidelines)",
    "achievementLevels": ["International Medallist", "National Medallist", "National Participant"],
    "education": ["10th Pass", "12th Pass", "Graduate"],
    "ageRange": "18-27 (with relaxations)",
    "quotaInfo": "5% reservation across certain posts",
    "processSummary": "Meritorious sportspersons are eligible. Monitor specific Ministry/Department notifications.",
    "officialLink": "https://dopt.gov.in/",
    "type": "Job",
    "icon": Briefcase
  },
  {
    "id": 2,
    "title": "Constable (General Duty) - Sports Quota",
    "organization": "Central Armed Police Forces (CAPFs - e.g., CISF, ITBP, BSF)",
    "achievementLevels": ["National Medallist", "National Participant"],
    "education": ["10th Pass"],
    "ageRange": "18-23 (with relaxations for sportspersons)",
    "quotaInfo": "Specific vacancies based on annual recruitment drive",
    "processSummary": "Involves physical standards test, skill test, and medical examination.",
    "officialLink": "https://ssb.nic.in/",
    "type": "Job",
    "icon": Shield
  },
  {
    "id": 3,
    "title": "Assistant Coach / Other Support Staff",
    "organization": "Sports Authority of India (SAI)",
    "achievementLevels": ["Olympic Participant", "International Medallist", "National Medallist"],
    "education": ["Graduate", "Post Graduate"],
    "ageRange": "Up to 32 (with relaxations for sportspersons)",
    "quotaInfo": "Direct recruitment for accomplished athletes",
    "processSummary": "Recruitment via SAI notifications. May involve interviews and practical tests.",
    "officialLink": "https://sportsauthorityofindia.nic.in/",
    "type": "Job",
    "icon": GraduationCap
  },
  {
    "id": 4,
    "title": "Pension Scheme for Meritorious Sportspersons",
    "organization": "Ministry of Youth Affairs & Sports (MYAS)",
    "achievementLevels": ["Olympic Medallist", "World Championship Medallist", "Asian Games Medallist", "Commonwealth Games Medallist"],
    "education": ["N/A"],
    "ageRange": "Age 40+",
    "quotaInfo": "Monthly pension (varying amounts based on achievement)",
    "processSummary": "Provides financial security for retired international medallists. Apply through MYAS.",
    "officialLink": "https://yas.nic.in/sports/schemes-for-sportspersons",
    "type": "Scheme",
    "icon": Heart
  },
  {
    "id": 5,
    "title": "Pandit Deendayal Upadhyay National Welfare Fund",
    "organization": "Ministry of Youth Affairs & Sports (MYAS)",
    "achievementLevels": ["Any International / National Recognition"],
    "education": ["N/A"],
    "ageRange": "Any Age",
    "quotaInfo": "Financial assistance for indigent sportspersons",
    "processSummary": "One-time financial assistance for medical treatment, injuries, or living in indigent circumstances.",
    "officialLink": "https://yas.nic.in/sports/schemes-for-sportspersons",
    "type": "Scheme",
    "icon": Heart
  },
  {
    "id": 6,
    "title": "Retired Sportsperson Empowerment Training (RESET) Programme",
    "organization": "Sports Authority of India (SAI)",
    "achievementLevels": ["National Participant", "State Medallist"],
    "education": ["12th Pass", "Graduate"],
    "ageRange": "No strict age limit (focus on career transition)",
    "quotaInfo": "Skill development & placement in sports sector roles",
    "processSummary": "Training for roles like coaches, sports nutritionists, event managers, etc. Apply via SAI initiatives.",
    "officialLink": "https://sportsauthorityofindia.nic.in/sai-schemes",
    "type": "Scheme",
    "icon": GraduationCap
  }
];

function RetirementPlanningMain() {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredOpportunities, setFilteredOpportunities] = useState(opportunities);
  const [selectedAchievement, setSelectedAchievement] = useState('All');
  const [selectedEducation, setSelectedEducation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedAchievement, selectedEducation, selectedType, searchTerm]);

  const applyFilters = () => {
    const newFiltered = opportunities.filter(item => {
      const matchesAchievement = selectedAchievement === 'All' || item.achievementLevels.includes(selectedAchievement);
      const matchesEducation = selectedEducation === 'All' || item.education.includes(selectedEducation);
      const matchesType = selectedType === 'All' || item.type === selectedType;
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.organization.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesAchievement && matchesEducation && matchesType && matchesSearch;
    });
    setFilteredOpportunities(newFiltered);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-apts-black">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-apts-purple rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-apts-white text-lg font-sprintura">TRACK. TRAIN. TRIUMPH</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
       <div
        className="min-h-screen bg-repeat bg-left-top"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
      >
        <div className="min-h-screen bg-black/55">
      {/* Background Effects */}
      {/* <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-apts-purple/5 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse-soft animation-delay-400"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-apts-purple/3 to-transparent rounded-full blur-2xl"></div>
      </div> */}
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="bg-transparent py-16 px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-sprintura font-bold text-white mb-4">
              Retirement Planning & Support
            </h1>
            <p className="text-lg text-white/80 font-poppins max-w-2xl mx-auto">
              Explore career opportunities and support schemes designed for athletes transitioning to post-competition life.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8 px-8 py-8">
          {/* Search and Filter Section */}
          <div className="max-w-7xl mx-auto w-full">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent backdrop-blur-sm border border-white/20 rounded-lg text-white font-poppins placeholder-white/60 focus:outline-none focus:border-apts-purple focus:ring-1 focus:ring-apts-purple"
              />
            </div>

            {/* Filter Section */}
            <div className="bg-transparent backdrop-blur-sm rounded-lg border border-white/20 p-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 mb-4 w-full">
                <Filter className="w-5 h-5 text-apts-purple" />
                <span className="text-white font-poppins font-medium">Filter Opportunities</span>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="achievement" className="block text-white text-sm font-poppins font-medium mb-2">
                  Achievement Level:
                </label>
                <select 
                  id="achievement" 
                  value={selectedAchievement} 
                  onChange={(e) => setSelectedAchievement(e.target.value)}
                  className="w-full p-3 rounded-md bg-apts-lightdark/80 text-white border border-white/10 focus:ring-apts-purple focus:border-apts-purple font-poppins"
                >
                  <option value="All">All Levels</option>
                  <option value="Olympic Medallist">Olympic Medallist</option>
                  <option value="World Championship Medallist">World Championship Medallist</option>
                  <option value="Asian Games Medallist">Asian Games Medallist</option>
                  <option value="Commonwealth Games Medallist">Commonwealth Games Medallist</option>
                  <option value="International Medallist">Other International Medallist</option>
                  <option value="International Participant">International Participant</option>
                  <option value="National Medallist">National Medallist</option>
                  <option value="National Participant">National Participant</option>
                  <option value="State Medallist">State Medallist</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label htmlFor="education" className="block text-white text-sm font-poppins font-medium mb-2">
                  Education Level:
                </label>
                <select 
                  id="education" 
                  value={selectedEducation} 
                  onChange={(e) => setSelectedEducation(e.target.value)}
                  className="w-full p-3 rounded-md bg-apts-lightdark/80 text-white border border-white/10 focus:ring-apts-purple focus:border-apts-purple font-poppins"
                >
                  <option value="All">Any Education</option>
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                  <option value="N/A">Not Applicable (for schemes)</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label htmlFor="type" className="block text-white text-sm font-poppins font-medium mb-2">
                  Opportunity Type:
                </label>
                <select 
                  id="type" 
                  value={selectedType} 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-3 rounded-md bg-apts-lightdark/80 text-white border border-white/10 focus:ring-apts-purple focus:border-apts-purple font-poppins"
                >
                  <option value="All">All Types</option>
                  <option value="Job">Job Opportunities</option>
                  <option value="Scheme">Support Schemes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-sprintura font-bold text-white">
                Available Opportunities ({filteredOpportunities.length})
              </h2>
            </div>

            {/* Opportunity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.length > 0 ? (
                filteredOpportunities.map(item => {
                  const IconComponent = item.icon;
                  const isFavorite = favorites.includes(item.id);
                  
                  return (
                    <div 
                      key={item.id} 
                      className="group relative bg-transparent backdrop-blur-sm border border-white/20 rounded-xl p-6 transition-all duration-300 hover:border-apts-purple/60 hover:shadow-lg hover:shadow-apts-purple/20 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
                    >
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-apts-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-apts-purple/20 rounded-lg group-hover:bg-apts-purple/30 transition-colors duration-300">
                              <IconComponent className="w-6 h-6 text-apts-purple" />
                            </div>
                            <div className="flex-1">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-poppins font-medium transition-all duration-300 ${
                                item.type === 'Job' 
                                  ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 border border-orange-500/30' 
                                  : 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}>
                                {item.type}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
                          >
                            {isFavorite ? (
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            ) : (
                              <StarOff className="w-5 h-5 text-white/40 group-hover:text-white/60" />
                            )}
                          </button>
                        </div>
                        
                        <h3 className="text-lg font-poppins font-semibold text-white mb-3 group-hover:text-apts-purple/90 transition-colors duration-300">
                          {item.title}
                        </h3>
                        
                        <p className="text-sm text-white/70 font-poppins mb-3">
                          <strong className="text-white/90">Organization:</strong> {item.organization}
                        </p>
                        
                        {/* Content that expands to fill available space */}
                        <div className="space-y-3 mb-4 flex-grow">
                          <div>
                            <p className="text-sm text-white/90 font-poppins font-medium mb-2">Eligibility:</p>
                            <ul className="text-sm text-white/70 font-poppins space-y-1">
                              {item.achievementLevels.slice(0, 3).map((level, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 bg-apts-purple rounded-full mt-2 flex-shrink-0"></span>
                                  <span>{level}</span>
                                </li>
                              ))}
                              {item.achievementLevels.length > 3 && (
                                <li className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 bg-apts-purple rounded-full mt-2 flex-shrink-0"></span>
                                  <span className="text-apts-purple">+{item.achievementLevels.length - 3} more levels</span>
                                </li>
                              )}
                            </ul>
                          </div>
                          
                          {item.education[0] !== "N/A" && (
                            <p className="text-sm text-white/70 font-poppins">
                              <strong className="text-white/90">Education:</strong> {item.education.join(', ')}
                            </p>
                          )}
                          
                          {item.ageRange && (
                            <p className="text-sm text-white/70 font-poppins">
                              <strong className="text-white/90">Age:</strong> {item.ageRange}
                            </p>
                          )}
                          
                          {item.quotaInfo && (
                            <p className="text-sm text-white/70 font-poppins">
                              <strong className="text-white/90">Info:</strong> {item.quotaInfo}
                            </p>
                          )}
                        </div>
                        
                        {/* Button always at bottom */}
                        <div className="mt-auto">
                          <a 
                            href={item.officialLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-full inline-flex items-center justify-center px-4 py-3 bg-apts-purple-dark text-white hover:bg-apts-purple font-poppins font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-apts-purple/25 group-hover:scale-[1.02]"
                          >
                            Explore Now
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="bg-apts-lightdark/60 backdrop-blur-md border border-white/20 rounded-lg p-8">
                    <p className="text-white/70 font-poppins text-lg mb-2">
                      No opportunities found matching your criteria
                    </p>
                    <p className="text-white/50 font-poppins text-sm">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default RetirementPlanningMain;
