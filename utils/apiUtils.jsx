export const getExercisesByWorkoutTypeApi = async (workoutType) => {
    const response = await fetch(
      `http://localhost:3000/exercises?workoutType=${workoutType}`
    );
    return response.json();
  };

  export const getGoalDetailsApi = async (id) => {
    const response = await fetch(`http://localhost:3000/goals/${id}`);
    return response.json();
  };
  
  