import "./App.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SingleExercisePage from "./pages/SingleExercisePage/SingleExercisePage";
import GoalsPage from "./pages/GoalsPage/GoalsPage";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/workouts" />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/excercises/:id" element={<SingleExercisePage />} />
        <Route path="/excercises/:id/edit" element={<ExerciseEditPage />} />
        <Route path="/excercises/add" element={<ExerciseAddPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/goals/:id" element={<GoalsPage />} />
        <Route path="/goals/add" element={<AddGoalsItem />} />
        <Route path="/goals/:id/edit" element={<GoalsEditPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}