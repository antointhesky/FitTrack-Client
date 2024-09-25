// src/pages/WorkoutsOverviewPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./WorkoutsOverviewPage.scss";

export default function WorkoutsOverviewPage() {
  const [workoutTypes, setWorkoutTypes] = useState([]);

  useEffect(() => {
    const fetchWorkoutTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5050/workouts"); // Replace with actual endpoint
        setWorkoutTypes(response.data);
      } catch (error) {
        console.error("Error fetching workout types:", error);
      }
    };

    fetchWorkoutTypes();
  }, []);

  return (
    <main className="workouts-overview-page">
      <h1>Choose a Workout Type</h1>
      <div className="workout-types-container">
        {workoutTypes.map((workout) => (
          <Link
            key={workout.id}
            to={`/workouts?workout_type=${encodeURIComponent(workout.name)}`}
            className="workout-type-card"
          >
            <h3>{workout.name}</h3>
          </Link>
        ))}
      </div>
    </main>
  );
}
