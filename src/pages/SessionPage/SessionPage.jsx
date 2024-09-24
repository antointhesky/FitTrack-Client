import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SessionPage.scss";

const SessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [session, setSession] = useState(null);
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`http://localhost:5050/session/${id}`);
        setSession(response.data.session);
        setExercises(response.data.exercises);
      } catch (error) {
        setError("Error fetching session data");
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  useEffect(() => {
    const fetchAllExercises = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/exercises`);
        setAllExercises(response.data);
      } catch (error) {
        setError("Error fetching all exercises");
        console.error("Error fetching exercises:", error);
      }
    };
    fetchAllExercises();
  }, []);

  const handleAddExercise = async (exerciseId) => {
    try {
      await axios.post(`http://localhost:5050/session/${id}/exercise`, { exerciseId });
      const exercise = allExercises.find((ex) => ex.id === exerciseId);
      setExercises([...exercises, exercise]);
    } catch (error) {
      setError("Error adding exercise");
      console.error("Error adding exercise to session:", error);
    }
  };

  const handleDelete = async (exerciseId) => {
    try {
      await axios.delete(`http://localhost:5050/session/${id}/exercise/${exerciseId}`);
      setExercises(exercises.filter((exercise) => exercise.id !== exerciseId));
    } catch (error) {
      setError("Error removing exercise");
      console.error("Error removing exercise:", error);
    }
  };

  const handleSaveSession = async () => {
    try {
      await axios.put(`http://localhost:5050/session/${id}`, { exercises });
      navigate("/progress");
    } catch (error) {
      setError("Error saving session");
      console.error("Error saving session:", error);
    }
  };

  if (loading) {
    return <p>Loading session data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="session-page">
      <h1>Current Session</h1>
      {session && (
        <h2>Workout Type: {session.workout_type}</h2>
      )}
      {exercises.length > 0 ? (
        <div className="exercise-list minimalist">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="exercise-card minimalist-card">
              <h3>{exercise.name}</h3>
              <button onClick={() => handleDelete(exercise.id)}>Remove</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No exercises added to this session yet.</p>
      )}

      <h2>Add Exercises</h2>
      <div className="available-exercises">
        {allExercises.map((exercise) => (
          <div key={exercise.id} className="exercise-card">
            <h3>{exercise.name}</h3>
            <p><strong>Body Part:</strong> {exercise.body_part}</p>
            <button onClick={() => handleAddExercise(exercise.id)}>Add to Session</button>
          </div>
        ))}
      </div>
      <button onClick={handleSaveSession}>Save Session</button>
    </div>
  );
};

export default SessionPage;

