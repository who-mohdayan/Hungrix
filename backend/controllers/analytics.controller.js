import Booking from '../models/Booking.model.js';
import User from '../models/User.model.js';
import Menu from '../models/Menu.model.js';

// Cache for analytics data (5 minutes TTL)
const analyticsCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes
};

const isCacheValid = () => {
  return analyticsCache.data && analyticsCache.timestamp && 
         (Date.now() - analyticsCache.timestamp < analyticsCache.ttl);
};

// @desc    Get analytics data with advanced metrics
// @route   GET /api/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = { $gte: startDate, $lte: endDate };
    } else {
      // Default to last 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter.date = { 
        $gte: thirtyDaysAgo.toISOString().split('T')[0],
        $lte: today.toISOString().split('T')[0]
      };
    }

    // Get daily statistics with advanced metrics
    const dailyStats = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$date',
          totalBookings: { $sum: 1 },
          attended: {
            $sum: { $cond: [{ $eq: ['$status', 'Attended'] }, 1, 0] }
          },
          missed: {
            $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
          },
          breakfast: {
            $sum: { $cond: [{ $eq: ['$mealType', 'Breakfast'] }, 1, 0] }
          },
          lunch: {
            $sum: { $cond: [{ $eq: ['$mealType', 'Lunch'] }, 1, 0] }
          },
          dinner: {
            $sum: { $cond: [{ $eq: ['$mealType', 'Dinner'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate advanced metrics
    const statsWithMetrics = dailyStats.map((stat, index) => {
      const attendanceRate = stat.totalBookings > 0 
        ? ((stat.attended / stat.totalBookings) * 100).toFixed(1) 
        : 0;
      
      // Waste estimation (missed meals + cancelled meals contribute to waste)
      const potentialWaste = stat.missed + Math.floor(stat.cancelled * 0.5);
      const wasteKg = Math.floor(potentialWaste * 0.35); // Avg 350g per meal
      
      // Calculate waste reduction percentage (compared to no-show prevention)
      const baselineWaste = stat.totalBookings * 0.25; // 25% baseline
      const wasteReduction = baselineWaste > 0 
        ? Math.min(100, Math.floor(((baselineWaste - potentialWaste) / baselineWaste) * 100))
        : 0;
      
      // Revenue impact (saved vs wasted)
      const savedRevenue = stat.attended * 50; // ₹50 per meal
      const lostRevenue = potentialWaste * 50;
      
      // Efficiency score (0-100)
      const efficiency = Math.round(
        (stat.attended / stat.totalBookings * 40) + // Attendance weight: 40%
        ((stat.totalBookings - stat.cancelled) / stat.totalBookings * 30) + // Low cancellation: 30%
        (wasteReduction * 0.3) // Waste reduction: 30%
      );

      return {
        date: stat._id,
        bookings: stat.totalBookings,
        attendance: stat.attended,
        missed: stat.missed,
        cancelled: stat.cancelled,
        attendanceRate: parseFloat(attendanceRate),
        waste: wasteKg,
        wasteReduction,
        efficiency,
        breakfastBookings: stat.breakfast,
        lunchBookings: stat.lunch,
        dinnerBookings: stat.dinner,
        revenue: {
          saved: savedRevenue,
          lost: lostRevenue,
          net: savedRevenue - lostRevenue
        }
      };
    });

    // Calculate trends
    const trends = calculateTrends(statsWithMetrics);

    res.json({
      data: statsWithMetrics,
      trends,
      summary: {
        totalDays: statsWithMetrics.length,
        avgBookingsPerDay: Math.round(
          statsWithMetrics.reduce((sum, s) => sum + s.bookings, 0) / statsWithMetrics.length
        ),
        avgAttendanceRate: (
          statsWithMetrics.reduce((sum, s) => sum + s.attendanceRate, 0) / statsWithMetrics.length
        ).toFixed(1),
        totalWaste: statsWithMetrics.reduce((sum, s) => sum + s.waste, 0),
        avgEfficiency: Math.round(
          statsWithMetrics.reduce((sum, s) => sum + s.efficiency, 0) / statsWithMetrics.length
        )
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Calculate trends from time-series data
const calculateTrends = (data) => {
  if (data.length < 2) return {};
  
  const recent = data.slice(-7);
  const previous = data.slice(-14, -7);
  
  const calcAvg = (arr, key) => arr.reduce((sum, item) => sum + item[key], 0) / arr.length;
  
  const recentBookings = calcAvg(recent, 'bookings');
  const previousBookings = previous.length > 0 ? calcAvg(previous, 'bookings') : recentBookings;
  
  const recentAttendance = calcAvg(recent, 'attendanceRate');
  const previousAttendance = previous.length > 0 ? calcAvg(previous, 'attendanceRate') : recentAttendance;
  
  const recentWaste = calcAvg(recent, 'waste');
  const previousWaste = previous.length > 0 ? calcAvg(previous, 'waste') : recentWaste;
  
  return {
    bookings: {
      trend: recentBookings > previousBookings ? 'increasing' : recentBookings < previousBookings ? 'decreasing' : 'stable',
      change: previousBookings > 0 ? (((recentBookings - previousBookings) / previousBookings) * 100).toFixed(1) : 0
    },
    attendance: {
      trend: recentAttendance > previousAttendance ? 'improving' : recentAttendance < previousAttendance ? 'declining' : 'stable',
      change: (recentAttendance - previousAttendance).toFixed(1)
    },
    waste: {
      trend: recentWaste < previousWaste ? 'reducing' : recentWaste > previousWaste ? 'increasing' : 'stable',
      change: previousWaste > 0 ? (((recentWaste - previousWaste) / previousWaste) * 100).toFixed(1) : 0
    }
  };
};

// @desc    Get meal popularity statistics with advanced insights
// @route   GET /api/analytics/meal-popularity
// @access  Private/Admin
export const getMealPopularity = async (req, res) => {
  try {
    const { period = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));
    
    const mealStats = await Booking.aggregate([
      {
        $match: {
          date: { $gte: daysAgo.toISOString().split('T')[0] }
        }
      },
      {
        $group: {
          _id: '$mealType',
          count: { $sum: 1 },
          attended: { $sum: { $cond: [{ $eq: ['$status', 'Attended'] }, 1, 0] } },
          missed: { $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] } }
        }
      }
    ]);

    const total = mealStats.reduce((sum, stat) => sum + stat.count, 0);
    
    const colors = {
      'Breakfast': '#f59e0b',
      'Lunch': '#10b981',
      'Dinner': '#6366f1'
    };

    const popularity = mealStats.map(stat => {
      const attendanceRate = stat.count > 0 ? ((stat.attended / stat.count) * 100).toFixed(1) : 0;
      return {
        name: stat._id,
        value: Math.round((stat.count / total) * 100),
        count: stat.count,
        attended: stat.attended,
        missed: stat.missed,
        attendanceRate: parseFloat(attendanceRate),
        color: colors[stat._id] || '#888888'
      };
    }).sort((a, b) => b.value - a.value);

    // Get item-level popularity
    const itemPopularity = await Booking.aggregate([
      {
        $match: {
          date: { $gte: daysAgo.toISOString().split('T')[0] }
        }
      },
      {
        $lookup: {
          from: 'menus',
          let: { menuDate: '$date', menuMealType: '$mealType' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$date', '$$menuDate'] },
                    { $eq: ['$mealType', '$$menuMealType'] }
                  ]
                }
              }
            }
          ],
          as: 'menuData'
        }
      },
      { $unwind: { path: '$menuData', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$menuData.items', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$menuData.items',
          bookings: { $sum: 1 }
        }
      },
      { $sort: { bookings: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      mealTypePopularity: popularity,
      topItems: itemPopularity.filter(item => item._id).map(item => ({
        item: item._id,
        bookings: item.bookings
      })),
      period: `${period} days`
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get sustainability metrics with detailed calculations
// @route   GET /api/analytics/sustainability
// @access  Private/Admin
export const getSustainabilityMetrics = async (req, res) => {
  try {
    // Check cache first
    if (isCacheValid() && analyticsCache.data.sustainability) {
      return res.json(analyticsCache.data.sustainability);
    }

    const totalBookings = await Booking.countDocuments();
    const missedBookings = await Booking.countDocuments({ status: 'Missed' });
    const attendedBookings = await Booking.countDocuments({ status: 'Attended' });
    const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });

    // Advanced waste calculations
    // Missed meals = full waste, Cancelled (early) = 50% waste prevented
    const totalWastedMeals = missedBookings + Math.floor(cancelledBookings * 0.3);
    const foodWasteReduced = Math.floor(totalWastedMeals * 0.35); // kg (avg 350g/meal)
    
    // Prevented waste (due to early cancellations)
    const preventedWaste = Math.floor(cancelledBookings * 0.7 * 0.35);
    
    // Environmental impact calculations
    const co2Saved = Math.floor(foodWasteReduced * 2.5); // kg CO2 per kg food waste
    const waterSaved = Math.floor(foodWasteReduced * 15.2); // liters per kg food
    const costSavings = Math.floor(foodWasteReduced * 165); // ₹ per kg
    
    // Waste reduction percentage (compared to baseline without system)
    const baselineWasteRate = 0.35; // 35% no-show rate without system
    const currentWasteRate = totalBookings > 0 ? missedBookings / totalBookings : 0;
    const wasteReductionPercent = totalBookings > 0 
      ? Math.floor(((baselineWasteRate - currentWasteRate) / baselineWasteRate) * 100)
      : 0;

    // Additional metrics
    const mealsSaved = attendedBookings;
    const treesEquivalent = Math.floor(co2Saved * 0.018); // Trees that absorb equivalent CO2/year
    const energySaved = Math.floor(foodWasteReduced * 1.8); // kWh
    
    // Compare with last period
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const recentMissed = await Booking.countDocuments({
      status: 'Missed',
      date: { $gte: thirtyDaysAgo.toISOString().split('T')[0] }
    });
    
    const previousMissed = await Booking.countDocuments({
      status: 'Missed',
      date: { 
        $gte: sixtyDaysAgo.toISOString().split('T')[0],
        $lt: thirtyDaysAgo.toISOString().split('T')[0]
      }
    });

    const wasteTrend = previousMissed > 0 
      ? (((recentMissed - previousMissed) / previousMissed) * 100).toFixed(1)
      : 0;

    const metrics = {
      co2Saved,
      waterSaved,
      costSavings,
      foodWasteReduced,
      preventedWaste,
      wasteReductionPercent,
      mealsSaved,
      treesEquivalent,
      energySaved,
      wasteTrend: {
        value: wasteTrend,
        direction: wasteTrend < 0 ? 'improving' : wasteTrend > 0 ? 'worsening' : 'stable'
      },
      impactSummary: {
        totalMeals: totalBookings,
        attendedMeals: attendedBookings,
        missedMeals: missedBookings,
        cancelledMeals: cancelledBookings,
        efficiencyRate: ((attendedBookings / totalBookings) * 100).toFixed(1)
      }
    };

    // Update cache
    if (!analyticsCache.data) analyticsCache.data = {};
    analyticsCache.data.sustainability = metrics;
    analyticsCache.timestamp = Date.now();

    res.json(metrics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get student accountability stats
// @route   GET /api/analytics/student-accountability
// @access  Private/Admin
export const getStudentAccountability = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name email accountabilityScore attendanceRate totalBookings hostel')
      .sort({ accountabilityScore: -1 });

    res.json(students);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get overview statistics with real-time data
// @route   GET /api/analytics/overview
// @access  Private/Admin
export const getOverviewStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalBookings = await Booking.countDocuments();
    const todayBookings = await Booking.countDocuments({
      date: new Date().toISOString().split('T')[0]
    });
    
    const attendanceRate = await Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          attended: {
            $sum: { $cond: [{ $eq: ['$status', 'Attended'] }, 1, 0] }
          }
        }
      }
    ]);

    const rate = attendanceRate.length > 0 && attendanceRate[0].total > 0
      ? Math.round((attendanceRate[0].attended / attendanceRate[0].total) * 100)
      : 0;

    // Get week-over-week comparison
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    const thisWeekBookings = await Booking.countDocuments({
      date: { $gte: sevenDaysAgo.toISOString().split('T')[0] }
    });
    
    const lastWeekBookings = await Booking.countDocuments({
      date: { 
        $gte: fourteenDaysAgo.toISOString().split('T')[0],
        $lt: sevenDaysAgo.toISOString().split('T')[0]
      }
    });

    const weeklyChange = lastWeekBookings > 0 
      ? (((thisWeekBookings - lastWeekBookings) / lastWeekBookings) * 100).toFixed(1)
      : 0;

    res.json({
      totalStudents,
      activeStudents,
      totalBookings,
      todayBookings,
      attendanceRate: rate,
      weeklyComparison: {
        thisWeek: thisWeekBookings,
        lastWeek: lastWeekBookings,
        change: weeklyChange,
        trend: weeklyChange > 0 ? 'up' : weeklyChange < 0 ? 'down' : 'stable'
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get real-time analytics (last 24 hours)
// @route   GET /api/analytics/realtime
// @access  Private/Admin
export const getRealtimeAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const today = now.toISOString().split('T')[0];
    
    // Get hourly distribution (if bookingTime field exists)
    const todayBookings = await Booking.find({ date: today })
      .select('mealType status createdAt')
      .lean();
    
    // Meal type distribution
    const mealDistribution = {
      Breakfast: { booked: 0, attended: 0, pending: 0 },
      Lunch: { booked: 0, attended: 0, pending: 0 },
      Dinner: { booked: 0, attended: 0, pending: 0 }
    };
    
    todayBookings.forEach(booking => {
      const meal = booking.mealType;
      if (mealDistribution[meal]) {
        mealDistribution[meal].booked++;
        if (booking.status === 'Attended') mealDistribution[meal].attended++;
        if (booking.status === 'Booked') mealDistribution[meal].pending++;
      }
    });
    
    // Recent activity (last 10 bookings)
    const recentActivity = await Booking.find()
      .populate('student', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('mealType date status createdAt')
      .lean();
    
    // Live stats
    const liveStats = {
      totalToday: todayBookings.length,
      attendedToday: todayBookings.filter(b => b.status === 'Attended').length,
      pendingToday: todayBookings.filter(b => ['Booked', 'Upcoming'].includes(b.status)).length,
      mealDistribution,
      recentActivity: recentActivity.map(a => ({
        student: a.student?.name || 'Unknown',
        meal: a.mealType,
        date: a.date,
        status: a.status,
        timestamp: a.createdAt
      })),
      lastUpdated: new Date().toISOString()
    };
    
    res.json(liveStats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get booking heatmap data
// @route   GET /api/analytics/heatmap
// @access  Private/Admin
export const getBookingHeatmap = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const heatmapData = await Booking.aggregate([
      {
        $match: {
          date: { $gte: startDate.toISOString().split('T')[0] }
        }
      },
      {
        $addFields: {
          dateObj: { $dateFromString: { dateString: '$date' } }
        }
      },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$dateObj' },
            mealType: '$mealType'
          },
          avgBookings: { $avg: 1 },
          totalBookings: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.dayOfWeek',
          meals: {
            $push: {
              mealType: '$_id.mealType',
              count: '$totalBookings'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const formattedHeatmap = heatmapData.map(day => {
      const dayObj = {
        day: dayNames[day._id - 1],
        Breakfast: 0,
        Lunch: 0,
        Dinner: 0
      };
      
      day.meals.forEach(meal => {
        dayObj[meal.mealType] = meal.count;
      });
      
      return dayObj;
    });
    
    res.json(formattedHeatmap);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get comparative analysis (current vs previous period)
// @route   GET /api/analytics/comparative
// @access  Private/Admin
export const getComparativeAnalysis = async (req, res) => {
  try {
    const { period = 30 } = req.query;
    const periodDays = parseInt(period);
    
    const now = new Date();
    const currentPeriodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const previousPeriodStart = new Date(now.getTime() - 2 * periodDays * 24 * 60 * 60 * 1000);
    
    // Current period stats
    const currentStats = await Booking.aggregate([
      {
        $match: {
          date: { $gte: currentPeriodStart.toISOString().split('T')[0] }
        }
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          attended: { $sum: { $cond: [{ $eq: ['$status', 'Attended'] }, 1, 0] } },
          missed: { $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] } }
        }
      }
    ]);
    
    // Previous period stats
    const previousStats = await Booking.aggregate([
      {
        $match: {
          date: { 
            $gte: previousPeriodStart.toISOString().split('T')[0],
            $lt: currentPeriodStart.toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          attended: { $sum: { $cond: [{ $eq: ['$status', 'Attended'] }, 1, 0] } },
          missed: { $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] } }
        }
      }
    ]);
    
    const current = currentStats[0] || { totalBookings: 0, attended: 0, missed: 0, cancelled: 0 };
    const previous = previousStats[0] || { totalBookings: 0, attended: 0, missed: 0, cancelled: 0 };
    
    const calcChange = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return (((curr - prev) / prev) * 100).toFixed(1);
    };
    
    const calcRate = (part, total) => total > 0 ? ((part / total) * 100).toFixed(1) : 0;
    
    res.json({
      current: {
        totalBookings: current.totalBookings,
        attended: current.attended,
        missed: current.missed,
        cancelled: current.cancelled,
        attendanceRate: calcRate(current.attended, current.totalBookings)
      },
      previous: {
        totalBookings: previous.totalBookings,
        attended: previous.attended,
        missed: previous.missed,
        cancelled: previous.cancelled,
        attendanceRate: calcRate(previous.attended, previous.totalBookings)
      },
      changes: {
        totalBookings: calcChange(current.totalBookings, previous.totalBookings),
        attended: calcChange(current.attended, previous.attended),
        missed: calcChange(current.missed, previous.missed),
        cancelled: calcChange(current.cancelled, previous.cancelled),
        attendanceRate: (calcRate(current.attended, current.totalBookings) - calcRate(previous.attended, previous.totalBookings)).toFixed(1)
      },
      period: `${period} days`
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
