import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { venueService } from '../../services/venueService';

const CreateEvent = () => {
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    category: 'other',
    attendees: 0,
    requiredSkills: [],
    addOns: []
  });
  const [skillInput, setSkillInput] = useState({ skill: '', count: 1, description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const data = await venueService.getVenues();
      setVenues(data);
    } catch (err) {
      setError('Failed to load venues');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = () => {
    if (skillInput.skill) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, { ...skillInput }]
      });
      setSkillInput({ skill: '', count: 1, description: '' });
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const event = await eventService.createEvent(formData);
      navigate(`/organizer/events/${event._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
    <div className="form-container">
      <h1>Create New Event</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter event title"
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe your event"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="conference">Conference</option>
              <option value="concert">Concert</option>
              <option value="wedding">Wedding</option>
              <option value="corporate">Corporate</option>
              <option value="party">Party</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Expected Attendees</label>
            <input
              type="number"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Venue *</label>
          <select name="venue" value={formData.venue} onChange={handleChange} required>
            <option value="">Select a venue</option>
            {venues.map(venue => (
              <option key={venue._id} value={venue._id}>
                {venue.name} - {venue.location.city} (₹{venue.pricePerDay}/day)
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Event Date *</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time *</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Required Skills</h3>
          <div className="skill-input-group">
            <input
              type="text"
              value={skillInput.skill}
              onChange={(e) => setSkillInput({ ...skillInput, skill: e.target.value })}
              placeholder="Skill (e.g., Singer, Dancer)"
            />
            <input
              type="number"
              value={skillInput.count}
              onChange={(e) => setSkillInput({ ...skillInput, count: parseInt(e.target.value) })}
              min="1"
              placeholder="Count"
              style={{ width: '100px' }}
            />
            <button type="button" onClick={handleAddSkill} className="btn-secondary">
              Add Skill
            </button>
          </div>

          <div className="skills-list">
            {formData.requiredSkills.map((skill, index) => (
              <div key={index} className="skill-item">
                <span>{skill.skill} (x{skill.count})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/organizer/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default CreateEvent;
