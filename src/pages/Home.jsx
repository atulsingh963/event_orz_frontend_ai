import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Event Organizer Platform</h1>
        <p className="hero-subtitle">
          Connecting Event Organizers, Managers, and Talents for Seamless Event Execution
        </p>

        {!isAuthenticated ? (
          <div className="hero-actions">
            <Link to="/register" className="btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary btn-large">
              Login
            </Link>
          </div>
        ) : (
          <div className="hero-actions">
            <Link
              to={
                user.role === 'eventOrganizer'
                  ? '/organizer/dashboard'
                  : user.role === 'eventManager'
                  ? '/manager/dashboard'
                  : '/talent/dashboard'
              }
              className="btn-primary btn-large"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Event Organizers</h3>
            <p>Create events, book venues, invite managers, and manage the entire event lifecycle.</p>
          </div>

          <div className="feature-card">
            <h3>Event Managers</h3>
            <p>Recruit talented performers, send invitations, and manage the talent lineup.</p>
          </div>

          <div className="feature-card">
            <h3>Talents</h3>
            <p>Build your profile, receive invitations, and grow your reputation with ratings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
