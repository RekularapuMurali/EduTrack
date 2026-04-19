# EduTrack

## Introduction

EduTrack is a comprehensive full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to streamline educational management and tracking. It features role-based authentication, allowing administrators to oversee system operations, volunteers to manage student data and activities, and students to monitor their progress and reports. This platform aims to enhance educational experiences by providing a centralized system for tracking attendance, assessments, sessions, and overall student development.

## Features

### Core Functionality
- **Role-Based Access Control**: Secure authentication with distinct roles for Admin, Volunteer, and Student.
- **Student Management**: Comprehensive tracking of student profiles, attendance, and progress.
- **Activity and Session Tracking**: Volunteers can manage educational activities and sessions.
- **Assessment System**: Tools for creating and managing student assessments.
- **Reporting and Analytics**: Generate reports on student performance, attendance, and volunteer activities.
- **Dashboard Views**: Customized dashboards for each user role with relevant data and actions.

### Admin Features
- Manage system operations and settings.
- Oversee students, volunteers, and reports.
- Configure assessments and activities.

### Volunteer Features
- Handle student data and activities.
- Track sessions and progress.
- Generate and view reports.

### Student Features
- View personal profile and dashboard.
- Monitor progress and reports.
- Access assessment results.

## Tech Stack

### Backend
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **JWT**: JSON Web Tokens for authentication.

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: HTTP client for API requests.

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables by creating a `.env` file in the backend directory with the following:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Ensure both backend and frontend servers are running.
2. Access the application at `http://localhost:5173` (default Vite port).
3. Register or log in with appropriate credentials based on your role (Admin, Volunteer, or Student).
4. Navigate through the dashboard to perform role-specific actions.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add a new student
- `PUT /api/students/:id` - Update student information
- `DELETE /api/students/:id` - Delete a student

### Activities
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Create a new activity

### Assessments
- `GET /api/assessments` - Get all assessments
- `POST /api/assessments` - Create a new assessment

### Sessions
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create a new session

### Users
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user information

## Contributing

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact the development team.
