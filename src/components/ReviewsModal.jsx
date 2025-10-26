import { useState, useEffect } from 'react';
import { ratingService } from '../services/ratingService';

const ReviewsModal = ({ user, onClose }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [user]);

  const fetchRatings = async () => {
    try {
      const data = await ratingService.getUserRatings(user._id);
      setRatings(data);
    } catch (err) {
      console.error('Failed to load ratings', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.round(rating));
  };

  return (
    <div className="modal reviews-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2>Reviews for {user.name}</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        {loading ? (
          <div className="loading" style={{ padding: '2rem' }}>Loading reviews...</div>
        ) : (
          <div className="reviews-modal-body">
            {/* Average Rating Summary */}
            {user.averageRating > 0 && (
              <div className="rating-summary-card">
                <div className="rating-summary-score">
                  <div className="rating-score-number">{user.averageRating.toFixed(1)}</div>
                  <div className="rating-stars-large">{renderStars(user.averageRating)}</div>
                  <div className="rating-count-text">Based on {user.totalRatings} review{user.totalRatings !== 1 ? 's' : ''}</div>
                </div>
              </div>
            )}

            {/* Individual Reviews */}
            {ratings.length === 0 ? (
              <div className="empty-state-hint" style={{ padding: '2rem', textAlign: 'center' }}>
                No reviews yet.
              </div>
            ) : (
              <div className="reviews-list">
                {ratings.map((rating) => (
                  <div key={rating._id} className="review-card">
                    <div className="review-header">
                      <div>
                        <div className="review-author">{rating.ratedBy?.name}</div>
                        {rating.event && (
                          <div className="review-event-name">Event: {rating.event.title}</div>
                        )}
                      </div>
                      <div className="review-date">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="review-rating">
                      {renderStars(rating.overallRating)} ({rating.overallRating}/5)
                    </div>

                    {rating.review && (
                      <div className="review-text">{rating.review}</div>
                    )}

                    {/* Category Ratings */}
                    {rating.categories && Object.keys(rating.categories).length > 0 && (
                      <div className="review-categories">
                        {Object.entries(rating.categories).map(([key, value]) => (
                          <div key={key} className="review-category-item">
                            <span className="review-category-label">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="review-category-value">
                              {renderStars(value)} ({value}/5)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsModal;
