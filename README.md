# EduTrack

EduTrack is a full-stack MERN application designed to streamline educational tracking and management. It features role-based authentication where admins oversee system operations, volunteers manage student data and activities, and students can monitor their progress and access reports. This platform aims to enhance educational initiatives by providing a centralized system for tracking student attendance, assessments, sessions, and overall progress.

## 🎯 Key Features

1. **Responsive Landing Page**
   - Introduction to EduTrack and its mission
   - Overview of projects and impact
   - Call-to-action buttons for getting involved and donations

2. **User Authentication Module**
   - Role-based access for Admin, Volunteer, and Student
   - Secure login, signup, and password recovery
   - JWT-based authentication

3. **Dynamic Dashboards (Role-based)**
   - **Admin Dashboard**: Manage users, approve activities, view analytics and reports
   - **Volunteer Dashboard**: View and manage tasks, student data, sessions, and progress tracking
   - **Student Dashboard**: Monitor personal progress, view assessments, and access reports

4. **Student Management**
   - Comprehensive student profiles
   - Attendance tracking
   - Assessment management
   - Progress monitoring

5. **Activity and Session Management**
   - Create and manage educational activities
   - Schedule and track sessions
   - Volunteer assignment to activities

6. **Reports and Analytics**
   - Generate detailed reports for admins and volunteers
   - Student progress analytics
   - Impact measurement tools

7. **Donation and Support System**
   - Secure donation forms
   - Integration with payment gateways
   - Volunteer time tracking

8. **Impact Stories and Media Gallery**
   - Showcase success stories and testimonials
   - Media upload and display functionality
   - Performance-optimized gallery with lazy loading

## 🧠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React.js with Vite |
| **Backend** | Node.js with Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT (JSON Web Tokens) |
| **Styling** | TailwindCSS |
| **State Management** | React Context API |
| **API Calls** | Axios |
| **Build Tool** | Vite |
| **Linting** | ESLint |

## 🛠️ Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add necessary environment variables (e.g., MongoDB URI, JWT secret)

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173` (default Vite port)

## 📁 Project Structure

```
EduTrack/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Activity.js
│   │   ├── Assessment.js
│   │   ├── Attendance.js
│   │   ├── Session.js
│   │   ├── Student.js
│   │   └── User.js
│   ├── routes/
│   │   ├── activities.js
│   │   ├── assessments.js
│   │   ├── auth.js
│   │   ├── sessions.js
│   │   ├── students.js
│   │   └── users.js
│   ├── package.json
│   ├── server.js
│   └── asmt.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Topbar.jsx
│   │   │   └── ui/
│   │   │       └── index.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── data/
│   │   │   └── mockData.js
│   │   ├── pages/
│   │   │   ├── DonatePage.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ImpactStories.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProjectListing.jsx
│   │   │   ├── PublicLanding.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ReportsPage.jsx
│   │   │   │   ├── SettingsPage.jsx
│   │   │   │   ├── StudentsPage.jsx
│   │   │   │   └── VolunteersPage.jsx
│   │   │   ├── student/
│   │   │   │   ├── ProfilePage.jsx
│   │   │   │   └── StudentDashboard.jsx
│   │   │   └── volunteer/
│   │   │       ├── ActivitiesPage.jsx
│   │   │       ├── ProgressPage.jsx
│   │   │       ├── ReportsPage.jsx
│   │   │       ├── SessionsPage.jsx
│   │   │       └── VolunteerDashboard.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── index.js
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── LICENSE
└── README.md
```

## 🚀 Usage

1. **Admin Users**: Can access the admin dashboard to manage users, view reports, and oversee system operations.

2. **Volunteers**: Can log in to manage student data, track attendance, create assessments, and monitor student progress.

3. **Students**: Can view their personal dashboard, check progress reports, and access assessment results.

4. **Public Access**: Visitors can view the landing page, learn about the platform, and make donations.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please open an issue in this repository.
