import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { venueService } from '../services/venueService';
import { motion } from 'framer-motion';
import { Search, MapPin, Users, Calendar, Star, ArrowRight } from 'lucide-react';

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [talentQuery, setTalentQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedVenues();
  }, []);

  const fetchFeaturedVenues = async () => {
    try {
      const data = await venueService.getVenues();
      setVenues(data.slice(0, 6)); // Get first 6 venues
    } catch (err) {
      console.error('Failed to load venues', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const skill = talentQuery.trim();
    navigate(skill ? `/talents?skill=${encodeURIComponent(skill)}` : '/talents');
  };

  const SUGGESTIONS = ['singer', 'dj', 'guitarist', 'dancer', 'anchor', 'comedian', 'photographer', 'violinist', 'magician', 'band'];
  const filteredSuggestions = talentQuery
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(talentQuery.toLowerCase())).slice(0, 6)
    : SUGGESTIONS.slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full min-h-[85vh] flex items-center justify-center relative px-4 py-20">
        <div className="absolute inset-0 bg-eventorz-navy/40 backdrop-blur-sm z-0"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-eventorz-purple/30 bg-eventorz-purple/10 text-eventorz-purple text-sm font-medium">
              ✨ Discover the best talents & spaces
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Flexible Venues.<br />
              <span className="text-gradient glow-text">Flexible Rates. FAST.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-eventorz-muted mb-8 max-w-2xl mx-auto">
              Find & Book Spaces for Your Creative Events.
              <span className="block mt-2 text-eventorz-gold font-semibold">Currently our service is available only in Bhopal with 20 best places.</span>
            </p>

            {/* Search Box */}
            <motion.form 
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="glass-panel p-2 rounded-2xl flex items-center relative z-20 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                <Search className="text-eventorz-muted ml-4 mr-2" size={24} />
                <input
                  type="text"
                  placeholder="Search for talents (e.g., singer, dj)..."
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-eventorz-slate text-lg py-3 px-2"
                  value={talentQuery}
                  onChange={(e) => { setTalentQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                <button type="submit" className="btn-primary py-3 px-8 rounded-xl ml-2 whitespace-nowrap hidden sm:flex">
                  Search
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 glass-panel border border-white/10 rounded-xl overflow-hidden z-30"
                >
                  {filteredSuggestions.map((s, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-3 hover:bg-eventorz-purple/20 cursor-pointer text-left text-eventorz-muted hover:text-white transition-colors flex items-center gap-3"
                      onMouseDown={(e) => { 
                        e.preventDefault();
                        setTalentQuery(s);
                        navigate(`/talents?skill=${encodeURIComponent(s)}`);
                        setShowSuggestions(false);
                      }}
                    >
                      <Search size={16} className="text-eventorz-purple/50" />
                      {s}
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.form>
            
            <button type="submit" onClick={handleSearch} className="btn-primary w-full py-4 rounded-xl mt-4 sm:hidden">
              Search Talents
            </button>
            
          </motion.div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-eventorz-purple/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-eventorz-blue/20 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-24 bg-eventorz-panel/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-eventorz-muted max-w-2xl mx-auto">Your journey to the perfect event in four simple steps.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { num: "01", title: "Search Venues", desc: "Browse through our curated collection of premium event spaces.", icon: MapPin },
              { num: "02", title: "Create Event", desc: "Set up your event details, requirements, and budget seamlessly.", icon: Calendar },
              { num: "03", title: "Recruit Talent", desc: "Find and invite perfectly matched talented performers.", icon: Users },
              { num: "04", title: "Execute & Rate", desc: "Host your event successfully and build lasting relationships.", icon: Star }
            ].map((step, idx) => (
              <motion.div key={idx} variants={itemVariants} className="glass-card p-8 text-center relative group">
                <div className="absolute top-0 right-0 p-4 text-4xl font-bold text-white/5 group-hover:text-eventorz-purple/10 transition-colors">
                  {step.num}
                </div>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-eventorz-purple/10 flex items-center justify-center text-eventorz-purple mb-6 group-hover:scale-110 group-hover:bg-eventorz-purple group-hover:text-white transition-all duration-300">
                  <step.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-eventorz-muted text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Spaces Section */}
      <section className="w-full py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Spaces</h2>
              <p className="text-eventorz-muted">Discover top-rated venues in your area</p>
            </div>
            <Link to="/venues" className="btn-secondary whitespace-nowrap">
              View All Venues <ArrowRight size={18} />
            </Link>
          </div>

          {venues.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-eventorz-slate">
                <MapPin size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4">No venues available yet</h3>
              <p className="text-eventorz-muted mb-8 max-w-md mx-auto">Be the first to list a premium space on our platform and reach hundreds of organizers.</p>
              <Link to="/login" className="btn-primary inline-flex">Login to Add Venues</Link>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {venues.map((venue) => (
                <motion.div key={venue._id} variants={itemVariants}>
                  <Link to={`/venues?venueId=${venue._id}`} className="glass-card block h-full group">
                    <div className="relative h-56 overflow-hidden">
                      {venue.images && venue.images.length > 0 ? (
                        <img 
                          src={venue.images[0]} 
                          alt={venue.name} 
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=400'; }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-eventorz-panel flex items-center justify-center text-4xl font-bold text-white/10 group-hover:scale-110 transition-transform duration-500">
                          {venue.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-eventorz-navy/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                        <Star size={14} className="text-eventorz-star fill-eventorz-star" />
                        <span className="text-sm font-semibold">4.8</span>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-eventorz-purple text-white px-3 py-1 rounded-lg font-bold shadow-lg">
                        ₹{venue.pricePerDay}<span className="text-xs font-normal opacity-80">/day</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-eventorz-purple transition-colors truncate">{venue.name}</h3>
                      <div className="flex items-center text-eventorz-muted text-sm mb-4">
                        <MapPin size={16} className="mr-1 shrink-0" />
                        <span className="truncate">{venue.location.city}, {venue.location.state}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <Users size={16} className="text-eventorz-slate" />
                        <span className="text-sm text-eventorz-slate">Capacity: <strong className="text-white">{venue.capacity}</strong></span>
                      </div>
                      
                      {venue.amenities && venue.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                          {venue.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="bg-white/5 px-2.5 py-1 rounded-md text-xs text-eventorz-muted border border-white/5">
                              {amenity}
                            </span>
                          ))}
                          {venue.amenities.length > 3 && (
                            <span className="bg-white/5 px-2.5 py-1 rounded-md text-xs text-eventorz-muted border border-white/5">
                              +{venue.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-eventorz-violet/20"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-eventorz-purple/30 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-eventorz-blue/30 rounded-full blur-[100px]"></div>
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to host your next big event?</h2>
          <p className="text-xl text-eventorz-muted mb-10">Join thousands of organizers and talents building the future of events.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-primary py-3 px-8 text-lg">Create an Account</Link>
            <Link to="/venues" className="btn-secondary py-3 px-8 text-lg">Explore Venues</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
