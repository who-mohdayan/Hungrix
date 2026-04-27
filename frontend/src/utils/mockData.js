// ⚠️ DEPRECATED - This file is no longer used in the application
// The application now uses a full backend API instead of localStorage and mock data
// This file is kept for reference purposes only
//
// All data now comes from:
// - Backend API: e:\Campus Food\Campus-Food-Intelligence-System\Backend
// - API Service: src/services/api.js
// - Context Providers: src/context/*.jsx
//
// For sample data, see: Backend/seeders/index.js

// Mock data for Dinex
// NOTE: Passwords stored in plain text for demo/mock purposes ONLY.
// Production implementations must use secure password hashing (e.g., bcrypt).

export const adminUser = {
  id: 0,
  name: 'Admin User',
  email: 'admin@campus.com',
  password: 'admin123',
  role: 'admin',
};

export const mockStudents = [
  { id: 1, name: 'Aarav Sharma', email: 'student@campus.com', password: 'student123', hostel: 'A', room: '101', accountabilityScore: 92, attendanceRate: 94, totalBookings: 78 },
  { id: 2, name: 'Priya Patel', email: 'priya@campus.com', password: 'pass123', hostel: 'B', room: '205', accountabilityScore: 85, attendanceRate: 88, totalBookings: 65 },
  { id: 3, name: 'Rohan Gupta', email: 'rohan@campus.com', password: 'pass123', hostel: 'A', room: '112', accountabilityScore: 45, attendanceRate: 52, totalBookings: 40 },
  { id: 4, name: 'Sneha Reddy', email: 'sneha@campus.com', password: 'pass123', hostel: 'C', room: '301', accountabilityScore: 78, attendanceRate: 82, totalBookings: 70 },
  { id: 5, name: 'Karan Singh', email: 'karan@campus.com', password: 'pass123', hostel: 'D', room: '408', accountabilityScore: 95, attendanceRate: 97, totalBookings: 88 },
  { id: 6, name: 'Ananya Iyer', email: 'ananya@campus.com', password: 'pass123', hostel: 'E', room: '502', accountabilityScore: 62, attendanceRate: 68, totalBookings: 55 },
  { id: 7, name: 'Vikram Nair', email: 'vikram@campus.com', password: 'pass123', hostel: 'B', room: '210', accountabilityScore: 88, attendanceRate: 90, totalBookings: 75 },
  { id: 8, name: 'Meera Joshi', email: 'meera@campus.com', password: 'pass123', hostel: 'C', room: '315', accountabilityScore: 55, attendanceRate: 60, totalBookings: 42 },
  { id: 9, name: 'Arjun Kumar', email: 'arjun@campus.com', password: 'pass123', hostel: 'A', room: '105', accountabilityScore: 72, attendanceRate: 76, totalBookings: 63 },
  { id: 10, name: 'Deepika Verma', email: 'deepika@campus.com', password: 'pass123', hostel: 'D', room: '412', accountabilityScore: 91, attendanceRate: 93, totalBookings: 82 },
  { id: 11, name: 'Rahul Mehta', email: 'rahul@campus.com', password: 'pass123', hostel: 'E', room: '508', accountabilityScore: 38, attendanceRate: 44, totalBookings: 30 },
  { id: 12, name: 'Kavya Pillai', email: 'kavya@campus.com', password: 'pass123', hostel: 'B', room: '218', accountabilityScore: 80, attendanceRate: 84, totalBookings: 71 },
  { id: 13, name: 'Siddharth Mishra', email: 'siddharth@campus.com', password: 'pass123', hostel: 'C', room: '308', accountabilityScore: 66, attendanceRate: 71, totalBookings: 58 },
  { id: 14, name: 'Tanvi Desai', email: 'tanvi@campus.com', password: 'pass123', hostel: 'A', room: '118', accountabilityScore: 87, attendanceRate: 89, totalBookings: 76 },
  { id: 15, name: 'Aditya Banerjee', email: 'aditya@campus.com', password: 'pass123', hostel: 'D', room: '404', accountabilityScore: 74, attendanceRate: 78, totalBookings: 66 },
  { id: 16, name: 'Pooja Chauhan', email: 'pooja@campus.com', password: 'pass123', hostel: 'E', room: '514', accountabilityScore: 93, attendanceRate: 95, totalBookings: 85 },
  { id: 17, name: 'Nikhil Saxena', email: 'nikhil@campus.com', password: 'pass123', hostel: 'B', room: '222', accountabilityScore: 48, attendanceRate: 54, totalBookings: 36 },
  { id: 18, name: 'Riya Agarwal', email: 'riya@campus.com', password: 'pass123', hostel: 'C', room: '312', accountabilityScore: 82, attendanceRate: 86, totalBookings: 73 },
  { id: 19, name: 'Suresh Pandey', email: 'suresh@campus.com', password: 'pass123', hostel: 'A', room: '108', accountabilityScore: 70, attendanceRate: 74, totalBookings: 61 },
  { id: 20, name: 'Shreya Kulkarni', email: 'shreya@campus.com', password: 'pass123', hostel: 'D', room: '416', accountabilityScore: 84, attendanceRate: 87, totalBookings: 74 },
  { id: 21, name: 'Amit Tiwari', email: 'amit@campus.com', password: 'pass123', hostel: 'E', room: '506', accountabilityScore: 56, attendanceRate: 62, totalBookings: 48 },
  { id: 22, name: 'Nisha Bose', email: 'nisha@campus.com', password: 'pass123', hostel: 'B', room: '214', accountabilityScore: 89, attendanceRate: 91, totalBookings: 79 },
  { id: 23, name: 'Gaurav Yadav', email: 'gaurav@campus.com', password: 'pass123', hostel: 'C', room: '320', accountabilityScore: 43, attendanceRate: 50, totalBookings: 32 },
  { id: 24, name: 'Isha Kapoor', email: 'isha@campus.com', password: 'pass123', hostel: 'A', room: '115', accountabilityScore: 77, attendanceRate: 81, totalBookings: 68 },
  { id: 25, name: 'Pranav Ghosh', email: 'pranav@campus.com', password: 'pass123', hostel: 'D', room: '420', accountabilityScore: 96, attendanceRate: 98, totalBookings: 90 },
  { id: 26, name: 'Divya Malhotra', email: 'divya@campus.com', password: 'pass123', hostel: 'E', room: '510', accountabilityScore: 64, attendanceRate: 69, totalBookings: 54 },
  { id: 27, name: 'Tushar Sinha', email: 'tushar@campus.com', password: 'pass123', hostel: 'B', room: '206', accountabilityScore: 81, attendanceRate: 85, totalBookings: 72 },
  { id: 28, name: 'Palak Jain', email: 'palak@campus.com', password: 'pass123', hostel: 'C', room: '304', accountabilityScore: 69, attendanceRate: 73, totalBookings: 60 },
  { id: 29, name: 'Harsh Trivedi', email: 'harsh@campus.com', password: 'pass123', hostel: 'A', room: '120', accountabilityScore: 86, attendanceRate: 88, totalBookings: 77 },
  { id: 30, name: 'Simran Dhawan', email: 'simran@campus.com', password: 'pass123', hostel: 'D', room: '410', accountabilityScore: 99, attendanceRate: 100, totalBookings: 92 },
];

