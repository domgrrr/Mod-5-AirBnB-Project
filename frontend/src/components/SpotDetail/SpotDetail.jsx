import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchSingleSpotFunction } from "../../store/spotsReducer";

import "./SpotDetail.css";

const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.spot);

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

  return (
    <div className='spot-detail'>
      <h1>{spot.name}</h1>
      <div className='location'>
        Location: {spot.city}, {spot.state}, {spot.country}
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
      <div className='hosted-by'>
        Hosted by {spot.Owner?.firstName || 'Unknown'} {spot.Owner?.lastName || ''}
      </div>
      <p>{spot.description}</p>
      <div className='callout-box'>
        <div className='price'>${spot.price} / night</div>
        <button onClick={() => alert("Feature coming soon")}>Reserve</button>
      </div>
    </div>
  );
};

export default SpotDetail;