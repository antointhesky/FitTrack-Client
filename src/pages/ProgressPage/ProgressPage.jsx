import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "react-circular-progressbar/dist/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./ProgressPage.scss";

const API_URL = import.meta.env.VITE_API_URL; 

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
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [caloriesData, setCaloriesData] = useState({ labels: [], data: [] });
  const [exerciseDurationData, setExerciseDurationData] = useState({
    labels: [],
    data: [],
  });
  const [setsData, setSetsData] = useState({ labels: [], data: [] });
  const [repsData, setRepsData] = useState({ labels: [], data: [] });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`${API_URL}/session`); 
        setSessions(response.data);

        const labels = response.data.map((session) =>
          new Date(session.date).toLocaleDateString()
        );
        const calories = response.data.map((session) =>
          session.exercises.reduce(
            (total, exercise) => total + exercise.calories_burned,
            0
          )
        );
        const durations = response.data.map((session) =>
          session.exercises.reduce(
            (total, exercise) => total + parseFloat(exercise.duration || 0),
            0
          )
        );
        const sets = response.data.map((session) =>
          session.exercises.reduce(
            (total, exercise) => total + (exercise.sets || 0),
            0
          )
        );
        const reps = response.data.map((session) =>
          session.exercises.reduce(
            (total, exercise) => total + (exercise.reps || 0),
            0
          )
        );

        setCaloriesData({ labels, data: calories });
        setExerciseDurationData({ labels, data: durations });
        setSetsData({ labels, data: sets });
        setRepsData({ labels, data: reps });
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = sessions.filter(
        (session) =>
          new Date(session.date).toLocaleDateString() ===
          selectedDate.toLocaleDateString()
      );
      setFilteredSessions(filtered);
    }
  }, [selectedDate, sessions]);

  const toggleDetails = (sessionId) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  const combinedData = {
    labels: caloriesData.labels,
    datasets: [
      {
        label: "Calories Burned",
        data: caloriesData.data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y1",
      },
      {
        label: "Duration (Minutes)",
        data: exerciseDurationData.data,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        yAxisID: "y2",
      },
      {
        label: "Sets",
        data: setsData.data,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        yAxisID: "y1",
      },
      {
        label: "Reps",
        data: repsData.data,
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        yAxisID: "y2",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      y1: {
        type: "linear",
        position: "left",
        ticks: {
          color: "#232940",
          font: {
            size: window.innerWidth < 768 ? 8 : 14,
          },
        },
        title: {
          display: true,
          text: "Calories Burned, Sets",
          color: "#232940",
          font: {
            size: window.innerWidth < 768 ? 10 : 16,
          },
        },
      },
      y2: {
        type: "linear",
        position: "right",
        ticks: {
          color: "#232940",
          font: {
            size: window.innerWidth < 768 ? 8 : 14,
          },
        },
        title: {
          display: true,
          text: "Duration (Minutes) and Reps",
          color: "#232940",
          font: {
            size: window.innerWidth < 768 ? 10 : 16,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#232940",
          font: {
            size: window.innerWidth < 768 ? 8 : 14,
          },
        },
      },
      title: {
        display: true,
        text: "Calories Burned, Duration, Sets, and Reps Over Time",
        color: "#232940",
        font: {
          size: window.innerWidth < 768 ? 12 : 18,
        },
      },
    },
  };

  return (
    <main className="progress-page">
      <section className="progress-page__hero">
        <div className="progress-page__hero-content">
          <h1 className="progress-page__hero-content__title">
            Track Your Fitness Journey
          </h1>
          <p className="progress-page__hero-content__description">
          You're building strength with every workout! Stay focused and see your progress grow over time.
          </p>
          <p className="progress-page__hero-content__motivation">
            Consistency is key! Track your efforts, celebrate each small
            victory, and push beyond your limits. You're closer to your goals
            with every session!
          </p>
        </div>
      </section>

      <h2 className="progress-page__subtitle">Your Progress</h2>

      <div className="progress-page__graphs">
        <Line options={chartOptions} data={combinedData} />
      </div>

      <h3 className="progress-page__subtitle">Your Workout Sessions</h3>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={({ date }) => {
          const isSessionDay = sessions.some(
            (session) =>
              new Date(session.date).toLocaleDateString() ===
              date.toLocaleDateString()
          );
          return isSessionDay ? "session-day" : null;
        }}
      />

      {selectedDate && (
        <ul className="progress-page__session-list">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <li
                key={session.id}
                className="progress-page__session-list__session-item"
              >
                <h4 className="progress-page__session-list__session-item__session-date">
                  Session on{" "}
                  {new Date(session.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </h4>
                <button
                  onClick={() => toggleDetails(session.id)}
                  className="progress-page__session-list__session-item__session-toggle"
                >
                  {expandedSession === session.id ? (
                    <FontAwesomeIcon icon={faChevronUp} />
                  ) : (
                    <FontAwesomeIcon icon={faChevronDown} />
                  )}
                </button>

                {expandedSession === session.id && (
                  <div className="progress-page__session-details">
                    {session.exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="progress-page__session-details__exercise-details"
                      >
                        <p className="progress-page__session-details__exercise-details__exercise-row">
                          <strong>Exercise:</strong> {exercise.name}
                        </p>
                        <p className="progress-page__session-details__exercise-details__exercise-row">
                          <strong>Calories Burned:</strong>{" "}
                          {exercise.calories_burned}
                        </p>
                        <p className="progress-page__session-details__exercise-details__exercise-row">
                          <strong>Workout Type:</strong> {exercise.workout_type}
                        </p>
                        <p className="progress-page__session-details__exercise-details__exercise-row">
                          <strong>Duration:</strong> {exercise.duration} min
                        </p>
                        <p className="progress-page__session-details__exercise-details__exercise-row">
                          <strong>Sets:</strong> {exercise.sets}
                        </p>
                        <p className="progress-page__session-details__exercise-details__exercise-row">
                          <strong>Reps:</strong> {exercise.reps}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))
          ) : (
            <p className="progress-page__no-sessions">
              No sessions on this day.
            </p>
          )}
        </ul>
      )}
    </main>
  );
};

export default ProgressPage;

