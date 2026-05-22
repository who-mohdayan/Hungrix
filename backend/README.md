# Campus Food Intelligence System - Backend

A comprehensive backend API for managing campus food services with intelligent booking and waste reduction features.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 User Management (Students & Admin)
- 📋 Menu Management
- 🎫 Meal Booking System
- 📊 Analytics & Reporting
- 🔮 Demand Predictions
- ♻️ Sustainability Metrics

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation

## Installation

1. Navigate to the Backend folder:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus-food-db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Database Setup

Make sure MongoDB is running on your system, then seed the database with sample data:

```bash
npm run seed
```

This will create:
- 1 admin user and 10 student users
- 42 menu items (14 days × 3 meals)
- Sample bookings

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### User Management (Admin)
- `GET /api/users/students` - Get all students
- `GET /api/users/students/:id` - Get student by ID
- `PUT /api/users/students/:id` - Update student
- `DELETE /api/users/students/:id` - Delete student
- `GET /api/users/students/:id/stats` - Get student statistics

### Menu Management
- `GET /api/menus` - Get all menus (with filters)
- `GET /api/menus/date/:date` - Get menus by date
- `GET /api/menus/:id` - Get menu by ID
- `POST /api/menus` - Create menu (Admin)
- `PUT /api/menus/:id` - Update menu (Admin)
- `DELETE /api/menus/:id` - Delete menu (Admin)

### Bookings
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/date/:date` - Get bookings by date (Admin)
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/attend` - Mark as attended (Admin)
- `PUT /api/bookings/:id/miss` - Mark as missed (Admin)

### Analytics (Admin)
- `GET /api/analytics` - Get analytics data
- `GET /api/analytics/meal-popularity` - Get meal popularity stats
- `GET /api/analytics/sustainability` - Get sustainability metrics
- `GET /api/analytics/student-accountability` - Get student accountability
- `GET /api/analytics/overview` - Get overview statistics

### Predictions (Admin)
- `GET /api/predictions` - Get demand predictions
- `GET /api/predictions/demand-forecast` - Get specific demand forecast

## Default Login Credentials

**Admin:**
- Email: admin@campus.com
- Password: admin123

**Student:**
- Email: student@campus.com
- Password: student123

## Project Structure

```
Backend/
├── controllers/        # Request handlers
├── models/            # Database models
├── routes/            # API routes
├── middleware/        # Custom middleware
├── seeders/          # Database seeders
├── utils/            # Utility functions
├── .env.example      # Environment variables template
├── .gitignore        # Git ignore file
├── package.json      # Dependencies
└── server.js         # Entry point
```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes with middleware
- Role-based access control (Admin/Student)
- Input validation and sanitization

## Error Handling

The API uses centralized error handling with appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC
