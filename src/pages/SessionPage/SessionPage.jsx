import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SessionPage.scss";

const SessionPage = () => {
  const { id } = useParams(); // Get session ID from URL if available
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrCreateSession = async () => {
      try {
        if (id) {
          // Fetch session by ID if it exists in the URL
          const response = await axios.get(`http://localhost:5050/session/${id}`);
          setExercises(response.data.exercises);
        } else {
          // If no session ID, check for an ongoing (draft) session
          const currentSessionResponse = await axios.get("http://localhost:5050/session/current");

          if (currentSessionResponse.data) {
            // If an ongoing session (draft) exists, redirect to that session
            navigate(`/session/${currentSessionResponse.data.id}`);
          } else {
            // If no ongoing session, create a new one
            const newSessionResponse = await axios.post("http://localhost:5050/session");
            const newSessionId = newSessionResponse.data.session_id;
            localStorage.setItem("currentSession", JSON.stringify({ session_id: newSessionId }));
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
        const response = await axios.get("http://localhost:5050/exercises");
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
      await axios.post(`http://localhost:5050/session/${id}/exercise`, {
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
      await axios.delete(`http://localhost:5050/session/${id}/exercise/${exerciseId}`);
      setExercises(exercises.filter((exercise) => exercise.id !== exerciseId));
    } catch (error) {
      setError("Error removing exercise");
    }
  };

  const handleSaveSession = async () => {
    try {
      // Save session exercises and mark it as completed
      await axios.put(`http://localhost:5050/session/${id}`, {
        exercises,
      });

      // Clear current session from local storage and navigate to progress page
      localStorage.removeItem("currentSession");
      navigate("/progress");
    } catch (error) {
      setError("Error saving session");
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
      <div className="current-session">
        <h1>Current Session</h1>
        {exercises.length > 0 ? (
          <div className="exercise-list">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <h3>{exercise.name}</h3>
                <div className="exercise-toggle" onClick={() => handleDelete(exercise.id)}>
                  <span>−</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No exercises added to this session yet.</p>
        )}
      </div>

      <div className="add-exercises">
        <h2>Add Exercises</h2>
        {Object.keys(allExercises).map((workoutType) => (
          <div key={workoutType} className="workout-section">
            <h3 className="workout-type-title">{workoutType}</h3>
            <div className="available-exercises">
              {allExercises[workoutType].map((exercise) => (
                <div key={exercise.id} className="exercise-card">
                  <h3>{exercise.name}</h3>
                  <p>
                    <strong>Body Part:</strong> {exercise.body_part}
                  </p>
                  <p>Sets: {exercise.sets}</p>
                  <p>Reps: {exercise.reps}</p>
                  <p>Duration: {exercise.duration}</p>
                  <p>Calories Burned: {exercise.calories_burned}</p>
                  <div className="exercise-toggle" onClick={() => handleAddExercise(exercise.id)}>
                    <span>+</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="save-session-container">
        <button className="save-session" onClick={handleSaveSession}>
          <span> + Save Session </span>
        </button>
      </div>
    </main>
  );
};

export default SessionPage;
