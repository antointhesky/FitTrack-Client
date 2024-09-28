import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./WorkoutTypePage.scss";

export default function WorkoutTypePage() {
  const [searchParams] = useSearchParams();
  const workoutType = searchParams.get("workout_type");
  const bodyPart = searchParams.get("body_part");
  const navigate = useNavigate();
  
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/exercises?${workoutType ? `workout_type=${encodeURIComponent(workoutType)}` : `body_part=${encodeURIComponent(bodyPart)}`}`
        );
        setExercises(response.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    if (workoutType || bodyPart) {
      fetchExercises();
    }
  }, [workoutType, bodyPart]);

  const handleToggleExercise = (exerciseId) => {
    if (selectedExercises.includes(exerciseId)) {
      setSelectedExercises(selectedExercises.filter((id) => id !== exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };

  const handleGoToSession = async () => {
    const sessionData = {
      exercises: selectedExercises.map((id) => ({
        id, // Passing the exercise ID
      })),
    };

    try {
      const response = await axios.post("http://localhost:5050/session", sessionData);
      const sessionId = response.data.session_id;
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error("Error creating or updating session:", error);
    }
  };

  return (
    <main className="workout-type-page">
      <h1>{`${workoutType || bodyPart} Workouts`}</h1>
      <button className="go-back-button" onClick={() => navigate("/")}>
        <span>← Go back to homepage</span>
      </button>

      <div className="exercises-container">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className={`exercise-card ${
              selectedExercises.includes(exercise.id) ? "active" : ""
            }`}
            onClick={() => handleToggleExercise(exercise.id)}
          >
            <div className="video-wrapper">
              <video src={`http://localhost:5050${exercise.video_url}`} controls />
              <div className="info-icon" title="Watch the exercise tutorial video">ℹ️</div>
            </div>
            <h3>{exercise.name}</h3>
            <p>Body Part: {exercise.body_part}</p>
            <p>Sets: {exercise.sets}</p>
            <p>Reps: {exercise.reps}</p>
            <p>Duration: {exercise.duration}</p>
            <p>Calories Burned: {exercise.calories_burned}</p>

            <div className={`exercise-toggle ${selectedExercises.includes(exercise.id) ? "active" : ""}`}>
              <span>{selectedExercises.includes(exercise.id) ? "−" : "+"}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedExercises.length > 0 && (
        <div className="go-to-session-container">
          <button className="go-to-session" onClick={handleGoToSession}>
            <span> + Go to your session </span>
          </button>
        </div>
      )}
    </main>
  );
}


