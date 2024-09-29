import React from "react";
import Modal from "react-modal";
import "./EditGoalModal.scss";

Modal.setAppElement("#root");

export default function EditGoalModal({ 
  isOpen, 
  onRequestClose, 
  goalToEdit, 
  handleInputChange, 
  handleSaveEdit 
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Goal"
      className="edit-goal-modal"
      overlayClassName="edit-goal-modal__overlay"
    >
      <div className="edit-goal-modal__content">
        <h2 className="edit-goal-modal__title">Edit Goal</h2>
        <form className="edit-goal-modal__form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="name"
            placeholder="Goal Name"
            value={goalToEdit.name}
            onChange={handleInputChange}
            required
            className="edit-goal-modal__input"
          />
          <input
            type="number"
            name="target"
            placeholder="Target"
            value={goalToEdit.target}
            onChange={handleInputChange}
            required
            className="edit-goal-modal__input"
          />
          <select
            name="unit"
            value={goalToEdit.unit}
            onChange={handleInputChange}
            required
            className="edit-goal-modal__select"
          >
            <option value="">Select Unit</option>
            <option value="kg">kg</option>
            <option value="cal">cal</option>
            <option value="km">km</option>
            <option value="steps">steps</option>
            <option value="workouts">workouts</option>
          </select>
          <input
            type="text"
            name="current_progress"
            placeholder="Current Progress"
            value={goalToEdit.current_progress}
            onChange={handleInputChange}
            required
            className="edit-goal-modal__input"
          />
          <input
            type="date"
            name="deadline_progress"
            value={goalToEdit.deadline_progress}
            onChange={handleInputChange}
            required
            className="edit-goal-modal__input"
          />
          <div className="modal-buttons">
            <button className="save-button" onClick={handleSaveEdit}>
              Save
            </button>
            <button className="cancel-button" onClick={onRequestClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
