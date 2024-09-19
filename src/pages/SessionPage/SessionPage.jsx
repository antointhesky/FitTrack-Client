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
  const { state } = useLocation(); 
  const [selectedWorkoutExercises, setSelectedWorkoutExercises] = useState({});

  const handleWorkoutTypeSelect = (type) => {
    navigate(`/exercises/${type.id}`);
  };

  useEffect(() => {
    if (state?.selectedExercises) {
      const { workoutId, selectedExercises } = state;

      setSelectedWorkoutExercises((prev) => ({
        ...prev,
        [workoutId]: selectedExercises,
      }));
    }
  }, [state]);

  return (
    <div className="session-page">
      <h1>Current Session</h1>

      <div className="workout-types-container">
        {WORKOUT_TYPES.map((type) => (
          <div
            key={type.id}
            className="workout-card"
            onClick={() => handleWorkoutTypeSelect(type)}
          >
            <img src={type.imageUrl} alt={type.name} className="workout-image" />
            <h3>{type.name}</h3>

            {selectedWorkoutExercises[type.id]?.length > 0 && (
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