const today = new Date();
const formatDate = (d) => d.toISOString().split('T')[0];

const getDateMinus = (days) => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return formatDate(d);
};

const getDatePlus = (days) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

export const mockBookings = [
  ...Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    studentId: 1,
    studentName: 'Aarav Sharma',
    date: getDateMinus(i + 1),
    mealType: mealTypes[i % 3],
    status: i % 7 === 0 ? 'Missed' : i % 11 === 0 ? 'Cancelled' : 'Attended',
    menuItems: i % 3 === 0 ? ['Idli', 'Sambar', 'Chutney'] : i % 3 === 1 ? ['Dal Tadka', 'Rice', 'Roti', 'Sabzi'] : ['Roti', 'Paneer Butter Masala', 'Raita'],
    specialRequest: i % 5 === 0 ? 'Less spicy please' : '',
  })),
  { id: 31, studentId: 1, studentName: 'Aarav Sharma', date: formatDate(today), mealType: 'Breakfast', status: 'Attended', menuItems: ['Poha', 'Tea', 'Banana'], specialRequest: '' },
  { id: 32, studentId: 1, studentName: 'Aarav Sharma', date: formatDate(today), mealType: 'Lunch', status: 'Upcoming', menuItems: ['Dal Makhani', 'Rice', 'Roti', 'Aloo Gobi'], specialRequest: '' },
  { id: 33, studentId: 1, studentName: 'Aarav Sharma', date: formatDate(today), mealType: 'Dinner', status: 'Upcoming', menuItems: ['Chole', 'Bhature', 'Kheer'], specialRequest: '' },
  { id: 34, studentId: 1, studentName: 'Aarav Sharma', date: getDatePlus(1), mealType: 'Breakfast', status: 'Upcoming', menuItems: ['Upma', 'Chutney', 'Coffee'], specialRequest: '' },
  { id: 35, studentId: 1, studentName: 'Aarav Sharma', date: getDatePlus(2), mealType: 'Lunch', status: 'Upcoming', menuItems: ['Rajma', 'Rice', 'Chapati', 'Salad'], specialRequest: 'Extra dal' },
  ...Array.from({ length: 65 }, (_, i) => ({
    id: 36 + i,
    studentId: (i % 29) + 2,
    studentName: mockStudents[(i % 29) + 1]?.name || 'Student',
    date: getDateMinus(i % 60),
    mealType: mealTypes[i % 3],
    status: i % 8 === 0 ? 'Missed' : i % 12 === 0 ? 'Cancelled' : 'Attended',
    menuItems: i % 3 === 0 ? ['Idli', 'Sambar', 'Chutney'] : i % 3 === 1 ? ['Dal Tadka', 'Rice', 'Roti', 'Sabzi'] : ['Roti', 'Paneer Butter Masala', 'Raita'],
    specialRequest: '',
  })),
];

