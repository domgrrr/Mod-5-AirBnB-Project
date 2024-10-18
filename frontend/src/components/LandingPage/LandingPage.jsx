import { useEffect } from 'react';
import { useSelector, useDispatch } from'react-redux';
import { fetchSpotsFunction } from '../../store/spotsReducer';
import SpotTile from '../SpotTile/SpotTile';
import './LandingPage.css';

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);

  console.log(spots);
  useEffect(() => {
    dispatch(fetchSpotsFunction());
  }, [dispatch]);

  return (
    <div className="landing-page">
      <h1>All Spots</h1>
      <div className="spots-list">
        {spots.map((spot) => (
          <SpotTile key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;