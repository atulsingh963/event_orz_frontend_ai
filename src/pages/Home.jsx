import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { venueService } from '../services/venueService';
import indiaMapBg from '../assets/india_earth_satellite_map.jpg';

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [searchData, setSearchData] = useState({
    eventType: '',
    location: ''
  });

  useEffect(() => {
    fetchFeaturedVenues();
  }, []);

  const fetchFeaturedVenues = async () => {
    try {
      const data = await venueService.getVenues();
      setVenues(data.slice(0, 6)); // Get first 6 venues
    } catch (err) {
      console.error('Failed to load venues', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter venues based on search
    const filtered = venues.filter(venue => {
      const matchesLocation = searchData.location
        ? venue.location.city.toLowerCase().includes(searchData.location.toLowerCase())
        : true;
      return matchesLocation;
    });
    setVenues(filtered);
  };

  return (
    <div className="home-container-new">
      {/* Hero Section */}
      <div className="hero-section-new" style={{
        backgroundImage: `url(${indiaMapBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Flexible Venues.<br />Flexible Rates. FAST.</h1>
            <p className="hero-subtitle">Find & Book Spaces for Your Creative Events</p>
            <p style={{ color: '#E52A2C', fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: '500' }}>
              Currently our service is available only in Bhopal with 20 best places
            </p>

            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="What are you planning?"
                className="search-input"
                value={searchData.eventType}
                onChange={(e) => setSearchData({ ...searchData, eventType: e.target.value })}
              />
              <input
                type="text"
                placeholder="Where? (Enter a city)"
                className="search-input"
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Spaces Section */}
      <div className="featured-section-wrapper">
        <div className="featured-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 className="featured-title">Featured Spaces</h2>
            <Link to="/venues" className="btn-view-all" style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              color: '#667eea',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              View All {venues.length > 6 ? venues.length : ''} Venues →
            </Link>
          </div>
          <div className="venues-grid">
          {venues.length === 0 ? (
            <div className="empty-venues">
              <p>No venues available. Please add some venues first.</p>
              <Link to="/login" className="btn-primary">Login to Add Venues</Link>
            </div>
          ) : (
            venues.map((venue) => (
              <Link to="/login" key={venue._id} className="venue-card">
                <div className="venue-image">
                  {venue.images && venue.images.length > 0 ? (
                    <img src={venue.images[0]} alt={venue.name} />
                  ) : (
                    <div className="venue-placeholder">
                      <span>{venue.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="venue-price">₹{venue.pricePerDay}</div>
                </div>
                <div className="venue-info">
                  <h3 className="venue-name">{venue.name}</h3>
                  <p className="venue-location">
                    {venue.location.city}, {venue.location.state}
                  </p>
                  <p className="venue-capacity">Capacity: {venue.capacity} people</p>
                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className="venue-amenities">
                      {venue.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="amenity-tag">{amenity}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Search Venues</h3>
            <p>Browse through our curated collection of event spaces</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Create Your Event</h3>
            <p>Set up your event details and requirements</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Recruit Talent</h3>
            <p>Find and invite talented performers for your event</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Execute & Rate</h3>
            <p>Host your event and build lasting relationships</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
