import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { invitationService } from '../../services/invitationService';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Calendar, Clock, MapPin, IndianRupee, Users, CheckCircle2, XCircle, Info, User, AlertCircle, Eye } from 'lucide-react';

const TalentDashboard = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const data = await invitationService.getMyInvitations();
      setInvitations(data);
    } catch (err) {
      console.error('Failed to load invitations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (invitationId, status) => {
    try {
      await invitationService.respondToInvitation(invitationId, status);
      fetchInvitations();
    } catch (err) {
      alert('Failed to respond to invitation');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-eventorz-purple/30 border-t-eventorz-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="badge badge-warning flex items-center gap-1"><Info size={12}/> Pending</span>;
      case 'accepted': return <span className="badge badge-success flex items-center gap-1"><CheckCircle2 size={12}/> Accepted</span>;
      case 'rejected': return <span className="badge badge-error flex items-center gap-1"><XCircle size={12}/> Rejected</span>;
      case 'cancelled': return <span className="badge bg-white/10 text-white border border-white/20 flex items-center gap-1"><AlertCircle size={12}/> Cancelled</span>;
      default: return <span className="badge badge-purple">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative w-full">
      <div className="absolute top-0 right-0 w-96 h-96 bg-eventorz-blue/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">My <span className="text-gradient">Dashboard</span></h1>
          <p className="text-eventorz-muted">Manage your event invitations and schedule.</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Mail className="text-eventorz-purple" size={24} /> 
            Your Invitations ({invitations.length})
          </h2>

          {invitations.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-16 text-center"
            >
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-eventorz-slate">
                <Mail size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-4">No invitations yet</h3>
              <p className="text-eventorz-muted mb-8 max-w-md mx-auto">Build out your profile to attract event organizers. Opportunities will appear here.</p>
              <Link to="/profile" className="btn-primary inline-flex">
                Complete Your Profile
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {invitations.map((invitation, idx) => (
                  <motion.div 
                    key={invitation._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`glass-card p-6 flex flex-col relative overflow-hidden ${
                      invitation.status === 'accepted' ? 'border-eventorz-green/30 shadow-[0_0_20px_rgba(107,183,109,0.1)]' : 
                      invitation.status === 'pending' ? 'border-eventorz-amber/30' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="pr-4">
                        <div className="text-xs font-semibold text-eventorz-purple uppercase tracking-wider mb-1 flex items-center gap-1">
                          Role: {invitation.skill}
                        </div>
                        <h3 className="text-xl font-bold">{invitation.event?.title}</h3>
                      </div>
                      <div className="shrink-0">{getStatusBadge(invitation.status)}</div>
                    </div>
                    
                    {invitation.message && (
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6 italic text-sm text-eventorz-muted relative">
                        <div className="absolute -top-3 -left-2 text-4xl text-eventorz-purple/30">&quot;</div>
                        {invitation.message}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar size={16} className="text-eventorz-slate shrink-0" />
                        <span className="text-white">{new Date(invitation.event?.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock size={16} className="text-eventorz-slate shrink-0" />
                        <span className="text-white">{invitation.event?.startTime} - {invitation.event?.endTime}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin size={16} className="text-eventorz-slate shrink-0" />
                        <span className="text-white truncate">{invitation.event?.venue?.location?.city || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Users size={16} className="text-eventorz-slate shrink-0" />
                        <span className="text-white">{invitation.event?.attendees ?? 'TBD'} guests</span>
                      </div>
                      {invitation.compensation && (
                        <div className="flex items-center gap-3 text-sm col-span-2 bg-eventorz-purple/10 p-2 rounded-lg border border-eventorz-purple/20">
                          <IndianRupee size={16} className="text-eventorz-purple shrink-0" />
                          <span className="text-white font-bold">₹{invitation.compensation.amount} <span className="font-normal text-eventorz-slate">offered</span></span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-eventorz-slate mb-6 border-t border-white/5 pt-4">
                      <div className="flex items-center gap-1"><User size={12} /> By {invitation.invitedBy?.name}</div>
                      <div className="flex items-center gap-1"><Clock size={12} /> Respond by {new Date(invitation.expiryDate).toLocaleDateString()}</div>
                    </div>
                    
                    <div className="mt-auto pt-2 flex flex-col sm:flex-row gap-3">
                      <Link to={`/talent/events/${invitation.event?._id}`} className="btn-secondary py-2 flex-1 flex items-center justify-center text-sm">
                        <Eye size={16} className="mr-2" /> Details
                      </Link>
                      
                      {invitation.status === 'pending' && (
                        <div className="flex gap-2 flex-1">
                          <button onClick={() => handleRespond(invitation._id, 'accepted')} className="btn-success py-2 flex-1 text-sm">
                            Accept
                          </button>
                          <button onClick={() => handleRespond(invitation._id, 'rejected')} className="btn-danger py-2 flex-1 text-sm">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {invitation.status === 'cancelled' && invitation.cancellationReason && (
                      <div className="mt-4 p-3 bg-eventorz-red/10 border border-eventorz-red/20 rounded-lg text-sm text-eventorz-red flex items-start gap-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <div>
                          <strong>Reason:</strong> {invitation.cancellationReason}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentDashboard;
