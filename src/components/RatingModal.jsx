import { useState } from 'react';
import { ratingService } from '../services/ratingService';

const RatingModal = ({ eventId, user, userType, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    review: '',
    categories: {
      professionalism: 5,
      punctuality: 5,
      skillLevel: 5,
      communication: 5
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await ratingService.createRating({
        eventId,
        userId: user._id,
        userType: userType || 'talent', // 'talent' or 'eventManager'
        ...formData
      });

      alert('Rating submitted successfully!');
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Rate {user.name}</h2>
          <button onClick={onClose} className="btn-close">&times;</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Overall Rating (1-5)</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  type="button"
                  className={`star-btn ${formData.rating >= value ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, rating: value })}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="categories-section">
            <h3>Detailed Ratings</h3>

            {Object.keys(formData.categories).map(category => (
              <div key={category} className="form-group">
                <label>
                  {category.charAt(0).toUpperCase() + category.slice(1)} (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.categories[category]}
                  onChange={(e) => setFormData({
                    ...formData,
                    categories: {
                      ...formData.categories,
                      [category]: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Review</label>
            <textarea
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              rows="4"
              placeholder="Write your review about this talent's performance"
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Rating'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
