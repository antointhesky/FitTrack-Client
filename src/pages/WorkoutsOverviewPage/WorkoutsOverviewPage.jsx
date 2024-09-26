import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./WorkoutsOverviewPage.scss";

export default function WorkoutsOverviewPage() {
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);

  useEffect(() => {
    const fetchWorkoutTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5050/workouts");
        setWorkoutTypes(response.data);
      } catch (error) {
        console.error("Error fetching workout types:", error);
      }
    };

    const fetchBodyParts = async () => {
      try {
        const response = await axios.get("http://localhost:5050/exercises/bodyparts");
        setBodyParts(response.data);
      } catch (error) {
        console.error("Error fetching body parts:", error);
      }
    };

    fetchWorkoutTypes();
    fetchBodyParts();
  }, []);

  return (
    <main className="workouts-overview-page">
      <h1>Choose a Workout Type or Body Part</h1>

      <section className="workout-types-container">
        <h2>Available Workout Types</h2>
        {workoutTypes.map((workout) => (
          <Link
            key={workout.id}
            to={`/workouts?workout_type=${encodeURIComponent(workout.name)}`}
            className="workout-type-card"
          >
            <h3>{workout.name}</h3>
          </Link>
        ))}
      </section>

      <section className="body-parts-container">
        <h2>Available Body Parts</h2>
        {bodyParts.map((part, index) => (
          <Link
            key={index}
            to={`/exercises?body_part=${encodeURIComponent(part.body_part)}`}
            className="body-part-card"
          >
            <h3>{part.body_part}</h3>
          </Link>
        ))}
      </section>
    </main>
  );
}
