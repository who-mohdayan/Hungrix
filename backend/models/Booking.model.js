import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner'],
    required: true
  },
  status: {
    type: String,
    enum: ['Booked', 'Upcoming', 'Attended', 'Missed', 'Cancelled'],
    default: 'Booked'
  },
  specialRequest: {
    type: String,
    default: ''
  },
  attendedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
bookingSchema.index({ date: 1, status: 1 });

// Prevent duplicate bookings
bookingSchema.index({ student: 1, date: 1, mealType: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
