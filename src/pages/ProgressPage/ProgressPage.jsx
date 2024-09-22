import React from "react";
import { useLocation, useParams } from "react-router-dom";

export default function ProgressPage() {
  const { state } = useLocation();
  const { sessionId } = useParams();
  const session = state?.session || {};

  return (
    <div className="progress-page">
      <h1>Session Progress</h1>
      <h2>Session ID: {sessionId}</h2>

      <div className="session-details">
        <p>Workout Type: {session.workout_type}</p>
        <ul>
          {session.exercises.map((exercise) => (
            <li key={exercise.id}>
              Exercise ID: {exercise.id} - Count: {exercise.count}
            </li>
          ))}
        </ul>
        <p>Date: {new Date(session.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
