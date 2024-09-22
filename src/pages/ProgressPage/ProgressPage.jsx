import React from "react";
import { useLocation } from "react-router-dom";
import "./ProgressPage.scss";

export default function ProgressPage() {
  const { state } = useLocation();
  const session = state?.session || {}; // Get session data from state

  // Group exercises by workout type
  const exercisesByWorkoutType = session.exercises.reduce((acc, exercise) => {
    // Ensure workout_type is properly handled
    if (!acc[exercise.workout_type]) {
      acc[exercise.workout_type] = [];
    }
    acc[exercise.workout_type].push(exercise);
    return acc;
  }, {});

  const formattedDate = new Date(session.date).toLocaleDateString();

  return (
    <div className="progress-page">
      <h1>Session Progress</h1>
      {/* Display session date */}
      <h2>Session Date: {formattedDate}</h2>

      {/* Display cards for each workout type */}
      {Object.keys(exercisesByWorkoutType).map((workoutType, index) => (
        <div key={index} className="workout-card">
          <h3>Workout Type: {workoutType}</h3>
          <ul className="exercise-list">
            {exercisesByWorkoutType[workoutType].map((exercise, i) => (
              <li key={i} className="exercise-card">
                <div className="exercise-name">{exercise.name}</div> {/* Show exercise name */}
                <div className="exercise-count">Count: {exercise.count}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
