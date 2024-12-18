import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview } from '../../store/spotsReducer';
import StarRating from '../StarRating';  // Add this import
import './ReviewModal.css';

const ReviewModal = ({ spotId, closeModal }) => {
  const dispatch = useDispatch();
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState('');
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createReview(spotId, { review, stars }));
      closeModal();
    } catch (error) {
      setErrors(error.message || 'An error occurred while posting your review.');
    }
  };

  const isSubmitDisabled = review.length < 10 || stars === 0;

  return (
    <div className="review-modal">
      <div className="review-modal-content">
        <h2>How was your stay?</h2>
        {errors && <div className="error-message">{errors}</div>}
        
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Leave your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="4"
          />
          
          <div className="stars-input">
            <StarRating 
              rating={stars}
              interactive={true}
              onChange={setStars}
            />
            <span className="stars-label">Stars</span>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitDisabled}
          >
            Submit Your Review
          </button>
        </form>

        <button 
          className="close-button" 
          onClick={closeModal}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;