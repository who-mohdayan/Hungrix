import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  hostel: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  room: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  department: {
    type: String,
    required: function() { return this.role === 'admin'; },
    enum: ['Operations', 'Finance', 'Kitchen', 'Nutrition', 'Quality Control', 'Management'],
    default: 'Management'
  },
  accountabilityScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  attendanceRate: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
