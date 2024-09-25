import React from "react";
import Modal from "react-modal";
import "./EditGoalModal.scss";

Modal.setAppElement("#root");

export default function EditGoalModal({ isOpen, onRequestClose, goalToEdit, handleInputChange, handleSaveEdit }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Goal"
      className="edit-goal-modal"
      overlayClassName="edit-goal-overlay"
    >
      <div className="modal-content">
        <h2>Edit Goal</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="name"
            placeholder="Goal Name"
            value={goalToEdit.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="target"
            placeholder="Target"
            value={goalToEdit.target}
            onChange={handleInputChange}
            required
          />
          <select
            name="unit"
            value={goalToEdit.unit}
            onChange={handleInputChange}
            required
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
          />
          <input
            type="date"
            name="deadline_progress"
            value={goalToEdit.deadline_progress}
            onChange={handleInputChange}
            required
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
