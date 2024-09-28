import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-circular-progressbar/dist/styles.css';
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
import './ProgressPage.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressPage = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [caloriesData, setCaloriesData] = useState({ labels: [], data: [] });
  const [exerciseDurationData, setExerciseDurationData] = useState({ labels: [], data: [] });
  const [setsData, setSetsData] = useState({ labels: [], data: [] });
  const [repsData, setRepsData] = useState({ labels: [], data: [] });
  const [workoutTypeData, setWorkoutTypeData] = useState({ labels: [], data: [] });

  // Fetch sessions and generate graph data
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:5050/session');
        setSessions(response.data);

        const labels = response.data.map((session) => new Date(session.date).toLocaleDateString());
        const calories = response.data.map((session) =>
          session.exercises.reduce((total, exercise) => total + exercise.calories_burned, 0)
        );
        const durations = response.data.map((session) =>
          session.exercises.reduce((total, exercise) => total + parseFloat(exercise.duration || 0), 0)
        );
        const sets = response.data.map((session) =>
          session.exercises.reduce((total, exercise) => total + (exercise.sets || 0), 0)
        );
        const reps = response.data.map((session) =>
          session.exercises.reduce((total, exercise) => total + (exercise.reps || 0), 0)
        );
        const workoutTypes = response.data.map((session) =>
          session.exercises.length > 0 ? session.exercises[0].workout_type : 'Unknown'
        );

        setCaloriesData({ labels, data: calories });
        setExerciseDurationData({ labels, data: durations });
        setSetsData({ labels, data: sets });
        setRepsData({ labels, data: reps });
        setWorkoutTypeData({ labels, data: workoutTypes });
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = sessions.filter(
        (session) => new Date(session.date).toLocaleDateString() === selectedDate.toLocaleDateString()
      );
      setFilteredSessions(filtered);
    }
  }, [selectedDate, sessions]);

  const toggleDetails = (sessionId) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  // Combined graph for calories, duration, sets, reps, and workout type
  const combinedData = {
    labels: caloriesData.labels,
    datasets: [
      {
        label: 'Calories Burned',
        data: caloriesData.data,
        borderColor: 'rgb(255, 99, 132)', // Color for calories line
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y1',
      },
      {
        label: 'Duration (Minutes)',
        data: exerciseDurationData.data,
        borderColor: 'rgb(54, 162, 235)', // Color for duration line
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        yAxisID: 'y2',
      },
      {
        label: 'Sets',
        data: setsData.data,
        borderColor: 'rgb(75, 192, 192)', // Color for sets line
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y1',
      },
      {
        label: 'Reps',
        data: repsData.data,
        borderColor: 'rgb(153, 102, 255)', // Color for reps line
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        yAxisID: 'y2',
      },
      {
        label: 'Workout Type',
        data: workoutTypeData.data,
        borderColor: 'rgb(255, 205, 86)', // Color for workout type line
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y1: {
        type: 'linear',
        position: 'left',
        ticks: {
          color: '#232940', // Use $font color for ticks and labels
        },
        title: {
          display: true,
          text: 'Calories Burned, Sets, and Workout Type',
          color: '#232940', // Use $font color
        },
      },
      y2: {
        type: 'linear',
        position: 'right',
        ticks: {
          color: '#232940', // $font 
        },
        title: {
          display: true,
          text: 'Duration (Minutes) and Reps',
          color: '#232940', // $font 
        },
        grid: {
          drawOnChartArea: false, 
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#232940', // $font
        },
      },
      title: {
        display: true,
        text: 'Calories Burned, Duration, Sets, Reps, and Workout Type Over Time',
        color: '#232940', // $font 
      },
    },
  };

  return (
    <main className="progress-page">
      <h1>Your Progress</h1>

      <div className="progress-graphs">
        <Line options={chartOptions} data={combinedData} />
      </div>

      <h2>
  {selectedDate
    ? `Sessions on ${selectedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}`
    : 'Please select a date from the calendar'}
</h2>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={({ date }) => {
          const isSessionDay = sessions.some(
            (session) => new Date(session.date).toLocaleDateString() === date.toLocaleDateString()
          );
          return isSessionDay ? 'session-day' : null;
        }}
      />

      {selectedDate && (
        <ul className="session-list">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <li key={session.id}>
                <h3>Session on {new Date(session.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}</h3>
                <button onClick={() => toggleDetails(session.id)}>
                  {expandedSession === session.id ? 'Hide Details' : 'View Details'}
                </button>

                {expandedSession === session.id && (
                  <div className="session-details">
                    {session.exercises.map((exercise) => (
                      <div key={exercise.id} className="exercise-details">
                        <p><strong>Exercise:</strong> {exercise.name}</p>
                        <p><strong>Calories Burned:</strong> {exercise.calories_burned}</p>
                        <p><strong>Workout Type:</strong> {exercise.workout_type}</p>
                        <p><strong>Duration:</strong> {exercise.duration} min</p>
                        <p><strong>Sets:</strong> {exercise.sets}</p>
                        <p><strong>Reps:</strong> {exercise.reps}</p>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))
          ) : (
            <p>No sessions on this day.</p>
          )}
        </ul>
      )}
    </main>
  );
};

export default ProgressPage; 