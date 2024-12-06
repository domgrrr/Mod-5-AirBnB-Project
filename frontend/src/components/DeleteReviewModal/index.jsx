import './DeleteReviewModal.css';
import { useDispatch } from 'react-redux';
import { deleteReview } from '../../store/spotsReducer';

const DeleteReviewModal = ({ reviewId, spotId, closeModal }) => {
  const dispatch = useDispatch();
  
  const handleDelete = async () => {
    try {
      await dispatch(deleteReview(reviewId, spotId));
      closeModal();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="delete-modal">
      <div className="delete-modal-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this review?</p>
        
        <div className="delete-modal-buttons">
          <button 
            className="delete-button"
            onClick={handleDelete}
          >
            Yes (Delete Review)
          </button>
          <button 
            className="cancel-button"
            onClick={closeModal}
          >
            No (Keep Review)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReviewModal;