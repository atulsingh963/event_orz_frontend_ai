import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Briefcase, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'talent'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      switch (user.role) {
        case 'eventOrganizer':
          navigate('/organizer/dashboard');
          break;
        case 'talent':
          navigate('/talent/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative w-full py-12">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-eventorz-purple/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-eventorz-blue/20 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 md:p-10 relative z-10">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="EventOrz Logo" className="h-12 w-auto mx-auto" />
            </Link>
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-eventorz-muted">Join the premier event organization platform</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-eventorz-red/10 border border-eventorz-red/30 text-eventorz-red p-4 rounded-xl mb-6 flex items-start gap-3 text-sm"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label text-sm">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-eventorz-slate" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="form-label text-sm">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-eventorz-slate" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="form-label text-sm">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-eventorz-slate" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="••••••••"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="form-label text-sm">Account Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase size={18} className="text-eventorz-slate" />
                </div>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange} 
                  required
                  className="input-field pl-11 appearance-none bg-eventorz-navy/80"
                >
                  <option value="talent">Talent / Performer</option>
                  <option value="eventOrganizer">Event Organizer</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-eventorz-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <p className="text-xs text-eventorz-slate mt-2 ml-1">
                You can update your profile and add skills after registration.
              </p>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full py-3 mt-6" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-eventorz-muted text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-eventorz-purple hover:text-white font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
