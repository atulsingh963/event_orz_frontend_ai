import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { invitationService } from '../../services/invitationService';

const TalentDashboard = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const data = await invitationService.getMyInvitations();
      // Show all invitations including cancelled ones
      setInvitations(data);
    } catch (err) {
      console.error('Failed to load invitations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (invitationId, status) => {
    try {
      await invitationService.respondToInvitation(invitationId, status);
      fetchInvitations();
      alert(`Invitation ${status}!`);
    } catch (err) {
      alert('Failed to respond to invitation');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Talent Dashboard</h1>
      </div>

      <div className="invitations-section">
        <h2>Your Invitations</h2>

        {invitations.length === 0 ? (
          <div className="empty-state">
            <p>No invitations yet. Build your profile and wait for opportunities!</p>
          </div>
        ) : (
          <div className="invitations-grid">
            {invitations.map(invitation => (
              <div key={invitation._id} className="invitation-card">
                <div className="invitation-header">
                  <h3>{invitation.event?.title}</h3>
                  <span className={`status-badge status-${invitation.status}`}>
                    {invitation.status}
                  </span>
                </div>

                <div className="invitation-body">
                  <p className="event-description">{invitation.event?.description}</p>
                  <div className="invitation-details">
                    <p><strong>Skill Required:</strong> {invitation.skill}</p>
                    <p><strong>Date:</strong> {new Date(invitation.event?.eventDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {invitation.event?.startTime} - {invitation.event?.endTime}</p>
                    <p><strong>From:</strong> {invitation.invitedBy?.name}</p>
                    {invitation.compensation && (
                      <p><strong>Compensation:</strong> ₹{invitation.compensation.amount}</p>
                    )}
                    {invitation.message && (
                      <p><strong>Message:</strong> {invitation.message}</p>
                    )}
                    <p><strong>Expiry:</strong> {new Date(invitation.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="invitation-actions">
                  <Link to={`/talent/events/${invitation.event?._id}`} className="btn-secondary">
                    View Event Details
                  </Link>
                  {invitation.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleRespond(invitation._id, 'accepted')}
                        className="btn-primary"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(invitation._id, 'rejected')}
                        className="btn-danger"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>

                {invitation.status === 'accepted' && (
                  <div className="invitation-info">
                    <p className="success-message">✓ You have accepted this invitation!</p>
                  </div>
                )}

                {invitation.status === 'cancelled' && (
                  <div className="invitation-info">
                    <div className="cancelled-message">
                      <strong>Invitation Cancelled</strong>
                      {invitation.cancellationReason && (
                        <p>{invitation.cancellationReason}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentDashboard;
