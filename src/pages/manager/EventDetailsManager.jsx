import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { invitationService } from '../../services/invitationService';

const EventDetailsManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
    fetchInvitations();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (err) {
      console.error('Failed to load event', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      const data = await invitationService.getEventInvitations(id);
      setInvitations(data);
    } catch (err) {
      console.error('Failed to load invitations', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!event) return <div className="error-message">Event not found</div>;

  const getTalentStats = () => {
    const total = event.requiredSkills?.length || 0;
    const accepted = invitations.filter(inv => inv.status === 'accepted').length;
    return { total, accepted };
  };

  const talentStats = getTalentStats();

  return (
    <div style={{ padding: '2rem' }}>
      <div className="event-details-container">
        {/* Header */}
        <div className="event-details-header">
          <div>
            <h1>{event.title}</h1>
            <div className="event-meta">
              <span className={`status-badge status-${event.status}`}>{event.status}</span>
              <span className="event-date">
                📅 {new Date(event.eventDate).toLocaleDateString()}
              </span>
              <span className="event-time">
                🕐 {event.startTime} - {event.endTime}
              </span>
            </div>
          </div>

          <div className="event-actions">
            <Link to="/manager/dashboard" className="btn-secondary">
              ← Back to Dashboard
            </Link>
            <Link to={`/manager/events/${id}/talents`} className="btn-primary">
              Manage Talents
            </Link>
          </div>
        </div>

        {/* Success banner if event is confirmed and ready */}
        {event.status === 'confirmed' && (
          <div className="success-banner">
            <div className="success-banner-icon">✓</div>
            <div className="success-banner-content">
              <h3>Event is Ready to Go!</h3>
              <p>All talents have been confirmed and everything looks good. Your event is ready to execute.</p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="event-details-grid">
          {/* Left Column */}
          <div className="details-column">
            <div className="details-card">
              <h2>Event Information</h2>
              <div className="info-item">
                <strong>Description:</strong>
                <p>{event.description}</p>
              </div>
              <div className="info-item">
                <strong>Category:</strong>
                <p>{event.category}</p>
              </div>
              <div className="info-item">
                <strong>Expected Attendees:</strong>
                <p>{event.attendees || 'Not specified'}</p>
              </div>
              <div className="info-item">
                <strong>Organizer:</strong>
                <p>{event.organizer?.name}</p>
                {event.organizer?.email && <p className="contact-info">📧 {event.organizer.email}</p>}
                {event.organizer?.phone && <p className="contact-info">📞 {event.organizer.phone}</p>}
              </div>
            </div>

            <div className="details-card">
              <h2>Venue Details</h2>
              <div className="info-item">
                <strong>Venue:</strong>
                <p>{event.venue?.name}</p>
              </div>
              <div className="info-item">
                <strong>Location:</strong>
                <p>{event.venue?.location?.address}, {event.venue?.location?.city}, {event.venue?.location?.state}</p>
              </div>
              <div className="info-item">
                <strong>Capacity:</strong>
                <p>{event.venue?.capacity} people</p>
              </div>
              <div className="info-item">
                <strong>Price:</strong>
                <p>₹{event.venue?.pricePerDay}/day</p>
              </div>
            </div>

            {event.addOns && event.addOns.length > 0 && (
              <div className="details-card">
                <h2>Event Add-ons</h2>
                <p className="addons-source-info">Selected from {event.venue?.name}</p>
                <div className="addons-list">
                  {event.addOns.map((addon, index) => (
                    <div key={index} className="addon-item">
                      <div className="addon-header">
                        <div className="addon-name">{addon.name}</div>
                        {addon.category && (
                          <span className="addon-category-badge">{addon.category}</span>
                        )}
                      </div>
                      {addon.description && <div className="addon-desc">{addon.description}</div>}
                      <div className="addon-pricing">
                        <span className="addon-unit-price">₹{addon.price} each</span>
                        <span className="addon-quantity">Qty: {addon.quantity}</span>
                        <span className="addon-total-price">₹{addon.price * addon.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="addons-summary">
                  <span>Total Add-ons Cost:</span>
                  <span className="addons-total-amount">
                    ₹{event.addOns.reduce((total, addon) => total + (addon.price * addon.quantity), 0)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="details-column">
            <div className="details-card">
              <h2>Budget Overview</h2>
              <div className="budget-breakdown">
                <div className="budget-item">
                  <span>Venue:</span>
                  <span>₹{event.budget?.venuePrice || 0}</span>
                </div>
                <div className="budget-item">
                  <span>Add-ons:</span>
                  <span>₹{event.budget?.addOnsPrice || 0}</span>
                </div>
                <div className="budget-item total">
                  <span>Total Budget:</span>
                  <span>₹{event.budget?.totalPrice || 0}</span>
                </div>
              </div>
            </div>

            <div className="details-card">
              <h2>Talent Requirements & Progress</h2>
              <div className="talent-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${talentStats.total > 0 ? (talentStats.accepted / talentStats.total) * 100 : 0}%` }}
                  />
                </div>
                <p className="progress-text">
                  {talentStats.accepted} of {talentStats.total} talents confirmed
                </p>
              </div>

              <div className="talents-list">
                {event.requiredSkills?.map((skill, index) => {
                  const invitedCount = invitations.filter(
                    inv => inv.skill === skill.skill && inv.status === 'accepted'
                  ).length;

                  return (
                    <div key={index} className="talent-requirement">
                      <div className="talent-skill">{skill.skill}</div>
                      <div className="talent-count">
                        {invitedCount}/{skill.count} confirmed
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link to={`/manager/events/${id}/talents`} className="btn-primary" style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}>
                Manage Talents & Invitations
              </Link>
            </div>

            <div className="details-card">
              <h2>Recent Invitations</h2>
              {invitations.length === 0 ? (
                <div className="empty-state-hint">
                  No invitations sent yet. Start recruiting talents!
                </div>
              ) : (
                <div className="recent-invitations-list">
                  {invitations.slice(0, 5).map((invitation) => (
                    <div key={invitation._id} className="recent-invitation-item">
                      <div className="invitation-talent-info">
                        <div className="talent-avatar-small">
                          {invitation.talent?.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="invitation-talent-name">{invitation.talent?.name}</div>
                          <div className="invitation-skill-small">{invitation.skill}</div>
                        </div>
                      </div>
                      <span className={`status-badge status-${invitation.status}`}>
                        {invitation.status}
                      </span>
                    </div>
                  ))}
                  {invitations.length > 5 && (
                    <Link to={`/manager/events/${id}/talents`} className="view-all-link">
                      View all {invitations.length} invitations →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsManager;
