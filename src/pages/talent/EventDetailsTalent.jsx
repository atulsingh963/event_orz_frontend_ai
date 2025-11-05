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

        {/* Main Content Grid - Restricted Talent View */}
        <div className="event-details-grid">
          {/* Left Column */}
          <div className="details-column">
            <div className="details-card">
              <h2>Your Role</h2>
              {myInvitation ? (
                <>
                  <div className="info-item">
                    <strong>Skill/Role:</strong>
                    <p>{myInvitation.skill}</p>
                  </div>
                  {myInvitation.compensation && (
                    <div className="info-item">
                      <strong>Compensation:</strong>
                      <p className="compensation-amount">₹{myInvitation.compensation.amount}</p>
                    </div>
                  )}
                  {myInvitation.message && (
                    <div className="info-item">
                      <strong>Instructions:</strong>
                      <p>{myInvitation.message}</p>
                    </div>
                  )}
                </>
              ) : (
                <p>No invitation details available.</p>
              )}
            </div>

            <div className="details-card">
              <h2>Event Details</h2>
              <div className="info-item">
                <strong>Event Name:</strong>
                <p>{event.title}</p>
              </div>
              <div className="info-item">
                <strong>Event Type:</strong>
                <p>{event.category || 'Not specified'}</p>
              </div>
              <div className="info-item">
                <strong>Date:</strong>
                <p>📅 {new Date(event.eventDate).toLocaleDateString()}</p>
              </div>
              <div className="info-item">
                <strong>Time:</strong>
                <p>🕐 {event.startTime} - {event.endTime}</p>
              </div>
              <div className="info-item">
                <strong>Expected Attendees:</strong>
                <p>👥 {event.attendees || 'Not specified'}</p>
              </div>
            </div>

            <div className="details-card">
              <h2>Venue Information</h2>
              <div className="info-item">
                <strong>Venue Name:</strong>
                <p>{event.venue?.name}</p>
              </div>
              <div className="info-item">
                <strong>Address:</strong>
                <p>{event.venue?.location?.address}</p>
                <p>{event.venue?.location?.city}, {event.venue?.location?.state}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="details-column">
            <div className="details-card">
              <h2>Contact Information</h2>
              {event.eventManager && (
                <div className="info-item">
                  <strong>Event Manager:</strong>
                  <div className="manager-info" style={{ marginTop: '0.5rem' }}>
                    <div className="manager-avatar">{event.eventManager.name?.charAt(0)}</div>
                    <div>
                      <div className="manager-name">{event.eventManager.name}</div>
                      <div className="manager-email">📧 {event.eventManager.email}</div>
                      {event.eventManager.phone && (
                        <div className="manager-phone">📞 {event.eventManager.phone}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="info-item" style={{ marginTop: event.eventManager ? '1rem' : '0' }}>
                <strong>Event Organizer:</strong>
                <p>{event.organizer?.name}</p>
                {event.organizer?.email && <p className="contact-info">📧 {event.organizer.email}</p>}
                {event.organizer?.phone && <p className="contact-info">📞 {event.organizer.phone}</p>}
              </div>
              
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                {event.eventManager 
                  ? 'Contact the event manager for day-to-day questions, or the organizer for general inquiries.'
                  : 'Contact the event organizer for any questions or concerns.'}
              </p>
            </div>

            <div className="details-card">
              <h2>Event Status</h2>
              <div className="info-item">
                <strong>Current Status:</strong>
                <p>
                  <span className={`status-badge status-${event.status}`}>
                    {event.status === 'confirmed' ? 'Confirmed - Ready to Go' : event.status}
                  </span>
                </p>
              </div>
              {myInvitation && (
                <div className="info-item">
                  <strong>Your Status:</strong>
                  <p>
                    <span className={`status-badge status-${myInvitation.status}`}>
                      {myInvitation.status.toUpperCase()}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {event.status === 'confirmed' && myInvitation?.status === 'accepted' && (
              <div className="details-card" style={{ backgroundColor: '#e8f5e9', borderColor: '#4caf50' }}>
                <h2 style={{ color: '#2e7d32' }}>✓ All Set!</h2>
                <p>The event is confirmed and ready. See you there!</p>
              </div>
            )}

            <div className="details-card" style={{ backgroundColor: '#f5f5f5' }}>
              <h2>Important Note</h2>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#555' }}>
                💡 This view shows only the essential information you need for the event. 
                If you have any questions, please contact the event manager or organizer listed above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsTalent;
