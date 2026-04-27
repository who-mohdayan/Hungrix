# Backend Setup & Deployment Guide

## Quick Start (Development)

### Prerequisites
1. Install MongoDB:
   - **Windows**: Download from https://www.mongodb.com/try/download/community
   - **Mac**: `brew install mongodb-community`
   - **Linux**: `sudo apt-get install mongodb`

2. Verify MongoDB is running:
   ```bash
   # Windows (in Command Prompt as Administrator)
   net start MongoDB

   # Mac/Linux
   sudo systemctl status mongod
   # or
   brew services start mongodb-community
   ```

### Installation Steps

1. **Navigate to Backend folder:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   # Copy example env file
   cp .env.example .env

   # Edit .env file with your settings
   ```

4. **Seed the database:**
   ```bash
   npm run seed
   ```
   This creates:
   - 1 admin user
   - 10 student users
   - 42 menu items (14 days × 3 meals)
   - Sample booking data

5. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify the API is running:**
   Open http://localhost:5000/api/health in your browser
   You should see: `{"status":"OK","message":"Campus Food Intelligence System API is running"}`

## Environment Variables Explained

```env
# Server port
PORT=5000

# MongoDB connection string
# Local: mongodb://localhost:27017/campus-food-db
# Cloud (MongoDB Atlas): mongodb+srv://username:password@cluster.mongodb.net/campus-food-db
MONGODB_URI=mongodb://localhost:27017/campus-food-db

# Secret key for JWT tokens (change this to a random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# JWT expiration time
JWT_EXPIRE=7d

# Environment
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

## Testing the API

### Using curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@campus.com","password":"admin123"}'

# Get menus (replace TOKEN with the token from login response)
curl http://localhost:5000/api/menus \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman or Thunder Client:

1. Import the API endpoints
2. Set base URL: `http://localhost:5000/api`
3. Login to get a token
4. Add token to Authorization header: `Bearer YOUR_TOKEN`

## Common Issues & Solutions

### Issue 1: MongoDB Connection Failed

**Error:** `MongoDB connection error: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Issue 2: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill the process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

Or change the PORT in .env file

### Issue 3: JWT Secret Not Set

**Error:** `secretOrPrivateKey must have a value`

**Solution:** Make sure JWT_SECRET is set in your .env file

### Issue 4: Database Seed Fails

**Solution:**
```bash
# Clear the database and try again
mongosh
use campus-food-db
db.dropDatabase()
exit

# Then run seed again
npm run seed
```

## Database Management

### View data in MongoDB:

```bash
# Open MongoDB shell
mongosh

# Switch to database
use campus-food-db

# View collections
show collections

# View users
db.users.find().pretty()

# View menus
db.menus.find().pretty()

# View bookings
db.bookings.find().pretty()

# Count documents
db.users.countDocuments()
db.bookings.countDocuments()
```

### Reset database:

```bash
# Drop entire database
mongosh
use campus-food-db
db.dropDatabase()
exit

# Re-seed
npm run seed
```

## Production Deployment

### Using MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in .env:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-food-db
   ```

### Environment Setup

1. Set NODE_ENV to production:
   ```
   NODE_ENV=production
   ```

2. Generate a strong JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. Update CLIENT_URL to your frontend URL

### Deployment Platforms

#### Heroku
```bash
heroku create campus-food-api
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

#### Railway
1. Connect GitHub repo
2. Add MongoDB service
3. Set environment variables
4. Deploy

#### DigitalOcean App Platform
1. Create new app
2. Link repository
3. Add MongoDB database
4. Configure environment variables
5. Deploy

## Security Best Practices

1. **Always change default credentials**
2. **Use strong JWT_SECRET** (at least 64 characters)
3. **Enable HTTPS** in production
4. **Set secure CORS policies**
5. **Rate limit API endpoints**
6. **Validate all inputs**
7. **Keep dependencies updated**

## API Rate Limiting (Optional)

Install express-rate-limit:
```bash
npm install express-rate-limit
```

Add to server.js:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Monitoring

### Logs
```bash
# View server logs
npm run dev

# Production with PM2
pm2 logs
```

### Health Check
Regular health checks at `/api/health`

### Database Monitoring
Use MongoDB Atlas dashboard or:
```bash
mongosh
db.serverStatus()
db.stats()
```

## Backup & Restore

### Backup
```bash
mongodump --db campus-food-db --out ./backup
```

### Restore
```bash
mongorestore --db campus-food-db ./backup/campus-food-db
```

## Support

For issues:
1. Check this guide
2. Review error logs
3. Check MongoDB connection
4. Verify environment variables
5. Open GitHub issue

## Next Steps

1. Start the backend server
2. Test API endpoints
3. Start the frontend
4. Test full integration
5. Customize for your needs
