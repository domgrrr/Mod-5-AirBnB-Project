import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './SpotDetail.css';

const SpetDetail = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.spots.find(s => s.id === spotId));

  if (!spot) {
    return <div>Loading...</div>;
  }

  return (
    <div className="spot-detail">
      <h1>{spot.name}</h1>
    </div>
  )
}