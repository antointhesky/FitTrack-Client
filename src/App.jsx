import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import WorkoutTypePage from "./pages/WorkoutTypePage/WorkoutTypePage";
import SessionPage from './pages/SessionPage/SessionPage';
// import ExercisePage from "./pages/ExercisePage/ExercisePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/workouts" element={<WorkoutTypePage />} />
      <Route path="/session/:id" element={<SessionPage />} />
        {/* <Route path="/exercises/:id" element={<ExercisePage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
