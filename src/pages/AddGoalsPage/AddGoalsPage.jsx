import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddGoalsPage.scss";

export default function AddGoalsPage() {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");
  const [currentProgress, setCurrentProgress] = useState("");
  const [deadline, setDeadline] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newGoal = {
      name,
      target,
      unit,
      current_progress: currentProgress,
      deadline_progress: deadline,
    };

    console.log(newGoal); // Debugging: log the new goal data

    try {
      await axios.post("http://localhost:5050/goals", newGoal);
      navigate("/goals");
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  return (
    <div className="add-goal-page">
      <h2>Add New Goal</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Goal Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Target:
          <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} required />
        </label>
        <label>
          Unit:
          <select value={unit} onChange={(e) => setUnit(e.target.value)} required>
            <option value="">Select Unit</option>
            <option value="kg">kg</option>
            <option value="cal">cal</option>
            <option value="km">km</option>
            <option value="steps">steps</option>
            <option value="workouts">workouts</option>
          </select>
        </label>
        <label>
          Current Progress:
          <input type="number" value={currentProgress} onChange={(e) => setCurrentProgress(e.target.value)} required />
        </label>
        <label>
          Deadline:
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        </label>
        <button type="submit" className="submit-button">Add Goal</button>
      </form>
    </div>
  );
}
