import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faDumbbell, faRedo } from '@fortawesome/free-solid-svg-icons';
import "./SessionPage.scss";

export default function SessionPage() {
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentSession, setCurrentSession] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();

  const colorPalette = ["#0091ea", "#00bfa5", "#ffab00", "#d50000"];

  useEffect(() => {
    const fetchWorkoutTypes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/workouts");
        setWorkoutTypes(response.data);
      } catch (error) {
        console.error("Error fetching workout types:", error);
      }
    };
    fetchWorkoutTypes();
  }, []);

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

  const handleWorkoutTypeSelect = (type) => {
    setSelectedWorkout(type.name);
    fetchExercises(type.name);
    setExpandedCard(type.id === expandedCard ? null : type.id);
  };

  const addExerciseToSession = (exercise) => {
    setCurrentSession((prevSession) => {
      const updatedSession = [...prevSession];
      const existingExerciseIndex = updatedSession.findIndex(
        (e) => e.id === exercise.id && e.workout_type === selectedWorkout
      );

      if (existingExerciseIndex !== -1) {
        updatedSession[existingExerciseIndex] = {
          ...updatedSession[existingExerciseIndex],
          count: updatedSession[existingExerciseIndex].count + 1,
        };
      } else {
        updatedSession.push({ ...exercise, count: 1, workout_type: selectedWorkout });
      }

      return updatedSession;
    });
  };

  const removeExerciseFromSession = (exerciseId) => {
    setCurrentSession((prevSession) =>
      prevSession.filter((e) => e.id !== exerciseId)
    );
  };

  const handleSaveSession = async () => {
    const sessionData = {
      exercises: currentSession.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        count: exercise.count,
        workout_type: exercise.workout_type,
      })),
      date: new Date().toISOString().split(".")[0].replace("T", " "),
    };

    try {
      const response = await axios.post("http://localhost:3000/session", sessionData);
      const sessionId = response.data.session_id;

      navigate(`/progress/${sessionId}`, { state: { session: sessionData } });
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  return (
    <div className="session-page">
      {currentSession.length > 0 && (
        <div className="current-session">
          <h2>Current Session</h2>
          <div className="session-list">
            {currentSession.map((exercise) => (
              <div key={exercise.id} className="session-item-card">
                <span>{exercise.name} ({exercise.count}x)</span>
                <button
                  onClick={() => removeExerciseFromSession(exercise.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleSaveSession} className="submit-session-button">
            Save Session
          </button>
        </div>
      )}

      <h1>Select Workout Type</h1>
      <div className="workout-types-container">
        {workoutTypes.map((type, index) => (
          <div
            key={type.id}
            className={`workout-card ${expandedCard === type.id ? 'expanded' : ''}`}
            onClick={() => handleWorkoutTypeSelect(type)}
            style={{
              backgroundColor: colorPalette[index % colorPalette.length],
              top: `${index * 50}px`,
              zIndex: expandedCard === type.id ? 10 : index,
              height: expandedCard === type.id ? "600px" : "150px",
            }}
          >
            <h3>{type.name}</h3>
            {expandedCard === type.id && (
              <div className="card-content">
                <p>{type.description}</p>
                <div className="exercises-list">
                  {exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="exercise-card-container"
                      onClick={() => addExerciseToSession(exercise)} // Add this line
                    >
                      <div className="pink-container">
                        <div className="circle-image-container">
                          <img src={exercise.imageUrl} alt={exercise.name} className="circle-image" />
                        </div>
                      </div>
                      <div className="white-container">
                        <h3>{exercise.name}</h3>
                        <div className="stats-row">
                          {exercise.calories_burned > 0 && (
                            <div className="stat">
                              <FontAwesomeIcon icon={faFire} />
                              <span>{exercise.calories_burned} cal</span>
                            </div>
                          )}
                          {exercise.sets > 0 && (
                            <div className="stat">
                              <FontAwesomeIcon icon={faDumbbell} />
                              <span>{exercise.sets} Sets</span>
                            </div>
                          )}
                          {exercise.reps > 0 && (
                            <div className="stat">
                              <FontAwesomeIcon icon={faRedo} />
                              <span>{exercise.reps} Reps</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
