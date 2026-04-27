import Booking from '../models/Booking.model.js';
import Menu from '../models/Menu.model.js';
import User from '../models/User.model.js';

const pendingStatuses = ['Booked', 'Upcoming'];

const recalculateStudentPerformance = async (studentId) => {
  const [totalBookings, attendedBookings, missedBookings] = await Promise.all([
    Booking.countDocuments({ student: studentId, status: { $in: ['Attended', 'Missed'] } }),
    Booking.countDocuments({ student: studentId, status: 'Attended' }),
    Booking.countDocuments({ student: studentId, status: 'Missed' })
  ]);

  const student = await User.findById(studentId);
  if (!student) return;

  if (totalBookings === 0) {
    student.attendanceRate = 100;
    student.accountabilityScore = 100;
  } else {
    const attendanceRate = Math.round((attendedBookings / totalBookings) * 100);
    const missedPenalty = Math.round((missedBookings / totalBookings) * 20);
    student.attendanceRate = attendanceRate;
    student.accountabilityScore = Math.max(0, attendanceRate - missedPenalty);
  }

  await student.save();
};

const processOverdueBookings = async () => {
  const today = new Date().toISOString().split('T')[0];
  const overdueBookings = await Booking.find({
    date: { $lt: today },
    status: { $in: pendingStatuses }
  }).select('_id student');

  if (!overdueBookings.length) return;

  const bookingIds = overdueBookings.map((booking) => booking._id);
  const studentIds = [...new Set(overdueBookings.map((booking) => booking.student.toString()))];

  await Booking.updateMany(
    { _id: { $in: bookingIds } },
    { $set: { status: 'Missed' } }
  );

  await Promise.all(studentIds.map((studentId) => recalculateStudentPerformance(studentId)));
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    await processOverdueBookings();

    const { status, mealType, startDate, endDate } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (mealType) query.mealType = mealType;
    
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const bookings = await Booking.find(query)
      .populate('student', 'name email hostel room')
      .populate('menu', 'items timing')
      .sort({ date: -1, createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    await processOverdueBookings();

    const { status, mealType } = req.query;
    
    let query = { student: req.user._id };
    
    if (status) query.status = status;
    if (mealType) query.mealType = mealType;

    const bookings = await Booking.find(query)
      .populate('student', 'name email hostel room')
      .populate('menu', 'items timing')
      .sort({ date: -1, createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('student', 'name email hostel room')
      .populate('menu', 'items timing');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized (admin or booking owner)
    if (req.user.role !== 'admin' && booking.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { menuId, date, mealType, specialRequest } = req.body;

    // Check if menu exists
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Check if booking already exists
    const existingBooking = await Booking.findOne({
      student: req.user._id,
      date,
      mealType
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a booking for this meal' });
    }

    // Create booking
    const booking = await Booking.create({
      student: req.user._id,
      menu: menuId,
      date,
      mealType,
      status: 'Booked',
      specialRequest: specialRequest || ''
    });

    // Update user's total bookings
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalBookings: 1 }
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('student', 'name email hostel room')
      .populate('menu', 'items timing');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized
    if (booking.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'Attended') {
      return res.status(400).json({ message: 'Cannot cancel attended booking' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'Cancelled';
    booking.cancelledAt = new Date();

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('student', 'name email hostel room')
      .populate('menu', 'items timing');

    res.json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark booking as attended
// @route   PUT /api/bookings/:id/attend
// @access  Private/Admin
export const markAsAttended = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot mark cancelled booking as attended' });
    }

    booking.status = 'Attended';
    booking.attendedAt = new Date();

    await booking.save();


    await recalculateStudentPerformance(booking.student);

    const populatedBooking = await Booking.findById(booking._id)
      .populate('student', 'name email hostel room')
      .populate('menu', 'items timing');

    res.json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark booking as missed
// @route   PUT /api/bookings/:id/miss
// @access  Private/Admin
export const markAsMissed = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot mark cancelled booking as missed' });
    }

    booking.status = 'Missed';

    await booking.save();


    await recalculateStudentPerformance(booking.student);

    const populatedBooking = await Booking.findById(booking._id)
      .populate('student', 'name email hostel room')
      .populate('menu', 'items timing');

    res.json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get bookings by date
// @route   GET /api/bookings/date/:date
// @access  Private/Admin
export const getBookingsByDate = async (req, res) => {
  try {
    await processOverdueBookings();

    const bookings = await Booking.find({ date: req.params.date })
      .populate('student', 'name email hostel room')
      .populate('menu', 'items timing')
      .sort({ mealType: 1, createdAt: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
