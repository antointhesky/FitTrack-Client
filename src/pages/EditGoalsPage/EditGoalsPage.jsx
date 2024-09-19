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

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/goals/${state.goalId}`);
        setGoal(response.data);
      } catch (error) {
        console.error("Error fetching goal:", error);
      }
    };

    fetchGoal();
  }, [state.goalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:3000/goals/${state.goalId}`, goal);
      navigate("/goals");
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  return (
    <div className="edit-goal-page">
      <h2>Edit Goal: {name}</h2> 
      <form onSubmit={handleSubmit}>
        <label>
          Goal Name:
          <input
            type="text"
            value={goal.name}
            onChange={(e) => setGoal({ ...goal, name: e.target.value })}
            required
          />
        </label>
        <label>
          Target:
          <input
            type="number"
            value={goal.target}
            onChange={(e) => setGoal({ ...goal, target: e.target.value })}
            required
          />
        </label>
        <label>
          Unit:
          <select
            value={goal.unit}
            onChange={(e) => setGoal({ ...goal, unit: e.target.value })}
            required
          >
            <option value="">Select Unit</option>
            <option value="sessions">Sessions</option>
            <option value="exercises">Exercises</option>
            <option value="calories">Calories Burned</option>
          </select>
        </label>
        <label>
          Current Progress:
          <input
            type="number"
            value={goal.current_progress}
            onChange={(e) => setGoal({ ...goal, current_progress: e.target.value })}
            required
          />
        </label>
        <label>
          Deadline:
          <input
            type="date"
            value={goal.deadline_progress}
            onChange={(e) => setGoal({ ...goal, deadline_progress: e.target.value })}
            required
          />
        </label>
        <button type="submit" className="submit-button">Update Goal</button>
      </form>
    </div>
  );
}
