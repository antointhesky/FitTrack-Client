import React from "react";
import Modal from "react-modal";
import "./DeleteGoalModal.scss";

Modal.setAppElement("#root");

export default function DeleteGoalModal({ isOpen, onRequestClose, handleConfirmDelete }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Delete Goal"
      className="delete-goal-modal"
      overlayClassName="delete-goal-modal__overlay" 
    >
      <div className="delete-goal-modal__content">
        <h2 className="delete-goal-modal__title">Are you sure you want to delete this goal?</h2>
        <div className="delete-goal-modal__buttons">
          <button className="delete-goal-modal__confirm-button" onClick={handleConfirmDelete}>
            Confirm
          </button>
          <button className="delete-goal-modal__cancel-button" onClick={onRequestClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
