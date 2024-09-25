import React from "react";
import Modal from "react-modal";
import "./DeleteGoalModal.scss";

// For accessibility, bind modal to your app element (usually root)
Modal.setAppElement("#root");

export default function DeleteGoalModal({ isOpen, onRequestClose, handleConfirmDelete }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Delete Goal"
      className="delete-modal" // Centered modal class
      overlayClassName="delete-modal-overlay" // Custom overlay class
    >
      <div className="modal-content">
        <h2>Are you sure you want to delete this goal?</h2>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={handleConfirmDelete}>
            Confirm
          </button>
          <button className="cancel-button" onClick={onRequestClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

