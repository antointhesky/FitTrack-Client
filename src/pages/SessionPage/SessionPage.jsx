import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SessionPage.scss";

const SessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/session/${sessionId}`);
        setSession(response.data.session);
        setExercises(response.data.exercises);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    fetchSession();
  }, [sessionId]);

  const handleDelete = async (exerciseId) => {
    try {
      await axios.delete(`http://localhost:5050/session/${sessionId}/exercise/${exerciseId}`);
      setExercises(exercises.filter((exercise) => exercise.id !== exerciseId));
    } catch (error) {
      console.error("Error removing exercise:", error);
    }
  };

  const handleSaveSession = async () => {
    try {
      await axios.put(`http://localhost:5050/session/${sessionId}`, { exercises });
      navigate("/progress"); // Redirect to progress page after saving
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  return (
    <div className="session-page">
      <h1>Current Session</h1>
      {exercises.length > 0 ? (
        <div className="exercise-list">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="exercise-card">
              <h3>{exercise.name}</h3>
              <p><strong>Sets:</strong> {exercise.sets}</p>
              <p><strong>Reps:</strong> {exercise.reps}</p>
              <p><strong>Duration:</strong> {exercise.duration}</p>
              <p><strong>Calories:</strong> {exercise.calories_burned}</p>
              <button onClick={() => handleDelete(exercise.id)}>Remove</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No exercises added to this session yet.</p>
      )}
      <button onClick={handleSaveSession}>Save Session</button>
    </div>
  );
};

export default SessionPage;
