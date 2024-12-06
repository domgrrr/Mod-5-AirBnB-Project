import { Link } from 'react-router-dom';
import StarRating from '../StarRating';
import './SpotTile.css';

const SpotTile = ({ spot }) => {
  return (
    <div className="spot-tile">
      <Link to={`/spots/${spot.id}`} title={spot.name}>
        <img src={spot.previewImage} alt={`${spot.name} preview`} className="spot-thumbnail" />
        <div className="spot-info">
          <div className="spot-location">
            {spot.city}, {spot.state}
          </div>
          <div className="spot-rating">
            <StarRating 
              rating={spot.avgRating} 
              showCount={true}
              reviewCount={spot.numReviews}
            />
          </div>
          <div className="spot-price">
            ${spot.price} night
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SpotTile;