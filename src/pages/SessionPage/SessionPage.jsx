import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SessionPage.scss";

const SessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState({});
  const [goals, setGoals] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrCreateSession = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `http://localhost:5050/session/${id}`
          );
          setExercises(response.data.exercises);
        } else {
          const response = await axios.post(`http://localhost:5050/session`);
          const newSessionId = response.data.session_id;
          localStorage.setItem(
            "currentSession",
            JSON.stringify({ session_id: newSessionId })
          );
          navigate(`/session/${newSessionId}`);
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
        const response = await axios.get(`http://localhost:5050/exercises`);
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

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/goals`);
        setGoals(response.data);
      } catch (error) {
        setError("Error fetching goals");
      }
    };
    fetchGoals();
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
      await axios.delete(
        `http://localhost:5050/session/${id}/exercise/${exerciseId}`
      );
      setExercises(exercises.filter((exercise) => exercise.id !== exerciseId));
    } catch (error) {
      setError("Error removing exercise");
    }
  };

  const handleGoalSelect = (goalId) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter((id) => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  // to the session and updating the global goals list
  const handleSaveSession = async () => {
    try {
      // Save the session exercises
      await axios.put(`http://localhost:5050/session/${id}`, {
        exercises,
        goal_ids: selectedGoals,
      });

      // Update the goals' progress based on the selected goals and exercises
      if (selectedGoals.length > 0) {
        await axios.patch(`http://localhost:5050/goals/update-goals-progress`, {
          selectedGoals,
          exercises,
        });
      }

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
                <div
                  className="exercise-toggle"
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

      {/* Goal Selection */}
      <div className="goal-selection">
        <h2>Select Goals for this Session</h2>
        <div className="goal-list scrollable">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`goal-card ${
                selectedGoals.includes(goal.id) ? "selected" : ""
              }`}
              onClick={() => handleGoalSelect(goal.id)}
            >
              <h3>{goal.name}</h3>
              <p>
                Progress: {goal.current_progress} / {goal.target}
              </p>
              <p>{goal.description || "No description available"}</p>
              <div className="goal-progress-bar">
                <div
                  className="progress"
                  style={{
                    width: `${(goal.current_progress / goal.target) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
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
                  <div
                    className="exercise-toggle"
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

      <div className="save-session-container">
        <button className="save-session" onClick={handleSaveSession}>
          <span> + Save Session </span>
        </button>
      </div>
    </main>
  );
};

export default SessionPage;
