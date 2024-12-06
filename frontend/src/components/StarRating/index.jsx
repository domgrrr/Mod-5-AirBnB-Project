import './StarRating.css';

const StarRating = ({ rating, showCount, reviewCount }) => {
  return (
    <div className="rating-container">
      <div className="stars-rating">
        <span className="star">★</span>
        <span>{rating ? rating.toFixed(1) : 'New'}</span>
      </div>
      {showCount && rating && reviewCount > 0 && (
        <>
          <span className="dot-separator">·</span>
          <span>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
        </>
      )}
    </div>
  );
};

export default StarRating;