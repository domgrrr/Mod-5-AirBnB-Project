import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserSpots, deleteSpot } from '../../store/spotsReducer';
import imageMapping from '../../store/imageMapping';
import ConfirmationModal from '../ConfirmationModal';
import './ManageSpots.css';

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector(state => state.spots.spots);
  const sessionUser = useSelector(state => state.session.user);
  const [showModal, setShowModal] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionUser) {
      navigate('/');
      return;
    }

    const loadSpots = async () => {
      try {
        await dispatch(getUserSpots());
      } catch (error) {
        console.error('Error loading spots:', error);
        if (error.status === 401) {
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSpots();
  }, [dispatch, sessionUser, navigate]);

  const handleDeleteClick = (spotId) => {
    setSpotToDelete(spotId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteSpot(spotToDelete));
      setShowModal(false);
      await dispatch(getUserSpots());
    } catch (error) {
      console.error('Error deleting spot:', error);
      if (error.status === 401) {
        navigate('/');
      }
    }
  };

  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  const spotsWithImages = spots.map(spot => ({
    ...spot,
    previewImage: imageMapping[spot.name] || 'frontend/public/airbnb-logo.png',
  }));

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!sessionUser) {
    return null;
  }

  return (
    <div className="manage-spots-container">
      <div className="manage-spots-header">
        <h1>Manage Spots</h1>
        {spots.length === 0 && (
          <button 
            onClick={() => navigate('/spots/new')}
            className="create-new-spot-button"
          >
            Create a New Spot
          </button>
        )}
      </div>

      <div className="spots-grid">
        {spotsWithImages.map(spot => (
          <div 
            key={spot.id} 
            className="spot-tile"
            onClick={() => navigate(`/spots/${spot.id}`)}
          >
            <div 
              className="spot-content"
              title={spot.name}
            >
              <img 
                src={spot.previewImage} 
                alt={spot.name}
                className="spot-image"
              />
              <div className="spot-info">
                <div className="spot-location-rating">
                  <p>{spot.city}, {spot.state}</p>
                  <p className="spot-rating">
                    <i className="fas fa-star"></i>
                    {spot.avgRating ? Number(spot.avgRating).toFixed(1) : 'New'}
                  </p>
                </div>
                <p className="spot-price">${spot.price} night</p>
              </div>
            </div>
            
            <div className="spot-buttons" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate(spot.id);
                }}
                className="update-button"
              >
                Update
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(spot.id);
                }}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ConfirmationModal 
          title="Confirm Delete"
          message="Are you sure you want to remove this spot?"
          onConfirm={confirmDelete}
          onCancel={() => setShowModal(false)}
          confirmText="Yes (Delete Spot)"
          cancelText="No (Keep Spot)"
        />
      )}
    </div>
  );
}

export default ManageSpots;