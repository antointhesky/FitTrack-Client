import React, { useState } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddGoalModal.scss";

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
  const units = ["cal", "reps", "sets"];
  
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
      overlayClassName="add-goal-modal__overlay"
    >
      <div className="add-goal-modal__content">
      <h2 className="add-goal-modal__title">Add New Goal</h2>
        <form onSubmit={handleAddNewGoal} className="add-goal-modal__form">
          <input
            type="text"
            name="name"
            placeholder="Goal Name"
            value={newGoal.name}
            onChange={handleNewGoalInputChange}
            required
            className="add-goal-modal__input"
          />
          <input
            type="number"
            name="target"
            placeholder="Target"
            value={newGoal.target}
            onChange={handleNewGoalInputChange}
            required
            className="add-goal-modal__input"
          />

          <div className="add-goal-modal__dropdown-container">
            <div
              className={`add-goal-modal__dropdown ${newGoal.unit ? "" : "placeholder"}`}
              onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            >
              {newGoal.unit || "Select Unit"}
            </div>
            {isDropdownVisible && (
              <div className="add-goal-modal__dropdown-menu">
                {units.map((unit, index) => (
                  <div
                    key={index}
                    className="add-goal-modal__dropdown-item"
                    onClick={() => handleDropdownItemClick(unit)}
                  >
                    {unit}
                  </div>
                ))}
              </div>
            )}
          </div>

          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              handleNewGoalInputChange({
                target: { name: "deadline_progress", value: date },
              });
            }}
            dateFormat="dd/MM/yyyy"
            className="add-goal-modal__date-picker"
          />

          <input
            type="text"
            name="current_progress"
            placeholder="Current Progress"
            value={newGoal.current_progress}
            onChange={handleNewGoalInputChange}
            required
            className="add-goal-modal__input"
          />
          
          <div className="add-goal-modal__actions">
            <button type="submit" className="add-goal-modal__save-button">
              Add Goal
            </button>
            <button
              type="button"
              className="add-goal-modal__cancel-button"
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