import React, { useState } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddGoalModal.scss";

// For accessibility, bind modal to your app element (usually root)
Modal.setAppElement("#root");

export default function AddGoalModal({
  isOpen,
  onRequestClose,
  newGoal,
  handleNewGoalInputChange,
  handleAddNewGoal,
}) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const units = ["cal", "reps", "sets", "hours", "name", "body part", "workout type"];
  
  const handleDropdownItemClick = (item) => {
    handleNewGoalInputChange({ target: { name: "unit", value: item } });
    setIsDropdownVisible(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add New Goal"
      className="add-goal-modal"
      overlayClassName="add-goal-overlay"
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

          {/* Custom Dropdown for Unit Selection */}
          <div className="custom-dropdown-container">
            <div
              className={`custom-dropdown ${newGoal.unit ? "" : "placeholder"}`}
              onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            >
              {newGoal.unit || "Select Unit"}
            </div>
            {isDropdownVisible && (
              <div className="custom-dropdown-menu">
                {units.map((unit, index) => (
                  <div
                    key={index}
                    className="custom-dropdown-item"
                    onClick={() => handleDropdownItemClick(unit)}
                  >
                    {unit}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom DatePicker instead of native input[type="date"] */}
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              handleNewGoalInputChange({
                target: { name: "deadline_progress", value: date },
              });
            }}
            dateFormat="dd/MM/yyyy"
            className="custom-date-picker"
          />

          <input
            type="text"
            name="current_progress"
            placeholder="Current Progress"
            value={newGoal.current_progress}
            onChange={handleNewGoalInputChange}
            required
          />
          
          <div className="modal-buttons">
            <button type="submit" className="save-button">
              Add Goal
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onRequestClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}