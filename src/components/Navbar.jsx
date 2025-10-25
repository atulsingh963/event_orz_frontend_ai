import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';

    switch (user.role) {
      case 'eventOrganizer':
        return '/organizer/dashboard';
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
          Event Organizer
        </Link>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()}>Dashboard</Link>
              <span className="user-info">
                {user.name} ({user.role})
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
