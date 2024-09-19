import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GoalsPage from "./pages/GoalsPage/GoalsPage";
import AddGoalsPage from "./pages/AddGoalsPage/AddGoalsPage";
import EditGoalsPage from "./pages/EditGoalsPage/EditGoalsPage";
import SessionPage from "./pages/SessionPage/SessionPage";
import ExercisesPage from "./pages/ExercisesPage/ExercisesPage"; 
// import BottomNavBar from "./components/BottomNavBar/BottomNavBar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/goals" />} />
        <Route path="/goals" element={<GoalsPage />} /> 
        <Route path="/goals/add" element={<AddGoalsPage />} /> 
        <Route path="/goals/:name/edit" element={<EditGoalsPage />} /> 
        <Route path="/session" element={<SessionPage />} /> 
        <Route path="/exercises/:workoutId" element={<ExercisesPage />} /> 
      </Routes>
      {/* <BottomNavBar /> */}
    </BrowserRouter>
  );
}
