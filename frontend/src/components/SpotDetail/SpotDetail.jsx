import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSingleSpotFunction } from "../../store/spotsReducer";
import StarRating from "../StarRating";
import ReviewModal from "../ReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";
import "./SpotDetail.css";

const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.spot);
  const reviews = useSelector((state) => state.spots.spotReviews);
  const sessionUser = useSelector((state) => state.session.user);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        await dispatch(fetchSingleSpotFunction(spotId));
      } catch (error) {
        console.error("Error fetching spot:", error);
      }
    };
    fetchSpot();
  }, [dispatch, spotId, showReviewModal, reviewToDelete]);

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
      <h1>{spot.name}</h1>
      <div className='location'>
        {spot.city}, {spot.state}, {spot.country}
      </div>

      <div className='images'>
        <img
          src={largeImage.url}
          alt={`${spot.name} large`}
          className='large-image'
        />
        <div className='small-images'>
          {smallImages.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={`${spot.name} small ${img.id}`}
            />
          ))}
        </div>
      </div>

      <div className='spot-info-container'>
        <div className='spot-info'>
          <div className='hosted-by'>
            Hosted by {spot.Owner?.firstName || 'Unknown'} {spot.Owner?.lastName || ''}
          </div>
          <p>{spot.description}</p>
        </div>

        <div className='callout-box'>
          <div className='price-rating'>
            <span className='price'>${spot.price} night</span>
            <StarRating 
              rating={spot.avgStarRating} 
              showCount={true}
              reviewCount={reviews.length}
            />
          </div>
          <button onClick={() => alert("Feature coming soon")}>Reserve</button>
        </div>
      </div>

      <div className='reviews-section'>
        <h2>
          <StarRating 
            rating={spot.avgStarRating} 
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
                {sessionUser?.id === review.userId && (
                  <button 
                    className="delete-review-button"
                    onClick={() => setReviewToDelete(review.id)}
                  >
                    Delete
                  </button>
                )}
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

      {reviewToDelete && (
        <DeleteReviewModal 
          reviewId={reviewToDelete}
          spotId={spotId}
          closeModal={() => setReviewToDelete(null)}
        />
      )}
    </div>
  );
};



export default SpotDetail;