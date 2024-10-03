import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faFire,
  faDumbbell,
  faSync,
  faClock,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
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

  const location = useLocation();
  const {
    totalCaloriesBurned,
    totalReps,
    totalSets,
    totalHours,
    uniqueWorkoutTypes,
    uniqueBodyParts,
    showMessage,
  } = location.state || {};
  const [showToast, setShowToast] = useState(false);
  const [goalStats, setGoalStats] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`${API_URL}/session`);
        const sessionsByDate = response.data.reduce((acc, session) => {
          const sessionDate = new Date(session.date).toLocaleDateString(
            "en-GB"
          );

          // Initialize the date entry if it doesn't exist
          if (!acc[sessionDate]) {
            acc[sessionDate] = {
              calories: 0,
              duration: 0,
              sets: 0,
              reps: 0,
              sessions: [], // To store all sessions for this date
            };
          }

          // Sum up the session's data into the grouped date
          const sessionCalories = session.exercises.reduce(
            (total, exercise) => total + (exercise.calories_burned || 0),
            0
          );
          const sessionDuration = session.exercises.reduce(
            (total, exercise) => total + parseFloat(exercise.duration || 0),
            0
          );
          const sessionSets = session.exercises.reduce(
            (total, exercise) => total + (exercise.sets || 0),
            0
          );
          const sessionReps = session.exercises.reduce(
            (total, exercise) => total + (exercise.reps || 0),
            0
          );

          acc[sessionDate].calories += sessionCalories;
          acc[sessionDate].duration += sessionDuration;
          acc[sessionDate].sets += sessionSets;
          acc[sessionDate].reps += sessionReps;
          acc[sessionDate].sessions.push(session); // Store the entire session for later use

          return acc;
        }, {});

        const labels = Object.keys(sessionsByDate); // Get the unique dates
        const calories = labels.map((date) => sessionsByDate[date].calories);
        const durations = labels.map((date) => sessionsByDate[date].duration);
        const sets = labels.map((date) => sessionsByDate[date].sets);
        const reps = labels.map((date) => sessionsByDate[date].reps);

        // Update the state with grouped data
        setSessions(sessionsByDate); // Store sessions grouped by date
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
      // Use sessions from the selected date and display all sessions
      const formattedDate = selectedDate.toLocaleDateString("en-GB");
      setFilteredSessions(sessions[formattedDate]?.sessions || []);
    }
  }, [selectedDate, sessions]);

  useEffect(() => {
    if (showMessage) {
      setShowToast(true);
      calculateGoalProgress();
    }
  }, [showMessage, totalCaloriesBurned, totalReps, totalSets, totalHours]);

  const calculateGoalProgress = async () => {
    try {
      const response = await axios.get(`${API_URL}/goals`);
      const goals = response.data;
      const goalStats = [];

      // Calorie goals
      const calorieGoal = goals.find((goal) => goal.unit === "cal");
      if (calorieGoal) {
        const progressPercentage =
          totalCaloriesBurned > 0
            ? ((totalCaloriesBurned / calorieGoal.target) * 100).toFixed(1)
            : 0;
        goalStats.push({
          type: "calories",
          burned: totalCaloriesBurned,
          percentage: progressPercentage,
        });
      }

      // Reps goals
      const repsGoal = goals.find((goal) => goal.unit === "reps");
      if (repsGoal) {
        const progressPercentage =
          totalReps > 0 ? ((totalReps / repsGoal.target) * 100).toFixed(1) : 0;
        goalStats.push({
          type: "reps",
          completed: totalReps,
          percentage: progressPercentage,
        });
      }

      // Sets goals
      const setsGoal = goals.find((goal) => goal.unit === "sets");
      if (setsGoal) {
        const progressPercentage =
          totalSets > 0 ? ((totalSets / setsGoal.target) * 100).toFixed(1) : 0;
        goalStats.push({
          type: "sets",
          completed: totalSets,
          percentage: progressPercentage,
        });
      }

      // Hours goals (converted from minutes)
      const hoursGoal = goals.find((goal) => goal.unit === "hours");
      if (hoursGoal) {
        const progressPercentage =
          totalHours > 0
            ? ((totalHours / hoursGoal.target) * 100).toFixed(1)
            : 0;
        goalStats.push({
          type: "hours",
          completed: totalHours,
          percentage: progressPercentage,
        });
      }

      setGoalStats(goalStats);
    } catch (error) {
      console.error("Error calculating goal progress:", error);
    }
  };

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
      padding: { left: 10, right: 10, top: 10, bottom: 10 },
    },
    scales: {
      y1: {
        type: "linear",
        position: "left",
        ticks: { color: "#232940" },
        title: {
          display: true,
          text: "Calories Burned, Sets",
          color: "#232940",
        },
      },
      y2: {
        type: "linear",
        position: "right",
        ticks: { color: "#232940" },
        title: {
          display: true,
          text: "Duration (Minutes) and Reps",
          color: "#232940",
        },
        grid: { drawOnChartArea: false },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#232940" },
      },
      title: {
        display: true,
        text: "Calories Burned, Duration, Sets, and Reps Over Time",
        color: "#232940",
      },
    },
  };

  return (
    <main className="progress-page">
      {showToast && goalStats.length > 0 && (
        <>
          <div
            className="toast-overlay"
            onClick={() => setShowToast(false)}
          ></div>
          <div className="progress-page__toast">
            <button
              onClick={() => setShowToast(false)}
              className="progress-page__toast-close"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            {goalStats.map((goal, index) => (
              <div key={index} className="progress-page__toast-message">
                <FontAwesomeIcon
                  icon={
                    goal.type === "calories"
                      ? faFire
                      : goal.type === "reps"
                      ? faSync
                      : goal.type === "sets"
                      ? faDumbbell
                      : faClock
                  }
                  className="progress-page__toast-icon"
                />
                <p>
                  You've {goal.type === "calories" ? "burned" : "completed"}{" "}
                  {goal.burned || goal.completed} {goal.type}.
                </p>
                <p>
                  You're {goal.percentage}% of the way to your {goal.type} goal.
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      <section className="progress-page__hero">
        <div className="progress-page__hero-content">
          <h1 className="progress-page__hero-content__title">
            Track Your Fitness Journey
          </h1>
          <p className="progress-page__hero-content__description">
            You're building strength with every workout! Stay focused and see
            your progress grow over time.
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
          const isSessionDay = Object.keys(sessions).some(
            (sessionDate) => sessionDate === date.toLocaleDateString("en-GB")
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
                <div className="progress-page__session-details">
                  {session.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="progress-page__session-details__exercise-details"
                    >
                      <p>
                        <strong>Exercise:</strong> {exercise.name}
                      </p>
                      <p>
                        <strong>Calories Burned:</strong>{" "}
                        {exercise.calories_burned}
                      </p>
                      <p>
                        <strong>Workout Type:</strong> {exercise.workout_type}
                      </p>
                      <p>
                        <strong>Duration:</strong> {exercise.duration} min
                      </p>
                      <p>
                        <strong>Sets:</strong> {exercise.sets}
                      </p>
                      <p>
                        <strong>Reps:</strong> {exercise.reps}
                      </p>
                    </div>
                  ))}
                </div>
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

