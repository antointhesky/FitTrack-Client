const API_URL = import.meta.env.VITE_API_URL;

export const getExercisesByWorkoutTypeApi = async (workoutType) => {
  const response = await fetch(`${API_URL}/exercises?workoutType=${workoutType}`);
  return response.json();
};

export const getGoalDetailsApi = async (id) => {
  const response = await fetch(`${API_URL}/goals/${id}`);
  return response.json();
};
