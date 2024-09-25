import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AddGoalModal from "../../components/AddGoalModal/AddGoalModal"; // Import the new AddGoalModal component
import "./GoalsPage.scss";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null); // Track goal being edited
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    unit: "",
    current_progress: "",
    deadline_progress: "",
  });
  const [goalData, setGoalData] = useState({
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

  // Function to handle adding a new goal
  const handleAddNewGoal = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5050/goals", newGoal);

      if (response.status === 201) {
        setGoals([...goals, response.data]); // Add the new goal to the list
        setNewGoal({
          name: "",
          target: "",
          unit: "",
          current_progress: "",
          deadline_progress: "",
        }); // Clear the form
        setIsModalOpen(false); // Close the modal after saving
      } else {
        console.error("Failed to add the new goal");
      }
    } catch (error) {
      console.error("Error adding new goal:", error);
    }
  };

  // Handle form input changes for adding new goals
  const handleNewGoalInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prevNewGoal) => ({
      ...prevNewGoal,
      [name]: value,
    }));
  };

  // Function to handle editing a goal
  const handleEditClick = (goal) => {
    setEditingGoalId(goal.id);
    setGoalData(goal);
  };

  // Function to save the edited goal
  const handleSaveEdit = async (goalId) => {
    try {
      const response = await axios.put(`http://localhost:5050/goals/${goalId}`, goalData);

      if (response.status === 200) {
        setGoals(goals.map((goal) => (goal.id === goalId ? { ...goal, ...goalData } : goal)));
        setEditingGoalId(null); // Exit edit mode after saving
      } else {
        console.error("Failed to save the goal");
      }
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  // Function to cancel editing mode
  const handleCancelEdit = () => {
    setEditingGoalId(null);
  };

  // Function to handle deleting a goal
  const handleDeleteGoal = async (goalId) => {
    if (window.confirm("Are you sure you want to cancel this goal?")) {
      try {
        const response = await axios.delete(`http://localhost:5050/goals/${goalId}`);

        if (response.status === 200) {
          setGoals(goals.filter((goal) => goal.id !== goalId)); // Remove the goal from the list
        } else {
          console.error("Failed to delete the goal");
        }
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  // Handle form input changes for editing goals
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGoalData((prevGoalData) => ({
      ...prevGoalData,
      [name]: value,
    }));
  };

  return (
    <main className="goals-page">
      <h1>Your Goals</h1>

      <button className="add-goal-button" onClick={() => setIsModalOpen(true)}>
        Add New Goal
      </button>

      {/* AddGoalModal Component */}
      <AddGoalModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        newGoal={newGoal}
        handleNewGoalInputChange={handleNewGoalInputChange}
        handleAddNewGoal={handleAddNewGoal}
      />

      <div className="goals-container">
        {goals.map((goal) => (
          <div key={goal.id} className={`goal-card ${editingGoalId === goal.id ? "editing" : ""}`}>
            {editingGoalId === goal.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  name="name"
                  value={goalData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="target"
                  value={goalData.target}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="unit"
                  value={goalData.unit}
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
                  value={goalData.current_progress}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="date"
                  name="deadline_progress"
                  value={goalData.deadline_progress}
                  onChange={handleInputChange}
                  required
                />
                <button className="save-button" onClick={() => handleSaveEdit(goal.id)}>
                  Save
                </button>
                <button className="cancel-button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="goal-header">
                  <h2 className="goal-name">{goal.name}</h2>
                  <div className="goal-actions">
                    <button onClick={() => handleEditClick(goal)}>
                      <i className="fas fa-pencil-alt"></i> {/* Edit Icon */}
                    </button>
                    <button onClick={() => handleDeleteGoal(goal.id)}>
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
    </main>
  );
}