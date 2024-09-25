import React from "react";
import Modal from "react-modal";
import "./AddGoalModal.scss";

// For accessibility, bind modal to your app element (usually root)
Modal.setAppElement('#root');

export default function AddGoalModal({ isOpen, onRequestClose, newGoal, handleNewGoalInputChange, handleAddNewGoal }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add New Goal"
      className="add-goal-modal" // Use similar styling as delete modal
      overlayClassName="add-goal-overlay" // Similar overlay class
    >
      <div className="modal-content">
        <h2>Add New Goal</h2>
        <form onSubmit={handleAddNewGoal} className="new-goal-form">
          <input
            type="text"
            name="name"
            placeholder="Goal Name"
            value={newGoal.name}
            onChange={handleNewGoalInputChange}
            required
          />
          <input
            type="number"
            name="target"
            placeholder="Target"
            value={newGoal.target}
            onChange={handleNewGoalInputChange}
            required
          />
          <select
            name="unit"
            value={newGoal.unit}
            onChange={handleNewGoalInputChange}
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
            value={newGoal.current_progress}
            onChange={handleNewGoalInputChange}
            required
          />
          <input
            type="date"
            name="deadline_progress"
            value={newGoal.deadline_progress}
            onChange={handleNewGoalInputChange}
            required
          />
          <div className="modal-buttons">
            <button type="submit" className="save-button">Add Goal</button>
            <button type="button" className="cancel-button" onClick={onRequestClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
