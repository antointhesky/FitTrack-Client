import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/scss";
import "swiper/scss/pagination";
import "./WorkoutTypePage.scss";

export default function WorkoutTypePage() {
  const [searchParams] = useSearchParams();
  const workoutType = searchParams.get("workout_type");

  const [exercises, setExercises] = useState([]);
  const [sessionId, setSessionId] = useState(null); // State to store session ID
  const navigate = useNavigate();

  useEffect(() => {
    if (workoutType) {
      const fetchExercises = async () => {
        try {
          const response = await axios.get(`http://localhost:5050/exercises?workout_type=${encodeURIComponent(workoutType)}`);
          setExercises(response.data);
        } catch (error) {
          console.error("Error fetching exercises:", error);
        }
      };
      fetchExercises();
    }
  }, [workoutType]);

  const handleAddToSession = async (exerciseId) => {
    try {
      
      if (!sessionId) {
        const sessionResponse = await axios.post("http://localhost:5050/session", { date: new Date() });
        setSessionId(sessionResponse.data.session_id);
      }

      await axios.post(`http://localhost:5050/session/${sessionId || sessionResponse.data.session_id}/exercise`, { exerciseId });

      navigate(`/session/${sessionId || sessionResponse.data.session_id}`);
    } catch (error) {
      console.error("Error adding exercise to session:", error);
    }
  };

  return (
    <main className="workout-type-page">
      <h1>{`${workoutType} Workouts`}</h1>
      <Swiper
        modules={[Pagination]}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        speed={800}
        slideToClickedSlide={true}
        pagination={{ clickable: true }}
        breakpoints={{
          320: { spaceBetween: 40 },
          430: { spaceBetween: 50 },
          580: { spaceBetween: 70 },
          650: { spaceBetween: 30 },
        }}
      >
        {exercises.map((exercise) => (
          <SwiperSlide key={exercise.id}>
            <div className="exercise-card" onClick={() => handleAddToSession(exercise.id)}>
              <video src={`http://localhost:5050${exercise.video_url}`} controls />
              <h3>{exercise.name}</h3>
              <p><strong>Body Part:</strong> {exercise.body_part}</p>
              <p><strong>Sets:</strong> {exercise.sets}</p>
              <p><strong>Reps:</strong> {exercise.reps}</p>
              <p><strong>Duration:</strong> {exercise.duration}</p>
              <p><strong>Calories Burned:</strong> {exercise.calories_burned}</p>
              <button>Add to Session</button> 
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}
