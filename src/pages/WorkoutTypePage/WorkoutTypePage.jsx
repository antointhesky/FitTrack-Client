import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./WorkoutTypePage.scss";

export default function WorkoutTypePage() {
  const [searchParams] = useSearchParams();
  const workoutType = searchParams.get("workout_type");
  const navigate = useNavigate();
  
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    if (workoutType) {
      const fetchExercises = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5050/exercises?workout_type=${encodeURIComponent(workoutType)}`
          );
          setExercises(response.data);
        } catch (error) {
          console.error("Error fetching exercises:", error);
        }
      };
      fetchExercises();
    }
  }, [workoutType]);

  const handleToggleExercise = (exerciseId) => {
    if (selectedExercises.includes(exerciseId)) {
      // Remove exercise if it's already selected
      setSelectedExercises(selectedExercises.filter((id) => id !== exerciseId));
    } else {
      // Add exercise to selected list
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };

  const handleGoToSession = async () => {
    const sessionData = {
      exercises: selectedExercises.map((id) => ({
        id,
        workout_type: workoutType,
      })),
    };

    try {
      const response = await axios.post("http://localhost:5050/session", sessionData);
      const sessionId = response.data.session_id;
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <main className="workout-type-page">
      <h1>{`${workoutType} Workouts`}</h1>
      <div className="exercises-container">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className={`exercise-card ${
              selectedExercises.includes(exercise.id) ? "active" : ""
            }`}
            onClick={() => handleToggleExercise(exercise.id)}
          >
            <video src={`http://localhost:5050${exercise.video_url}`} controls />
            <h3>{exercise.name}</h3>
            <p>Body Part: {exercise.body_part}</p>
            <p>Sets: {exercise.sets}</p>
            <p>Reps: {exercise.reps}</p>
            <p>Duration: {exercise.duration}</p>
            <p>Calories Burned: {exercise.calories_burned}</p>

            <div className={`exercise-toggle ${selectedExercises.includes(exercise.id) ? "active" : ""}`}>
              <p>
                {selectedExercises.includes(exercise.id) ? "-" : "+"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Only show the button when exercises are selected */}
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
