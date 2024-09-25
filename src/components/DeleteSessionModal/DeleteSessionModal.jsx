import React from "react";
import Modal from "react-modal";
import "./DeleteSessionModal.scss";

// For accessibility, bind modal to your app element (usually root)
Modal.setAppElement('#root');

export default function DeleteSessionModal({ isOpen, onRequestClose, handleConfirmDelete }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Delete Session"
      className="delete-modal"
      overlayClassName="delete-modal-overlay"
    >
      <div className="delete-modal-content">
        <h2>Are you sure you want to delete this session?</h2>
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
