import "./App.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GoalsPage from "./pages/GoalsPage/GoalsPage";
import AddGoalsPage from "./pages/AddGoalsPage/AddGoalsPage";
import EditGoalsPage from "./pages/EditGoalsPage/EditGoalsPage";
import SessionPage from "./pages/SessionPage/SessionPage"; // Import SessionPage

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect to /goals */}
        <Route path="/" element={<Navigate to="/goals" />} />

        {/* Goals related routes */}
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/goals/add" element={<AddGoalsPage />} />
        <Route path="/goals/:id/edit" element={<EditGoalsPage />} />

        {/* Session related route */}
        <Route path="/session" element={<SessionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
