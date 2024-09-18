import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./SessionPage.scss";

const WORKOUT_TYPES = [
  { id: 1, name: "Cardio", imageUrl: "/images/cardio.png" },
  { id: 2, name: "Strength", imageUrl: "/images/strength.png" },
  { id: 3, name: "Fat Burning", imageUrl: "/images/fat_burning.png" },
  { id: 4, name: "Health Fitness", imageUrl: "/images/health_fitness.png" },
];

export default function SessionPage() {
  const navigate = useNavigate();
  const location = useLocation(); // To get the state passed from the ExercisesPage
  const [selectedWorkoutExercises, setSelectedWorkoutExercises] = useState({});

  // Handle workout type selection and redirect to exercises page
  const handleWorkoutTypeSelect = (type) => {
    navigate(`/exercises/${type.id}`);
  };

  // Update the state with exercises selected in the ExercisesPage
  useEffect(() => {
    if (location.state && location.state.selectedExercises) {
      const workoutId = location.state.workoutId;
      const exercises = location.state.selectedExercises;
      
      // Update selected exercises for the workout type
      setSelectedWorkoutExercises((prev) => ({
        ...prev,
        [workoutId]: exercises,
      }));
    }
  }, [location.state]);

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

            {/* Display selected exercises for this workout type */}
            {selectedWorkoutExercises[type.id] && selectedWorkoutExercises[type.id].length > 0 && (
              <ul>
                {selectedWorkoutExercises[type.id].map((exercise, index) => (
                  <li key={index}>
                    {exercise.name} - {exercise.duration} mins - {exercise.calories_burned} cal
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
