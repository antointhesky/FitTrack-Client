import { useState, useEffect } from "react";
import axios from "axios";
import "./WorkoutsPage.scss";

const WORKOUT_TYPES = ["Cardio", "Strength", "Fat Burning", "Health Fitness"];

export default function WorkoutsPage() {
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("");
  const [exercises, setExercises] = useState([]);
  const [workoutForm, setWorkoutForm] = useState({
    name: "",
    exercises: [],
  });

  useEffect(() => {
    if (selectedWorkoutType) {
      const fetchExercises = async () => {
        try {
          const response = await axios.get("http://localhost:3000/exercises");
          const filteredExercises = response.data.filter(
            (exercise) => exercise.workout_type === selectedWorkoutType
          );
          setExercises(filteredExercises);
        } catch (error) {
          console.error("Error fetching exercises:", error);
        }
      };

      fetchExercises();
    }
  }, [selectedWorkoutType]);

  const handleWorkoutSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/workouts", workoutForm);
      alert("Workout added successfully!");
      setWorkoutForm({ name: "", exercises: [] });
      setSelectedWorkoutType("");
    } catch (error) {
      console.error("Error adding workout:", error);
    }
  };

  return (
    <div className="workouts-page">
      <h1>Workouts</h1>
      <form onSubmit={handleWorkoutSubmit} className="workout-form">
        <label htmlFor="workout-type">Workout Type</label>
        <select
          id="workout-type"
          value={selectedWorkoutType}
          onChange={(e) => setSelectedWorkoutType(e.target.value)}
        >
          <option value="">Select Workout Type</option>
          {WORKOUT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {selectedWorkoutType && (
          <div className="exercises-section">
            <h2>{selectedWorkoutType} Exercises</h2>
            <div className="exercise-list">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="exercise-item">
                  <label>
                    <input
                      type="checkbox"
                      value={exercise.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setWorkoutForm({
                            ...workoutForm,
                            exercises: [...workoutForm.exercises, exercise],
                          });
                        } else {
                          setWorkoutForm({
                            ...workoutForm,
                            exercises: workoutForm.exercises.filter(
                              (ex) => ex.id !== exercise.id
                            ),
                          });
                        }
                      }}
                    />
                    {exercise.name} - {exercise.duration} mins - {exercise.calories_burned} cal
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedWorkoutType && (
          <button type="submit" className="submit-workout-button">
            Submit Workout
          </button>
        )}
      </form>
    </div>
  );
}
