import "./WorkoutsPage.scss";
import { useEffect, useState } from "react";
import { getExercisesByWorkoutTypeApi } from "../../utils/apiUtils";
import Loader from "../../components/Loader/Loader";

export default function WorkoutsPage() {
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  const workoutTypes = ["Cardio", "Strength", "Fat Burning", "Health Fitness"];

  const handleWorkoutTypeChange = async (e) => {
    const workoutType = e.target.value;
    setSelectedWorkoutType(workoutType);

    setLoading(true);
    try {
      const exercisesData = await getExercisesByWorkoutTypeApi(workoutType);
      setExercises(exercisesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workouts">
      <h1 className="workouts__title">Choose Your Workout</h1>

      <div className="workouts__dropdown">
        <label htmlFor="workout-type">Select Workout Type:</label>
        <select
          id="workout-type"
          value={selectedWorkoutType}
          onChange={handleWorkoutTypeChange}
        >
          <option value="" disabled>
            Select a workout type
          </option>
          {workoutTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader loading="true" />
      ) : (
        selectedWorkoutType && (
          <div className="workouts__exercises">
            <h2>Exercises for {selectedWorkoutType}</h2>
            {exercises.length > 0 ? (
              <ul>
                {exercises.map((exercise) => (
                  <li key={exercise.id}>
                    <strong>{exercise.name}</strong> - {exercise.duration} -{" "}
                    {exercise.calories_burned} cal
                  </li>
                ))}
              </ul>
            ) : (
              <p>No exercises available for this workout type.</p>
            )}
          </div>
        )
      )}
    </div>
  );
}
