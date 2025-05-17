# Skillora Learning Platform

Skillora is a full-stack application inspired by Udemy, built using React, Node.js, Express, MongoDB, and JavaScript.

## Features

- User authentication (register, login, logout)
- Role-based access control (student, instructor, admin)
- Course browsing and filtering
- Course creation and management
- Video lessons and progress tracking
- Student enrollment and dashboard
- Reviews and ratings
- Admin panel

## Tech Stack

### Frontend
- React with JavaScript
- Tailwind CSS for styling
- shadcn/ui for UI components
- wouter for client-side routing
- React Query for data fetching
- Vite as the build tool

### Backend
- Express with JavaScript
- MongoDB for database
- Mongoose for ODM
- JSON Web Tokens for authentication
- Express-session for session management
- Zod for validation

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB running locally or a MongoDB Atlas account

### Installation

#### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd skillora-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/skillora
   JWT_SECRET=your_jwt_secret_key_change_in_production
   SESSION_SECRET=your_session_secret_key_change_in_production
   NODE_ENV=development
   ```

4. Seed the database with initial data:
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

#### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd skillora-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:3000

## Demo Accounts

The seed script creates the following accounts:

- Admin:
  - Email: admin@skillora.com
  - Password: admin123

- Instructor:
  - Email: instructor@skillora.com
  - Password: instructor123

- Student:
  - Email: student@skillora.com
  - Password: student123

## Deployment

### Backend Deployment (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Select the server directory
4. Set up the environment variables
5. Deploy!

### Frontend Deployment (Vercel/Netlify)
1. Create a new project on Vercel or Netlify
2. Connect your GitHub repository
3. Select the client directory
4. Configure the build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy!

## License

This project is licensed under the MIT License. 