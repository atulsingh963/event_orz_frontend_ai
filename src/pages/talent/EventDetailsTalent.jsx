import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { invitationService } from '../../services/invitationService';

const EventDetailsTalent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [myInvitation, setMyInvitation] = useState(null);
  const [allInvitations, setAllInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const eventData = await eventService.getEventById(id);
      setEvent(eventData);

      // Get all invitations for this event
      const invitationsData = await invitationService.getEventInvitations(id);
      setAllInvitations(invitationsData);

      // Get my invitations to find the one for this event
      const myInvitations = await invitationService.getMyInvitations();
      const myEventInvitation = myInvitations.find(inv => inv.event?._id === id);
      setMyInvitation(myEventInvitation);
    } catch (err) {
      console.error('Failed to load event details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (status) => {
    if (!myInvitation) return;

    try {
      await invitationService.respondToInvitation(myInvitation._id, status);
      alert(`Invitation ${status}!`);
      fetchEventDetails();
    } catch (err) {
      alert('Failed to respond to invitation');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!event) return <div className="error-message">Event not found</div>;

  const getTalentStats = () => {
    const total = event.requiredSkills?.reduce((sum, skill) => sum + skill.count, 0) || 0;
    const accepted = allInvitations.filter(inv => inv.status === 'accepted').length;
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
              <span className={`status-badge status-${event.status}`}>
                {event.status === 'confirmed' ? 'Ready to Go' : event.status}
              </span>
              <span className="event-date">
                📅 {new Date(event.eventDate).toLocaleDateString()}
              </span>
              <span className="event-time">
                🕐 {event.startTime} - {event.endTime}
              </span>
            </div>
          </div>

          <div className="event-actions">
            <Link to="/talent/dashboard" className="btn-secondary">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* My Invitation Status */}
        {myInvitation && (
          <div className={`invitation-status-banner status-${myInvitation.status}`}>
            <div className="invitation-status-content">
              <h3>Your Invitation Status: {myInvitation.status.toUpperCase()}</h3>
              <div className="invitation-status-details">
                <p><strong>Role:</strong> {myInvitation.skill}</p>
                {myInvitation.compensation && (
                  <p><strong>Compensation:</strong> ₹{myInvitation.compensation.amount}</p>
                )}
                {myInvitation.message && (
                  <p><strong>Message:</strong> {myInvitation.message}</p>
                )}
              </div>

              {myInvitation.status === 'pending' && (
                <div className="invitation-actions" style={{ marginTop: '1rem' }}>
                  <button
                    onClick={() => handleRespond('accepted')}
                    className="btn-primary"
                  >
                    Accept Invitation
                  </button>
                  <button
                    onClick={() => handleRespond('rejected')}
                    className="btn-danger"
                  >
                    Decline
                  </button>
                </div>
              )}

              {myInvitation.status === 'accepted' && (
                <p className="success-message" style={{ marginTop: '1rem' }}>
                  ✓ You have accepted this invitation!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Success banner if event is confirmed and ready */}
        {event.status === 'confirmed' && myInvitation?.status === 'accepted' && (
          <div className="success-banner">
            <div className="success-banner-icon">✓</div>
            <div className="success-banner-content">
              <h3>Event is Ready to Go!</h3>
              <p>All talents have been confirmed. See you at the event!</p>
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
            </div>

            {event.addOns && event.addOns.length > 0 && (
              <div className="details-card">
                <h2>Event Add-ons</h2>
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="details-column">
            <div className="details-card">
              <h2>Contact Information</h2>
              <div className="info-item">
                <strong>Organizer:</strong>
                <p>{event.organizer?.name}</p>
                {event.organizer?.email && <p className="contact-info">📧 {event.organizer.email}</p>}
                {event.organizer?.phone && <p className="contact-info">📞 {event.organizer.phone}</p>}
              </div>

              {event.eventManager && (
                <div className="info-item">
                  <strong>Event Manager:</strong>
                  <div className="manager-info" style={{ marginTop: '0.5rem' }}>
                    <div className="manager-avatar">{event.eventManager.name?.charAt(0)}</div>
                    <div>
                      <div className="manager-name">{event.eventManager.name}</div>
                      <div className="manager-email">{event.eventManager.email}</div>
                      {event.eventManager.phone && (
                        <div className="manager-phone">📞 {event.eventManager.phone}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {event.status !== 'completed' && myInvitation?.status === 'accepted' && (
                <div className="review-pending-notice" style={{ marginTop: '1rem' }}>
                  <p>📝 Can't review until event is done</p>
                </div>
              )}
            </div>

            <div className="details-card">
              <h2>Talent Team Progress</h2>
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
                  const invitedCount = allInvitations.filter(
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
            </div>

            <div className="details-card">
              <h2>Other Talents</h2>
              {allInvitations.filter(inv => inv.status === 'accepted').length === 0 ? (
                <div className="empty-state-hint">
                  No other talents confirmed yet.
                </div>
              ) : (
                <div className="talents-team-list">
                  {allInvitations
                    .filter(inv => inv.status === 'accepted')
                    .map((invitation) => (
                      <div key={invitation._id} className="team-member-item">
                        <div className="talent-avatar-small">
                          {invitation.talent?.name?.charAt(0)}
                        </div>
                        <div className="team-member-info">
                          <div className="team-member-name">{invitation.talent?.name}</div>
                          <div className="team-member-skill">{invitation.skill}</div>
                        </div>
                        {/* RATING_FEATURE: Uncomment below to show talent ratings in team list */}
                        {/* {invitation.talent?.averageRating > 0 && (
                          <div className="team-member-rating">
                            ⭐ {invitation.talent.averageRating.toFixed(1)}
                          </div>
                        )} */}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsTalent;
