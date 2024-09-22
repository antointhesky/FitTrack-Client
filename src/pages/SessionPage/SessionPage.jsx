import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SessionPage.scss";

const WORKOUT_TYPES = [
  { id: 1, name: "Cardio", imageUrl: "/images/cardio.png" },
  { id: 2, name: "Strength", imageUrl: "/images/strength.png" },
  { id: 3, name: "Fat Burning", imageUrl: "/images/fat_burning.png" },
  { id: 4, name: "Health Fitness", imageUrl: "/images/health_fitness.png" },
];

export default function SessionPage() {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentSession, setCurrentSession] = useState([]);
  const navigate = useNavigate();

  // Fetch exercises based on workout type
  const fetchExercises = async (workoutType) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/exercises?workout_type=${workoutType}`
      );
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  // Add exercise to the current session or increment count if it already exists
  const addExerciseToSession = (exercise) => {
    setCurrentSession((prevSession) => {
      // Avoid direct mutation of prevSession
      const updatedSession = [...prevSession];

      // Find if the exercise already exists in the session
      const existingExerciseIndex = updatedSession.findIndex((e) => e.id === exercise.id && e.workout_type === selectedWorkout);

      if (existingExerciseIndex !== -1) {
        // Increment the count by 1
        updatedSession[existingExerciseIndex] = {
          ...updatedSession[existingExerciseIndex],
          count: updatedSession[existingExerciseIndex].count + 1,
        };
      } else {
        // Add the exercise with the workout type to the session with an initial count of 1
        updatedSession.push({ ...exercise, count: 1, workout_type: selectedWorkout });
      }

      return updatedSession;
    });

    // Debugging: Check if the function is called twice on a single click
    console.log(`Added ${exercise.name} to the session under ${selectedWorkout}`);
  };

  // Remove exercise or decrease the count from the current session
  const removeExerciseFromSession = (exerciseId) => {
    setCurrentSession((prevSession) =>
      prevSession
        .map((e) => (e.id === exerciseId ? { ...e, count: e.count - 1 } : e))
        .filter((e) => e.count > 0) // Remove the exercise if the count goes to 0
    );
  };

  // Handle saving the session
  const handleSaveSession = async () => {
    const sessionData = {
      // No workout_type at the session level
      exercises: currentSession.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        count: exercise.count,
        workout_type: exercise.workout_type, // Attach workout type to each exercise
      })),
      date: new Date().toISOString().split(".")[0].replace("T", " "), // Properly formatted date
    };
  
    try {
      const response = await axios.post("http://localhost:3000/session", sessionData);
      const sessionId = response.data.session_id;
  
      // Redirect to progress page with the session data
      navigate(`/progress/${sessionId}`, { state: { session: sessionData } });
    } catch (error) {
      console.error("Error saving session:", error.response?.data || error.message);
    }
  };
  
  // Handle workout type selection
  const handleWorkoutTypeSelect = (type) => {
    setSelectedWorkout(type.name);
    fetchExercises(type.name);
  };

  return (
    <div className="session-page">
      <h1>Select Workout Type</h1>
      <div className="workout-types-container">
        {WORKOUT_TYPES.map((type) => (
          <div
            key={type.id}
            className="workout-card"
            onClick={() => handleWorkoutTypeSelect(type)}
          >
            <img src={type.imageUrl} alt={type.name} className="workout-image" />
            <h3>{type.name}</h3>
          </div>
        ))}
      </div>

      {selectedWorkout && (
        <>
          <h2>{selectedWorkout} Exercises</h2>
          <div className="exercises-list">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <span>{exercise.name}</span>
                <button onClick={() => addExerciseToSession(exercise)} className="add-button">
                  Add
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {currentSession.length > 0 && (
        <>
          <h2>Current Session</h2>
          <ul className="session-list">
            {currentSession.map((exercise) => (
              <li key={exercise.id} className="session-item">
                {exercise.name} ({exercise.workout_type}) - {exercise.count}x
                <button
                  onClick={() => removeExerciseFromSession(exercise.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleSaveSession} className="submit-session-button">
            Save Session
          </button>
        </>
      )}
    </div>
  );
}
