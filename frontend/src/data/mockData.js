// src/data/mockData.js
// All placeholder data. Replace each export with real API calls in Week 2.

export const mockStudents = [
  {
    _id: '1',
    name: 'Arjun Sharma',
    grade: '8th',
    school: 'Delhi Public School',
    status: 'active',
    volunteer: 'Priya Nair',
    points: 340,
    dateOfBirth: '2009-04-12',
    parentName: 'Ramesh Sharma',
    parentPhone: '+91 98765 43210',
    address: 'Sector 14, Noida',
  },
  {
    _id: '2',
    name: 'Meera Patel',
    grade: '7th',
    school: 'Kendriya Vidyalaya',
    status: 'active',
    volunteer: 'Rahul Gupta',
    points: 210,
    dateOfBirth: '2010-08-22',
    parentName: 'Suresh Patel',
    parentPhone: '+91 87654 32109',
    address: 'Vasant Kunj, Delhi',
  },
  {
    _id: '3',
    name: 'Rohan Kumar',
    grade: '9th',
    school: "St. Xavier's",
    status: 'active',
    volunteer: 'Priya Nair',
    points: 480,
    dateOfBirth: '2008-11-05',
    parentName: 'Vijay Kumar',
    parentPhone: '+91 76543 21098',
    address: 'Lajpat Nagar, Delhi',
  },
  {
    _id: '4',
    name: 'Anjali Singh',
    grade: '6th',
    school: 'Delhi Public School',
    status: 'inactive',
    volunteer: 'Neha Verma',
    points: 120,
    dateOfBirth: '2011-02-18',
    parentName: 'Anil Singh',
    parentPhone: '+91 65432 10987',
    address: 'Rohini, Delhi',
  },
  {
    _id: '5',
    name: 'Vikram Rao',
    grade: '10th',
    school: 'Kendriya Vidyalaya',
    status: 'active',
    volunteer: 'Rahul Gupta',
    points: 560,
    dateOfBirth: '2007-07-30',
    parentName: 'Srinivas Rao',
    parentPhone: '+91 54321 09876',
    address: 'Saket, Delhi',
  },
  {
    _id: '6',
    name: 'Deepa Menon',
    grade: '8th',
    school: "St. Xavier's",
    status: 'active',
    volunteer: 'Priya Nair',
    points: 295,
    dateOfBirth: '2009-09-14',
    parentName: 'Krishnan Menon',
    parentPhone: '+91 43210 98765',
    address: 'Dwarka, Delhi',
  },
];

export const mockVolunteers = [
  { _id: 'v1', name: 'Priya Nair',   email: 'priya@edutrack.org',  studentsCount: 3, sessionsThisMonth: 8, status: 'active'   },
  { _id: 'v2', name: 'Rahul Gupta',  email: 'rahul@edutrack.org',  studentsCount: 2, sessionsThisMonth: 6, status: 'active'   },
  { _id: 'v3', name: 'Neha Verma',   email: 'neha@edutrack.org',   studentsCount: 1, sessionsThisMonth: 3, status: 'active'   },
  { _id: 'v4', name: 'Amit Joshi',   email: 'amit@edutrack.org',   studentsCount: 0, sessionsThisMonth: 0, status: 'inactive' },
];

export const mockSessions = [
  { _id: 's1', student: 'Arjun Sharma', date: '2024-03-28', time: '10:00 AM', duration: 60, status: 'scheduled',  topics: ['Algebra', 'Geometry']    },
  { _id: 's2', student: 'Meera Patel',  date: '2024-03-26', time: '2:00 PM',  duration: 45, status: 'completed',  topics: ['Essay Writing'], attended: true },
  { _id: 's3', student: 'Rohan Kumar',  date: '2024-03-27', time: '11:00 AM', duration: 60, status: 'scheduled',  topics: ['Physics', 'Chemistry']   },
  { _id: 's4', student: 'Vikram Rao',   date: '2024-03-25', time: '3:00 PM',  duration: 90, status: 'completed',  topics: ['Board Exam Prep'], attended: true },
  { _id: 's5', student: 'Deepa Menon',  date: '2024-03-24', time: '9:00 AM',  duration: 60, status: 'cancelled',  topics: ['Science']                },
];

