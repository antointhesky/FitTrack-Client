import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AddGoalModal from "../../components/AddGoalModal/AddGoalModal";
import DeleteGoalModal from "../../components/DeleteGoalModal/DeleteGoalModal"; // Import the delete modal
import "./GoalsPage.scss";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For AddGoalModal
  const [goalToEdit, setGoalToEdit] = useState(null); // Track goal being edited
  const [goalToDelete, setGoalToDelete] = useState(null); // Track goal being deleted
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Track if delete modal is open
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    unit: "",
    current_progress: "",
    deadline_progress: "",
  });

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get("http://localhost:5050/goals");
        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  // Handle opening inline edit mode on the card
  const handleEditClick = (goal) => {
    setGoalToEdit(goal); // Set the goal to be edited
  };

  // Handle saving the edited goal
  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:5050/goals/${goalToEdit.id}`, goalToEdit);
      if (response.status === 200) {
        setGoals(goals.map((goal) => (goal.id === goalToEdit.id ? { ...goal, ...goalToEdit } : goal)));
        setGoalToEdit(null); // Exit edit mode after saving
      }
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setGoalToEdit(null); // Exit edit mode without saving
  };

  // Handle opening delete confirmation modal
  const handleDeleteClick = (goalId) => {
    setGoalToDelete(goalId); // Set the goal ID for deletion
    setIsDeleteModalOpen(true); // Open the delete modal
  };

  // Handle confirming delete
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5050/goals/${goalToDelete}`);
      if (response.status === 200) {
        setGoals(goals.filter((goal) => goal.id !== goalToDelete)); // Remove deleted goal
        setGoalToDelete(null);
        setIsDeleteModalOpen(false); // Close delete modal
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  // Handle canceling delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // Close delete modal
  };

  return (
    <main className="goals-page">
      <h1>Your Goals</h1>

      {/* Button to trigger AddGoalModal */}
      <button className="add-goal-button" onClick={() => setIsModalOpen(true)}>
        Add New Goal
      </button>

      {/* Goals container */}
      <div className={`goals-container ${isDeleteModalOpen ? "hide" : ""}`}>
        {goals.map((goal) => (
          <div key={goal.id} className={`goal-card ${goalToEdit && goalToEdit.id === goal.id ? "editing" : ""}`}>
            {goalToEdit && goalToEdit.id === goal.id ? (
              // Inline editing form when pencil is clicked
              <div className="edit-form">
                <input
                  type="text"
                  name="name"
                  value={goalToEdit.name}
                  onChange={(e) => setGoalToEdit({ ...goalToEdit, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  name="target"
                  value={goalToEdit.target}
                  onChange={(e) => setGoalToEdit({ ...goalToEdit, target: e.target.value })}
                  required
                />
                <select
                  name="unit"
                  value={goalToEdit.unit}
                  onChange={(e) => setGoalToEdit({ ...goalToEdit, unit: e.target.value })}
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
                  value={goalToEdit.current_progress}
                  onChange={(e) => setGoalToEdit({ ...goalToEdit, current_progress: e.target.value })}
                  required
                />
                <input
                  type="date"
                  name="deadline_progress"
                  value={goalToEdit.deadline_progress}
                  onChange={(e) => setGoalToEdit({ ...goalToEdit, deadline_progress: e.target.value })}
                  required
                />
                <div className="edit-actions">
                  <button className="save-button" onClick={handleSaveEdit}>
                    Save
                  </button>
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Normal goal display if not editing
              <>
                <div className="goal-header">
                  <h2 className="goal-name">{goal.name}</h2>
                  <div className="goal-actions">
                    {/* Pencil Icon for editing */}
                    <button onClick={() => handleEditClick(goal)}>
                      <i className="fas fa-pencil-alt"></i> {/* Edit Icon */}
                    </button>

                    {/* Trash Icon for deletion */}
                    <button onClick={() => handleDeleteClick(goal.id)}>
                      <i className="fas fa-trash"></i> {/* Delete Icon */}
                    </button>
                  </div>
                </div>

                <div className="goal-progress">
                  <CircularProgressbar
                    value={goal.current_progress}
                    maxValue={goal.target}
                    text={`${goal.current_progress}/${goal.target}`}
                    styles={buildStyles({
                      textColor: "#FFF",
                      pathColor: "#FFF",
                      trailColor: "#eee",
                    })}
                  />
                </div>

                <div className="goal-footer">
                  <p className="goal-deadline">
                    Deadline: {new Date(goal.deadline_progress).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* AddGoalModal */}
      <AddGoalModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        newGoal={newGoal}
        handleNewGoalInputChange={(e) => {
          const { name, value } = e.target;
          setNewGoal((prevNewGoal) => ({ ...prevNewGoal, [name]: value }));
        }}
        handleAddNewGoal={async (e) => {
          e.preventDefault();
          try {
            const response = await axios.post("http://localhost:5050/goals", newGoal);
            if (response.status === 201) {
              setGoals([...goals, response.data]); // Add new goal to list
              setIsModalOpen(false); // Close modal after adding
            }
          } catch (error) {
            console.error("Error adding new goal:", error);
          }
        }}
      />

      {/* DeleteGoalModal */}
      <DeleteGoalModal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </main>
  );
}
