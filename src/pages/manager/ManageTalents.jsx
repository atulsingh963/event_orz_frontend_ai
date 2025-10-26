import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { invitationService } from '../../services/invitationService';
import { eventService } from '../../services/eventService';
// RATING_FEATURE: Uncomment below to enable rating functionality
// import RatingModal from '../../components/RatingModal';
// import ReviewsModal from '../../components/ReviewsModal';

const ManageTalents = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [talents, setTalents] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [showTalentBrowser, setShowTalentBrowser] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [invitationForm, setInvitationForm] = useState({
    message: '',
    expiryDate: '',
    compensation: { amount: 0 }
  });
  // RATING_FEATURE: Uncomment below to enable rating state
  // const [showRatingModal, setShowRatingModal] = useState(false);
  // const [talentToRate, setTalentToRate] = useState(null);
  // const [showReviewsModal, setShowReviewsModal] = useState(false);
  // const [reviewsUser, setReviewsUser] = useState(null);

  useEffect(() => {
    fetchEvent();
    fetchInvitations();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const data = await eventService.getEventById(eventId);
      setEvent(data);
    } catch (err) {
      console.error('Failed to load event', err);
    }
  };

  const fetchInvitations = async () => {
    try {
      const data = await invitationService.getEventInvitations(eventId);
      setInvitations(data);
    } catch (err) {
      console.error('Failed to load invitations', err);
    }
  };

  const handleBrowseTalents = async (skill) => {
    setSelectedSkill(skill);
    setShowTalentBrowser(true);

    try {
      const data = await invitationService.getTalents({ skills: skill });
      setTalents(data);
    } catch (err) {
      console.error('Failed to load talents', err);
    }
  };

  const handleSendInvitation = async (talentId) => {
    if (!invitationForm.expiryDate) {
      alert('Please set an expiry date');
      return;
    }

    try {
      await invitationService.sendInvitation({
        eventId,
        talentId,
        skill: selectedSkill,
        ...invitationForm
      });

      alert('Invitation sent successfully!');
      setShowTalentBrowser(false);
      fetchInvitations();
    } catch (err) {
      alert('Failed to send invitation');
    }
  };

  const handleRespondInvitation = async (invitationId, action) => {
    try {
      await invitationService.removeOrReplaceTalent(invitationId);
      fetchInvitations();
    } catch (err) {
      alert('Failed to update invitation');
    }
  };

  // RATING_FEATURE: Uncomment below to enable rating handlers
  // const handleRateTalent = (talent) => {
  //   setTalentToRate(talent);
  //   setShowRatingModal(true);
  // };

  // const handleRatingSuccess = () => {
  //   setShowRatingModal(false);
  //   setTalentToRate(null);
  //   fetchInvitations(); // Refresh to show updated ratings
  // };

  // const handleViewReviews = (user) => {
  //   setReviewsUser(user);
  //   setShowReviewsModal(true);
  // };

  if (!event) return <div className="loading">Loading...</div>;

  // Get invitation stats per skill
  const getSkillStats = (skill) => {
    const skillInvitations = invitations.filter(inv => inv.skill === skill.skill);
    const accepted = skillInvitations.filter(inv => inv.status === 'accepted').length;
    const pending = skillInvitations.filter(inv => inv.status === 'pending').length;
    return { accepted, pending, total: skillInvitations.length };
  };

  return (
    <div style={{ padding: '2rem' }}>
    <div className="manage-talents-container">
      <div className="page-header">
        <div>
          <h1>Manage Talents</h1>
          <p className="page-subtitle">{event.title}</p>
        </div>
        <div className="event-meta-info">
          <span className="meta-item">📅 {new Date(event.eventDate).toLocaleDateString()}</span>
          <span className="meta-item">📍 {event.venue?.name}</span>
        </div>
      </div>

      <div className="required-skills-section">
        <h2>Required Talents</h2>
        <p className="section-description">Browse and invite talents for each required skill</p>
        <div className="skills-grid">
          {event.requiredSkills?.map((skill, idx) => {
            const stats = getSkillStats(skill);
            return (
              <div key={idx} className="skill-requirement-card">
                <div className="skill-card-header">
                  <h3>{skill.skill}</h3>
                  {skill.description && <p className="skill-description">{skill.description}</p>}
                </div>
                <div className="skill-stats">
                  <div className="stat-item">
                    <span className="stat-label">Required:</span>
                    <span className="stat-value">{skill.count}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Accepted:</span>
                    <span className="stat-value accepted">{stats.accepted}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Pending:</span>
                    <span className="stat-value pending">{stats.pending}</span>
                  </div>
                </div>
                <div className="progress-bar-wrapper">
                  <div className="mini-progress-bar">
                    <div
                      className="mini-progress-fill"
                      style={{ width: `${(stats.accepted / skill.count) * 100}%` }}
                    />
                  </div>
                  <span className="progress-label">{stats.accepted} / {skill.count} confirmed</span>
                </div>
                <button
                  onClick={() => handleBrowseTalents(skill.skill)}
                  className="btn-primary btn-block"
                >
                  {stats.total > 0 ? 'Browse More Talents' : 'Browse Talents'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="invitations-section">
        <h2>Sent Invitations ({invitations.length})</h2>
        {invitations.length === 0 ? (
          <div className="empty-state">
            <p>No invitations sent yet</p>
            <p className="empty-state-hint">Browse talents above to send your first invitation</p>
          </div>
        ) : (
          <div className="invitations-grid">
            {invitations.map(invitation => (
              <div key={invitation._id} className="invitation-item-card">
                <div className="invitation-card-header">
                  <div className="talent-avatar">{invitation.talent?.name?.charAt(0)}</div>
                  <div className="talent-info">
                    <h3>{invitation.talent?.name}</h3>
                    <p className="talent-email">{invitation.talent?.email}</p>
                  </div>
                  <span className={`status-badge status-${invitation.status}`}>
                    {invitation.status}
                  </span>
                </div>
                <div className="invitation-details">
                  <div className="detail-row">
                    <span className="detail-label">Skill:</span>
                    <span className="detail-value skill-tag">{invitation.skill}</span>
                  </div>
                  {/* RATING_FEATURE: Uncomment below to show talent rating */}
                  {/* <div className="detail-row">
                    <span className="detail-label">Rating:</span>
                    <span className="detail-value rating-value">
                      ⭐ {invitation.talent?.averageRating?.toFixed(1) || 'N/A'} / 5
                    </span>
                  </div> */}
                  <div className="detail-row">
                    <span className="detail-label">Compensation:</span>
                    <span className="detail-value">₹{invitation.compensation?.amount || 0}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Expires:</span>
                    <span className="detail-value">{new Date(invitation.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {invitation.status === 'pending' && (
                    <button
                      onClick={() => handleRespondInvitation(invitation._id)}
                      className="btn-danger btn-sm"
                    >
                      Cancel Invitation
                    </button>
                  )}
                  {/* RATING_FEATURE: Uncomment below to enable rating button for talents */}
                  {/* {invitation.status === 'accepted' && event.status === 'completed' && (
                    <button
                      onClick={() => handleRateTalent(invitation.talent)}
                      className="btn-rate btn-sm"
                    >
                      ⭐ Rate Talent
                    </button>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RATING_FEATURE: Uncomment below to enable Rating Modal */}
      {/* {showRatingModal && talentToRate && (
        <RatingModal
          eventId={eventId}
          user={talentToRate}
          userType="talent"
          onClose={() => setShowRatingModal(false)}
          onSuccess={handleRatingSuccess}
        />
      )} */}

      {/* RATING_FEATURE: Uncomment below to enable Reviews Modal */}
      {/* {showReviewsModal && reviewsUser && (
        <ReviewsModal
          user={reviewsUser}
          onClose={() => {
            setShowReviewsModal(false);
            setReviewsUser(null);
          }}
        />
      )} */}

      {showTalentBrowser && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '900px' }}>
            <div className="modal-header">
              <h2>Browse Talents - {selectedSkill}</h2>
              <button onClick={() => setShowTalentBrowser(false)} className="btn-close">
                &times;
              </button>
            </div>

            <div className="invitation-form-card">
              <h3>Invitation Details</h3>
              <p className="form-hint">Set invitation parameters before sending</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date *</label>
                  <input
                    type="date"
                    value={invitationForm.expiryDate}
                    onChange={(e) => setInvitationForm({ ...invitationForm, expiryDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Compensation Amount (₹)</label>
                  <input
                    type="number"
                    value={invitationForm.compensation.amount}
                    onChange={(e) => setInvitationForm({
                      ...invitationForm,
                      compensation: { amount: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="Enter amount in rupees"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea
                  value={invitationForm.message}
                  onChange={(e) => setInvitationForm({ ...invitationForm, message: e.target.value })}
                  placeholder="Add a personal message to the talent..."
                  rows="3"
                />
              </div>
            </div>

            <div className="talents-browse-section">
              <h3>Available Talents ({talents.length})</h3>
              {talents.length === 0 ? (
                <div className="empty-state">
                  <p>No talents found for this skill</p>
                </div>
              ) : (
                <div className="talents-grid">
                  {talents.map(talent => (
                    <div key={talent._id} className="talent-browse-card">
                      <div className="talent-card-header">
                        <div className="talent-avatar-large">{talent.name?.charAt(0)}</div>
                        <div>
                          <h3>{talent.name}</h3>
                          {/* RATING_FEATURE: Uncomment below to show talent ratings in browser */}
                          {/* <div className="talent-rating">
                            ⭐ {talent.averageRating?.toFixed(1) || 'N/A'}
                            <span
                              className="review-count rating-count-clickable"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewReviews(talent);
                              }}
                            >
                              ({talent.totalRatings || 0} review{talent.totalRatings !== 1 ? 's' : ''})
                            </span>
                          </div> */}
                        </div>
                      </div>
                      <div className="talent-skills-list">
                        <strong>Skills:</strong>
                        <div className="skills-tags">
                          {talent.skills?.map((skill, idx) => (
                            <span key={idx} className="skill-tag-small">{skill}</span>
                          ))}
                        </div>
                      </div>
                      {talent.bio && (
                        <p className="talent-bio-text">{talent.bio}</p>
                      )}
                      <button
                        onClick={() => handleSendInvitation(talent._id)}
                        className="btn-primary btn-block"
                      >
                        Send Invitation
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ManageTalents;
