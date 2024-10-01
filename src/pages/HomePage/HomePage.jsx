import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/scss";
import "swiper/scss/pagination";
import "./HomePage.scss";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import AddGoalModal from "../../components/AddGoalModal/AddGoalModal";

const API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    unit: "",
    current_progress: "",
    deadline_progress: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`${API_URL}/workouts`);
        setWorkouts(response.data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    const fetchBodyParts = async () => {
      try {
        const response = await axios.get(`${API_URL}/exercises/bodyparts`);
        setBodyParts(response.data);
      } catch (error) {
        console.error("Error fetching body parts:", error);
      }
    };

    const fetchGoals = async () => {
      try {
        const response = await axios.get(`${API_URL}/goals`);
        if (Array.isArray(response.data)) {
          setGoals(response.data);
        } else {
          console.error("Goals data is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchWorkouts();
    fetchBodyParts();
    fetchGoals();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/exercises?body_part=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleAddNewGoal = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/goals`, newGoal);
      if (response.status === 201) {
        setGoals([...goals, response.data]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding new goal:", error);
    }
  };

  const handleDropdownItemClick = (item) => {
    setSearchTerm(item);
    setIsDropdownVisible(false);
  };

  const handleStartNowClick = () => {
    navigate("/workouts-overview");
  };

  return (
    <main className="home-page">
      <section className="home-page__hero">
        <div className="home-page__hero-content">
          <h1 className="home-page__hero-title">Unlock Your Full Potential</h1>
          <p className="home-page__hero-description">
            Start tracking your fitness journey today. Choose your workouts, set goals, and reach new heights.
          </p>
          <button className="home-page__cta-button" onClick={handleStartNowClick}>
            Start Now
          </button>
        </div>
      </section>

      <div className="home-page__container">
        <h2 className="home-page__highlight-title">Find Workouts and Explore Types</h2>

        <div className="home-page__search-section">
          <form className="home-page__search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by muscle group"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownVisible(true)}
              className="home-page__search-input"
            />
            <button type="submit" className="home-page__search-button">
              <FaSearch />
            </button>

            {isDropdownVisible && (
              <div className="home-page__custom-dropdown">
                {bodyParts
                  .filter((part) =>
                    part.body_part.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((part, index) => (
                    <div
                      key={index}
                      className="home-page__dropdown-item"
                      onClick={() => handleDropdownItemClick(part.body_part)}
                    >
                      {part.body_part}
                    </div>
                  ))}
              </div>
            )}
          </form>
        </div>

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
                <div className="home-page__workout-card">
                  <img
                    src={`${API_URL}${workout.imageUrl}`}
                    alt={workout.name}
                    className="home-page__workout-img"
                  />
                  <h3 className="home-page__workout-title">{workout.name}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-pagination"></div>
      </div>

      <section className="home-page__goals-section">
        <h2 className="home-page__goals-title">Your Fitness Goals</h2>
        {Array.isArray(goals) && goals.length > 0 ? (
          <div className="home-page__goals-list">
            {goals.map((goal) => (
              <Link className="home-page__goal-link" key={goal.id} to="/goals"> 
                <div className="home-page__goal-card">
                  <h3 className="home-page__goal-name">{goal.name}</h3>
                  <p className="home-page__goal-progress">
                    Progress: {goal.current_progress} / {goal.target} {goal.unit}
                  </p>
                  <p className="home-page__goal-deadline">
                    Deadline: {new Date(goal.deadline_progress).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>
            No goals yet.{" "}
            <button className="home-page__set-goal-button" onClick={() => setIsModalOpen(true)}>
              Set Your First Goal
            </button>
          </p>
        )}
        <button className="home-page__add-goal-button" onClick={() => setIsModalOpen(true)}>
          + New Goal
        </button>
      </section>

      <AddGoalModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        newGoal={newGoal}
        handleNewGoalInputChange={(e) => {
          const { name, value } = e.target;
          setNewGoal((prevNewGoal) => ({ ...prevNewGoal, [name]: value }));
        }}
        handleAddNewGoal={handleAddNewGoal}
      />
    </main>
  );
};

export default HomePage;

