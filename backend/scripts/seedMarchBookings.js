/**
 * Seed Script: March 7-11, 2026 Bookings for 150 Students
 * Seeds Breakfast, Lunch, and Dinner for all five days.
 * NON-DESTRUCTIVE: uses upsert patterns; does NOT wipe existing data.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import Menu from '../models/Menu.model.js';
import Booking from '../models/Booking.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-food-db';

const TARGET_DATES = ['2026-03-07', '2026-03-08', '2026-03-09', '2026-03-10', '2026-03-11'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];
const TOTAL_STUDENTS = 150;

const MEAL_TIMINGS = {
  Breakfast: '7:30 AM - 9:30 AM',
  Lunch: '12:00 PM - 2:00 PM',
  Dinner: '7:00 PM - 9:00 PM',
};

const MENU_ITEMS = {
  Breakfast: [
    ['Idli (3 pcs)', 'Sambar', 'Coconut Chutney', 'Tea/Coffee'],      // Saturday  = index 6 → day % 7
    ['Poha', 'Jalebi', 'Banana', 'Tea/Coffee'],                        // Sunday    = 0
    ['Upma', 'Coconut Chutney', 'Fruit', 'Tea/Coffee'],                // Monday    = 1
    ['Paratha (2 pcs)', 'Curd', 'Pickle', 'Tea/Coffee'],               // Tuesday   = 2
    ['Dosa', 'Sambar', 'Chutney', 'Tea/Coffee'],                       // Wednesday = 3
    ['Puri Bhaji', 'Halwa', 'Tea/Coffee'],                             // Thursday  = 4
    ['Bread Butter', 'Cornflakes', 'Boiled Eggs', 'Tea/Coffee'],       // Friday    = 5
  ],
  Lunch: [
    ['Dal Tadka', 'Steamed Rice', 'Chapati (2)', 'Aloo Gobi', 'Salad', 'Papad'],
    ['Rajma', 'Jeera Rice', 'Roti (2)', 'Cabbage Sabzi', 'Curd', 'Salad'],
    ['Chole', 'Bhature (2)', 'Raita', 'Onion Salad', 'Pickle'],
    ['Dal Makhani', 'Butter Naan (2)', 'Paneer Tikka Masala', 'Salad'],
    ['Sambar', 'Rasam', 'Steamed Rice', 'Roti (2)', 'Beans Poriyal', 'Papad'],
    ['Yellow Dal', 'Steamed Rice', 'Phulka (2)', 'Methi Sabzi', 'Buttermilk'],
    ['Mixed Dal', 'Veg Biryani', 'Raita', 'Papad', 'Sweet'],
  ],
  Dinner: [
    ['Roti (2)', 'Paneer Butter Masala', 'Dal Fry', 'Rice', 'Kheer'],
    ['Naan (2)', 'Mix Veg', 'Raita', 'Gulab Jamun'],
    ['Phulka (3)', 'Palak Paneer', 'Dal Makhani', 'Rice', 'Ice Cream'],
    ['Roti (2)', 'Aloo Matar', 'Dal', 'Rice', 'Halwa'],
    ['Chapati (2)', 'Kadhai Paneer', 'Raita', 'Rice', 'Fruit Custard'],
    ['Paratha (2)', 'Curd', 'Mix Veg', 'Dal', 'Rice'],
    ['Roti (2)', 'Chana Masala', 'Raita', 'Khichdi', 'Papad'],
  ],
};

// Day-of-week index (0=Sun, 1=Mon, ..., 6=Sat) → menu array index
// The arrays above are ordered Sun=0, Mon=1, ..., Sat=6
const getMenuItemsForDate = (dateStr, mealType) => {
  const dow = new Date(dateStr).getDay(); // 0-6
  return MENU_ITEMS[mealType][dow];
};

// Generate student records (non-duplicate emails)
const generateStudentData = (count) => {
  const hostels = ['A', 'B', 'C', 'D', 'E', 'F'];
  const students = [];
  for (let i = 1; i <= count; i++) {
    students.push({
      name: `Student ${i}`,
      email: `student${i}@campus.com`,
      password: 'student123',
      role: 'student',
      hostel: hostels[(i - 1) % hostels.length],
      room: `${100 + ((i - 1) % 50)}`,
    });
  }
  return students;
};

const run = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // --- 1. Ensure 150 student users exist ---
    console.log(`👥 Ensuring ${TOTAL_STUDENTS} student users exist...`);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('student123', salt);

    const studentData = generateStudentData(TOTAL_STUDENTS);
    let createdCount = 0;
    let existingCount = 0;

    const studentUsers = [];
    for (const s of studentData) {
      const existing = await User.findOne({ email: s.email });
      if (existing) {
        studentUsers.push(existing);
        existingCount++;
      } else {
        const created = await User.create({ ...s, password: hashedPassword });
        studentUsers.push(created);
        createdCount++;
      }
    }
    console.log(`   Created: ${createdCount}, Already existed: ${existingCount}`);
    console.log(`✅ ${studentUsers.length} student users ready\n`);

    // --- 2. Ensure menus exist for each date + meal type ---
    console.log('📋 Ensuring menus exist for March 7–11...');
    const menuMap = {}; // key: "date|mealType" → Menu doc

    for (const date of TARGET_DATES) {
      for (const mealType of MEAL_TYPES) {
        const key = `${date}|${mealType}`;
        let menu = await Menu.findOne({ date, mealType });
        if (!menu) {
          menu = await Menu.create({
            date,
            mealType,
            items: getMenuItemsForDate(date, mealType),
            timing: MEAL_TIMINGS[mealType],
            isActive: true,
          });
          console.log(`   ✅ Created menu: ${date} ${mealType}`);
        } else {
          console.log(`   ⏭  Existing menu: ${date} ${mealType}`);
        }
        menuMap[key] = menu;
      }
    }
    console.log('✅ All menus ready\n');

    // --- 3. Create bookings ---
    console.log('🎫 Creating bookings (150 students × 3 meals × 5 days = 2250 expected)...');
    const TODAY = '2026-03-11';
    let bookedNew = 0;
    let skippedDuplicate = 0;

    for (const date of TARGET_DATES) {
      const isPast = date < TODAY;
      // Past dates → Attended, today → Booked
      const status = isPast ? 'Attended' : 'Booked';

      for (const mealType of MEAL_TYPES) {
        const menu = menuMap[`${date}|${mealType}`];

        // Build all docs for this slot
        const bookingDocs = studentUsers.map((student) => {
          const doc = {
            student: student._id,
            menu: menu._id,
            date,
            mealType,
            status,
            specialRequest: '',
          };
          if (status === 'Attended') {
            doc.attendedAt = new Date(`${date}T10:00:00.000Z`);
          }
          return doc;
        });

        // insertMany with ordered:false — MongoDB skips duplicates via unique index
        try {
          const result = await Booking.insertMany(bookingDocs, { ordered: false });
          bookedNew += result.length;
          console.log(`   ✅ ${date} ${mealType}: +${result.length} bookings (${status})`);
        } catch (err) {
          // BulkWriteError: duplicates are skipped, count what was inserted
          if (err.name === 'MongoBulkWriteError' || err.code === 11000) {
            const inserted = err.result?.insertedCount ?? 0;
            const dupes = bookingDocs.length - inserted;
            bookedNew += inserted;
            skippedDuplicate += dupes;
            console.log(`   ⚠️  ${date} ${mealType}: +${inserted} new, ${dupes} duplicates skipped`);
          } else {
            throw err;
          }
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Done!`);
    console.log(`   New bookings created : ${bookedNew}`);
    console.log(`   Duplicates skipped   : ${skippedDuplicate}`);
    console.log(`   Total target         : ${TOTAL_STUDENTS * MEAL_TYPES.length * TARGET_DATES.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

run();
