import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProgressPage.scss";

export default function ProgressPage() {
  const { state } = useLocation();
  const { sessionId } = useParams();
  const session = state?.session || {}; 
  const [exercises, setExercises] = useState(session.exercises || []);
  const [availableExercises, setAvailableExercises] = useState([]); 
  const [isEditing, setIsEditing] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      const fetchAvailableExercises = async () => {
        try {
          const response = await axios.get(`http://localhost:5050/exercises`);
          setAvailableExercises(response.data); 
        } catch (error) {
          console.error("Error fetching available exercises:", error);
        }
      };

      fetchAvailableExercises();
    }
  }, [isEditing]);

  const addExerciseToSession = (exercise) => {
    setExercises((prevExercises) => [
      ...prevExercises,
      { ...exercise, workout_type: exercise.workout_type },
    ]);
  };

  const removeExerciseFromSession = (exerciseId) => {
    setExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.id !== exerciseId)
    );
  };

  const handleSaveUpdates = async () => {
    const sessionData = {
      exercises: exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        workout_type: exercise.workout_type,
      })),
      date: session.date,
    };

    try {
      await axios.put(`http://localhost:5050/session/${sessionId}`, sessionData);
      setIsEditing(false); 
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
              )
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