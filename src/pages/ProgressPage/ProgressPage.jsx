import { useEffect, useState } from "react";
import axios from "axios";
import "./ProgressPage.scss";

const ProgressPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null); // To track which session is expanded

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/session`);
        console.log("Sessions fetched:", response.data); // Debugging: Log sessions
        setSessions(response.data);
      } catch (error) {
        setError("Error fetching progress data");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const toggleDetails = (sessionId) => {
    setExpandedSession((prevSession) => (prevSession === sessionId ? null : sessionId));
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return <p>Loading progress data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="progress-page">
      <h1>Progress</h1>
      <div className="progress-graphs">
        {/* Placeholder for graphs showing weekly/daily/monthly progress */}
        <p>Graphs of workouts (e.g., calories burned, sessions per week) will go here.</p>
      </div>

      <h2>Session History</h2>
      {sessions.length > 0 ? (
        <ul className="session-list">
          {sessions.map((session) => (
            <li key={session.id}>
              <h3>Session on {formatDate(session.date)}</h3>
              <button onClick={() => toggleDetails(session.id)}>
                {expandedSession === session.id ? "Hide Details" : "View Details"}
              </button>

              {/* Only display session details if expanded */}
              {expandedSession === session.id && (
                <div className="session-details">
                  {/* Check if exercises exist */}
                  {session.exercises && session.exercises.length > 0 ? (
                    session.exercises.map((exercise) => (
                      <div key={exercise.id} className="exercise-details">
                        <p><strong>Exercise:</strong> {exercise.name}</p>
                        <p><strong>Calories Burned:</strong> {exercise.calories_burned}</p>
                        <p><strong>Workout Type:</strong> {exercise.workout_type}</p>
                      </div>
                    ))
                  ) : (
                    <p>No exercises for this session.</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No sessions found.</p>
      )}
    </main>
  );
};

export default ProgressPage;
