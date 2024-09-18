import "./App.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SingleExercisePage from "./vite-project/pages/SingleExercisePage/SingleExercisePage";
import ExercisesPage from "./vite-project/pages/ExercisesPage/ExercisesPage";
import ExerciseEditPage from "./vite-project/pages/ExerciseEditPage/ExerciseEditPage";
import ExerciseAddPage from "./vite-project/pages/ExerciseAddPage/ExerciseAddPage";
import GoalsPage from "./pages/GoalsPage/GoalsPage";
import GoalsEditPage from "./vite-project/pages/GoalsEditPage/GoalsEditPage";
import AddGoalsItem from "./vite-project/pages/AddGoalsItem/AddGoalsItem";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/exercises" />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/exercises/:id" element={<SingleExercisePage />} />
        <Route path="/exercises/:id/edit" element={<ExerciseEditPage />} />
        <Route path="/exercises/add" element={<ExerciseAddPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/goals/:id" element={<GoalsPage />} />
        <Route path="/goals/add" element={<AddGoalsItem />} />
        <Route path="/goals/:id/edit" element={<GoalsEditPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
