import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/scss";
import "swiper/scss/pagination";
import "./HomePage.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const HomePage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get("http://localhost:5050/workouts");
        setWorkouts(response.data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/exercises?body_part=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleDropdownItemClick = (item) => {
    setSearchTerm(item);
    setIsDropdownVisible(false); 
  };

  const handleStartNowClick = () => {
    navigate("/workouts-overview"); // Navigate to the workouts page when clicked
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Unlock Your Full Potential</h1>
          <p>Start tracking your fitness journey today. Choose your workouts, set goals, and reach new heights.</p>
          <button className="cta-button" onClick={handleStartNowClick}>Start Now</button>
        </div>
      </section>

      <div className="container">
        {/* Combined Title for Search and Slider */}
        <h2 className="highlight-title">Find Workouts and Explore Types</h2>
        
        {/* Search Bar Section */}
        <div className="search-section">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by body part"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownVisible(true)} 
            />
            <button type="submit">
              <FaSearch /> 
            </button>

            {isDropdownVisible && (
              <div className="custom-dropdown">
                {bodyParts
                  .filter((part) => part.body_part.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((part, index) => (
                    <div
                      key={index}
                      className="dropdown-item"
                      onClick={() => handleDropdownItemClick(part.body_part)}
                    >
                      {part.body_part}
                    </div>
                  ))}
              </div>
            )}
          </form>
        </div>

        {/* Workout Slider */}
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
