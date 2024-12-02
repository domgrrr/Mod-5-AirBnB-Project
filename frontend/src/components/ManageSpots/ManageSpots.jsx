import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getUserSpots, deleteSpot } from '../../store/spotsReducer';
import imageMapping from '../../store/imageMapping';
import ConfirmationModal from '../ConfirmationModal';
import './ManageSpots.css';

function ManageSpots() {
  const dispatch = useDispatch();
  const history = useHistory();
  const spots = useSelector(state => state.spots.spots);
  const sessionUser = useSelector(state => state.session.user);
  const [showModal, setShowModal] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);

  useEffect(() => {
    dispatch(getUserSpots());
  }, [dispatch]);

  if (!sessionUser) {
    history.push('/');
    return null;
  }

  const handleDeleteClick = (spotId) => {
    setSpotToDelete(spotId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteSpot(spotToDelete));
    setShowModal(false);
    dispatch(getUserSpots());
  };

  const handleUpdate = (spotId) => {
    history.push(`/spots/${spotId}/edit`);
  };

  const spotsWithImages = spots.map(spot => ({
    ...spot,
    previewImage: imageMapping[spot.name] || 'frontend/public/airbnb-logo.png',
  }));

  return (
    <div className="manage-spots-container">
      <div className="manage-spots-header">
        <h1>Manage Spots</h1>
        {spots.length === 0 && (
          <button 
            onClick={() => history.push('/spots/new')}
            className="create-new-spot-button"
          >
            Create a New Spot
          </button>
        )}
      </div>

      <div className="spots-grid">
        {spotsWithImages.map(spot => (
          <div key={spot.id} className="spot-tile">
            <div 
              className="spot-content"
              onClick={() => history.push(`/spots/${spot.id}`)}
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
            
            <div className="spot-buttons">
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
