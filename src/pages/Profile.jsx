import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    skills: [],
    portfolio: '',
    profileImage: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      const normalizedSkills = Array.isArray(user.skills)
        ? user.skills.map((s) => (typeof s === 'string' ? s : s?.skill)).filter(Boolean)
        : [];
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        skills: normalizedSkills,
        portfolio: user.portfolio || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = () => {
    const newSkill = skillInput.trim();
    if (!newSkill) return;
    // Compare case-insensitively to avoid duplicates like "Singer" vs "singer"
    const exists = formData.skills.some((s) => s.toLowerCase() === newSkill.toLowerCase());
    if (!exists) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill]
      });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div className="form-container">
        <h1>Edit Profile</h1>

        {message.text && (
          <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
                placeholder="Email cannot be changed"
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#999' }}>
                Email cannot be changed
              </small>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={user?.role === 'talent' ? 'Talent' : user?.role === 'eventManager' ? 'Event Manager' : 'Event Organizer'}
                disabled
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#999' }}>
                Role cannot be changed
              </small>
            </div>
          </div>

          {user?.role === 'talent' && (
            <>
              <div className="form-section">
                <h3>Talent Information</h3>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about yourself and your experience"
                    maxLength="500"
                  />
                  <small style={{ display: 'block', marginTop: '0.5rem', color: '#999' }}>
                    {formData.bio.length}/500 characters
                  </small>
                </div>

                <div className="form-group">
                  <label>Skills *</label>
                  <div className="skill-input-group">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill (e.g., Singer, Dancer, Host)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="btn-secondary"
                    >
                      Add Skill
                    </button>
                  </div>

                  <div className="skills-list">
                    {formData.skills.length === 0 ? (
                      <p style={{ color: '#999', fontStyle: 'italic' }}>
                        No skills added yet. Add at least one skill to showcase your talents.
                      </p>
                    ) : (
                      formData.skills.map((skill, index) => (
                        <div key={index} className="skill-item">
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="btn-remove"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Portfolio URL</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                  />
                  <small style={{ display: 'block', marginTop: '0.5rem', color: '#999' }}>
                    Link to your portfolio, YouTube channel, or social media
                  </small>
                </div>

                <div className="form-group">
                  <label>Profile Image URL</label>
                  <input
                    type="url"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
