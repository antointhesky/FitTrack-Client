import axios from 'axios';

const API_KEY = 'your-rapidapi-key'; // Replace this with your actual API key

// Function to fetch exercises
export const fetchExercises = async (bodyPart = 'all') => {
  const options = {
    method: 'GET',
    url: 'https://exercisedb.p.rapidapi.com/exercises',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    return response.data; // Return exercise data
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }
};
