import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./GoalsPage.scss";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get("http://localhost:3000/goals");
        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  return (
    <div className="goals-page">
      <h1>Your Goals</h1>
      <ul className="goals-list">
        {goals.map((goal) => (
          <li key={goal.id} className="goal-item">
            <Link to={`/goals/${goal.id}/edit`}>
              <div className="goal-name">{goal.name}</div>
              <CircularProgressbar
                value={goal.current_progress}
                maxValue={goal.target}
                text={`${goal.current_progress}/${goal.target}`}
                styles={buildStyles({
                  textColor: "#4caf50",
                  pathColor: "#4caf50",
                  trailColor: "#eee",
                })}
              />
              <div className="goal-deadline">
                Deadline: {new Date(goal.deadline_progress).toLocaleDateString("en-GB")}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/goals/add" className="add-goal-button">
        Add New Goal
      </Link>
    </div>
  );
}
