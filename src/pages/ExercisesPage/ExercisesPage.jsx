import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./ExercisesPage.scss";

export default function ExercisesPage() {
  const { workoutName } = useParams(); 
  const { state } = useLocation(); 
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState(new Set());
  const navigate = useNavigate();

  const workoutType = state?.workoutType || workoutName; // Use state or fallback to param

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/exercises?workout_type=${workoutName}`);
        setExercises(response.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };
  
    fetchExercises();
  }, [workoutName]);

  const handleExerciseSelect = (exercise) => {
    setSelectedExercises((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.has(exercise) ? updatedSet.delete(exercise) : updatedSet.add(exercise);
      return updatedSet;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/session", { state: { selectedExercises: [...selectedExercises], workoutType } });
  };

  return (
    <div className="exercises-page">
      <h1>{workoutType} Exercises</h1> 
      <form onSubmit={handleSubmit} className="exercises-form">
        <div className="exercises-list">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="exercise-item">
              <label>
                <input
                  type="checkbox"
                  checked={selectedExercises.has(exercise)}
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
