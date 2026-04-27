import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
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
    enum: ['Attended', 'Missed'],
    required: true
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ booking: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;