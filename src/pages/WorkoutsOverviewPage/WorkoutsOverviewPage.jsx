import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell, faRunning, faBiking, faHeartbeat, faHandSparkles } from "@fortawesome/free-solid-svg-icons";
import "./WorkoutsOverviewPage.scss";

const API_URL = import.meta.env.VITE_API_URL;

export default function WorkoutsOverviewPage() {
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);

  useEffect(() => {
    const fetchWorkoutTypes = async () => {
      try {
        const response = await axios.get(`${API_URL}/workouts`);
        setWorkoutTypes(response.data);
      } catch (error) {
        console.error("Error fetching workout types:", error);
      }
    };

    const fetchBodyParts = async () => {
      try {
        const response = await axios.get(`${API_URL}/exercises/bodyparts`);
        setBodyParts(response.data);
      } catch (error) {
        console.error("Error fetching body parts:", error);
      }
    };

    fetchWorkoutTypes();
    fetchBodyParts();
  }, []);

  const workoutIcons = {
    "Cardio": faRunning,
    "Strength": faDumbbell,
    "Cycling": faBiking,
    "HIIT": faHeartbeat,
    "Yoga": faHandSparkles,
  };

  const bodyPartIcons = {
    "Arms": faHandSparkles,
    "Legs": faRunning,
    "Back": faDumbbell,
    "Core": faHeartbeat,
  };

  return (
    <main className="workouts-overview-page">
      <h1 className="workouts-overview-page__title">Discover Your Perfect Workout</h1>
      <h2 className="workouts-overview-page__subtitle">Browse by workout type or target specific body parts for a personalized fitness journey.</h2>

      <div className="workouts-overview-page__section-container">
        <div className="workouts-overview-page__section-left">
          <h2 className="workouts-overview-page__section-title">Workout Types</h2>
        </div>
        <div className="workouts-overview-page__section-right">
          <div className="workouts-overview-page__grid-container">
            {workoutTypes.map((workout) => (
              <Link
                key={workout.id}
                to={`/workouts?workout_type=${encodeURIComponent(workout.name)}`}
                className="workouts-overview-page__workout-type-card"
              >
                <FontAwesomeIcon
                  icon={workoutIcons[workout.name] || faDumbbell}
                  size="3x"
                  className="workouts-overview-page__workout-icon"
                />
                <h3 className="workouts-overview-page__workout-name">{workout.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="workouts-overview-page__section-container workouts-overview-page__body-parts-section">
        <div className="workouts-overview-page__section-left">
          <h2 className="workouts-overview-page__section-title">Body Parts</h2>
        </div>
        <div className="workouts-overview-page__section-right">
          <div className="workouts-overview-page__grid-container">
            {bodyParts.map((part, index) => (
              <Link
                key={index}
                to={`/exercises?body_part=${encodeURIComponent(part.body_part)}`}
                className="workouts-overview-page__body-part-card"
              >
                <FontAwesomeIcon
                  icon={bodyPartIcons[part.body_part] || faHeartbeat}
                  size="3x"
                  className="workouts-overview-page__body-part-icon"
                />
                <h3 className="workouts-overview-page__body-part-name">{part.body_part}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
