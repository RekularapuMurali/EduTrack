export const mockStudents = [
  { _id: '1', name: 'Arjun Sharma', grade: '8th', school: 'Delhi Public School', status: 'active', volunteer: 'Priya Nair', points: 340, avatar: 'AS' },
  { _id: '2', name: 'Meera Patel', grade: '7th', school: 'Kendriya Vidyalaya', status: 'active', volunteer: 'Rahul Gupta', points: 210, avatar: 'MP' },
  { _id: '3', name: 'Rohan Kumar', grade: '9th', school: 'St. Xavier\'s', status: 'active', volunteer: 'Priya Nair', points: 480, avatar: 'RK' },
  { _id: '4', name: 'Anjali Singh', grade: '6th', school: 'Delhi Public School', status: 'inactive', volunteer: 'Neha Verma', points: 120, avatar: 'AS' },
  { _id: '5', name: 'Vikram Rao', grade: '10th', school: 'Kendriya Vidyalaya', status: 'active', volunteer: 'Rahul Gupta', points: 560, avatar: 'VR' },
  { _id: '6', name: 'Deepa Menon', grade: '8th', school: 'St. Xavier\'s', status: 'active', volunteer: 'Priya Nair', points: 295, avatar: 'DM' },
];

export const mockVolunteers = [
  { _id: 'v1', name: 'Priya Nair', email: 'priya@org.com', studentsCount: 3, sessionsThisMonth: 8, status: 'active', avatar: 'PN' },
  { _id: 'v2', name: 'Rahul Gupta', email: 'rahul@org.com', studentsCount: 2, sessionsThisMonth: 6, status: 'active', avatar: 'RG' },
  { _id: 'v3', name: 'Neha Verma', email: 'neha@org.com', studentsCount: 1, sessionsThisMonth: 3, status: 'active', avatar: 'NV' },
  { _id: 'v4', name: 'Amit Joshi', email: 'amit@org.com', studentsCount: 0, sessionsThisMonth: 0, status: 'inactive', avatar: 'AJ' },
];

export const mockAssessments = [
  { _id: 'a1', period: 'Q1 2024', overallScore: 74, subjects: [{ name: 'Math', score: 78 }, { name: 'Science', score: 72 }, { name: 'English', score: 68 }, { name: 'Hindi', score: 80 }] },
  { _id: 'a2', period: 'Q2 2024', overallScore: 79, subjects: [{ name: 'Math', score: 82 }, { name: 'Science', score: 76 }, { name: 'English', score: 74 }, { name: 'Hindi', score: 85 }] },
  { _id: 'a3', period: 'Q3 2024', overallScore: 83, subjects: [{ name: 'Math', score: 88 }, { name: 'Science', score: 80 }, { name: 'English', score: 78 }, { name: 'Hindi', score: 88 }] },
  { _id: 'a4', period: 'Q4 2024', overallScore: 87, subjects: [{ name: 'Math', score: 90 }, { name: 'Science', score: 85 }, { name: 'English', score: 82 }, { name: 'Hindi', score: 91 }] },
];

export const mockActivities = [
  { _id: 'act1', title: 'Tree Plantation Drive', type: 'tree_plantation', student: 'Arjun Sharma', points: 30, date: '2024-03-15', verified: true },
  { _id: 'act2', title: 'Recycling Workshop', type: 'recycling', student: 'Meera Patel', points: 20, date: '2024-03-18', verified: true },
  { _id: 'act3', title: 'Water Conservation Pledge', type: 'water_conservation', student: 'Rohan Kumar', points: 25, date: '2024-03-20', verified: false },
  { _id: 'act4', title: 'Energy Saving Campaign', type: 'energy_saving', student: 'Vikram Rao', points: 20, date: '2024-03-22', verified: true },
  { _id: 'act5', title: 'Community Garden', type: 'tree_plantation', student: 'Deepa Menon', points: 35, date: '2024-03-25', verified: false },
];

export const mockSessions = [
  { _id: 's1', student: 'Arjun Sharma', date: '2024-03-28', time: '10:00 AM', duration: 60, status: 'scheduled', topics: ['Algebra', 'Geometry'] },
  { _id: 's2', student: 'Meera Patel', date: '2024-03-26', time: '2:00 PM', duration: 45, status: 'completed', topics: ['Essay Writing'], attended: true },
  { _id: 's3', student: 'Rohan Kumar', date: '2024-03-27', time: '11:00 AM', duration: 60, status: 'scheduled', topics: ['Physics', 'Chemistry'] },
  { _id: 's4', student: 'Vikram Rao', date: '2024-03-25', time: '3:00 PM', duration: 90, status: 'completed', topics: ['Board Exam Prep'], attended: true },
  { _id: 's5', student: 'Deepa Menon', date: '2024-03-24', time: '9:00 AM', duration: 60, status: 'cancelled', topics: ['Science'] },
];

export const progressChartData = [
  { month: 'Jan', score: 62, activities: 4 },
  { month: 'Feb', score: 68, activities: 6 },
  { month: 'Mar', score: 71, activities: 5 },
  { month: 'Apr', score: 75, activities: 8 },
  { month: 'May', score: 79, activities: 7 },
  { month: 'Jun', score: 83, activities: 10 },
];

export const adminStats = {
  totalStudents: 124,
  totalVolunteers: 18,
  activeSessions: 47,
  activitiesThisMonth: 89,
  avgProgress: 76,
  completionRate: 82,
};