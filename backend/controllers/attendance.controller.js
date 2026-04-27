import Booking from '../models/Booking.model.js';

// @desc    Get historical attendance grouped by date and meal type
// @route   GET /api/attendance/history
// @access  Private/Admin
export const getAttendanceHistory = async (req, res) => {
  try {
    const days = Math.max(parseInt(req.query.days, 10) || 14, 1);

    const history = await Booking.aggregate([
      {
        $group: {
          _id: { date: '$date', mealType: '$mealType' },
          attendance: {
            $sum: {
              $cond: [{ $in: ['$status', ['Booked', 'Upcoming', 'Attended']] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id.date': -1 } },
      { $limit: days * 3 },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          mealType: '$_id.mealType',
          attendance: 1
        }
      }
    ]);

    res.json(history.reverse());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
