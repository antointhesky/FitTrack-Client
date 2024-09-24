export const getExercisesByWorkoutTypeApi = async (workoutType) => {
    const response = await fetch(
      `http://localhost:5050/exercises?workoutType=${workoutType}`
    );
    return response.json();
  };

  export const getGoalDetailsApi = async (id) => {
    const response = await fetch(`http://localhost:5050/goals/${id}`);
    return response.json();
  };
  
  