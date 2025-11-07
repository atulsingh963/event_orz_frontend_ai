import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';

    switch (user.role) {
      case 'eventOrganizer':
        return '/organizer/dashboard';
      case 'talent':
        return '/talent/dashboard';
      default:
        return '/';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'eventOrganizer':
        return 'Organizer';
      case 'talent':
        return 'Talent';
      default:
        return '';
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <img src={logo} alt="Event Organizer" className="brand-logo" />
        </Link>

        <div className="nav-center">
          <Link to="/venues" className="nav-link">
            <span className="search-icon">🏛️</span> Browse Venues
          </Link>
          <Link to="/talents" className="nav-link">
            <span className="search-icon">🎤</span> Browse Talents
          </Link>
          {isAuthenticated && user.role === 'eventOrganizer' && (
            <Link to="/" className="nav-link">
              <span className="search-icon">🔍</span> Search
            </Link>
          )}
        </div>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              {user.role === 'eventOrganizer' && (
                <>
                  {/* <Link to="/organizer/create-event" className="btn-list-space">
                    List Your Space
                  </Link> */}
                  <Link to="/organizer/dashboard" className="nav-link">My Events</Link>
                  <Link to="/organizer/talents" className="nav-link">Talent Management</Link>
                  <Link to="/profile" className="nav-link">My Profile</Link>
                </>
              )}
              {user.role === 'talent' && (
                <>
                  <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
                  <Link to="/profile" className="nav-link">Profile</Link>
                </>
              )}
              <span className="user-info">
                {user.name} <span className="user-role-badge">({getRoleDisplayName(user.role)})</span>
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
