import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/scss";
import "swiper/scss/pagination";
import "./HomePage.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Workouts
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get("http://localhost:5050/workouts");
        setWorkouts(response.data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    // Fetch Body Parts
    const fetchBodyParts = async () => {
      try {
        const response = await axios.get("http://localhost:5050/exercises/bodyparts");
        setBodyParts(response.data);
      } catch (error) {
        console.error("Error fetching body parts:", error);
      }
    };

    fetchWorkouts();
    fetchBodyParts();
  }, []);

  // Handle Search Submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/exercises?body_part=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <main>
      <div className="container">
        <h1>Choose Your Workout</h1>
        <h2>By Workout Type</h2>
        
        {/* Search Bar for Body Parts */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by body part"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            list="bodyParts"
          />
          <datalist id="bodyParts">
            {bodyParts.map((part) => (
              <option key={part.body_part} value={part.body_part} />
            ))}
          </datalist>
          <button type="submit">Search</button>
        </form>

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
              <Link to={`/workouts?workout_type=${encodeURIComponent(workout.name)}`}>
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
