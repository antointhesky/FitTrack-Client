import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GoalsPage from "./pages/GoalsPage/GoalsPage";
import AddGoalsPage from "./pages/AddGoalsPage/AddGoalsPage";
import EditGoalsPage from "./pages/EditGoalsPage/EditGoalsPage";
import SessionPage from "./pages/SessionPage/SessionPage";
import ExercisesPage from "./pages/ExercisesPage/ExercisesPage"; // Import the ExercisesPage
import BottomNavBar from "./components/BottomNavBar/BottomNavBar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to /goals */}
        <Route path="/" element={<Navigate to="/goals" />} />

        {/* Goals related routes */}
        <Route path="/goals" element={<GoalsPage />} /> {/* View all goals */}
        <Route path="/goals/add" element={<AddGoalsPage />} /> {/* Add a new goal */}
        <Route path="/goals/:id/edit" element={<EditGoalsPage />} /> {/* Edit a specific goal */}

        {/* Session related routes */}
        <Route path="/session" element={<SessionPage />} /> {/* Start or view a workout session */}

        {/* Exercises page route, passing the workout type ID */}
        <Route path="/exercises/:workoutId" element={<ExercisesPage />} /> {/* View exercises for a workout type */}
      </Routes>
      <BottomNavBar />
    </BrowserRouter>
  );
}
