import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./SessionPage.scss";

export default function SessionPage() {
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentSession, setCurrentSession] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();

  // Define color palette for the workout cards
  const colorPalette = ["#0091ea", "#00bfa5", "#ffab00", "#d50000"];

  // Fetch workout types from the backend
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

  // Handle workout type selection and card expansion
  const handleWorkoutTypeSelect = (type) => {
    setSelectedWorkout(type.name); // Track selected workout type
    fetchExercises(type.name);
    setExpandedCard(type.id === expandedCard ? null : type.id); // Toggle card expansion
  };

  // Add exercise to the current session
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

  // Remove exercise from the current session
  const removeExerciseFromSession = (exerciseId) => {
    setCurrentSession((prevSession) =>
      prevSession.filter((e) => e.id !== exerciseId) // Remove the exercise completely
    );
  };

  // Handle saving the session and navigate to the progress page
  const handleSaveSession = async () => {
    const sessionData = {
      exercises: currentSession.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        count: exercise.count,
        workout_type: exercise.workout_type,
      })),
      date: new Date().toISOString().split(".")[0].replace("T", " "), // Properly formatted date
    };

    try {
      const response = await axios.post("http://localhost:3000/session", sessionData);
      const sessionId = response.data.session_id;

      // Redirect to progress page with the session data
      navigate(`/progress/${sessionId}`, { state: { session: sessionData } });
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  return (
    <div className="session-page">
      <h1>Select Workout Type</h1>
      <div className="workout-types-container">
        {workoutTypes.map((type, index) => (
          <div
            key={type.id}
            className={`workout-card ${expandedCard === type.id ? 'expanded' : ''}`}
            onClick={() => handleWorkoutTypeSelect(type)}
            style={{
              backgroundColor: colorPalette[index % colorPalette.length], // Assign color based on index
              top: `${index * 50}px`, // Adjust the position based on index for stacking
              zIndex: expandedCard === type.id ? 10 : index, // Bring the expanded card to the front
              height: expandedCard === type.id ? "600px" : "150px", // Increase workout card size
            }}
          >
            <h3>{type.name}</h3>
            {expandedCard === type.id && (
              <div className="card-content">
                <p>{type.description}</p>
                <div className="exercises-list">
                  {exercises.map((exercise) => (
                    <div key={exercise.id} className="exercise-card-container">
                      <div className="pink-container">
                        <div className="circle-image-container">
                          <img src={exercise.imageUrl} alt={exercise.name} className="circle-image" />
                        </div>
                      </div>
                      <div className="white-container">
                        <h3>{exercise.name}</h3>
                        <div className="stats-row">
                          <div className="stat">
                            <span>{exercise.calories_burned} cal</span>
                          </div>
                          <div className="stat">
                            <span>{exercise.sets} Sets</span>
                          </div>
                          <div className="stat">
                            <span>{exercise.reps} Reps</span>
                          </div>
                        </div>
                        <button onClick={() => addExerciseToSession(exercise)} className="add-button">
                          Add to Session
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current Session Section */}
      {currentSession.length > 0 && (
        <div className="current-session">
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
        </div>
      )}
    </div>
  );
}
