import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BodyPartExercisesPage.scss";

const API_URL = import.meta.env.VITE_API_URL;

const BodyPartExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchParams] = useSearchParams();
  const bodyPart = searchParams.get("body_part");
  const navigate = useNavigate();

  useEffect(() => {
    if (bodyPart) {
      const fetchExercises = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/exercises?body_part=${encodeURIComponent(bodyPart)}`
          );
          setExercises(response.data);
        } catch (error) {
          console.error("Error fetching exercises:", error);
        }
      };
      fetchExercises();
    }
  }, [bodyPart]);

  const handleToggleExercise = (exerciseId) => {
    if (selectedExercises.includes(exerciseId)) {
      setSelectedExercises(selectedExercises.filter((id) => id !== exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };

  const handleGoToSession = async () => {
    const sessionData = {
      exercises: selectedExercises.map((id) => ({ id })),
    };

    try {
      const response = await axios.post(`${API_URL}/session`, sessionData);
      const sessionId = response.data.session_id;
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error("Error creating or updating session:", error);
    }
  };

  return (
    <main className="body-part-exercises-page">
      <h1 className="body-part-exercises-page__title">Exercises for {bodyPart}</h1>
      <button className="body-part-exercises-page__go-back-button" onClick={() => navigate("/")}>
        <span>← Go back to homepage</span>
      </button>

      <div className="body-part-exercises-page__exercises-container">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className={`body-part-exercises-page__exercise-card ${
              selectedExercises.includes(exercise.id) ? "active" : ""
            }`}
            onClick={() => handleToggleExercise(exercise.id)}
          >
            <div className="body-part-exercises-page__video-wrapper">
              <video
                src={`${API_URL}${exercise.video_url}`}
                controls
              />
              <div className="body-part-exercises-page__info-icon" title="Watch the exercise tutorial video">
                ℹ️
              </div>
            </div>
            <h3 className="body-part-exercises-page__exercise-title">{exercise.name}</h3>
            <p className="body-part-exercises-page__exercise-detail">Sets: {exercise.sets}</p>
            <p className="body-part-exercises-page__exercise-detail">Reps: {exercise.reps}</p>
            <p className="body-part-exercises-page__exercise-detail">Calories Burned: {exercise.calories_burned}</p>
            <p className="body-part-exercises-page__exercise-detail">Duration: {exercise.duration}</p>

            <div className={`body-part-exercises-page__exercise-toggle ${
              selectedExercises.includes(exercise.id) ? "active" : ""
            }`}>
              <span>{selectedExercises.includes(exercise.id) ? "−" : "+"}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedExercises.length > 0 && (
        <div className="body-part-exercises-page__go-to-session-container">
          <button className="body-part-exercises-page__go-to-session">
            <span> + Go to your session </span>
          </button>
        </div>
      )}
    </main>
  );
};

export default BodyPartExercisesPage;

