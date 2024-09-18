import { useState, useEffect } from "react";
import axios from "axios";
import "./SessionPage.scss";

const WORKOUT_TYPES = ["Cardio", "Strength", "Fat Burning", "Health Fitness"];

export default function SessionPage() {
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("");
  const [exercises, setExercises] = useState([]);
  const [session, setSession] = useState({
    workoutType: "",
    exercises: [],
    date: new Date().toISOString().split("T")[0], // Default to today's date
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/sessions", session);
      alert("Session logged successfully!");
      setSession({ workoutType: "", exercises: [], date: "" });
      setSelectedWorkoutType("");
    } catch (error) {
      console.error("Error logging session:", error);
    }
  };

  return (
    <div className="session-page">
      <h1>Log a New Session</h1>
      <form onSubmit={handleSubmit} className="session-form">
        <label htmlFor="workout-type">Workout Type</label>
        <select
          id="workout-type"
          value={selectedWorkoutType}
          onChange={(e) => {
            setSelectedWorkoutType(e.target.value);
            setSession({ ...session, workoutType: e.target.value });
          }}
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
                          setSession({
                            ...session,
                            exercises: [...session.exercises, exercise],
                          });
                        } else {
                          setSession({
                            ...session,
                            exercises: session.exercises.filter(
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
          <button type="submit" className="submit-session-button">
            Submit Session
          </button>
        )}
      </form>
    </div>
  );
}
