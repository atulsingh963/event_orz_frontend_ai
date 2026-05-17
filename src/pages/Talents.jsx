import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { talentService } from '../services/talentService';
import { motion } from 'framer-motion';
import { Search, Star, Mic2, Briefcase, User, Mail } from 'lucide-react';

const Talents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const initialSkill = searchParams.get('skill') || '';
  const [skill, setSkill] = useState(initialSkill);

  const query = useMemo(() => {
    const params = {};
    if (skill.trim()) params.skill = skill.trim();
    return params;
  }, [skill]);

  useEffect(() => {
    const fetchTalents = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await talentService.getTalents(query);
        setTalents(data);
      } catch (e) {
        setError('Failed to load talents');
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (skill.trim()) params.skill = skill.trim();
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative w-full">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-eventorz-blue/10 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Find <span className="text-gradient">Top Talents</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-eventorz-muted text-lg max-w-2xl mx-auto"
          >
            Discover and connect with highly rated performers and professionals for your events.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <form onSubmit={handleSearch} className="glass-panel p-2 rounded-2xl flex items-center relative shadow-lg">
            <Search className="text-eventorz-slate ml-4 mr-2" size={24} />
            <input
              type="text"
              placeholder="e.g. singer, dj, guitarist, photographer..."
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-eventorz-slate text-lg py-3 px-2"
            />
            <button type="submit" className="btn-primary py-3 px-8 rounded-xl ml-2 whitespace-nowrap">
              Search
            </button>
          </form>
        </motion.div>

        {error && (
          <div className="bg-eventorz-red/10 border border-eventorz-red/30 text-eventorz-red p-4 rounded-xl mb-8 max-w-3xl mx-auto text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-eventorz-blue/20 border-t-eventorz-blue rounded-full animate-spin"></div>
          </div>
        ) : talents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="glass-card p-12 text-center max-w-3xl mx-auto"
          >
            <Mic2 size={48} className="mx-auto text-eventorz-slate mb-4 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">No talents found {skill && `for "${skill}"`}</h3>
            <p className="text-eventorz-muted mb-6">Try a different skill or broaden your search criteria.</p>
            <button onClick={() => { setSkill(''); setSearchParams({}); }} className="btn-secondary">
              View All Talents
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {talents.map((t, idx) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card flex flex-col h-full group"
              >
                <div className="p-6 flex flex-col items-center text-center relative border-b border-white/5">
                  <div className="absolute top-4 right-4">
                    {typeof t.averageRating === 'number' && (
                      <div className="bg-eventorz-panel border border-white/10 px-2 py-1 rounded-md flex items-center gap-1">
                        <Star size={12} className="text-eventorz-star fill-eventorz-star" />
                        <span className="text-xs font-bold">{t.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-24 h-24 rounded-full bg-gradient-purple flex items-center justify-center text-3xl font-bold text-white shadow-lg mb-4 transform group-hover:scale-105 transition-transform">
                    {t.name?.charAt(0).toUpperCase()}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-eventorz-purple transition-colors">{t.name}</h3>
                  <div className="text-sm text-eventorz-muted flex items-center gap-1 justify-center">
                    <Briefcase size={14} /> Professional Talent
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  {t.bio && (
                    <p className="text-sm text-eventorz-slate line-clamp-3 mb-4 italic">
                      &quot;{t.bio}&quot;
                    </p>
                  )}
                  
                  <div className="mt-auto">
                    <div className="text-xs font-semibold text-eventorz-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Star size={12} className="text-eventorz-purple" /> Expertise
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {t.skills?.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="badge badge-purple text-xs">
                          {s.skill}
                        </span>
                      ))}
                      {t.skills?.length > 4 && (
                        <span className="badge bg-white/5 text-eventorz-muted text-xs border border-white/10">
                          +{t.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                    <Link to={`/login`} className="btn-secondary py-2 px-0 text-sm w-full text-center group-hover:bg-eventorz-purple group-hover:text-white group-hover:border-eventorz-purple flex justify-center items-center">
                      <Mail size={14} className="mr-1.5" /> Invite
                    </Link>
                    <Link to={`/talents/${t._id}`} className="btn-ghost py-2 px-0 text-sm w-full text-center bg-white/5 border border-white/10 flex justify-center items-center">
                      <User size={14} className="mr-1.5" /> Profile
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Talents;
