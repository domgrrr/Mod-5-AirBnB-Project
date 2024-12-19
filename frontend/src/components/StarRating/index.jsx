import { useState } from 'react';
import './StarRating.css';

const StarRating = ({ rating, showCount, reviewCount, onChange, interactive = false }) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  
  return (
    <div className="rating-container">
      <div className="stars-rating">
        {[1, 2, 3, 4, 5].map(num => (
          <span
            key={num}
            className={`star ${num <= (interactive ? (hoveredStar || rating) : rating) ? 'filled' : ''}`}
            onClick={() => interactive && onChange && onChange(num)}
            onMouseEnter={() => interactive && setHoveredStar(num)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            ★
          </span>
        ))}
      </div>
      {showCount && (
        <>
          <span className="dot-separator">·</span>
          <span>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
        </>
      )}
    </div>
  );
};

export default StarRating;