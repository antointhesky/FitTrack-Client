import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRunning,
  faDumbbell,
  faFire,
  faSpa,
  faMinusCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./SessionPage.scss";

const API_URL = import.meta.env.VITE_API_URL;

const SessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState({});
  const [availableExercises, setAvailableExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

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
        setAvailableExercises(exercisesByWorkoutType);
      } catch (error) {
        setError("Error fetching all exercises");
      }
    };
    fetchAllExercises();
  }, []);

  const handleAddExercise = async (exerciseId) => {
    try {
      await axios.post(`${API_URL}/session/${id}/exercise`, { exerciseId });
      const exercise = Object.values(allExercises)
        .flat()
        .find((ex) => ex.id === exerciseId);
      setExercises([...exercises, exercise]);

      const updatedAvailableExercises = { ...availableExercises };
      Object.keys(updatedAvailableExercises).forEach((workoutType) => {
        updatedAvailableExercises[workoutType] = updatedAvailableExercises[
          workoutType
        ].filter((ex) => ex.id !== exerciseId);
      });
      setAvailableExercises(updatedAvailableExercises);
    } catch (error) {
      setError("Error adding exercise");
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await axios.delete(`${API_URL}/session/${id}/exercise/${exerciseId}`);
      const removedExercise = exercises.find(
        (exercise) => exercise.id === exerciseId
      );
      setExercises(exercises.filter((exercise) => exercise.id !== exerciseId));

      const updatedAvailableExercises = { ...availableExercises };
      if (!updatedAvailableExercises[removedExercise.workout_type]) {
        updatedAvailableExercises[removedExercise.workout_type] = [];
      }
      updatedAvailableExercises[removedExercise.workout_type].push(
        removedExercise
      );
      setAvailableExercises(updatedAvailableExercises);
    } catch (error) {
      setError("Error removing exercise");
    }
  };

  const handleSaveSession = async () => {
    try {
      await axios.patch(`${API_URL}/session/${id}`, { exercises });
      await axios.patch(`${API_URL}/goals/update-goals-progress`, {
        exercises,
      });

      // Calculate total units for toast message
      const totalCaloriesBurned = exercises.reduce(
        (total, exercise) => total + (exercise.calories_burned || 0),
        0
      );
      const totalReps = exercises.reduce(
        (total, exercise) => total + (exercise.reps || 0),
        0
      );
      const totalSets = exercises.reduce(
        (total, exercise) => total + (exercise.sets || 0),
        0
      );
      const totalHours = exercises.reduce(
        (total, exercise) => total + (exercise.duration || 0) / 60,
        0 // convert minutes to hours
      );

      const uniqueWorkoutTypes = [
        ...new Set(exercises.map((exercise) => exercise.workout_type)),
      ];
      const uniqueBodyParts = [
        ...new Set(exercises.map((exercise) => exercise.body_part)),
      ];

      navigate("/progress", {
        state: {
          showMessage: true,
          totalCaloriesBurned,
          totalReps,
          totalSets,
          totalHours,
          uniqueWorkoutTypes,
          uniqueBodyParts,
        },
      });

      localStorage.removeItem("currentSession");
    } catch (error) {
      console.error("Error saving session and updating goals:", error);
      setError("Error saving session and updating goals");
    }
  };

  const getIconForWorkoutType = (workoutType) => {
    switch (workoutType) {
      case "HIIT":
        return faFire;
      case "Strength":
        return faDumbbell;
      case "Fat Burning":
        return faRunning;
      case "Low Impact":
        return faSpa;
      default:
        return faRunning;
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
      <div className="session-page__summary">
        <h2 className="session-page__summary-title">Session Summary</h2>
        <div className="session-page__exercise-list current-session">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="session-page__exercise-card current-session"
            >
              <h3 className="session-page__exercise-name">{exercise.name}</h3>
              <button
                className="session-page__exercise-toggle"
                onClick={() => handleDeleteExercise(exercise.id)}
              >
                <FontAwesomeIcon icon={faMinusCircle} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="session-page__tabs">
        <button
          className={`session-page__tabs-tab ${
            activeTab === "All" ? "active" : ""
          }`}
          onClick={() => setActiveTab("All")}
        >
          All
        </button>
        <button
          className={`session-page__tabs-tab ${
            activeTab === "HIIT" ? "active" : ""
          }`}
          onClick={() => setActiveTab("HIIT")}
        >
          HIIT
        </button>
        <button
          className={`session-page__tabs-tab ${
            activeTab === "Strength" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Strength")}
        >
          Strength
        </button>
        <button
          className={`session-page__tabs-tab ${
            activeTab === "Fat Burning" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Fat Burning")}
        >
          Fat Burning
        </button>
        <button
          className={`session-page__tabs-tab ${
            activeTab === "Low Impact" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Low Impact")}
        >
          Low Impact
        </button>
      </div>

      {Object.keys(availableExercises).map((workoutType) => (
        <div key={workoutType} className="session-page__accordion">
          <h3
            className="session-page__accordion-title"
            onClick={() => setActiveTab(workoutType)}
          >
            <FontAwesomeIcon icon={getIconForWorkoutType(workoutType)} />{" "}
            {workoutType}
          </h3>
          {activeTab === workoutType && (
            <div className="session-page__exercise-list">
              {availableExercises[workoutType].map((exercise) => (
                <div key={exercise.id} className="session-page__exercise-card">
                  <h4 className="session-page__exercise-card-title">
                    {exercise.name}
                  </h4>
                  <p className="session-page__exercise-card-details">
                    Body Part: {exercise.body_part}
                  </p>
                  <p className="session-page__exercise-card-details">
                    Calories: {exercise.calories_burned}
                  </p>
                  <button
                    className="session-page__exercise-toggle"
                    onClick={() => handleAddExercise(exercise.id)}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="session-page__floating-save">
        <button onClick={() => setShowSaveDialog(true)}>Save Session</button>
      </div>

      {showSaveDialog && (
        <div className="session-page__save-dialog">
          <h3>Save Session Summary</h3>
          <button onClick={handleSaveSession}>Save</button>
          <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
        </div>
      )}
    </main>
  );
};

export default SessionPage;
