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
        const response = await axios.get("http://localhost:5050/goals");
        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  return (
    <main className="goals-page">
      <h1>Your Goals</h1>
      <div className="goals-container">
        {goals.map((goal) => (
          <div key={goal.id} className="goal-card">
            <Link
              to={`/goals/${goal.name}/edit`}
              state={{ goalId: goal.id }} 
              className="goal-link"
            >
              <div className="goal-header">
                <h2 className="goal-name">{goal.name}</h2>
              </div>
              <div className="goal-progress">
                <CircularProgressbar
                  value={goal.current_progress}
                  maxValue={goal.target}
                  text={`${goal.current_progress}/${goal.target}`}
                  styles={buildStyles({
                    textColor: "$orange", 
                    pathColor: "$orange", 
                    trailColor: "#eee", 
                  })}
                />
              </div>
              <div className="goal-footer">
                <p className="goal-deadline">
                  Deadline: {new Date(goal.deadline_progress).toLocaleDateString("en-GB")}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <Link to="/goals/add" className="add-goal-button">
        Add New Goal
      </Link>
    </main>
  );
}
