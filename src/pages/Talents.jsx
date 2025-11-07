import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { talentService } from '../services/talentService';

const Talents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const initialSkill = searchParams.get('skill') || '';
  const [skill, setSkill] = useState(initialSkill);

  const query = useMemo(() => {
    const params = {};
    if (skill.trim()) params.skill = skill.trim();
    return params;
  }, [skill]);

  useEffect(() => {
    const fetchTalents = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await talentService.getTalents(query);
        setTalents(data);
      } catch (e) {
        setError('Failed to load talents');
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (skill.trim()) params.skill = skill.trim();
    setSearchParams(params);
  };

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div className="page-header">
        <h1>Browse Talents</h1>
        <p className="page-subtitle">Find talents by skill and explore their profiles</p>
      </div>

      <form onSubmit={handleSearch} className="search-form" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="e.g. singer, dj, guitarist"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="search-input"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {!loading && talents.length === 0 && (
        <div className="empty-state">
          <p>No talents found{skill ? ` for "${skill}"` : ''}.</p>
          <p className="empty-state-hint">Try a different skill or broaden your search.</p>
        </div>
      )}

      <div className="talents-grid">
        {talents.map((t) => (
          <div key={t._id} className="talent-card">
            <div className="talent-card-header">
              <div className="talent-avatar-large">{t.name?.charAt(0)}</div>
              <div>
                <h3>{t.name}</h3>
                {typeof t.averageRating === 'number' && (
                  <div className="talent-rating">⭐ {t.averageRating?.toFixed(1)} ({t.totalRatings || 0})</div>
                )}
              </div>
            </div>

            <div className="talent-skills-list">
              <strong>Skills:</strong>
              <div className="skills-tags">
                {t.skills?.map((s, idx) => (
                  <span key={idx} className="skill-tag-small">{s.skill}</span>
                ))}
              </div>
            </div>

            {t.bio && <p className="talent-bio-text">{t.bio}</p>}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to={`/login`} className="btn-primary btn-sm">Invite</Link>
              <Link to={`/talents/${t._id}`} className="btn-secondary btn-sm">View Profile</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Talents;
