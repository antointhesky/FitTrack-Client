import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AddGoalModal from "../../components/AddGoalModal/AddGoalModal";
import DeleteGoalModal from "../../components/DeleteGoalModal/DeleteGoalModal";
import "./GoalsPage.scss";

const API_URL = import.meta.env.VITE_API_URL;

function Toast({ message, onClose }) {
  return (
    <div className="toast">
      <button className="toast__close-button" onClick={onClose}>
        &times;
      </button>
      <p className="toast__message">{message}</p>
    </div>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
      const response = await axios.get(`${API_URL}/goals`);
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
      const updatedGoal = {
        ...goalToEdit,
        current_progress: Number(goalToEdit.current_progress),
        deadline_progress: new Date(goalToEdit.deadline_progress)
          .toISOString()
          .split("T")[0],
      };

      const response = await axios.put(
        `${API_URL}/goals/${goalToEdit.id}`,
        updatedGoal
      );

      if (response.status === 200) {
        setGoals(
          goals.map((goal) =>
            goal.id === goalToEdit.id ? { ...goal, ...updatedGoal } : goal
          )
        );
        setGoalToEdit(null);
        setToastMessage("Goal updated successfully!");
        setShowToast(true);
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
      const response = await axios.delete(`${API_URL}/goals/${goalToDelete}`);

      if (response.status === 200) {
        setGoals(goals.filter((goal) => goal.id !== goalToDelete));
        setGoalToDelete(null);
        setIsDeleteModalOpen(false);
        setToastMessage("Goal deleted successfully!");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const extractNumericValue = (value) => {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const numericValue = value.match(/\d+/);
      return numericValue ? parseFloat(numericValue[0]) : 0;
    }

    return 0;
  };

  return (
    <main className="goals-page">
      {/* Hero Section */}
      <section className="goals-page__hero">
        <div className="goals-page__hero-content">
          <h1 className="goals-page__hero-content__title">
            Track Your Fitness Goals with Ease
          </h1>
          <p className="goals-page__hero-content__description">
            Stay motivated, set new targets, and watch your progress grow!
          </p>
          <div className="goals-page__hero-button-wrapper">
            <button
              className="goals-page__add-goal-button"
              onClick={() => setIsModalOpen(true)}
            >
              Add New Goal
            </button>
          </div>
        </div>
      </section>

      <h2 className="goals-page__title">Your Current Goals</h2>

      <div
        className={`goals-page__goals-container ${
          isDeleteModalOpen ? "hide" : ""
        }`}
      >
        {goals.map((goal) => {
          const validTarget = Number(goal.target) || 1;
          const validProgress = extractNumericValue(goal.current_progress);
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
                    className="add-goal-modal__input"
                  />
                  <input
                    type="number"
                    name="target"
                    value={goalToEdit.target}
                    onChange={(e) =>
                      setGoalToEdit({ ...goalToEdit, target: e.target.value })
                    }
                    required
                    className="add-goal-modal__input"
                  />
                  <select
                    name="unit"
                    value={goalToEdit.unit}
                    onChange={(e) =>
                      setGoalToEdit({ ...goalToEdit, unit: e.target.value })
                    }
                    required
                    className="add-goal-modal__input"
                  >
                    <option value="">Select Unit</option>
                    <option value="cal">cal</option>
                    <option value="reps">reps</option>
                    <option value="sets">sets</option>
                    <option value="hours">hours</option>
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
                    className="add-goal-modal__input"
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
                    className="add-goal-modal__input"
                  />
                  <div className="goals-page__edit-actions">
                    <button
                      className="goals-page__edit-actions__save-button"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="goals-page__edit-actions__cancel-button"
                      onClick={handleCancelEdit}
                    >
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
                          percentageCompleted >= 100 ? "#2f5c63" : "#fd6827",
                        trailColor: "#eee",
                        textSize: "0.8rem",
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

      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}

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

          const deadlineDate = new Date(newGoal.deadline_progress);
          if (isNaN(deadlineDate.getTime())) {
            console.error(
              "Invalid Date for deadline_progress:",
              newGoal.deadline_progress
            );
            return;
          }

          const formattedDeadline = deadlineDate.toISOString().split("T")[0];

          try {
            const response = await axios.post(`${API_URL}/goals`, {
              ...newGoal,
              deadline_progress: formattedDeadline,
            });

            if (response.status === 201) {
              setGoals([...goals, response.data]);
              setIsModalOpen(false);
              setToastMessage("Goal added successfully!");
              setShowToast(true);
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
