import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./WorkoutTypePage.scss";

const API_URL = import.meta.env.VITE_API_URL; 

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
          `${API_URL}/exercises?${workoutType ? `workout_type=${encodeURIComponent(workoutType)}` : `body_part=${encodeURIComponent(bodyPart)}`}` // Use API_URL
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
        id,
      })),
    };

    try {
      const response = await axios.post(`${API_URL}/session`, sessionData); 
      const sessionId = response.data.session_id;
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error("Error creating or updating session:", error);
    }
  };

  return (
    <main className="workout-type-page">
  <h1 className="workout-type-page__title">{`${workoutType || bodyPart} Workouts`}</h1>
  <button className="workout-type-page__go-back-button" onClick={() => navigate("/")}>
    <span>← Go back to homepage</span>
  </button>

  <div className="workout-type-page__exercises-container">
    {exercises.map((exercise) => (
      <div
        key={exercise.id}
        className={`workout-type-page__exercise-card ${
          selectedExercises.includes(exercise.id) ? "active" : ""
        }`}
        onClick={() => handleToggleExercise(exercise.id)}
      >
        <div className="workout-type-page__video-wrapper">
          <video src={`${API_URL}${exercise.video_url}`} controls />
          <div className="workout-type-page__info-icon" title="Watch the exercise tutorial video">
            ℹ️
          </div>
        </div>
        <h3 className="workout-type-page__exercise-title">{exercise.name}</h3>
        <p className="workout-type-page__exercise-detail">Body Part: {exercise.body_part}</p>
        <p className="workout-type-page__exercise-detail">Sets: {exercise.sets}</p>
        <p className="workout-type-page__exercise-detail">Reps: {exercise.reps}</p>
        <p className="workout-type-page__exercise-detail">Duration: {exercise.duration}</p>
        <p className="workout-type-page__exercise-detail">Calories Burned: {exercise.calories_burned}</p>

        <div className={`workout-type-page__exercise-toggle ${selectedExercises.includes(exercise.id) ? "active" : ""}`}>
          <span>{selectedExercises.includes(exercise.id) ? "−" : "+"}</span>
        </div>
      </div>
    ))}
  </div>

  {selectedExercises.length > 0 && (
    <div className="workout-type-page__go-to-session-container">
      <button className="workout-type-page__go-to-session-button" onClick={handleGoToSession}>
        <span> + Go to your session </span>
      </button>
    </div>
  )}
</main>

  );
}
