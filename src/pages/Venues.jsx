import { useState, useEffect } from 'react';
import { venueService } from '../services/venueService';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    minCapacity: '',
    maxPrice: '',
    sortBy: 'name'
  });
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [venues, filters]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const data = await venueService.getVenues();
      setVenues(data);
      setFilteredVenues(data);
    } catch (err) {
      console.error('Failed to load venues', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...venues];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        venue.location.address.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(venue =>
        venue.location.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Capacity filter
    if (filters.minCapacity) {
      filtered = filtered.filter(venue => venue.capacity >= parseInt(filters.minCapacity));
    }

    // Price filter
    if (filters.maxPrice) {
      filtered = filtered.filter(venue => venue.pricePerDay <= parseInt(filters.maxPrice));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.pricePerDay - b.pricePerDay;
        case 'price-high':
          return b.pricePerDay - a.pricePerDay;
        case 'capacity-low':
          return a.capacity - b.capacity;
        case 'capacity-high':
          return b.capacity - a.capacity;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredVenues(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      city: '',
      minCapacity: '',
      maxPrice: '',
      sortBy: 'name'
    });
  };

  const openVenueDetails = (venue) => {
    setSelectedVenue(venue);
  };

  const closeVenueDetails = () => {
    setSelectedVenue(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading venues...</div>
      </div>
    );
  }

  return (
    <div className="venues-page">
      {/* Header */}
      <div className="venues-header">
        <h1>Browse All Venues</h1>
        <p className="venues-subtitle">
          Discover the perfect venue for your event from our collection of {venues.length} amazing spaces
        </p>
      </div>

      {/* Filters Section */}
      <div className="venues-filters">
        <div className="filter-group">
          <input
            type="text"
            name="search"
            placeholder="Search venues..."
            value={filters.search}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <input
            type="number"
            name="minCapacity"
            placeholder="Min Capacity"
            value={filters.minCapacity}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price (₹)"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="capacity-low">Capacity: Low to High</option>
            <option value="capacity-high">Capacity: High to Low</option>
          </select>
        </div>

        <button onClick={resetFilters} className="btn-reset-filters">
          Reset Filters
        </button>
      </div>

      {/* Results Count */}
      <div className="venues-results-info">
        <p>Showing {filteredVenues.length} of {venues.length} venues</p>
      </div>

      {/* Venues Grid */}
      <div className="venues-grid-container">
        {filteredVenues.length === 0 ? (
          <div className="no-venues-found">
            <h3>No venues found</h3>
            <p>Try adjusting your filters to see more results</p>
            <button onClick={resetFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="venues-grid">
            {filteredVenues.map((venue) => (
              <div
                key={venue._id}
                className="venue-card"
                onClick={() => openVenueDetails(venue)}
              >
                <div className="venue-image">
                  {venue.images && venue.images.length > 0 ? (
                    <img src={venue.images[0]} alt={venue.name} />
                  ) : (
                    <div className="venue-placeholder">
                      <span>{venue.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="venue-price-badge">₹{venue.pricePerDay.toLocaleString()}/day</div>
                </div>

                <div className="venue-card-content">
                  <h3 className="venue-name">{venue.name}</h3>
                  <p className="venue-location">
                    📍 {venue.location.address}, {venue.location.city}
                  </p>
                  <p className="venue-capacity">
                    👥 Capacity: {venue.capacity} people
                  </p>

                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className="venue-amenities">
                      {venue.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="amenity-badge">{amenity}</span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <span className="amenity-badge">+{venue.amenities.length - 3} more</span>
                      )}
                    </div>
                  )}

                  <button className="btn-view-details">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Venue Details Modal */}
      {selectedVenue && (
        <div className="modal venue-modal" onClick={closeVenueDetails}>
          <div className="modal-content venue-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeVenueDetails}>×</button>

            <div className="venue-details">
              <div className="venue-details-header">
                {selectedVenue.images && selectedVenue.images.length > 0 && (
                  <img
                    src={selectedVenue.images[0]}
                    alt={selectedVenue.name}
                    className="venue-details-image"
                  />
                )}
                <div className="venue-details-info">
                  <h2>{selectedVenue.name}</h2>
                  <p className="venue-details-location">
                    📍 {selectedVenue.location.address}, {selectedVenue.location.city}, {selectedVenue.location.state} - {selectedVenue.location.zipCode}
                  </p>
                  <div className="venue-details-meta">
                    <span className="meta-item">👥 {selectedVenue.capacity} people</span>
                    <span className="meta-item price-meta">₹{selectedVenue.pricePerDay.toLocaleString()}/day</span>
                  </div>
                </div>
              </div>

              {selectedVenue.description && (
                <div className="venue-section">
                  <h3>About This Venue</h3>
                  <p>{selectedVenue.description}</p>
                </div>
              )}

              {selectedVenue.amenities && selectedVenue.amenities.length > 0 && (
                <div className="venue-section">
                  <h3>Amenities</h3>
                  <div className="amenities-list">
                    {selectedVenue.amenities.map((amenity, idx) => (
                      <span key={idx} className="amenity-item">✓ {amenity}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedVenue.availableAddOns && selectedVenue.availableAddOns.length > 0 && (
                <div className="venue-section">
                  <h3>Available Add-Ons</h3>
                  <div className="addons-list">
                    {selectedVenue.availableAddOns.map((addon, idx) => (
                      <div key={idx} className="addon-item">
                        <div className="addon-header">
                          <span className="addon-name">{addon.name}</span>
                          <span className="addon-price">₹{addon.price.toLocaleString()}</span>
                        </div>
                        {addon.description && (
                          <p className="addon-description">{addon.description}</p>
                        )}
                        <span className="addon-category">{addon.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedVenue.contactPerson && (
                <div className="venue-section">
                  <h3>Contact Information</h3>
                  <div className="contact-info">
                    <p><strong>Name:</strong> {selectedVenue.contactPerson.name}</p>
                    <p><strong>Phone:</strong> {selectedVenue.contactPerson.phone}</p>
                    <p><strong>Email:</strong> {selectedVenue.contactPerson.email}</p>
                  </div>
                </div>
              )}

              <div className="venue-modal-actions">
                <button className="btn-primary" onClick={closeVenueDetails}>
                  Book This Venue
                </button>
                <button className="btn-secondary" onClick={closeVenueDetails}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Venues;
