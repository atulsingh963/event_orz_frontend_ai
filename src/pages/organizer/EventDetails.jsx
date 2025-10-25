import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { invitationService } from '../../services/invitationService';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [managers, setManagers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showManagerFinder, setShowManagerFinder] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    fetchManagers();
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

  const fetchManagers = async () => {
    try {
      // Get all event managers
      const data = await invitationService.getTalents({ role: 'eventManager' });
      setManagers(data.filter(user => user.role === 'eventManager'));
    } catch (err) {
      console.error('Failed to load managers', err);
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

  const handleMakePublic = async () => {
    setActionLoading(true);
    try {
      await eventService.updateEvent(id, { status: 'recruiting', isPublic: true });
      fetchEventDetails();
      alert('Event is now live and visible to event managers!');
    } catch (err) {
      alert('Failed to publish event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignManager = async (managerId) => {
    setActionLoading(true);
    try {
      await eventService.inviteEventManager(id, managerId);
      setShowManagerFinder(false);
      fetchEventDetails();
      alert('Event manager assigned successfully!');
    } catch (err) {
      alert('Failed to assign manager');
    } finally {
      setActionLoading(false);
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
            <Link to={`/organizer/events/${id}/edit`} className="btn-secondary">
              Edit Event
            </Link>
            {event.status === 'draft' && (
              <button onClick={handleMakePublic} className="btn-primary" disabled={actionLoading}>
                {actionLoading ? 'Publishing...' : 'Make Public & Recruit'}
              </button>
            )}
          </div>
        </div>

        {/* Warning if no manager */}
        {!event.eventManager && event.status !== 'draft' && (
          <div className="warning-banner">
            ⚠️ No event manager assigned. <button onClick={() => setShowManagerFinder(true)} className="btn-link">Find a Manager</button>
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

            <div className="details-card">
              <h2>Budget Breakdown</h2>
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
                  <span>Total:</span>
                  <span>₹{event.budget?.totalPrice || 0}</span>
                </div>
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
              <h2>Event Manager</h2>
              {event.eventManager ? (
                <div className="manager-info">
                  <div className="manager-avatar">{event.eventManager.name.charAt(0)}</div>
                  <div>
                    <div className="manager-name">{event.eventManager.name}</div>
                    <div className="manager-email">{event.eventManager.email}</div>
                    {event.eventManager.phone && <div className="manager-phone">📞 {event.eventManager.phone}</div>}
                  </div>
                </div>
              ) : (
                <div className="no-manager">
                  <p>No manager assigned yet</p>
                  <button onClick={() => setShowManagerFinder(true)} className="btn-primary">
                    Find Event Manager
                  </button>
                </div>
              )}
            </div>

            <div className="details-card">
              <h2>Required Talents</h2>
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

              {event.eventManager && (
                <Link to={`/organizer/events/${id}/invitations`} className="btn-secondary" style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}>
                  View All Invitations
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Manager Finder Modal */}
        {showManagerFinder && (
          <div className="modal">
            <div className="modal-content" style={{ maxWidth: '800px' }}>
              <div className="modal-header">
                <h2>Find Event Manager</h2>
                <button onClick={() => setShowManagerFinder(false)} className="btn-close">×</button>
              </div>

              <div className="managers-grid">
                {managers.length === 0 ? (
                  <p>No event managers available at the moment.</p>
                ) : (
                  managers.map(manager => (
                    <div key={manager._id} className="manager-card">
                      <div className="manager-card-avatar">{manager.name.charAt(0)}</div>
                      <div className="manager-card-info">
                        <h3>{manager.name}</h3>
                        <p>{manager.email}</p>
                        {manager.phone && <p>📞 {manager.phone}</p>}
                      </div>
                      <button
                        onClick={() => handleAssignManager(manager._id)}
                        className="btn-primary"
                        disabled={actionLoading}
                      >
                        Assign
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
