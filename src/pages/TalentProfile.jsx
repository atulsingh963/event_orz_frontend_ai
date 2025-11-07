import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { talentService } from '../services/talentService';

const TalentProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null); // { talent, ratings }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await talentService.getTalentProfile(id);
        setData(result);
      } catch (e) {
        setError('Failed to load talent profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!data) return null;

  const { talent, ratings } = data;

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div className="page-header">
        <h1>{talent.name}</h1>
        {typeof talent.averageRating === 'number' && (
          <div className="talent-rating">⭐ {talent.averageRating?.toFixed(1)} ({talent.totalRatings || 0})</div>
        )}
      </div>

      <div className="talent-profile-grid">
        <div className="talent-profile-left">
          {talent.profileImage ? (
            <img src={talent.profileImage} alt={talent.name} className="profile-image" />
          ) : (
            <div className="talent-avatar-large">{talent.name?.charAt(0)}</div>
          )}
          {talent.bio && <p style={{ marginTop: '1rem' }}>{talent.bio}</p>}
          {talent.portfolio && (
            <p style={{ marginTop: '0.5rem' }}>
              <a href={talent.portfolio} target="_blank" rel="noreferrer">Portfolio</a>
            </p>
          )}
        </div>

        <div className="talent-profile-right">
          <h3>Skills</h3>
          <div className="skills-tags" style={{ marginBottom: '1rem' }}>
            {talent.skills?.map((s, idx) => (
              <span key={idx} className="skill-tag-small">{s.skill} {typeof s.price === 'number' ? `(₹${s.price})` : ''}</span>
            ))}
          </div>

          <h3>Recent Ratings</h3>
          {ratings && ratings.length > 0 ? (
            <div className="ratings-list">
              {ratings.map((r) => (
                <div key={r._id} className="rating-item">
                  <div className="rating-header">
                    <strong>{r.ratedBy?.name || 'Anonymous'}</strong>
                    <span>⭐ {r.rating}</span>
                  </div>
                  {r.comment && <p>{r.comment}</p>}
                  {r.event && (
                    <small>Event: {r.event.title} ({new Date(r.event.eventDate).toLocaleDateString()})</small>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No ratings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
