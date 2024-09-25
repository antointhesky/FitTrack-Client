import { useEffect, useState } from "react";
import axios from "axios";
import "./AllExercisesPage.scss";

export default function AllExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [groupedExercises, setGroupedExercises] = useState({});

  useEffect(() => {
    const fetchAllExercises = async () => {
      try {
        const response = await axios.get("http://localhost:5050/exercises");
        const exercises = response.data;

        // Group exercises by workout type
        const grouped = exercises.reduce((acc, exercise) => {
          if (!acc[exercise.workout_type]) {
            acc[exercise.workout_type] = [];
          }
          acc[exercise.workout_type].push(exercise);
          return acc;
        }, {});

        setExercises(exercises);
        setGroupedExercises(grouped);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchAllExercises();
  }, []);

  return (
    <main className="all-exercises-page">
      <h1>All Workouts and Exercises</h1>

      {Object.keys(groupedExercises).map((workoutType) => (
        <section key={workoutType} className="workout-section">
          <h2>{workoutType}</h2>
          <div className="exercises-container">
            {groupedExercises[workoutType].map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <video src={`http://localhost:5050${exercise.video_url}`} controls />
                <h3>{exercise.name}</h3>
                <p>Body Part: {exercise.body_part}</p>
                <p>Sets: {exercise.sets}</p>
                <p>Reps: {exercise.reps}</p>
                <p>Duration: {exercise.duration}</p>
                <p>Calories Burned: {exercise.calories_burned}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
