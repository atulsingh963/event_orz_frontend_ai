import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Briefcase, Link as LinkIcon, Camera, Plus, X, Save, AlertCircle, Star } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    skills: [],
    portfolio: '',
    profileImage: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      const normalizedSkills = Array.isArray(user.skills)
        ? user.skills.map((s) => (typeof s === 'string' ? s : s?.skill)).filter(Boolean)
        : [];
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        skills: normalizedSkills,
        portfolio: user.portfolio || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = () => {
    const newSkill = skillInput.trim();
    if (!newSkill) return;
    // Compare case-insensitively to avoid duplicates like "Singer" vs "singer"
    const exists = formData.skills.some((s) => s.toLowerCase() === newSkill.toLowerCase());
    if (!exists) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill]
      });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 relative w-full flex items-center justify-center">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-eventorz-purple/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl glass-card relative z-10 p-8 md:p-10"
      >
        <div className="text-center mb-8 border-b border-white/10 pb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Edit Profile</h2>
          <p className="text-eventorz-muted">Update your personal information and portfolio</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl mb-8 flex items-start gap-3 text-sm ${message.type === 'success' ? 'bg-eventorz-green/10 text-eventorz-green border border-eventorz-green/30' : 'bg-eventorz-red/10 text-eventorz-red border border-eventorz-red/30'}`}>
            <AlertCircle size={18} className="shrink-0 mt-0.5" /> 
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Information Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-eventorz-purple" /> Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label text-sm">Full Name <span className="text-eventorz-red">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-eventorz-slate" />
                  </div>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your name" className="input-field pl-11" />
                </div>
              </div>
              
              <div>
                <label className="form-label text-sm">Email Address <span className="text-eventorz-red">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-eventorz-slate" />
                  </div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled className="input-field pl-11 bg-eventorz-navy/50 text-eventorz-slate cursor-not-allowed border-dashed" />
                </div>
                <p className="text-xs text-eventorz-slate mt-2 ml-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="form-label text-sm">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone size={18} className="text-eventorz-slate" />
                  </div>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" className="input-field pl-11" />
                </div>
              </div>
              
              <div>
                <label className="form-label text-sm">Account Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Briefcase size={18} className="text-eventorz-slate" />
                  </div>
                  <input type="text" value={user?.role === 'talent' ? 'Talent' : user?.role === 'eventManager' ? 'Event Manager' : 'Event Organizer'} disabled className="input-field pl-11 bg-eventorz-navy/50 text-eventorz-slate cursor-not-allowed border-dashed" />
                </div>
                <p className="text-xs text-eventorz-slate mt-2 ml-1">Role cannot be changed</p>
              </div>
            </div>
          </div>
          
          {/* Talent Information Section */}
          {user?.role === 'talent' && (
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Star size={20} className="text-eventorz-purple" /> Professional Details
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="form-label text-sm">Professional Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" placeholder="Tell organizers about yourself and your experience" maxLength="500" className="input-field resize-none"></textarea>
                  <p className="text-xs text-eventorz-slate mt-2 ml-1 text-right">{formData.bio.length}/500 characters</p>
                </div>
                
                <div>
                  <label className="form-label text-sm">Skills & Expertise <span className="text-eventorz-red">*</span></label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                    <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="e.g., Singer, Dancer, Host" onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }} className="input-field w-full sm:flex-1" />
                    <button type="button" onClick={handleAddSkill} className="btn-secondary py-3 px-6 w-full sm:w-auto whitespace-nowrap flex items-center justify-center gap-2">
                      <Plus size={18} /> Add Skill
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 p-5 bg-eventorz-navy/50 border border-white/5 rounded-xl min-h-[80px]">
                    {formData.skills.length === 0 ? (
                      <p className="text-eventorz-slate text-sm italic m-auto">No skills added yet. Add at least one skill.</p>
                    ) : (
                      formData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 bg-eventorz-purple/20 border border-eventorz-purple/30 text-eventorz-purple px-3 py-1.5 rounded-lg text-sm font-medium">
                          {skill}
                          <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-eventorz-purple hover:text-eventorz-red transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label text-sm">Portfolio URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LinkIcon size={18} className="text-eventorz-slate" />
                      </div>
                      <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://yourportfolio.com" className="input-field pl-11" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label text-sm">Profile Image URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Camera size={18} className="text-eventorz-slate" />
                      </div>
                      <input type="url" name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder="https://example.com/image.jpg" className="input-field pl-11" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-8 border-t border-white/10 flex justify-end">
            <button type="submit" className="btn-primary py-3 px-8 text-lg w-full md:w-auto" disabled={loading}>
              {loading ? 'Saving...' : <span className="flex items-center justify-center gap-2"><Save size={18} /> Save Changes</span>}
            </button>
          </div>
          
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
