import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ExercisesPage.scss";

export default function ExercisesPage() {
  const { workoutId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const navigate = useNavigate();

  // Fetch exercises based on workout ID
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get("http://localhost:3000/exercises");
        const filteredExercises = response.data.filter(
          (exercise) => exercise.workout_id === parseInt(workoutId)
        );
        setExercises(filteredExercises);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();
  }, [workoutId]);

  const handleExerciseSelect = (exercise) => {
    if (selectedExercises.includes(exercise)) {
      setSelectedExercises(selectedExercises.filter((ex) => ex.id !== exercise.id));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  // Handle form submission and navigate back to SessionPage with selected exercises
  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate back to the session page with selected exercises and workout ID
    navigate("/session", { state: { selectedExercises, workoutId } });
  };

  return (
    <div className="exercises-page">
      <h1>Select Exercises</h1>
      <form onSubmit={handleSubmit} className="exercises-form">
        <div className="exercises-list">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="exercise-item">
              <label>
                <input
                  type="checkbox"
                  value={exercise.id}
                  onChange={() => handleExerciseSelect(exercise)}
                />
                {exercise.name} - {exercise.duration} mins - {exercise.calories_burned} cal
              </label>
            </div>
          ))}
        </div>
        <button type="submit" className="submit-exercises-button">
          Add Exercises
        </button>
      </form>
    </div>
  );
}
