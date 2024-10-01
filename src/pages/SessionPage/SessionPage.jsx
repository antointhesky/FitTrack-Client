import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SessionPage.scss";

const API_URL = import.meta.env.VITE_API_URL;

const SessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrCreateSession = async () => {
      try {
        let sessionId = id;

        const storedSession = JSON.parse(
          localStorage.getItem("currentSession")
        );
        if (storedSession) {
          sessionId = storedSession.session_id;
        }

        if (sessionId) {
          const response = await axios.get(`${API_URL}/session/${sessionId}`);
          setExercises(response.data.exercises);
        } else {
          const currentSessionResponse = await axios.get(
            `${API_URL}/session/current`
          );

          if (currentSessionResponse.data) {
            const currentSessionId = currentSessionResponse.data.id;
            localStorage.setItem(
              "currentSession",
              JSON.stringify({ session_id: currentSessionId })
            );
            navigate(`/session/${currentSessionId}`);
          } else {
            const newSessionResponse = await axios.post(`${API_URL}/session`);
            const newSessionId = newSessionResponse.data.session_id;
            localStorage.setItem(
              "currentSession",
              JSON.stringify({ session_id: newSessionId })
            );
            navigate(`/session/${newSessionId}`);
          }
        }
      } catch (error) {
        setError("Error fetching or creating session");
      } finally {
        setLoading(false);
      }
    };
    fetchOrCreateSession();
  }, [id, navigate]);

  useEffect(() => {
    const fetchAllExercises = async () => {
      try {
        const response = await axios.get(`${API_URL}/exercises`);
        const exercisesByWorkoutType = response.data.reduce((acc, exercise) => {
          if (!acc[exercise.workout_type]) {
            acc[exercise.workout_type] = [];
          }
          acc[exercise.workout_type].push(exercise);
          return acc;
        }, {});
        setAllExercises(exercisesByWorkoutType);
      } catch (error) {
        setError("Error fetching all exercises");
      }
    };
    fetchAllExercises();
  }, []);

  const handleAddExercise = async (exerciseId) => {
    try {
      await axios.post(`${API_URL}/session/${id}/exercise`, {
        exerciseId,
      });
      const exercise = Object.values(allExercises)
        .flat()
        .find((ex) => ex.id === exerciseId);
      setExercises([...exercises, exercise]);
    } catch (error) {
      setError("Error adding exercise");
    }
  };

  const handleDelete = async (exerciseId) => {
    try {
      await axios.delete(`${API_URL}/session/${id}/exercise/${exerciseId}`);
      setExercises(exercises.filter((exercise) => exercise.id !== exerciseId));
    } catch (error) {
      setError("Error removing exercise");
    }
  };

  const handleSaveSession = async () => {
    try {
      await axios.patch(`${API_URL}/session/${id}`, { exercises });

      // Calculate totals for calories, reps, sets
      const totalCaloriesBurned = exercises.reduce(
        (total, exercise) => total + exercise.calories_burned,
        0
      );
      const totalReps = exercises.reduce(
        (total, exercise) => total + exercise.reps,
        0
      );
      const totalSets = exercises.reduce(
        (total, exercise) => total + exercise.sets,
        0
      );

      localStorage.removeItem("currentSession");
      navigate("/progress", {
        state: { totalCaloriesBurned, totalReps, totalSets },
      });
    } catch (error) {
      console.error("Error saving session and updating goals:", error);
      setError("Error saving session and updating goals");
    }
  };

  if (loading) {
    return <p>Loading session data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="session-page">
      <div className="session-page__current-session">
        <h1>Current Session</h1>
        {exercises.length > 0 ? (
          <div className="session-page__exercise-list">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="session-page__exercise-card current-session"
              >
                <h3 className="session-page__exercise-name">{exercise.name}</h3>
                <div
                  className="session-page__exercise-toggle"
                  onClick={() => handleDelete(exercise.id)}
                >
                  <span>−</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No exercises added to this session yet.</p>
        )}
      </div>

      <div className="session-page__add-exercises">
        <h2 className="session-page__add-exercises-title">Add Exercises</h2>
        {Object.keys(allExercises).map((workoutType) => (
          <div key={workoutType} className="session-page__workout-section">
            <h3 className="session-page__workout-type-title">{workoutType}</h3>
            <div className="session-page__available-exercises">
              {allExercises[workoutType].map((exercise) => (
                <div key={exercise.id} className="session-page__exercise-card">
                  <h3 className="session-page__exercise-card-title">
                    {exercise.name}
                  </h3>
                  <p className="session-page__exercise-card-details">
                    Body Part: {exercise.body_part}
                  </p>
                  <p className="session-page__exercise-card-details">
                    Sets: {exercise.sets}
                  </p>
                  <p className="session-page__exercise-card-details">
                    Reps: {exercise.reps}
                  </p>
                  <p className="session-page__exercise-card-details">
                    Duration: {exercise.duration}
                  </p>
                  <p className="session-page__exercise-card-details">
                    Calories Burned: {exercise.calories_burned}
                  </p>
                  <div
                    className="session-page__exercise-toggle"
                    onClick={() => handleAddExercise(exercise.id)}
                  >
                    <span>+</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="session-page__save-session-container">
        <button
          className="session-page__save-session"
          onClick={handleSaveSession}
        >
          <span> + Save Session </span>
        </button>
      </div>
    </main>
  );
};

export default SessionPage;
