import { useState, useEffect } from 'react';
import { venueService } from '../services/venueService';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Filter, Star, X, Calendar, ShieldCheck, Mail, Phone, IndianRupee, ArrowRight } from 'lucide-react';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    minCapacity: '',
    maxPrice: '',
    sortBy: 'name'
  });
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    applyFilters();
    // Open modal if venueId is present in URL
    const venueIdFromUrl = searchParams.get('venueId');
    if (venueIdFromUrl && venues.length > 0) {
      const v = venues.find(v => v._id === venueIdFromUrl);
      if (v) setSelectedVenue(v);
    }
  }, [venues, filters, searchParams]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const data = await venueService.getVenues();
      setVenues(data);
      setFilteredVenues(data);
    } catch (err) {
      console.error('Failed to load venues', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...venues];

    if (filters.search) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        venue.location.address.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter(venue =>
        venue.location.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.minCapacity) {
      filtered = filtered.filter(venue => venue.capacity >= parseInt(filters.minCapacity));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(venue => venue.pricePerDay <= parseInt(filters.maxPrice));
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low': return a.pricePerDay - b.pricePerDay;
        case 'price-high': return b.pricePerDay - a.pricePerDay;
        case 'capacity-low': return a.capacity - b.capacity;
        case 'capacity-high': return b.capacity - a.capacity;
        case 'name':
        default: return a.name.localeCompare(b.name);
      }
    });

    setFilteredVenues(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      city: '',
      minCapacity: '',
      maxPrice: '',
      sortBy: 'name'
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative w-full">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-eventorz-purple/10 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Browse <span className="text-gradient">Premium Venues</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-eventorz-muted text-lg max-w-2xl mx-auto"
          >
            Discover the perfect venue for your next event from our collection of {venues.length} amazing spaces.
          </motion.p>
        </div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-4 mb-8 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full md:w-96 flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-eventorz-slate" size={20} />
            <input
              type="text"
              name="search"
              placeholder="Search venues by name or address..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full bg-eventorz-navy/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-eventorz-purple transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${isFilterOpen ? 'bg-eventorz-purple border-eventorz-purple text-white' : 'bg-transparent border-white/10 text-eventorz-muted hover:text-white'}`}
            >
              <Filter size={18} /> Filters
            </button>
            <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block"></div>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="bg-eventorz-navy/50 border border-white/10 rounded-xl py-3 px-4 text-eventorz-muted focus:outline-none focus:border-eventorz-purple appearance-none pr-10 relative"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="capacity-low">Capacity: Low to High</option>
              <option value="capacity-high">Capacity: High to Low</option>
            </select>
          </div>
        </motion.div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="glass-panel overflow-hidden"
            >
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="form-label text-sm">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="form-label text-sm">Minimum Capacity</label>
                  <input
                    type="number"
                    name="minCapacity"
                    placeholder="e.g. 100"
                    value={filters.minCapacity}
                    onChange={handleFilterChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="form-label text-sm">Max Price (₹)</label>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="e.g. 50000"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="px-6 pb-6 flex justify-end">
                <button onClick={resetFilters} className="text-eventorz-muted hover:text-white text-sm font-medium transition-colors">
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6 flex justify-between items-center text-sm text-eventorz-slate">
          <span>Showing <strong className="text-white">{filteredVenues.length}</strong> of {venues.length} venues</span>
        </div>

        {/* Venues Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-eventorz-purple/20 border-t-eventorz-purple rounded-full animate-spin"></div>
          </div>
        ) : filteredVenues.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="glass-card p-12 text-center"
          >
            <MapPin size={48} className="mx-auto text-eventorz-slate mb-4 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">No venues found</h3>
            <p className="text-eventorz-muted mb-6">Try adjusting your filters to see more results</p>
            <button onClick={resetFilters} className="btn-secondary">Clear Filters</button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map((venue, idx) => (
              <motion.div
                key={venue._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card flex flex-col h-full group cursor-pointer"
                onClick={() => setSelectedVenue(venue)}
              >
                <div className="relative h-60 overflow-hidden">
                  {venue.images && venue.images.length > 0 ? (
                    <img 
                      src={venue.images[0]} 
                      alt={venue.name} 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=400'; }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-eventorz-navy flex items-center justify-center text-5xl font-bold text-white/5 transition-transform duration-700 group-hover:scale-110">
                      {venue.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-eventorz-navy via-transparent to-transparent opacity-60"></div>
                  
                  <div className="absolute top-4 left-4 bg-eventorz-panel/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                    <Star size={14} className="text-eventorz-star fill-eventorz-star" />
                    <span className="text-sm font-semibold">4.8</span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="bg-eventorz-purple/90 backdrop-blur-md text-white px-4 py-1.5 rounded-lg font-bold shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                      ₹{venue.pricePerDay.toLocaleString()}<span className="text-xs font-normal opacity-80">/day</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-eventorz-purple transition-colors">
                      <ArrowRight size={18} className="text-white transform group-hover:-rotate-45 transition-transform" />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-eventorz-purple transition-colors">{venue.name}</h3>
                  
                  <div className="flex items-center text-eventorz-muted text-sm mb-4">
                    <MapPin size={16} className="mr-1.5 shrink-0 text-eventorz-purple" />
                    <span className="truncate">{venue.location.address}, {venue.location.city}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                    <Users size={18} className="text-eventorz-slate" />
                    <span className="text-sm">Capacity: <strong className="text-white">{venue.capacity} people</strong></span>
                  </div>

                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto pt-4">
                      {venue.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="badge bg-white/5 border border-white/10 text-eventorz-muted text-xs">
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <span className="badge bg-eventorz-purple/20 border border-eventorz-purple/30 text-eventorz-purple text-xs">
                          +{venue.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Venue Details Modal */}
      <AnimatePresence>
        {selectedVenue && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-eventorz-navy/80 backdrop-blur-sm"
            onClick={() => setSelectedVenue(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-t-3xl">
                {selectedVenue.images && selectedVenue.images.length > 0 ? (
                  <img src={selectedVenue.images[0]} alt={selectedVenue.name} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800'; }} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-eventorz-panel flex items-center justify-center text-4xl text-white/10 font-bold">
                    {selectedVenue.name}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-eventorz-navy to-transparent"></div>
                
                <button 
                  onClick={() => setSelectedVenue(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-eventorz-red/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/10"
                >
                  <X size={20} />
                </button>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{selectedVenue.name}</h2>
                      <div className="flex items-center text-eventorz-muted text-sm md:text-base">
                        <MapPin size={18} className="mr-2 text-eventorz-purple" />
                        {selectedVenue.location.address}, {selectedVenue.location.city}, {selectedVenue.location.state}
                      </div>
                    </div>
                    <div className="hidden md:block bg-eventorz-purple text-white px-6 py-2 rounded-xl font-bold text-xl shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                      ₹{selectedVenue.pricePerDay.toLocaleString()}
                      <span className="text-sm font-normal opacity-80 block text-center">per day</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <Users className="text-eventorz-purple mb-2" size={24} />
                    <span className="text-sm text-eventorz-slate mb-1">Capacity</span>
                    <span className="font-bold text-lg">{selectedVenue.capacity}</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <IndianRupee className="text-eventorz-purple mb-2" size={24} />
                    <span className="text-sm text-eventorz-slate mb-1">Price/Day</span>
                    <span className="font-bold text-lg">₹{selectedVenue.pricePerDay.toLocaleString()}</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <Star className="text-eventorz-star mb-2" size={24} />
                    <span className="text-sm text-eventorz-slate mb-1">Rating</span>
                    <span className="font-bold text-lg">4.8/5.0</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <ShieldCheck className="text-eventorz-green mb-2" size={24} />
                    <span className="text-sm text-eventorz-slate mb-1">Status</span>
                    <span className="font-bold text-lg text-eventorz-green">Verified</span>
                  </div>
                </div>

                {selectedVenue.description && (
                  <div>
                    <h3 className="text-xl font-bold mb-3 border-b border-white/10 pb-2">About This Venue</h3>
                    <p className="text-eventorz-muted leading-relaxed">{selectedVenue.description}</p>
                  </div>
                )}

                {selectedVenue.amenities && selectedVenue.amenities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedVenue.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-eventorz-muted">
                          <div className="w-5 h-5 rounded-full bg-eventorz-green/20 text-eventorz-green flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVenue.contactPerson && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Contact Information</h3>
                    <div className="bg-eventorz-navy/50 rounded-xl p-6 border border-white/5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                      <div>
                        <p className="font-bold text-lg mb-1">{selectedVenue.contactPerson.name}</p>
                        <p className="text-eventorz-purple text-sm">Property Manager</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-eventorz-muted">
                          <Phone size={16} /> {selectedVenue.contactPerson.phone}
                        </div>
                        <div className="flex items-center gap-3 text-eventorz-muted">
                          <Mail size={16} /> {selectedVenue.contactPerson.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-white/10 bg-eventorz-navy/30 flex flex-col sm:flex-row justify-end gap-4 rounded-b-3xl">
                <button className="btn-secondary w-full sm:w-auto" onClick={() => setSelectedVenue(null)}>
                  Close
                </button>
                <button className="btn-primary w-full sm:w-auto" onClick={() => navigate(`/organizer/create-event?venueId=${selectedVenue._id}`)}>
                  Book This Venue <Calendar size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Venues;
