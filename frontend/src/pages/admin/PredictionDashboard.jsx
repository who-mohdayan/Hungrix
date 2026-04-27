import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import PredictionForm from '../../components/prediction/PredictionForm';
import PredictionResults from '../../components/prediction/PredictionResults';
import PredictionCharts from '../../components/prediction/PredictionCharts';

const SAMPLE_SCHEMA_KEYS = [
  'meal_type',
  'day_of_week',
  'menu_popularity_score',
  'holiday_flag',
  'exam_period_flag',
  'total_registered_students',
  'current_bookings',
  'last_7_day_avg_attendance',
  'menu_items',
];

const DEFAULT_FORM_DATA = {
  meal_type: 'dinner',
  day_of_week: new Date().getDay(),
  menu_popularity_score: 5,
  holiday_flag: 0,
  exam_period_flag: 0,
  total_registered_students: 300,
  current_bookings: 270,
  last_7_day_avg_attendance: 250,
  menu_items: [],
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function PredictionDashboard() {
  const [pageLoading, setPageLoading] = useState(true);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [predictionResult, setPredictionResult] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [attendanceHistoryRows, setAttendanceHistoryRows] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [menuOptions, setMenuOptions] = useState([]);
  const [registeredStudentsDefault, setRegisteredStudentsDefault] = useState(DEFAULT_FORM_DATA.total_registered_students);
  const [currentBookingsByMeal, setCurrentBookingsByMeal] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    loadTodayMenuItems(formData.meal_type);
  }, [formData.meal_type]);

  useEffect(() => {
    const bookingCount = currentBookingsByMeal[formData.meal_type] ?? 0;
    setFormData((prev) => ({
      ...prev,
      current_bookings: bookingCount,
    }));
  }, [formData.meal_type, currentBookingsByMeal]);

  useEffect(() => {
    if (!attendanceHistoryRows.length) return;
    const autoAvg = calculateLast7DayAverage(attendanceHistoryRows, formData.meal_type);
    setFormData((prev) => ({
      ...prev,
      last_7_day_avg_attendance: autoAvg,
    }));
  }, [formData.meal_type, attendanceHistoryRows]);

  useEffect(() => {
    const selectedItems = formData.menu_items || [];

    if (selectedItems.length === 0) {
      setFormData((prev) => ({ ...prev, menu_popularity_score: 5 }));
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const preview = await api.getMenuPopularityScorePreview(formData.meal_type, selectedItems);
        if (typeof preview?.menuPopularityScore === 'number') {
          setFormData((prev) => ({
            ...prev,
            menu_popularity_score: preview.menuPopularityScore,
          }));
        }
      } catch {
        // Keep existing score if preview endpoint fails.
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [formData.meal_type, formData.menu_items]);

  const fetchInitialData = async () => {
    try {
      setPageLoading(true);
      const [attendanceHistory, mealBookingStats, students] = await Promise.all([
        api.getAttendanceHistory(14),
        api.getMealBookingStats(14),
        api.getAllStudents(),
      ]);

      const realtime = await api.getRealtimeAnalytics();

      setTrendData(buildTrendData(attendanceHistory));
      setAttendanceHistoryRows(Array.isArray(attendanceHistory) ? attendanceHistory : []);
      setDistributionData([
        { name: 'Breakfast', value: mealBookingStats.breakfastBookings || 0 },
        { name: 'Lunch', value: mealBookingStats.lunchBookings || 0 },
        { name: 'Dinner', value: mealBookingStats.dinnerBookings || 0 },
      ]);

      const mealDistribution = realtime?.mealDistribution || {};
      const mealBookingMap = {
        breakfast: mealDistribution.Breakfast?.booked || 0,
        lunch: mealDistribution.Lunch?.booked || 0,
        dinner: mealDistribution.Dinner?.booked || 0,
      };
      setCurrentBookingsByMeal(mealBookingMap);

      const totalStudentsFromDb = Array.isArray(students) ? students.length : DEFAULT_FORM_DATA.total_registered_students;
      setRegisteredStudentsDefault(totalStudentsFromDb);
      setFormData((prev) => ({
        ...prev,
        total_registered_students: totalStudentsFromDb,
        current_bookings: mealBookingMap[prev.meal_type] ?? 0,
      }));

      await loadTodayMenuItems(DEFAULT_FORM_DATA.meal_type);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load chart data. Please try again.');
    } finally {
      setPageLoading(false);
    }
  };

  const loadTodayMenuItems = async (mealType) => {
    try {
      setMenuLoading(true);
      const response = await api.getTodayMenuItems(mealType);
      const items = Array.isArray(response?.menuItems) ? response.menuItems : [];
      setMenuOptions(items);
      setFormData((prev) => ({
        ...prev,
        menu_items: items,
      }));
    } catch {
      setMenuOptions([]);
      setFormData((prev) => ({
        ...prev,
        menu_items: [],
      }));
    } finally {
      setMenuLoading(false);
    }
  };

  const buildTrendData = (rows) => {
    const mapByDate = new Map();

    (rows || []).forEach((entry) => {
      if (!mapByDate.has(entry.date)) {
        mapByDate.set(entry.date, { date: entry.date, Breakfast: 0, Lunch: 0, Dinner: 0 });
      }
      const day = mapByDate.get(entry.date);
      if (entry.mealType === 'Breakfast') day.Breakfast = entry.attendance;
      if (entry.mealType === 'Lunch') day.Lunch = entry.attendance;
      if (entry.mealType === 'Dinner') day.Dinner = entry.attendance;
    });

    return Array.from(mapByDate.values()).slice(-14);
  };

  const calculateLast7DayAverage = (rows, mealTypeRaw) => {
    const mealType = String(mealTypeRaw || 'lunch').toLowerCase();
    const formattedMealType = mealType.charAt(0).toUpperCase() + mealType.slice(1);

    const values = (rows || [])
      .filter((entry) => entry.mealType === formattedMealType)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7)
      .map((entry) => Number(entry.attendance) || 0);

    if (!values.length) return 0;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key) => {
    setFormData((prev) => ({ ...prev, [key]: prev[key] ? 0 : 1 }));
  };

  const handleMenuItemChange = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, menu_items: selectedValues }));
  };

  const handlePredict = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.meal_type || Number(formData.total_registered_students) <= 0) {
      setError('Please provide meal type and valid student counts before prediction.');
      return;
    }

    try {
      setPredictionLoading(true);
      const response = await api.getTodayPrediction(formData);
      setPredictionResult(response);
      if (response?.input?.menu_popularity_score) {
        setFormData((prev) => ({
          ...prev,
          menu_popularity_score: response.input.menu_popularity_score,
        }));
      }
    } catch (predictionError) {
      setError(predictionError.message || 'Unable to fetch prediction. Please try again.');
    } finally {
      setPredictionLoading(false);
    }
  };

  const handleReset = () => {
    setError('');
    setPredictionResult(null);
    const currentDay = new Date().getDay();
    setFormData((prev) => ({
      ...DEFAULT_FORM_DATA,
      meal_type: prev.meal_type,
      day_of_week: currentDay,
      total_registered_students: registeredStudentsDefault,
      current_bookings: currentBookingsByMeal[prev.meal_type] ?? 0,
      menu_items: [...menuOptions],
    }));
  };

  const comparisonData = useMemo(() => {
    if (!predictionResult) return [];
    return [
      { name: 'Predicted', value: predictionResult.predictedStudentsAttending || 0 },
      { name: 'Current', value: predictionResult.currentBookings || 0 },
      { name: 'Prep Target', value: predictionResult.recommendedFoodPreparation || 0 },
    ];
  }, [predictionResult]);

  const summaryStats = useMemo(() => {
    const totalTrendPoints = trendData.length;
    const latestDay = trendData[totalTrendPoints - 1] || {};
    const latestTotal = (latestDay.Breakfast || 0) + (latestDay.Lunch || 0) + (latestDay.Dinner || 0);

    return {
      selectedMeal: formData.meal_type.charAt(0).toUpperCase() + formData.meal_type.slice(1),
      selectedDay: DAY_LABELS[Number(formData.day_of_week) || 0],
      menuItems: formData.menu_items.length,
      latestTotal,
      last7Avg: formData.last_7_day_avg_attendance,
    };
  }, [formData, trendData]);

  if (pageLoading) return (
    <AdminLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-3 text-center">
          <LoadingSpinner size="lg" color="indigo" />
          <p className="text-sm text-slate-500">Loading prediction workspace...</p>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-6 text-white shadow-xl lg:p-8">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-orange-300/10 blur-2xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Prediction Engine</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight lg:text-4xl">Admin Forecast Studio</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Build daily meal forecasts from live bookings, menu popularity, and attendance history. Tune inputs and compare prediction impact instantly.
            </p>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-300">Meal</p>
              <p className="mt-1 text-lg font-semibold">{summaryStats.selectedMeal}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-300">Day</p>
              <p className="mt-1 text-lg font-semibold">{summaryStats.selectedDay}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-300">Menu Items</p>
              <p className="mt-1 text-lg font-semibold">{summaryStats.menuItems}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-300">Last Day Total</p>
              <p className="mt-1 text-lg font-semibold">{summaryStats.latestTotal}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 col-span-2 sm:col-span-1">
              <p className="text-[11px] uppercase tracking-wide text-slate-300">7-Day Avg</p>
              <p className="mt-1 text-lg font-semibold">{summaryStats.last7Avg}</p>
            </div>
          </div>
        </section>

        <PredictionForm
          schema={SAMPLE_SCHEMA_KEYS}
          formData={formData}
          menuOptions={menuOptions}
          loading={predictionLoading || menuLoading}
          error={error}
          onChange={handleChange}
          onToggle={handleToggle}
          onMenuItemChange={handleMenuItemChange}
          onSubmit={handlePredict}
          onReset={handleReset}
        />

        <PredictionResults prediction={predictionResult} />

        <PredictionCharts
          comparisonData={comparisonData}
          trendData={trendData}
          distributionData={distributionData}
        />
      </div>
    </AdminLayout>
  );
}
