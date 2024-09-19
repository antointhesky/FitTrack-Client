import { useNavigate } from "react-router-dom";
import "./SessionPage.scss";

const WORKOUT_TYPES = [
  { id: 1, name: "Cardio", imageUrl: "/images/cardio.png" },
  { id: 2, name: "Strength", imageUrl: "/images/strength.png" },
  { id: 3, name: "Fat Burning", imageUrl: "/images/fat_burning.png" },
  { id: 4, name: "Health Fitness", imageUrl: "/images/health_fitness.png" },
];

export default function SessionPage() {
  const navigate = useNavigate();

  const handleWorkoutTypeSelect = (type) => {
    navigate(`/exercises/${type.name}`, { state: { workoutType: type.name } });
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
    </div>
  );
}
