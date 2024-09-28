import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AddGoalModal from "../../components/AddGoalModal/AddGoalModal";
import DeleteGoalModal from "../../components/DeleteGoalModal/DeleteGoalModal";
import "./GoalsPage.scss";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    unit: "",
    current_progress: "",
    deadline_progress: "",
  });

  
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get("http://localhost:5050/goals");
      setGoals(response.data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const handleEditClick = (goal) => {
    setGoalToEdit(goal);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5050/goals/${goalToEdit.id}`,
        goalToEdit
      );
      if (response.status === 200) {
        setGoals(
          goals.map((goal) =>
            goal.id === goalToEdit.id ? { ...goal, ...goalToEdit } : goal
          )
        );
        setGoalToEdit(null);
      }
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleCancelEdit = () => {
    setGoalToEdit(null);
  };

  const handleDeleteClick = (goalId) => {
    setGoalToDelete(goalId); 
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5050/goals/${goalToDelete}`
      );
      if (response.status === 200) {
        setGoals(goals.filter((goal) => goal.id !== goalToDelete));
        setGoalToDelete(null);
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const extractNumericValue = (str) => {
    // Remove non-numeric characters and convert to a number
    const numericValue = str.match(/\d+/);
    return numericValue ? parseFloat(numericValue[0]) : 0;
  };

  return (
    <main className="goals-page">
      <h1>Your Goals</h1>
      <button className="add-goal-button" onClick={() => setIsModalOpen(true)}>
        Add New Goal
      </button>

      <div className={`goals-container ${isDeleteModalOpen ? "hide" : ""}`}>
        {goals.map((goal) => {
          // Check if target and current_progress are valid numbers before calculating
          const validTarget = Number(goal.target) || 1; // Default to 1 if target is invalid
          const validProgress = extractNumericValue(goal.current_progress); 

          // Calculate the percentage of progress
          const percentageCompleted = (validProgress / validTarget) * 100;

          return (
            <div
              key={goal.id}
              className={`goal-card ${
                goalToEdit && goalToEdit.id === goal.id ? "editing" : ""
              }`}
            >
              {goalToEdit && goalToEdit.id === goal.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    name="name"
                    value={goalToEdit.name}
                    onChange={(e) =>
                      setGoalToEdit({ ...goalToEdit, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="number"
                    name="target"
                    value={goalToEdit.target}
                    onChange={(e) =>
                      setGoalToEdit({ ...goalToEdit, target: e.target.value })
                    }
                    required
                  />
                  <select
                    name="unit"
                    value={goalToEdit.unit}
                    onChange={(e) =>
                      setGoalToEdit({ ...goalToEdit, unit: e.target.value })
                    }
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
                    onChange={(e) =>
                      setGoalToEdit({
                        ...goalToEdit,
                        current_progress: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="date"
                    name="deadline_progress"
                    value={goalToEdit.deadline_progress}
                    onChange={(e) =>
                      setGoalToEdit({
                        ...goalToEdit,
                        deadline_progress: e.target.value,
                      })
                    }
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
                <>
                  <div className="goal-header">
                    <h2 className="goal-name">{goal.name}</h2>
                    <div className="goal-actions">
                      <button onClick={() => handleEditClick(goal)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>

                      <button onClick={() => handleDeleteClick(goal.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div className="goal-progress">
                    <CircularProgressbar
                      value={validProgress}
                      maxValue={validTarget}
                      text={`${validProgress}/${validTarget}`}
                      styles={buildStyles({
                        textColor: "#0E3740",
                        pathColor:
                          percentageCompleted >= 100
                            ? "#28a745"
                            : percentageCompleted >= 50
                            ? "#ffc107"
                            : "#fd6827", // Change color based on completion
                        trailColor: "#eee",
                        textSize: "16px",
                      })}
                    />
                  </div>

                  <div className="goal-footer">
                    <p className="goal-deadline">
                      Deadline:{" "}
                      {new Date(goal.deadline_progress).toLocaleDateString(
                        "en-GB"
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

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
            const response = await axios.post(
              "http://localhost:5050/goals",
              newGoal
            );
            if (response.status === 201) {
              setGoals([...goals, response.data]);
              setIsModalOpen(false);
            }
          } catch (error) {
            console.error("Error adding new goal:", error);
          }
        }}
      />

      <DeleteGoalModal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </main>
  );
}
