import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './SpotDetail.css';

const SpotDetail = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.spots.find(s => s.id === spotId));

  if (!spot) {
    return <div>Loading...</div>;
  }

  const largeImage = spot.SpotImages.find(img => img.preview);

  const smallImages = spot.SpotImages.filter(img => !img.preview);

  return (
    <div className="spot-detail">
      <h1>{spot.name}</h1>
      <div className="location">
        Location: {spot.city}, {spot.state}, {spot.country}
      </div>
      <div className="images">
        <img src={largeImage.url} alt={`${spot.name} large`} className="large-image" />
        <div className="small-images">
          {smallImages.map((img) => (
            <img key={img.id} src={img.url} alt={`${spot.name} small ${img.url}`} />
          ))}
        </div>
      </div>
      <div className="hosted-by">
        Hosted by {spot.firstName}, {spot.lastName}
      </div>
      <p>{spot.description}</p>
      <div className="callout-box">
        <div className="price">
          ${spot.price} / night
        </div>
        <button onClick={() => alert('Feature coming soon')}>Reserve</button>
      </div>
    </div>
  );
};

export default SpotDetail;