import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        return '/organizer/dashboard'; // Event organizers see home page, but this is for "My Events"
      case 'eventManager':
        return '/manager/dashboard';
      case 'talent':
        return '/talent/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">📅</span>
          <span className="brand-text">Event Organizer</span>
        </Link>

        <div className="nav-center">
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
                  <Link to="/organizer/create-event" className="btn-list-space">
                    List Your Space
                  </Link>
                  <Link to="/organizer/dashboard" className="nav-link">My Events</Link>
                </>
              )}
              {user.role === 'eventManager' && (
                <>
                  <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
                  <Link to="/profile" className="nav-link">Profile</Link>
                </>
              )}
              {user.role === 'talent' && (
                <>
                  <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
                  <Link to="/profile" className="nav-link">Profile</Link>
                </>
              )}
              <span className="user-info">
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
