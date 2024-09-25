import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./BodyPartExercisesPage.scss";

const BodyPartExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [searchParams] = useSearchParams();
  const bodyPart = searchParams.get("body_part");

  useEffect(() => {
    if (bodyPart) {
      const fetchExercises = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5050/exercises?body_part=${encodeURIComponent(bodyPart)}`
          );
          setExercises(response.data);
        } catch (error) {
          console.error("Error fetching exercises:", error);
        }
      };
      fetchExercises();
    }
  }, [bodyPart]);

  return (
    <main className="body-part-exercises-page">
      <h1>Exercises for {bodyPart}</h1>
      <div className="exercises-container">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="exercise-card">
            <video src={`http://localhost:5050${exercise.video_url}`} controls />
            <h3>{exercise.name}</h3>
            <p>Sets: {exercise.sets}</p>
            <p>Reps: {exercise.reps}</p>
            <p>Calories Burned: {exercise.calories_burned}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default BodyPartExercisesPage;
