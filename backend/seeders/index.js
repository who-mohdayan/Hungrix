import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import Menu from '../models/Menu.model.js';
import Booking from '../models/Booking.model.js';
import DishPopularity from '../models/DishPopularity.model.js';
import dishPopularityData from './dishPopularityData.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-food-db';

// Sample users data
const usersData = [
  {
    name: 'Admin User',
    email: 'admin@campus.com',
    password: 'admin123',
    role: 'admin'
  },
  { name: 'Aarav Sharma', email: 'student@campus.com', password: 'student123', hostel: 'A', room: '101', accountabilityScore: 92, attendanceRate: 94, totalBookings: 78 },
  { name: 'Priya Patel', email: 'priya@campus.com', password: 'pass123', hostel: 'B', room: '205', accountabilityScore: 85, attendanceRate: 88, totalBookings: 65 },
  { name: 'Rohan Gupta', email: 'rohan@campus.com', password: 'pass123', hostel: 'A', room: '112', accountabilityScore: 45, attendanceRate: 52, totalBookings: 40 },
  { name: 'Sneha Reddy', email: 'sneha@campus.com', password: 'pass123', hostel: 'C', room: '301', accountabilityScore: 78, attendanceRate: 82, totalBookings: 70 },
  { name: 'Karan Singh', email: 'karan@campus.com', password: 'pass123', hostel: 'D', room: '408', accountabilityScore: 95, attendanceRate: 97, totalBookings: 88 },
  { name: 'Ananya Iyer', email: 'ananya@campus.com', password: 'pass123', hostel: 'E', room: '502', accountabilityScore: 62, attendanceRate: 68, totalBookings: 55 },
  { name: 'Vikram Nair', email: 'vikram@campus.com', password: 'pass123', hostel: 'B', room: '210', accountabilityScore: 88, attendanceRate: 90, totalBookings: 75 },
  { name: 'Meera Joshi', email: 'meera@campus.com', password: 'pass123', hostel: 'C', room: '315', accountabilityScore: 55, attendanceRate: 60, totalBookings: 42 },
  { name: 'Arjun Kumar', email: 'arjun@campus.com', password: 'pass123', hostel: 'A', room: '105', accountabilityScore: 72, attendanceRate: 76, totalBookings: 63 },
  { name: 'Deepika Verma', email: 'deepika@campus.com', password: 'pass123', hostel: 'D', room: '412', accountabilityScore: 91, attendanceRate: 93, totalBookings: 82 },
];

// Menu items data
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

const getDateOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const normalizeDishName = (name) => String(name)
  .toLowerCase()
  .replace(/\([^)]*\)/g, ' ')
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Menu.deleteMany({});
    await Booking.deleteMany({});
    await DishPopularity.deleteMany({});
    console.log('✅ Existing data cleared');

    // Seed dish popularity scores
    const dishDocs = dishPopularityData.map((dish) => ({
      ...dish,
      normalizedName: normalizeDishName(dish.name),
    }));
    await DishPopularity.insertMany(dishDocs);
    console.log(`✅ Created ${dishDocs.length} dish popularity scores`);

    // Create users
    console.log('👥 Creating users...');
    const users = await User.create(usersData);
    console.log(`✅ Created ${users.length} users`);

    // Create menus for 14 days (7 past, 7 future)
    console.log('📋 Creating menus...');
    const menus = [];
    for (let i = -7; i < 7; i++) {
      const date = getDateOffset(i);
      const dayIndex = (new Date(date).getDay() + 7) % 7;
      
      menus.push({
        date,
        mealType: 'Breakfast',
        items: indianBreakfast[dayIndex],
        timing: '7:30 AM - 9:30 AM'
      });

      menus.push({
        date,
        mealType: 'Lunch',
        items: indianLunch[dayIndex],
        timing: '12:00 PM - 2:00 PM'
      });

      menus.push({
        date,
        mealType: 'Dinner',
        items: indianDinner[dayIndex],
        timing: '7:00 PM - 9:00 PM'
      });
    }

    const createdMenus = await Menu.create(menus);
    console.log(`✅ Created ${createdMenus.length} menus`);

    // Create sample bookings
    console.log('🎫 Creating bookings...');
    const students = users.filter(u => u.role === 'student');
    const bookings = [];

    // Create bookings for the past 7 days
    for (let i = -7; i < 0; i++) {
      const date = getDateOffset(i);
      const dayMenus = createdMenus.filter(m => m.date === date);

      students.forEach((student, idx) => {
        dayMenus.forEach((menu, menuIdx) => {
          // Random chance of booking (80%)
          if (Math.random() > 0.2) {
            const statuses = ['Attended', 'Attended', 'Attended', 'Missed', 'Cancelled'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            bookings.push({
              student: student._id,
              menu: menu._id,
              date: date,
              mealType: menu.mealType,
              status: status,
              specialRequest: idx % 5 === 0 ? 'Less spicy please' : ''
            });
          }
        });
      });
    }

    // Create upcoming bookings
    for (let i = 0; i < 3; i++) {
      const date = getDateOffset(i);
      const dayMenus = createdMenus.filter(m => m.date === date);

      // First student gets all meals
      if (students.length > 0) {
        dayMenus.forEach(menu => {
          bookings.push({
            student: students[0]._id,
            menu: menu._id,
            date: date,
            mealType: menu.mealType,
            status: 'Upcoming',
            specialRequest: ''
          });
        });
      }

      // Other students get random meals
      students.slice(1).forEach((student, idx) => {
        if (Math.random() > 0.3) {
          const randomMenu = dayMenus[Math.floor(Math.random() * dayMenus.length)];
          bookings.push({
            student: student._id,
            menu: randomMenu._id,
            date: date,
            mealType: randomMenu.mealType,
            status: 'Upcoming',
            specialRequest: ''
          });
        }
      });
    }

    const createdBookings = await Booking.create(bookings);
    console.log(`✅ Created ${createdBookings.length} bookings`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${users.length} (1 admin, ${students.length} students)`);
    console.log(`   📋 Menus: ${createdMenus.length}`);
    console.log(`   🎫 Bookings: ${createdBookings.length}`);
    console.log('\n🔑 Login credentials:');
    console.log('   Admin: admin@campus.com / admin123');
    console.log('   Student: student@campus.com / student123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
