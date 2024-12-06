import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchSingleSpotFunction } from "../../store/spotsReducer";
import StarRating from "../StarRating";
import "./SpotDetail.css";

const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.spot);
  const reviews = useSelector((state) => state.spots.spotReviews);
  const sessionUser = useSelector((state) => state.session.user);

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

  // Safely find the preview image
  const largeImage = spot.SpotImages.find((img) => img.preview) || spot.SpotImages[0] || { url: 'default-image-url.jpg' };

  // Safely filter small images
  const smallImages = spot.SpotImages.filter((img) => !img.preview) || [];

  const isOwner = sessionUser?.id === spot.ownerId;

  return (
    <div className='spot-detail'>
      <h1>{spot.name}</h1>
      <div className='spot-header'>
        <StarRating 
          rating={spot.avgRating} 
          showCount={true}
          reviewCount={reviews.length}
        />
        <div className='location'>
          {spot.city}, {spot.state}, {spot.country}
        </div>
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
              rating={spot.avgRating} 
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
            rating={spot.avgRating} 
            showCount={true}
            reviewCount={reviews.length}
          />
        </h2>
        
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
    </div>
  );
};

export default SpotDetail;