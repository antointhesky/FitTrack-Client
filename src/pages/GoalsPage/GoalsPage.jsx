import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AddGoalModal from "../../components/AddGoalModal/AddGoalModal";
import DeleteGoalModal from "../../components/DeleteGoalModal/DeleteGoalModal"; // Import the delete modal component
import "./GoalsPage.scss";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For the AddGoalModal
  const [editingGoalId, setEditingGoalId] = useState(null); // Track goal being edited
  const [goalToEdit, setGoalToEdit] = useState(null); // Track the current goal to edit
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

  // Function to handle opening the edit form when clicking the pencil icon
  const handleEditClick = (goal) => {
    setEditingGoalId(goal.id); // Set the ID of the goal being edited
    setGoalToEdit(goal); // Set the current goal data in state
  };

  // Function to save the edited goal
  const handleSaveEdit = async (goalId) => {
    try {
      const response = await axios.put(`http://localhost:5050/goals/${goalId}`, goalToEdit);

      if (response.status === 200) {
        // Update the goals list after editing
        setGoals(goals.map((goal) => (goal.id === goalId ? { ...goal, ...goalToEdit } : goal)));
        setEditingGoalId(null); // Exit edit mode after saving
      } else {
        console.error("Failed to save the goal");
      }
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  // Function to cancel the editing mode
  const handleCancelEdit = () => {
    setEditingGoalId(null); // Reset the editing state
  };

  // Handle input changes for the goal being edited
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setGoalToEdit((prevGoal) => ({
      ...prevGoal,
      [name]: value,
    }));
  };

  return (
    <main className="goals-page">
      <h1>Your Goals</h1>

      {/* Add a button for adding new goals */}
      <button className="add-goal-button" onClick={() => setIsModalOpen(true)}>
        Add New Goal
      </button>

      {/* AddGoalModal Component */}
      <AddGoalModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        newGoal={newGoal}
        handleNewGoalInputChange={(e) => {
          const { name, value } = e.target;
          setNewGoal((prevNewGoal) => ({
            ...prevNewGoal,
            [name]: value,
          }));
        }}
        handleAddNewGoal={async (e) => {
          e.preventDefault();
          try {
            const response = await axios.post("http://localhost:5050/goals", newGoal);

            if (response.status === 201) {
              setGoals([...goals, response.data]); // Add the new goal to the list
              setIsModalOpen(false); // Close the modal after saving
            } else {
              console.error("Failed to add the new goal");
            }
          } catch (error) {
            console.error("Error adding new goal:", error);
          }
        }}
      />

      <div className="goals-container">
        {goals.map((goal) => (
          <div key={goal.id} className={`goal-card ${editingGoalId === goal.id ? "editing" : ""}`}>
            {editingGoalId === goal.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  name="name"
                  value={goalToEdit.name}
                  onChange={handleEditInputChange}
                  required
                />
                <input
                  type="number"
                  name="target"
                  value={goalToEdit.target}
                  onChange={handleEditInputChange}
                  required
                />
                <select
                  name="unit"
                  value={goalToEdit.unit}
                  onChange={handleEditInputChange}
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
                  onChange={handleEditInputChange}
                  required
                />
                <input
                  type="date"
                  name="deadline_progress"
                  value={goalToEdit.deadline_progress}
                  onChange={handleEditInputChange}
                  required
                />
                <div className="edit-actions">
                  <button className="save-button" onClick={() => handleSaveEdit(goal.id)}>
                    Save
                  </button>
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="goal-header">
                  <h2 className="goal-name">{goal.name}</h2>
                  <div className="goal-actions">
                    <button onClick={() => handleEditClick(goal)}>
                      <i className="fas fa-pencil-alt"></i> {/* Edit Icon */}
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
    </main>
  );
}
