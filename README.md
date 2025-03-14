# FitTrack

## Overview
FitTrack is a fitness app designed to help users track their workouts, set fitness goals, and monitor progress. It provides a platform for users to log exercises, keep track of their routines, and view their progress over time, making it easier to stay motivated and on track with fitness goals.

### Problem Space
Many fitness enthusiasts struggle with tracking their workouts consistently and visualizing their progress. Without a clear view of their workout history, they may find it hard to stay motivated or know if they are improving. Additionally, fitness tracking apps are often complex and bloated with unnecessary features, making it hard for beginners to use them effectively.

### Installation
To run FitTrack fully, you need to clone both the client and server repositories:
1. Clone the client repository: git clone https://github.com/antointhesky/FitTrack-Client.git
2. Clone the server repository: git clone https://github.com/antointhesky/FitTrack-server.git

### Run Locally
1. Navigate to the server folder: cd FitTrack-Server
2. Install dependencies: cd FitTrack-Server
3. Start the backend server: npm start

1. Navigate to the client folder: cd FitTrack-Client
2. Install dependencies: npm install
3. Start the frontend development server: npm run dev

### Features
As a user, I want to be able to log my workouts by adding exercises, sets, reps, and weights.
As a user, I want to be able to view my past workouts to see progress over time.
As a user, I want to set fitness goals and track my progress toward those goals.
As a user, I want to create an account to manage my workouts and goals.
As a logged-in user, I want to update or delete a workout entry.
As a logged-in user, I want to be able to edit my fitness goals.
As a user, I want to visualize my progress through charts and graphs.

### Tech Stack
Frontend: React
Backend: Node.js, Express
Database: MySql
Client libraries:
React
react-router
axios
Server libraries:
knex
express

### Sitemap
Home Page
Workout Log Page: Log new workout, view past workouts
Progress Page: View progress charts
Goals Page: Set and update fitness goals

### Data
The app will track the following:
Workouts (exercise name, sets, reps, weight, date)
Fitness Goals (goal type, target value, current progress)

## Future Implementations
Integrate a social feature where users can share their progress with friends.
A "forgot password" feature.
Expanded stats 
