import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';

const ManagerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Talent Management Dashboard</h1>
      </div>

      <div className="events-grid">
        {events.length === 0 ? (
          <div className="empty-state">
            <p>No events yet.</p>
          </div>
        ) : (
          events.map(event => (
            <div key={event._id} className={`event-card ${event.status === 'confirmed' ? 'event-card-confirmed' : ''}`}>
              <div className="event-card-header">
                <h3>{event.title}</h3>
                <span className={`status-badge status-${event.status}`}>
                  {event.status === 'confirmed' ? 'Ready to Go' : event.status}
                </span>
              </div>

              {event.status === 'confirmed' && (
                <div className="event-ready-indicator">
                  <span className="ready-icon">✓</span>
                  <span className="ready-text">Ready to Go!</span>
                </div>
              )}

              <div className="event-card-body">
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
                  <p><strong>Organizer:</strong> {event.organizer?.name}</p>
                  <p><strong>Required Skills:</strong></p>
                  <ul>
                    {event.requiredSkills?.map((skill, idx) => (
                      <li key={idx}>{skill.skill} (x{skill.count})</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="event-card-actions">
                <Link to={`/organizer/events/${event._id}/manage`} className="btn-secondary">
                  View Details
                </Link>
                <Link to={`/organizer/events/${event._id}/talents`} className="btn-primary">
                  Manage Talents
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
