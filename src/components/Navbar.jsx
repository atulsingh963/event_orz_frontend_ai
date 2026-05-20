import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, LayoutDashboard, Search, Home as HomeIcon, Menu, X, MapPin, Mic2 } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'eventOrganizer': return '/organizer/dashboard';
      case 'talent': return '/talent/dashboard';
      default: return '/';
    }
  };

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
        isActive(to) 
          ? "bg-eventorz-purple/20 text-eventorz-purple shadow-[0_0_10px_rgba(139,92,246,0.2)] border border-eventorz-purple/30" 
          : "text-eventorz-muted hover:text-eventorz-white hover:bg-white/5"
      )}
    >
      {Icon && <Icon size={16} />}
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b border-white/5 bg-eventorz-navy/80 rounded-none rounded-b-2xl mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img src={logo} alt="EventOrz Logo" className="h-10 w-auto" />
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-purple hidden sm:block">
              EventOrz
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavItem to="/" icon={HomeIcon}>Home</NavItem>
            <NavItem to="/venues" icon={MapPin}>Venues</NavItem>
            <NavItem to="/talents" icon={Mic2}>Talents</NavItem>
            
            {isAuthenticated ? (
              <>
                <div className="h-6 w-px bg-white/10 mx-2"></div>
                
                {user.role === 'eventOrganizer' && (
                  <>
                    <NavItem to="/organizer/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
                    <NavItem to="/organizer/talents" icon={Search}>Manage</NavItem>
                  </>
                )}
                
                {user.role === 'talent' && (
                  <NavItem to={getDashboardLink()} icon={LayoutDashboard}>Dashboard</NavItem>
                )}
                
                <NavItem to="/profile" icon={User}>Profile</NavItem>
                
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-eventorz-purple">{user.role === 'eventOrganizer' ? 'Organizer' : 'Talent'}</p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2 text-eventorz-muted hover:text-eventorz-red hover:bg-eventorz-red/10 rounded-xl transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-eventorz-muted hover:text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-white/5 rounded-b-2xl rounded-t-none"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <NavItem to="/" icon={HomeIcon}>Home</NavItem>
              <NavItem to="/venues" icon={MapPin}>Venues</NavItem>
              <NavItem to="/talents" icon={Mic2}>Talents</NavItem>
              
              {isAuthenticated ? (
                <>
                  <div className="h-px w-full bg-white/10 my-2"></div>
                  {user.role === 'eventOrganizer' && (
                    <>
                      <NavItem to="/organizer/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
                      <NavItem to="/organizer/talents" icon={Search}>Manage Talents</NavItem>
                    </>
                  )}
                  {user.role === 'talent' && (
                    <NavItem to={getDashboardLink()} icon={LayoutDashboard}>Dashboard</NavItem>
                  )}
                  <NavItem to="/profile" icon={User}>Profile</NavItem>
                  
                  <div className="h-px w-full bg-white/10 my-2"></div>
                  <div className="flex items-center justify-between px-4 py-2">
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-eventorz-purple">{user.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-eventorz-red text-sm font-medium"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-px w-full bg-white/10 my-2"></div>
                  <Link to="/login" className="flex items-center justify-center w-full py-3 text-eventorz-white bg-white/5 rounded-xl font-medium mb-2">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary w-full flex justify-center py-3">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
