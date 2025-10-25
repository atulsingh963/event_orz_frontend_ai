import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventService.deleteEvent(eventId);
      setEvents(events.filter(e => e._id !== eventId));
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Event Organizer Dashboard</h1>
        <Link to="/organizer/create-event" className="btn-primary">
          Create New Event
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="events-grid">
        {events.length === 0 ? (
          <div className="empty-state">
            <p>No events yet. Create your first event!</p>
          </div>
        ) : (
          events.map(event => (
            <div key={event._id} className="event-card">
              <div className="event-card-header">
                <h3>{event.title}</h3>
                <span className={`status-badge status-${event.status}`}>
                  {event.status}
                </span>
              </div>

              <div className="event-card-body">
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
                  <p><strong>Venue:</strong> {event.venue?.name}</p>
                  <p><strong>Budget:</strong> ₹{event.budget?.totalPrice || 0}</p>
                  {event.eventManager && (
                    <p><strong>Manager:</strong> {event.eventManager.name}</p>
                  )}
                </div>
              </div>

              <div className="event-card-actions">
                <Link to={`/organizer/events/${event._id}`} className="btn-secondary">
                  View Details
                </Link>
                <Link to={`/organizer/events/${event._id}/edit`} className="btn-secondary">
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
