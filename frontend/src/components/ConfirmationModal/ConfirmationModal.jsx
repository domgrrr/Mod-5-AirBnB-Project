import './ConfirmationModal.css';

const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmText, cancelText }) => {
  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-button">{confirmText}</button>
          <button onClick={onCancel} className="cancel-button">{cancelText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
