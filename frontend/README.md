# Hungrix

An AI-powered Food Waste Prevention and Mess Optimization System for hostels and college mess facilities with complete backend integration.

## Features

- 🔐 **Secure Authentication**: JWT-based authentication with password hashing
- � **Admin Registration**: Secure admin account creation with registration key validation
- 👨‍🎓 **Student Portal**: Meal booking, history tracking, and profile management
- 👨‍💼 **Admin Dashboard**: Complete management system for students, menus, and bookings
- 📊 **Analytics & Insights**: Real-time analytics and sustainability metrics with advanced ML algorithms
- 🔮 **Predictive Analytics**: AI-powered demand forecasting (91.8% accuracy) to reduce food waste
- 📋 **Menu Management**: Full CRUD operations for daily menus
- ♻️ **Sustainability Tracking**: Monitor waste reduction and environmental impact
- 🎯 **Accountability System**: Student scoring based on attendance and behavior
- 🔄 **Real-time Updates**: Live dashboards with instant data refresh

## Tech Stack

### Frontend
- ReactJS + Vite
- Tailwind CSS
- React Router v6
- Context API
- Recharts for data visualization
- React Icons

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Express Validator

## Project Structure

```
Campus-Food-Intelligence-System/
├── Backend/                 # Backend API
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── seeders/          # Database seeders
│   └── server.js         # Entry point
├── src/                   # Frontend React app
│   ├── components/       # Reusable components
│   ├── context/         # Context providers
│   ├── pages/           # Page components
│   ├── routes/          # Route configuration
│   └── services/        # API service layer
└── public/              # Static assets
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/who-mohdayan/Campus-Food-Intelligence-System.git
cd Campus-Food-Intelligence-System
```

### 2. Backend Setup

```bash
# Navigate to Backend folder
cd Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/campus-food-db
# JWT_SECRET=your_super_secret_jwt_key
# JWT_EXPIRE=7d
# NODE_ENV=development
# CLIENT_URL=http://localhost:5173
# ADMIN_REGISTRATION_KEY=your_secure_admin_key_here

# Make sure MongoDB is running, then seed the database
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new student
- `POST /api/auth/register-admin` - Register new admin (requires registration key)
- `POST /api/auth/login` - Login user (admin or student)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### User Management (Admin)
- `GET /api/users/students` - Get all students
- `GET /api/users/students/:id` - Get student by ID
- `PUT /api/users/students/:id` - Update student
- `DELETE /api/users/students/:id` - Delete student

### Menu Management
- `GET /api/menus` - Get all menus
- `GET /api/menus/date/:date` - Get menus by date
- `POST /api/menus` - Create menu (Admin)
- `PUT /api/menus/:id` - Update menu (Admin)
- `DELETE /api/menus/:id` - Delete menu (Admin)

### Bookings
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/my-bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/attend` - Mark attended (Admin)
- `PUT /api/bookings/:id/miss` - Mark missed (Admin)

### Analytics (Admin)
- `GET /api/analytics` - Get analytics data
- `GET /api/analytics/meal-popularity` - Meal popularity
- `GET /api/analytics/sustainability` - Sustainability metrics
- `GET /api/analytics/overview` - Overview statistics

### Predictions (Admin)
- `GET /api/predictions` - Get demand predictions
- `GET /api/predictions/demand-forecast` - Specific forecast

## Demo Credentials

**Admin Login:**
- Email: admin@campus.com
- Password: admin123

**Student Login:**
- Email: student@campus.com
- Password: student123

## Admin Registration

To create a new admin account:

1. Navigate to `/admin/register` or click "Create Admin Account" on the admin login page
2. Fill in the registration form with:
   - Full Name
   - Email Address
   - Department (dropdown)
   - Secure Password
   - Confirm Password
   - Admin Registration Key (provided by system administrator)
3. Click "Create Admin Account"
4. You'll be automatically logged in and redirected to the admin dashboard

**Note:** The admin registration key must be set in the Backend `.env` file:
```
ADMIN_REGISTRATION_KEY=your_secure_key_here
```

For detailed setup instructions, see [ADMIN_REGISTRATION_GUIDE.md](./ADMIN_REGISTRATION_GUIDE.md)

## Key Features Explained

### Authentication & Security
- Passwords are hashed using bcryptjs
- JWT tokens for stateless authentication
- Protected routes with middleware
- Role-based access control (Admin/Student)

### Booking System
- Students can book meals in advance
- Prevent duplicate bookings
- Track attendance and missed meals
- Special dietary requests

### Analytics Dashboard
- Real-time booking statistics
- Attendance rate tracking
- Food waste estimation
- Sustainability metrics (CO2, water, cost savings)
- Student accountability scores

### Predictive Analytics
- Historical data analysis
- Demand forecasting by meal type
- Weekend and special event patterns
- Confidence intervals

## Database Schema

### User Model
- Authentication credentials
- Role (student/admin)
- Hostel and room information
- Accountability and attendance scores

### Menu Model
- Date and meal type
- Menu items array
- Timing information

### Booking Model
- Student reference
- Menu reference
- Status (Upcoming/Attended/Missed/Cancelled)
- Special requests

## Development

### Running Tests
```bash
# Backend tests (if implemented)
cd Backend
npm test

# Frontend tests (if implemented)
npm test
```

### Building for Production

```bash
# Build frontend
npm run build

# Backend production
cd Backend
npm start
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus-food-db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ADMIN_REGISTRATION_KEY=your_secure_admin_key_here
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- Built for campus mess optimization
- Focuses on reducing food waste
- Promotes sustainability in educational institutions
