import React, { useState } from "react";
import AdviceCard from "../../components/AdviceCard/AdviceCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./AdvicePage.scss";

const adviceData = [
  {
    title: "The 10 Best Exercises to Build Muscle and Strength",
    description:
      "From bench presses to dips, these essential exercises can help you maximize muscle growth and strength.",
    linkUrl: "https://www.strengthlog.com/best-exercises-to-build-muscle/",
  },
  {
    title: "The Importance of Rest Days",
    description: "Learn why rest days are just as important as your workouts.",
    linkUrl: "https://www.healthline.com/health/exercise-fitness/rest-day",
  },
  {
    title: "Weight Loss: 6 Strategies for Success",
    description:
      "The key to sustainable weight loss is long-term lifestyle changes in diet and physical activity.",
    linkUrl:
      "https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/weight-loss/art-20047752",
  },
];

export default function AdvicePage() {
  const [favoriteExercises, setFavoriteExercises] = useState([
    { id: 1, name: "Push-Ups", calories: 100, sets: 3, reps: 12 },
    { id: 2, name: "Squats", calories: 120, sets: 4, reps: 15 },
  ]);

  // Handle removing an exercise from the favorite section
  const handleRemoveExercise = (exerciseId) => {
    const updatedExercises = favoriteExercises.filter(
      (exercise) => exercise.id !== exerciseId
    );
    setFavoriteExercises(updatedExercises);
  };

  return (
    <div className="advice">
      <h1 className="advice__title">Fitness & Health Advice</h1>

      <div className="advice__list">
        {adviceData.map((advice, index) => (
          <AdviceCard
            key={index}
            title={advice.title}
            description={advice.description}
            linkUrl={advice.linkUrl}
          />
        ))}
      </div>

      <h2 className="advice__title">Your Favorite Exercises</h2>

      {favoriteExercises.length > 0 ? (
        <div className="advice__favorites">
          {favoriteExercises.map((exercise) => (
            <div key={exercise.id} className="advice__favorite-item">
              <div className="advice__favorite-details">
                <h3>{exercise.name}</h3>
                <p>Calories: {exercise.calories}</p>
                <p>Sets: {exercise.sets}</p>
                <p>Reps: {exercise.reps}</p>
              </div>
              <div
                className="advice__favorite-delete"
                onClick={() => handleRemoveExercise(exercise.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="advice__no-favorites">No favorite exercises yet.</p>
      )}
    </div>
  );
}