export const mockActivities = [
  { _id: 'a1', title: 'Tree Plantation Drive',      type: 'tree_plantation',    student: 'Arjun Sharma', points: 30, date: '2024-03-15', verified: true  },
  { _id: 'a2', title: 'Recycling Workshop',         type: 'recycling',          student: 'Meera Patel',  points: 20, date: '2024-03-18', verified: true  },
  { _id: 'a3', title: 'Water Conservation Pledge',  type: 'water_conservation', student: 'Rohan Kumar',  points: 25, date: '2024-03-20', verified: false },
  { _id: 'a4', title: 'Energy Saving Campaign',     type: 'energy_saving',      student: 'Vikram Rao',   points: 20, date: '2024-03-22', verified: true  },
  { _id: 'a5', title: 'Community Garden Project',   type: 'tree_plantation',    student: 'Deepa Menon',  points: 35, date: '2024-03-25', verified: false },
];

export const mockAssessments = [
  { _id: 'q1', period: 'Q1 2024', overallScore: 74, subjects: [{ name: 'Math', score: 78 }, { name: 'Science', score: 72 }, { name: 'English', score: 68 }, { name: 'Hindi', score: 80 }] },
  { _id: 'q2', period: 'Q2 2024', overallScore: 79, subjects: [{ name: 'Math', score: 82 }, { name: 'Science', score: 76 }, { name: 'English', score: 74 }, { name: 'Hindi', score: 85 }] },
  { _id: 'q3', period: 'Q3 2024', overallScore: 83, subjects: [{ name: 'Math', score: 88 }, { name: 'Science', score: 80 }, { name: 'English', score: 78 }, { name: 'Hindi', score: 88 }] },
  { _id: 'q4', period: 'Q4 2024', overallScore: 87, subjects: [{ name: 'Math', score: 90 }, { name: 'Science', score: 85 }, { name: 'English', score: 82 }, { name: 'Hindi', score: 91 }] },
];

export const progressChartData = [
  { month: 'Aug', score: 62, activities: 3 },
  { month: 'Sep', score: 66, activities: 5 },
  { month: 'Oct', score: 70, activities: 4 },
  { month: 'Nov', score: 74, activities: 7 },
  { month: 'Dec', score: 79, activities: 6 },
  { month: 'Jan', score: 83, activities: 9 },
];

export const adminOverviewData = [
  { month: 'Aug', students: 98,  sessions: 210 },
  { month: 'Sep', students: 105, sessions: 238 },
  { month: 'Oct', students: 110, sessions: 255 },
  { month: 'Nov', students: 115, sessions: 270 },
  { month: 'Dec', students: 118, sessions: 285 },
  { month: 'Jan', students: 124, sessions: 312 },
];

export const activityDistribution = [
  { name: 'Tree Plantation', value: 38, color: '#166534' },
  { name: 'Recycling',       value: 24, color: '#15803D' },
  { name: 'Water Saving',    value: 20, color: '#4ADE80' },
  { name: 'Energy Saving',   value: 18, color: '#86EFAC' },
];

export const adminStats = {
  totalStudents: 124,
  totalVolunteers: 18,
  activeSessionsMonth: 47,
  activitiesThisMonth: 89,
  avgProgressScore: 76,
  completionRate: 82,
};

export const demoAccounts = {
  admin:     { name: 'Kavita Reddy', email: 'admin@edutrack.org',  role: 'admin',     avatar: 'KR' },
  volunteer: { name: 'Priya Nair',   email: 'priya@edutrack.org',  role: 'volunteer', avatar: 'PN' },
  student:   { name: 'Arjun Sharma', email: 'arjun@student.org',   role: 'student',   avatar: 'AS' },
};