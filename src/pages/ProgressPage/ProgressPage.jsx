import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProgressPage.scss";

export default function ProgressPage() {
  const { state } = useLocation();
  const { sessionId } = useParams(); // Get session ID from URL
  const session = state?.session || {}; // Get session data from state
  const [exercises, setExercises] = useState(session.exercises || []);
  const [availableExercises, setAvailableExercises] = useState([]); // For adding new exercises
  const [isEditing, setIsEditing] = useState(false); // Toggle editing state
  const navigate = useNavigate();

  // Fetch available exercises that are not yet in the session
  useEffect(() => {
    if (isEditing) {
      const fetchAvailableExercises = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/exercises`);
          setAvailableExercises(response.data); // All exercises in the database
        } catch (error) {
          console.error("Error fetching available exercises:", error);
        }
      };

      fetchAvailableExercises();
    }
  }, [isEditing]);

  // Add exercise to the session
  const addExerciseToSession = (exercise) => {
    setExercises((prevExercises) => [
      ...prevExercises,
      { ...exercise, count: 1, workout_type: exercise.workout_type },
    ]);
  };

  // Remove exercise from the session
  const removeExerciseFromSession = (exerciseId) => {
    setExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.id !== exerciseId)
    );
  };

  // Save updates to the session
  const handleSaveUpdates = async () => {
    const sessionData = {
      exercises: exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        count: exercise.count,
        workout_type: exercise.workout_type,
      })),
      date: session.date,
    };

    try {
      await axios.put(`http://localhost:3000/session/${sessionId}`, sessionData);
      setIsEditing(false); // Hide the edit view after saving
      navigate(`/progress/${sessionId}`, { state: { session: sessionData } });
    } catch (error) {
      console.error("Error saving updates:", error);
    }
  };

  return (
    <div className="progress-page">
      <h1>Session Progress</h1>
      <h2>Session Date: {new Date(session.date).toLocaleDateString()}</h2>

      <h3>Exercises in Session</h3>
      <ul className="exercise-list">
        {exercises.map((exercise, i) => (
          <li key={i} className="exercise-card">
            <div className="exercise-name">
              {exercise.name} ({exercise.workout_type})
            </div>
            <div className="exercise-count">Count: {exercise.count}</div>
            {isEditing && (
              <button onClick={() => removeExerciseFromSession(exercise.id)}>
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)} className="edit-session-button">
          Edit Session
        </button>
      ) : (
        <>
          <h3>Add Exercises to Session</h3>
          <ul className="available-exercises">
            {availableExercises
              .filter(
                (availableExercise) =>
                  !exercises.some((exercise) => exercise.id === availableExercise.id)
              ) // Only show exercises not already in the session
              .map((exercise, i) => (
                <li key={i} className="exercise-card">
                  <div className="exercise-name">{exercise.name}</div>
                  <button onClick={() => addExerciseToSession(exercise)}>Add</button>
                </li>
              ))}
          </ul>
          <button onClick={handleSaveUpdates} className="submit-session-button">
            Save Updates
          </button>
        </>
      )}
    </div>
  );
}