const indianBreakfast = [
  ['Idli (3 pcs)', 'Sambar', 'Coconut Chutney', 'Tea/Coffee'],
  ['Poha', 'Jalebi', 'Banana', 'Tea/Coffee'],
  ['Upma', 'Coconut Chutney', 'Fruit', 'Tea/Coffee'],
  ['Paratha (2 pcs)', 'Curd', 'Pickle', 'Tea/Coffee'],
  ['Dosa', 'Sambar', 'Chutney', 'Tea/Coffee'],
  ['Puri Bhaji', 'Halwa', 'Tea/Coffee'],
  ['Bread Butter', 'Cornflakes', 'Boiled Eggs', 'Tea/Coffee'],
];

const indianLunch = [
  ['Dal Tadka', 'Steamed Rice', 'Chapati (2)', 'Aloo Gobi', 'Salad', 'Papad'],
  ['Rajma', 'Jeera Rice', 'Roti (2)', 'Cabbage Sabzi', 'Curd', 'Salad'],
  ['Chole', 'Bhature (2)', 'Raita', 'Onion Salad', 'Pickle'],
  ['Dal Makhani', 'Butter Naan (2)', 'Paneer Tikka Masala', 'Salad'],
  ['Sambar', 'Rasam', 'Steamed Rice', 'Roti (2)', 'Beans Poriyal', 'Papad'],
  ['Yellow Dal', 'Steamed Rice', 'Phulka (2)', 'Methi Sabzi', 'Buttermilk'],
  ['Mixed Dal', 'Veg Biryani', 'Raita', 'Papad', 'Sweet'],
];

const indianDinner = [
  ['Roti (2)', 'Paneer Butter Masala', 'Dal Fry', 'Rice', 'Kheer'],
  ['Naan (2)', 'Butter Chicken (Veg)', 'Mix Veg', 'Raita', 'Gulab Jamun'],
  ['Phulka (3)', 'Palak Paneer', 'Dal Makhani', 'Rice', 'Ice Cream'],
  ['Roti (2)', 'Aloo Matar', 'Dal', 'Rice', 'Halwa'],
  ['Chapati (2)', 'Kadhai Paneer', 'Raita', 'Rice', 'Fruit Custard'],
  ['Paratha (2)', 'Curd', 'Mix Veg', 'Dal', 'Rice'],
  ['Roti (2)', 'Chana Masala', 'Raita', 'Khichdi', 'Papad'],
];

export const mockMenus = Array.from({ length: 14 }, (_, i) => {
  const date = i < 7 ? getDateMinus(7 - i) : getDatePlus(i - 7);
  return [
    { id: i * 3 + 1, date, mealType: 'Breakfast', items: indianBreakfast[i % 7], timing: '7:30 AM - 9:30 AM' },
    { id: i * 3 + 2, date, mealType: 'Lunch', items: indianLunch[i % 7], timing: '12:00 PM - 2:00 PM' },
    { id: i * 3 + 3, date, mealType: 'Dinner', items: indianDinner[i % 7], timing: '7:00 PM - 9:00 PM' },
  ];
}).flat();

export const predictionData = Array.from({ length: 7 }, (_, i) => {
  const date = getDatePlus(i);
  const base = 280 + Math.floor(Math.random() * 60);
  return {
    date,
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date).getDay()],
    predictedBreakfast: Math.floor(base * 0.65),
    predictedLunch: Math.floor(base * 1.1),
    predictedDinner: Math.floor(base * 0.9),
    confidenceLow: Math.floor(base * 0.85),
    confidenceHigh: Math.floor(base * 1.15),
    factors: ['Exam week', 'Weekend', 'Holiday'][i % 3] || 'Normal day',
  };
});

export const analyticsData = Array.from({ length: 30 }, (_, i) => {
  const date = getDateMinus(29 - i);
  const bookings = 250 + Math.floor(Math.random() * 100);
  const attendance = Math.floor(bookings * (0.75 + Math.random() * 0.2));
  const waste = Math.floor((bookings - attendance) * 0.3);
  return {
    date,
    day: i + 1,
    bookings,
    attendance,
    missed: bookings - attendance,
    waste,
    wasteReduction: Math.floor(15 + Math.random() * 25),
    breakfastBookings: Math.floor(bookings * 0.3),
    lunchBookings: Math.floor(bookings * 0.42),
    dinnerBookings: Math.floor(bookings * 0.28),
  };
});

export const sustainabilityMetrics = {
  co2Saved: 2847,
  waterSaved: 15420,
  costSavings: 184500,
  foodWasteReduced: 1245,
  wasteReductionPercent: 34,
  mealsSaved: 8920,
  treesEquivalent: 142,
};

export const mealPopularity = [
  { name: 'Breakfast', value: 28, color: '#f59e0b' },
  { name: 'Lunch', value: 42, color: '#10b981' },
  { name: 'Dinner', value: 30, color: '#6366f1' },
];
