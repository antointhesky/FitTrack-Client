import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./EditGoalsPage.scss";

export default function EditGoalsPage() {
  const { name } = useParams(); 
  const { state } = useLocation();
  const [goal, setGoal] = useState({
    name: "",
    target: "",
    unit: "",
    current_progress: "",
    deadline_progress: "",
  });
  const navigate = useNavigate();

  // Fetch the current goal data when the component mounts
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/goals/${state.goalId}`);
        setGoal(response.data);
      } catch (error) {
        console.error("Error fetching goal:", error);
      }
    };

    if (state && state.goalId) {
      fetchGoal();
    } else {
      console.error("No goal ID found in state.");
    }
  }, [state.goalId]);

  // Handle form submission to update the goal
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check and log the data being submitted
    console.log("Goal data before update:", goal);

    try {
      await axios.put(`http://localhost:3000/goals/${state.goalId}`, goal);
      navigate("/goals");
    } catch (error) {
      console.error("Error updating goal:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="edit-goal-page">
      <h2>Edit Goal: {name}</h2> 
      <form onSubmit={handleSubmit}>
        {/* Goal Name Input */}
        <label>
          Goal Name:
          <input
            type="text"
            value={goal.name}
            onChange={(e) => setGoal({ ...goal, name: e.target.value })}
            required
          />
        </label>

        {/* Target Input */}
        <label>
          Target:
          <input
            type="number"
            value={goal.target}
            onChange={(e) => setGoal({ ...goal, target: e.target.value })}
            required
          />
        </label>

        {/* Unit Input */}
        <label>
          Unit:
          <select
            value={goal.unit}
            onChange={(e) => setGoal({ ...goal, unit: e.target.value })}
            required
          >
            <option value="">Select Unit</option>
            <option value="kg">kg</option>
            <option value="cal">cal</option>
            <option value="km">km</option>
            <option value="steps">steps</option>
            <option value="workouts">workouts</option>
          </select>
        </label>

        {/* Current Progress Input */}
        <label>
          Current Progress:
          <input
            type="text"
            value={goal.current_progress} // Changed to type="text" for more flexibility
            onChange={(e) => setGoal({ ...goal, current_progress: e.target.value })}
            required
          />
        </label>

        {/* Deadline Input */}
        <label>
          Deadline:
          <input
            type="date"
            value={goal.deadline_progress}
            onChange={(e) => setGoal({ ...goal, deadline_progress: e.target.value })}
            required
          />
        </label>

        {/* Submit Button */}
        <button type="submit" className="submit-button">Update Goal</button>
      </form>
    </div>
  );
}
