import "./App.scss";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import BottomNavBar from "./components/BottomNavBar/BottomNavBar";
import HomePage from "./pages/HomePage/HomePage";
import WorkoutsOverviewPage from "./pages/WorkoutsOverviewPage/WorkoutsOverviewPage";
import WorkoutTypePage from "./pages/WorkoutTypePage/WorkoutTypePage";
import SessionPage from "./pages/SessionPage/SessionPage";
import SessionsOverviewPage from "./pages/SessionsOverviewPage/SessionsOverviewPage";
import ProgressPage from "./pages/ProgressPage/ProgressPage";
import GoalsPage from "./pages/GoalsPage/GoalsPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workouts-overview" element={<WorkoutsOverviewPage />} />
        <Route path="/workouts" element={<WorkoutTypePage />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/sessions-overview" element={<SessionsOverviewPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/goals" element={<GoalsPage />} />
      </Routes>
      <BottomNavBar />
    </Router>
  );
}

export default App;
