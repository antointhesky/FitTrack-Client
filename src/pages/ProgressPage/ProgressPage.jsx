import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; 
import "./ProgressPage.scss";

// Registering required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);
  const [caloriesData, setCaloriesData] = useState({ labels: [], data: [] }); // State for chart data

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/session`);
        const fetchedSessions = response.data;
        setSessions(fetchedSessions);

        // Preparing data for the calories burned chart
        const labels = fetchedSessions.map((session) => formatDate(session.date));
        const data = fetchedSessions.map((session) =>
          session.exercises.reduce((total, exercise) => total + exercise.calories_burned, 0)
        );

        setCaloriesData({ labels, data });
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setError("Error fetching progress data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const toggleDetails = (sessionId) => {
    setExpandedSession((prevSession) => (prevSession === sessionId ? null : sessionId));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Calories Burned per Session',
      },
    },
  };

  const chartData = {
    labels: caloriesData.labels,
    datasets: [
      {
        label: 'Calories Burned',
        data: caloriesData.data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="progress-page">
      <h1>Progress</h1>

      <div className="progress-graphs">
        <Line options={chartOptions} data={chartData} />
      </div>

      <h2>Session History</h2>
      {sessions.length > 0 ? (
        <ul className="session-list">
          {sessions.map((session) => (
            <li key={session.id} className="session-item">
              <h3>Session on {formatDate(session.date)}</h3>
              <button className="toggle-details-btn" onClick={() => toggleDetails(session.id)}>
                {expandedSession === session.id ? "Hide Details" : "View Details"}
              </button>

              {expandedSession === session.id && (
                <div className="session-details">
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
