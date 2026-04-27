import Booking from '../models/Booking.model.js';

// @desc    Get meal booking distribution stats
// @route   GET /api/admin/meal-booking-stats
// @access  Private/Admin
export const getMealBookingStats = async (req, res) => {
  try {
    const days = Math.max(parseInt(req.query.days, 10) || 7, 1);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    const startDateStr = startDate.toISOString().split('T')[0];

    const stats = await Booking.aggregate([
      { $match: { date: { $gte: startDateStr } } },
      {
        $group: {
          _id: '$mealType',
          bookings: { $sum: 1 }
        }
      }
    ]);

    const distribution = {
      Breakfast: 0,
      Lunch: 0,
      Dinner: 0
    };

    stats.forEach((entry) => {
      if (distribution[entry._id] !== undefined) {
        distribution[entry._id] = entry.bookings;
      }
    });

    res.json({
      breakfastBookings: distribution.Breakfast,
      lunchBookings: distribution.Lunch,
      dinnerBookings: distribution.Dinner,
      days
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
