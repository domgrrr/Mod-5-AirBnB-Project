import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSingleSpotFunction } from "../../store/spotsReducer";
import StarRating from "../StarRating";
import ReviewModal from "../ReviewModal";
import "./SpotDetail.css";

const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.spot);
  const reviews = useSelector((state) => state.spots.spotReviews);
  const sessionUser = useSelector((state) => state.session.user);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        await dispatch(fetchSingleSpotFunction(spotId));
      } catch (error) {
        console.error("Error fetching spot:", error);
      }
    };
    fetchSpot();
  }, [dispatch, spotId]);

  if (!spot || !spot.SpotImages) {
    return <div>Loading...</div>;
  }

  const largeImage = spot.SpotImages.find((img) => img.preview) || spot.SpotImages[0] || { url: 'default-image-url.jpg' };
  const smallImages = spot.SpotImages.filter((img) => !img.preview) || [];
  
  const isOwner = sessionUser?.id === spot.ownerId;
  const hasReviewed = reviews.some(review => review.userId === sessionUser?.id);
  const canReview = sessionUser && !isOwner && !hasReviewed;

  return (
    <div className='spot-detail'>
      {/* ... your existing header and images code ... */}

      <div className='reviews-section'>
        <h2>
          <StarRating 
            rating={spot.avgRating} 
            showCount={true}
            reviewCount={reviews.length}
          />
        </h2>
        
        {canReview && (
          <button 
            className="post-review-button"
            onClick={() => setShowReviewModal(true)}
          >
            Post Your Review
          </button>
        )}
        
        {reviews.length === 0 && sessionUser && !isOwner ? (
          <p className="be-first-review">Be the first to post a review!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-item">
                <h3>{review.User.firstName}</h3>
                <div className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                <p>{review.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showReviewModal && (
        <ReviewModal 
          spotId={spotId} 
          closeModal={() => setShowReviewModal(false)} 
        />
      )}
    </div>
  );
};

export default SpotDetail;