import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { invitationService } from '../../services/invitationService';
import { eventService } from '../../services/eventService';

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

  if (!event) return <div className="loading">Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
    <div className="manage-talents-container">
      <h1>Manage Talents - {event.title}</h1>

      <div className="required-skills-section">
        <h2>Required Skills</h2>
        <div className="skills-grid">
          {event.requiredSkills?.map((skill, idx) => (
            <div key={idx} className="skill-requirement-card">
              <h3>{skill.skill}</h3>
              <p>Required: {skill.count}</p>
              <button
                onClick={() => handleBrowseTalents(skill.skill)}
                className="btn-primary"
              >
                Browse Talents
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="invitations-section">
        <h2>Current Invitations</h2>
        {invitations.length === 0 ? (
          <p>No invitations sent yet</p>
        ) : (
          <div className="invitations-list">
            {invitations.map(invitation => (
              <div key={invitation._id} className="invitation-card">
                <div className="invitation-header">
                  <h3>{invitation.talent?.name}</h3>
                  <span className={`status-badge status-${invitation.status}`}>
                    {invitation.status}
                  </span>
                </div>
                <div className="invitation-body">
                  <p><strong>Skill:</strong> {invitation.skill}</p>
                  <p><strong>Email:</strong> {invitation.talent?.email}</p>
                  <p><strong>Rating:</strong> {invitation.talent?.averageRating?.toFixed(1) || 'N/A'} / 5</p>
                  <p><strong>Expiry:</strong> {new Date(invitation.expiryDate).toLocaleDateString()}</p>
                </div>
                {invitation.status === 'pending' && (
                  <div className="invitation-actions">
                    <button
                      onClick={() => handleRespondInvitation(invitation._id)}
                      className="btn-danger"
                    >
                      Cancel Invitation
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showTalentBrowser && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Browse Talents - {selectedSkill}</h2>
              <button onClick={() => setShowTalentBrowser(false)} className="btn-close">
                &times;
              </button>
            </div>

            <div className="invitation-form">
              <h3>Invitation Details</h3>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={invitationForm.expiryDate}
                  onChange={(e) => setInvitationForm({ ...invitationForm, expiryDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={invitationForm.message}
                  onChange={(e) => setInvitationForm({ ...invitationForm, message: e.target.value })}
                  placeholder="Add a message to the talent"
                />
              </div>
              <div className="form-group">
                <label>Compensation Amount</label>
                <input
                  type="number"
                  value={invitationForm.compensation.amount}
                  onChange={(e) => setInvitationForm({
                    ...invitationForm,
                    compensation: { amount: parseInt(e.target.value) }
                  })}
                />
              </div>
            </div>

            <div className="talents-grid">
              {talents.map(talent => (
                <div key={talent._id} className="talent-card">
                  <h3>{talent.name}</h3>
                  <p><strong>Skills:</strong> {talent.skills?.join(', ')}</p>
                  <p><strong>Rating:</strong> {talent.averageRating?.toFixed(1) || 'N/A'} / 5</p>
                  <p><strong>Reviews:</strong> {talent.totalRatings || 0}</p>
                  {talent.bio && <p className="talent-bio">{talent.bio}</p>}
                  <button
                    onClick={() => handleSendInvitation(talent._id)}
                    className="btn-primary"
                  >
                    Send Invitation
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ManageTalents;
