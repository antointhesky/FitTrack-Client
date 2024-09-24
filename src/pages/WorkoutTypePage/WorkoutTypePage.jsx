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
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    if (workoutType) {
      const fetchExercises = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5050/exercises?workout_type=${encodeURIComponent(workoutType)}`
          );
          setExercises(response.data);
        } catch (error) {
        }
      };
      fetchExercises();
    }
  }, [workoutType]);

  const handleAddExercise = async (exerciseId, workoutType) => {
    const sessionData = {
      exercises: [
        {
          id: exerciseId,
          workout_type: workoutType,
        },
      ],
    };

    try {
      const response = await axios.post("http://localhost:5050/session", sessionData);
      const sessionId = response.data.session_id;
      
      navigate(`/session/${sessionId}`);
    } catch (error) {
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
            <div
              className="exercise-card"
              onClick={() => handleAddExercise(exercise.id, exercise.workout_type)}
            >
              <video src={`http://localhost:5050${exercise.video_url}`} controls />
              <h3>{exercise.name}</h3>
              <p>Body Part: {exercise.body_part}</p>
              <p>Sets: {exercise.sets}</p>
              <p>Reps: {exercise.reps}</p>
              <p>Duration: {exercise.duration}</p>
              <p>Calories Burned: {exercise.calories_burned}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}

