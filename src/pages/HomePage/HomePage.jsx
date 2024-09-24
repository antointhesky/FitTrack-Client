import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/scss";
import "swiper/scss/pagination";
import "./HomePage.scss";
import { Link } from "react-router-dom";
import axios from "axios";  

const HomePage = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get("http://localhost:5050/workouts");
        setWorkouts(response.data); 
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };
    fetchWorkouts();
  }, []);

  return (
    <main>
      <div className="container">
        <h1>Choose Your Workout</h1>
        <h2>By Workout Type</h2>
        <Swiper
          modules={[Pagination]}
          grabCursor={true}
          initialSlide={2}
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
          {workouts.map((workout) => (
            <SwiperSlide key={workout.id}>
              <Link to={`/workouts?workout_type=${workout.name}`}>
                <div className="card">
                  <img
                    src={`http://localhost:5050${workout.imageUrl}`} 
                    alt={workout.name}
                  />
                  <h3 className="title">{workout.name}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-pagination"></div>
      </div>
    </main>
  );
};

export default HomePage;
