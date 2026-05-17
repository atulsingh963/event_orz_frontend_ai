import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Clock, MapPin, IndianRupee, Trash2, Edit, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventService.deleteEvent(eventId);
      setEvents(events.filter(e => e._id !== eventId));
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-eventorz-purple/30 border-t-eventorz-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative w-full">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-eventorz-purple/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My <span className="text-gradient">Events</span></h1>
            <p className="text-eventorz-muted">Manage your upcoming and past events.</p>
          </div>
          <Link to="/organizer/create-event" className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Create New Event
          </Link>
        </div>

        {error && (
          <div className="bg-eventorz-red/10 border border-eventorz-red/30 text-eventorz-red p-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-16 text-center"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-eventorz-purple/50">
              <Calendar size={48} />
            </div>
            <h3 className="text-2xl font-bold mb-4">No events yet</h3>
            <p className="text-eventorz-muted mb-8 max-w-md mx-auto">You haven&apos;t created any events. Start organizing your first successful event today!</p>
            <Link to="/organizer/create-event" className="btn-primary inline-flex">
              Create Your First Event
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {events.map((event, idx) => (
                <motion.div 
                  key={event._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`glass-card p-6 flex flex-col relative overflow-hidden ${
                    event.status === 'confirmed' ? 'border-eventorz-green/30 shadow-[0_0_20px_rgba(107,183,109,0.1)]' : ''
                  }`}
                >
                  {event.status === 'confirmed' && (
                    <div className="absolute top-0 right-0 bg-eventorz-green text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <CheckCircle2 size={12} /> Ready
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold truncate pr-4">{event.title}</h3>
                    <span className={`badge ${
                      event.status === 'confirmed' ? 'badge-success' : 
                      event.status === 'draft' ? 'bg-white/10 text-white border border-white/20' : 
                      'badge-purple'
                    } capitalize shrink-0`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <p className="text-eventorz-muted text-sm line-clamp-2 mb-6">
                    {event.description}
                  </p>
                  
                  <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={16} className="text-eventorz-purple shrink-0" />
                      <span className="text-white">{new Date(event.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock size={16} className="text-eventorz-purple shrink-0" />
                      <span className="text-white">{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin size={16} className="text-eventorz-purple shrink-0" />
                      <span className="text-white truncate">{event.venue?.name || 'No venue selected'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <IndianRupee size={16} className="text-eventorz-purple shrink-0" />
                      <span className="text-white font-semibold">₹{event.budget?.totalPrice?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto grid grid-cols-3 gap-2">
                    <Link to={`/organizer/events/${event._id}`} className="btn-primary py-2 px-0 text-sm flex items-center justify-center col-span-2">
                      Manage Event <ChevronRight size={16} />
                    </Link>
                    <div className="flex gap-2 col-span-1">
                      <Link to={`/organizer/events/${event._id}/edit`} className="bg-white/5 hover:bg-white/10 text-white rounded-xl flex-1 flex items-center justify-center transition-colors">
                        <Edit size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDeleteEvent(event._id)}
                        className="bg-eventorz-red/10 hover:bg-eventorz-red/20 text-eventorz-red rounded-xl flex-1 flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
