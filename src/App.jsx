import "./App.scss";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import WorkoutTypePage from "./pages/WorkoutTypePage/WorkoutTypePage";
import SessionPage from './pages/SessionPage/SessionPage';
import GoalsPage from './pages/GoalsPage/GoalsPage'; // Add GoalsPage
import AddGoalsPage from "./pages/AddGoalsPage/AddGoalsPage";
import ProgressPage from './pages/ProgressPage/ProgressPage';
import EditGoalsPage from './pages/EditGoalsPage/EditGoalsPage';  // Add ProgressPage

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workouts" element={<WorkoutTypePage />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/goals" element={<GoalsPage />} /> 
        <Route path="/goals/add" element={<AddGoalsPage />} /> 
        <Route path="/goals/:name/edit" element={<EditGoalsPage />} />
        <Route path="/progress" element={<ProgressPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}
