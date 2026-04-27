import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { useMenu } from '../../context/MenuContext';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from '../../components/StudentNavbar';
import Footer from '../../components/Footer';
import Badge from '../../components/Badge';
import StatCard from '../../components/StatCard';
import { FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

function CircularProgress({ value }) {
  const size = 120;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const strokeColor = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';
  const textColorClass = value >= 80 ? 'text-emerald-600' : value >= 60 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={strokeColor} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </svg>
      <span className={`absolute text-2xl font-bold ${textColorClass}`}>{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { bookings, loading } = useBooking();
  const { getMenuByDate } = useMenu();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f6fb] flex flex-col">
        <StudentNavbar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" color="indigo" />
        </main>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const studentId = user?._id;
  const todayBookings = bookings.filter(b => b.student?._id === studentId && b.date === today);
  const allStudentBookings = bookings.filter(b => b.student?._id === studentId);

  const todayMealStatus = ['Breakfast', 'Lunch', 'Dinner'].map(meal => {
    const booking = todayBookings.find(b => b.mealType === meal);
    return { meal, booking };
  });

  const upcomingMeals = bookings
    .filter(b => b.student?._id === studentId && b.status === 'Upcoming')
    .slice(0, 5);

  const todayMenu = getMenuByDate(today);

  const totalBookings = allStudentBookings.length;
  const attended = allStudentBookings.filter(b => b.status === 'Attended').length;
  const missed = allStudentBookings.filter(b => b.status === 'Missed').length;
  const attendanceRate = totalBookings > 0 ? Math.round((attended / totalBookings) * 100) : 0;

  const score = user?.accountabilityScore || 100;

  const mealTimings = { Breakfast: '7:30–9:30 AM', Lunch: '12:00–2:00 PM', Dinner: '7:00–9:00 PM' };
  const mealEmoji = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙' };

  return (
    <div className="min-h-screen bg-[#f3f6fb] flex flex-col">
      <StudentNavbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 lg:py-8 space-y-6">
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/60">Student Control Panel</p>
              <h1 className="mt-1 text-3xl font-semibold">Welcome back, {user?.name?.split(' ')[0]}</h1>
              <p className="mt-2 text-sm text-emerald-100">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2">Hostel {user?.hostel} • Room {user?.room}</div>
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2">Score {score}/100</div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Bookings" value={totalBookings} icon={FiCalendar} color="indigo" subtitle="All-time records" />
          <StatCard title="Meals Attended" value={attended} icon={FiCheckCircle} color="emerald" subtitle="Successful check-ins" />
          <StatCard title="Meals Missed" value={missed} icon={FiXCircle} color="red" subtitle="Needs improvement" />
          <StatCard title="Attendance" value={`${attendanceRate}%`} icon={FiTrendingUp} color="amber" subtitle="Current performance" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Today's Meal Status</h2>
                <button
                  onClick={() => navigate('/book-meal')}
                  className="rounded-xl bg-gradient-to-r from-green-700 to-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
                >
                  + Create Booking
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {todayMealStatus.map(({ meal, booking }) => (
                  <div key={meal}
                    className={`rounded-2xl border p-4 ${booking ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="text-2xl mb-2">{mealEmoji[meal]}</div>
                    <h3 className="font-semibold text-slate-800 text-sm">{meal}</h3>
                    <p className="text-xs text-slate-500 mb-3">{mealTimings[meal]}</p>
                    {booking ? (
                      <Badge label={booking.status} variant={booking.status} />
                    ) : (
                      <span className="text-xs text-slate-400 italic">Not booked yet</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {todayMenu.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Today's Menu Board</h2>
                <div className="space-y-3">
                  {todayMenu.map(menu => (
                    <div key={menu.id || `${menu.date}-${menu.mealType}`} className="flex gap-4 items-start rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="text-xl">{mealEmoji[menu.mealType]}</span>
                      <div>
                        <p className="font-medium text-slate-700 text-sm">{menu.mealType}
                          <span className="text-slate-400 font-normal ml-2 text-xs">({menu.timing})</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{menu.items.join(' • ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 self-start">Accountability Score</h2>
              <CircularProgress value={score} />
              <p className="text-sm text-slate-500 mt-3 text-center">
                {score >= 80 ? '✅ Great discipline! Keep it up.' : score >= 60 ? '⚠️ Room for improvement.' : '❌ Low score – please attend meals.'}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Meals</h2>
              {upcomingMeals.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No upcoming bookings</p>
              ) : (
                <div className="space-y-3">
                  {upcomingMeals.map(b => (
                    <div key={b.id || b._id} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                      <FiClock className="text-emerald-600 shrink-0" size={16} />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{b.mealType}</p>
                        <p className="text-xs text-slate-500">{b.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
