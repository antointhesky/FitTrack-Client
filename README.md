# Project Title

## Overview

FitTrack is a fitness app designed to help users track their workouts, set fitness goals, and monitor progress. It provides a platform for users to log exercises, keep track of their routines, and view their progress over time, making it easier to stay motivated and on track with fitness goals.

### Problem Space

Many fitness enthusiasts struggle with tracking their workouts consistently and visualizing their progress. Without a clear view of their workout history, they may find it hard to stay motivated or know if they are improving. Additionally, fitness tracking apps are often complex and bloated with unnecessary features, making it hard for beginners to use them effectively.

### User Profile

Fitness enthusiasts:
looking to track their daily workouts
aiming to set fitness goals and track their progress
looking for a simple, easy-to-use platform to log workouts and see results

### Features

As a user, I want to be able to log my workouts by adding exercises, sets, reps, and weights.
As a user, I want to be able to view my past workouts to see progress over time.
As a user, I want to set fitness goals and track my progress toward those goals.
As a user, I want to create an account to manage my workouts and goals.
As a logged-in user, I want to update or delete a workout entry.
As a logged-in user, I want to be able to edit my fitness goals.
As a user, I want to visualize my progress through charts and graphs.

## Implementation

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

### APIs

List any external sources of data that will be used in your app.

### Sitemap

Home Page
Workout Log Page: Log new workout, view past workouts
Progress Page: View progress charts
Register: Create an account
Login: Access your account
Goals Page: Set and update fitness goals

### Mockups

Provide visuals of your app's screens. You can use pictures of hand-drawn sketches, or wireframing tools like Figma.

### Data

The app will track the following:

Users (name, email, password)
Workouts (exercise name, sets, reps, weight, date)
Fitness Goals (goal type, target value, current progress)

### Endpoints

POST /register

Registers a new user.
Parameters: email, password
POST /login

Logs in an existing user.
Parameters: email, password
POST /workouts

Adds a new workout entry.
Parameters: exercise name, sets, reps, weight, date
GET /workouts

Retrieves all workout entries for the logged-in user.
PUT /workouts/

Updates a workout entry.
Parameters: id, updated workout data
DELETE /workouts/

Deletes a workout entry.
Parameters: id
POST /goals

Sets a new fitness goal.
Parameters: goal type, target value
GET /goals

Retrieves fitness goals for the logged-in user.
PUT /goals/

Updates a fitness goal.
Parameters: id, updated goal data

## Roadmap

Create client:

Set up React project with basic routes and components for home, login, and registration pages.
Create server:

Set up Express project with routing and placeholder responses.
Create database with Knex:

Create migrations for users, workouts, and fitness goals tables.
Develop features:

User Authentication: Implement registration and login.
Workout Logging: Create forms and API routes for adding, updating, and deleting workouts.
Progress Tracking: Display a history of workouts and progress charts using a charting library (e.g., Chart.js).
Fitness Goals: Allow users to set and track goals.
Deploy:

Deploy client and server so commits are reflected in production.

## Future Implementations

Ability to track specific workout programs or routines.
Integrate a social feature where users can share their progress with friends.
A "forgot password" feature.
Expanded stats such as calories burned per workout.
This proposal outlines the basic features and structure of the FitTrack app, ensuring it is achievable within the two-week time frame while providing room for growth.
